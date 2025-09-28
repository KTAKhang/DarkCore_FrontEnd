import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Table,
  Button,
  Tag,
  Input,
  Space,
  Typography,
  Statistic,
  Row,
  Col,
  Badge,
  Avatar,
  Spin,
  Select,
  Alert,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";

import CreateCategory from "./CreateCategory";
import UpdateCategory from "./UpdateCategory";
import ViewCategoryDetail from "./ViewCategoryDetail";
import {
  categoryListRequest,
  categoryCreateRequest,
  categoryUpdateRequest,
  categoryStatsRequest,
  categoryClearMessages,
} from "../../redux/actions/categoryActions";

const { Title } = Typography;

// Simple placeholder avatar background colors
const CATEGORY_COLORS = ["#13C2C2", "#52c41a", "#fa8c16", "#722ED1", "#0D364C"]; 

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { items: categoryItems, stats, pagination: apiPagination, loadingList, loadingStats, creating, updating, error, message } = useSelector((state) => state.category);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "active", "inactive"
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [sortBy, setSortBy] = useState("default"); // "default", "createdat", "name"
  const [sortOrder, setSortOrder] = useState(""); // "asc", "desc", "" (empty for default)
  const [createdAtClickCount, setCreatedAtClickCount] = useState(0); // Track clicks on createdAt column
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Prevent duplicate initial calls
  const paginationRef = useRef(pagination);
  const prevFiltersRef = useRef({ searchText, statusFilter });
  
  // Default sort state - cố định không thay đổi (không sort gì cả)
  const defaultSort = { sortBy: "default", sortOrder: "" };
  
  // Update ref when pagination changes
  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  // Modals state
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);


  useEffect(() => {
    // Initial load - get all categories and stats (only once)
    if (isInitialLoad) {
      dispatch(categoryListRequest({ page: 1, limit: 5, sortBy: "default", sortOrder: "" }));
      dispatch(categoryStatsRequest());
      setIsInitialLoad(false);
    }
  }, [dispatch, isInitialLoad]);

  // Auto-load when filters change with debounce for search
  useEffect(() => {
    // Skip if this is initial load (already handled above)
    if (isInitialLoad) return;
    
    // Check if filters actually changed
    const prevFilters = prevFiltersRef.current;
    const filtersChanged = prevFilters.searchText !== searchText || prevFilters.statusFilter !== statusFilter;
    
    if (!filtersChanged) return;
    
    const timeoutId = setTimeout(() => {
      const query = {
        page: 1, // Luôn bắt đầu từ trang 1 khi filter thay đổi
        limit: paginationRef.current.pageSize,
        sortBy,
        sortOrder,
      };
      
      if (statusFilter !== "all") {
        query.status = statusFilter;
      }
      
      if (searchText.trim()) {
        query.keyword = searchText.trim();
      }
      
      dispatch(categoryListRequest(query));
      
      // Reset to first page when filtering
      if (paginationRef.current.current !== 1) {
        setPagination(prev => ({ ...prev, current: 1 }));
      }
      
      // Update prev filters
      prevFiltersRef.current = { searchText, statusFilter };
    }, searchText.trim() ? 500 : 0); // 500ms debounce for search

    return () => clearTimeout(timeoutId);
  }, [searchText, statusFilter, sortBy, sortOrder, dispatch, isInitialLoad]);

  // Handle sort changes without resetting pagination
  useEffect(() => {
    // Skip if this is initial load (already handled above)
    if (isInitialLoad) return;
    
    const query = {
      page: paginationRef.current.current, // Keep current page
      limit: paginationRef.current.pageSize,
      sortBy,
      sortOrder,
    };
    
    if (statusFilter !== "all") {
      query.status = statusFilter;
    }
    
    if (searchText.trim()) {
      query.keyword = searchText.trim();
    }
    
    dispatch(categoryListRequest(query));
  }, [sortBy, sortOrder, dispatch, isInitialLoad, statusFilter, searchText]);

  const categories = useMemo(() => {
    // Backend now sets default status = true, so we can use it directly
    return (categoryItems || []);
  }, [categoryItems]);

  // Backend handles filtering, so we use categories directly
  const filteredCategories = categories;

  // Check if any filters are active
  const hasActiveFilters = searchText.trim() || statusFilter !== "all";
  
  // Create filter summary text
  const getFilterSummary = () => {
    const filters = [];
    if (statusFilter !== "all") {
      filters.push(`Trạng thái: ${statusFilter === "active" ? "Đang hiển thị" : "Đang ẩn"}`);
    }
    if (searchText.trim()) {
      filters.push(`Tìm kiếm: "${searchText.trim()}"`);
    }
    return filters.length > 0 ? filters.join(" • ") : "";
  };

  // Use stats from API instead of calculating locally
  const displayStats = {
    total: stats.total || 0,
    active: stats.visible || 0,
    inactive: stats.hidden || 0,
  };

  const handleRefresh = useCallback(() => {
    setLoading(true);
    const query = {
      page: pagination.current,
      limit: pagination.pageSize,
      sortBy,
      sortOrder,
    };
    
    if (statusFilter !== "all") {
      query.status = statusFilter;
    }
    
    if (searchText.trim()) {
      query.keyword = searchText.trim();
    }
    
    dispatch(categoryListRequest(query));
    dispatch(categoryStatsRequest());
    
    setTimeout(() => setLoading(false), 450);
  }, [dispatch, statusFilter, searchText, pagination, sortBy, sortOrder]);

  const handleOpenUpdateModal = useCallback((category) => {
    setSelectedCategory(category);
    setIsUpdateModalVisible(true);
  }, []);

  const handleOpenDetailModal = useCallback((category) => {
    setSelectedCategory(category);
    setIsViewDetailModalVisible(true);
  }, []);

  const handleCreateSuccess = useCallback((createdCategory) => {
    // Send name, description, status, and image file to backend
    const payload = {
      name: createdCategory.name,
      description: createdCategory.description || "",
      status: createdCategory.status !== undefined ? createdCategory.status : true
    };
    
    // If there's an image file, add it to payload
    if (createdCategory.imageFile) {
      payload.image = createdCategory.imageFile;
    }
    
    dispatch(categoryCreateRequest(payload));
    setIsCreateModalVisible(false);
    setPagination((p) => ({ ...p, current: 1 }));
    
    // Refresh the list and stats after create
    setTimeout(() => {
      handleRefresh();
    }, 1000);
  }, [dispatch, handleRefresh]);

  const handleUpdateSuccess = useCallback((updatedCategory) => {
    if (!updatedCategory?._id) return;
    
    const payload = {
      name: updatedCategory.name,
      description: updatedCategory.description || "",
      status: updatedCategory.status !== undefined ? updatedCategory.status : true
    };
    
    // If there's an image file, add it to payload
    if (updatedCategory.imageFile) {
      payload.image = updatedCategory.imageFile;
    }
    
    dispatch(categoryUpdateRequest(updatedCategory._id, payload));
    setIsUpdateModalVisible(false);
    setSelectedCategory(null);
    
    // Refresh the list and stats after update
    setTimeout(() => {
      handleRefresh();
    }, 1000);
  }, [dispatch, handleRefresh]);

  const columns = useMemo(
    () => [
      {
        title: "Hình ảnh",
        dataIndex: "image",
        key: "image",
        width: 80,
        render: (image, record, index) => (
          <Avatar
            size={50}
            src={image || ""}
            icon={<AppstoreOutlined />}
            style={{ 
              backgroundColor: image ? "transparent" : CATEGORY_COLORS[index % CATEGORY_COLORS.length],
              border: image ? "1px solid #d9d9d9" : "none"
            }}
          />
        ),
      },
      {
        title: "Thông tin Category",
        key: "category",
        render: (_, record) => (
            <div>
              <div style={{ color: "#0D364C", fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>{record.name}</div>
              {record.description && (
                <div style={{ color: "#666", fontSize: 14, marginBottom: 4 }}>{record.description}</div>
              )}
              <div
                style={{ fontSize: 12, color: "#999", cursor: "pointer" }}
                onClick={() => {
                  navigator.clipboard.writeText(record._id);
                  message.success("Đã copy ID vào clipboard");
                }}
                title="Click để copy ID"
              >
                <AppstoreOutlined style={{ marginRight: 4 }} />ID: {record._id}
              </div>
              {record.image && (
                <div style={{ fontSize: 11, color: "#13C2C2", marginTop: 2 }}>
                  📷 Có hình ảnh
                </div>
              )}
            </div>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status) => (
          <Badge
            status={status ? "success" : "error"}
            text={
              <Tag
                color={status ? "#52c41a" : "#ff4d4f"}
                icon={status ? <CheckCircleOutlined /> : <StopOutlined />}
                style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }}
              >
                {status ? "Hiển thị" : "Ẩn"}
              </Tag>
            }
          />
        ),
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        sorter: {
          multiple: false,
        },
        sortOrder: sortBy === 'default' ? null : (sortBy === 'createdat' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null),
        render: (date) => (
          <div>
            <span style={{ color: "#0D364C", fontSize: 14, display: "block" }}>
              {date ? new Date(date).toLocaleDateString("vi-VN") : "N/A"}
            </span>
            <span style={{ color: "#999", fontSize: 12 }}>
              {date ? new Date(date).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }) : ""}
            </span>
          </div>
        ),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => (
          <Space size="small">
            <Button type="text" icon={<EyeOutlined />} onClick={() => handleOpenDetailModal(record)} style={{ color: "#13C2C2" }} title="Xem chi tiết" />
            <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenUpdateModal(record)} style={{ color: "#0D364C" }} title="Chỉnh sửa" />
          </Space>
        ),
      },
    ],
    [handleOpenDetailModal, handleOpenUpdateModal, sortBy, sortOrder, message]
  );

  const handleTableChange = (pagination, filters, sorter) => {
    // Xử lý khi click vào createdAt column (cả khi có field và khi field undefined nhưng đang sort createdat)
    if ((sorter && sorter.field === 'createdAt') || (sorter && !sorter.field && sortBy === 'createdat')) {
      const newClickCount = createdAtClickCount + 1;
      setCreatedAtClickCount(newClickCount);
      
      // Cycle through 3 states: desc → asc → reset to default
      if (newClickCount % 3 === 1) {
        // Click 1, 4, 7... → desc (mới nhất)
        setSortBy("createdat");
        setSortOrder("desc");
      } else if (newClickCount % 3 === 2) {
        // Click 2, 5, 8... → asc (cũ nhất)
        setSortBy("createdat");
        setSortOrder("asc");
      } else {
        // Click 3, 6, 9... → reset to default (no sort)
        setSortBy("default");
        setSortOrder("");
        
        // Không dispatch ở đây, để useEffect xử lý
      }
    }
  };

  // Handle sort option change from dropdown
  const handleSortChange = (value) => {
    switch (value) {
      case "default":
        setSortBy("default");
        setSortOrder("");
        break;
      case "newest":
        setSortBy("createdat");
        setSortOrder("desc");
        break;
      case "oldest":
        setSortBy("createdat");
        setSortOrder("asc");
        break;
      case "name-asc":
        setSortBy("name");
        setSortOrder("asc");
        break;
      case "name-desc":
        setSortBy("name");
        setSortOrder("desc");
        break;
      default:
        setSortBy(defaultSort.sortBy);
        setSortOrder(defaultSort.sortOrder);
    }
  };


  const tablePagination = useMemo(
    () => ({
      current: apiPagination?.page || pagination.current,
      pageSize: apiPagination?.limit || pagination.pageSize,
      total: apiPagination?.total || 0,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ["5", "10", "20", "50"],
      showTotal: (total, range) => (
        <span style={{ color: "#0D364C" }}>
          Hiển thị {range[0]}-{range[1]} trong tổng số {total} categories
          {hasActiveFilters && <span style={{ color: "#13C2C2" }}> (đã lọc)</span>}
        </span>
      ),
      onChange: (page, pageSize) => {
        setPagination({ current: page, pageSize });
        const query = {
          page,
          limit: pageSize,
          sortBy,
          sortOrder,
        };
        
        if (statusFilter !== "all") query.status = statusFilter;
        if (searchText.trim()) query.keyword = searchText.trim();
        
        dispatch(categoryListRequest(query));
      },
      onShowSizeChange: (current, size) => {
        setPagination({ current, pageSize: size });
        // Dispatch API call với page size mới
        const query = {
          page: current,
          limit: size,
          sortBy,
          sortOrder,
        };
        
        if (statusFilter !== "all") query.status = statusFilter;
        if (searchText.trim()) query.keyword = searchText.trim();
        
        dispatch(categoryListRequest(query));
      },
    }),
    [apiPagination, pagination, hasActiveFilters, statusFilter, searchText, sortBy, sortOrder, dispatch]
  );

  // Backend handles pagination, so we use categories directly
  const dataForPage = filteredCategories;

  return (
    <div
      style={{
        padding: 24,
        background: "linear-gradient(135deg, #13C2C205 0%, #0D364C05 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={loadingStats} size="small">
              <Statistic title={<span style={{ color: "#0D364C" }}>Tổng categories</span>} value={displayStats.total} prefix={<AppstoreOutlined style={{ color: "#13C2C2" }} />} valueStyle={{ color: "#13C2C2", fontWeight: "bold" }} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={loadingStats} size="small">
              <Statistic title={<span style={{ color: "#0D364C" }}>Đang hiển thị</span>} value={displayStats.active} prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />} valueStyle={{ color: "#52c41a", fontWeight: "bold" }} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={loadingStats} size="small">
              <Statistic title={<span style={{ color: "#0D364C" }}>Đang ẩn</span>} value={displayStats.inactive} prefix={<StopOutlined style={{ color: "#ff4d4f" }} />} valueStyle={{ color: "#ff4d4f", fontWeight: "bold" }} />
            </Spin>
          </Card>
        </Col>
      </Row>

      <Card
        style={{ borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #13C2C220" }}
        title={
          <Space>
            <Avatar style={{ backgroundColor: "#13C2C2" }} icon={<AppstoreOutlined />} />
            <Title level={3} style={{ margin: 0, color: "#0D364C" }}>Quản lý Categories</Title>
          </Space>
        }
      >
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <Space size="middle" style={{ flex: 1, flexWrap: "wrap" }}>
            <Input.Search
              placeholder="Tìm kiếm theo tên category hoặc ID..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 320, maxWidth: "100%" }}
              size="large"
              prefix={<SearchOutlined style={{ color: "#13C2C2" }} />}
              allowClear
              onSearch={(value) => setSearchText(value)}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
              size="large"
              placeholder="Lọc theo trạng thái"
              suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="active">Đang hiển thị</Select.Option>
              <Select.Option value="inactive">Đang ẩn</Select.Option>
            </Select>
            <Select
              value={sortBy === "default" ? "default" : `${sortBy}-${sortOrder}`}
              onChange={handleSortChange}
              style={{ width: 180 }}
              size="large"
              placeholder="Sắp xếp"
              suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}
            >
              <Select.Option value="default">Mặc định</Select.Option>
              <Select.Option value="newest">Mới nhất</Select.Option>
              <Select.Option value="oldest">Cũ nhất</Select.Option>
              <Select.Option value="name-asc">Tên A-Z</Select.Option>
              <Select.Option value="name-desc">Tên Z-A</Select.Option>
            </Select>
          </Space>
          <Space>
            <Button onClick={handleRefresh} icon={<ReloadOutlined />} loading={loading} style={{ borderColor: "#13C2C2", color: "#13C2C2" }}>Làm mới</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)} style={{ backgroundColor: "#0D364C", borderColor: "#0D364C" }}>Thêm Category</Button>
          </Space>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => dispatch(categoryClearMessages())}
            style={{ 
              marginBottom: 16, 
              borderColor: "#ff4d4f", 
              backgroundColor: "#fff2f0"
            }}
          />
        )}
        
        {message && (
          <Alert
            message={message}
            type="success"
            showIcon
            closable
            onClose={() => dispatch(categoryClearMessages())}
            style={{ 
              marginBottom: 16, 
              borderColor: "#52c41a", 
              backgroundColor: "#f6ffed"
            }}
          />
        )}

        {/* Filter status indicator */}
        {hasActiveFilters && (
          <Alert
            message={`Đang hiển thị kết quả đã lọc: ${getFilterSummary()}`}
            type="info"
            showIcon
            closable={false}
            style={{ 
              marginBottom: 16, 
              borderColor: "#13C2C2", 
              backgroundColor: "#f0fdff",
              border: "1px solid #13C2C220"
            }}
            action={
              <Button 
                size="small" 
                type="link" 
                onClick={() => {
                  setSearchText("");
                  setStatusFilter("all");
                }}
                style={{ color: "#13C2C2" }}
              >
                Xóa bộ lọc
              </Button>
            }
          />
        )}

        <Spin spinning={loading || loadingList || creating || updating} tip={loadingList ? "Đang tải categories..." : undefined}>
          <Table
            rowKey={(record) => record._id}
            columns={columns}
            dataSource={dataForPage}
            pagination={tablePagination}
            onChange={handleTableChange}
            style={{ borderRadius: 12, overflow: "hidden" }}
            scroll={{ x: true }}
            size="middle"
          />
        </Spin>
      </Card>

      <CreateCategory visible={isCreateModalVisible} onClose={() => setIsCreateModalVisible(false)} onSuccess={handleCreateSuccess} />

      {selectedCategory && (
        <UpdateCategory visible={isUpdateModalVisible} categoryData={selectedCategory} onClose={() => { setIsUpdateModalVisible(false); setSelectedCategory(null); }} onSuccess={handleUpdateSuccess} />
      )}

      {selectedCategory && (
        <ViewCategoryDetail visible={isViewDetailModalVisible} categoryData={selectedCategory} onClose={() => { setIsViewDetailModalVisible(false); setSelectedCategory(null); }} />
      )}
    </div>
  );
};

CategoryManagement.propTypes = {
  // no props
};

export default CategoryManagement;


