import { useCallback, useEffect, useMemo, useState } from "react";
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
  message,
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
} from "../../redux/actions/categoryActions";

const { Title } = Typography;

// Simple placeholder avatar background colors
const CATEGORY_COLORS = ["#13C2C2", "#52c41a", "#fa8c16", "#722ED1", "#0D364C"]; 

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { items: categoryItems, stats, loadingList, loadingStats, creating, updating } = useSelector((state) => state.category);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "active", "inactive"
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

  // Modals state
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Load categories with current filters
  const loadCategories = useCallback((query = {}) => {
    dispatch(categoryListRequest(query));
  }, [dispatch]);

  useEffect(() => {
    // Initial load - get all categories and stats
    dispatch(categoryListRequest({}));
    dispatch(categoryStatsRequest());
  }, [dispatch]);

  // Auto-load when filters change with debounce for search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const query = {};
      let hasFilters = false;
      
      if (statusFilter !== "all") {
        query.status = statusFilter;
        hasFilters = true;
      }
      
      if (searchText.trim()) {
        query.keyword = searchText.trim();
        hasFilters = true;
      }
      
      // Load categories with filters or reset to all if no filters
      loadCategories(query);
      
      // Reset to first page when filtering or resetting
      setPagination(prev => ({ ...prev, current: 1 }));
      
      // If no filters, refresh stats
      if (!hasFilters) {
        dispatch(categoryStatsRequest());
      }
    }, searchText.trim() ? 500 : 0); // 500ms debounce for search, immediate for status filter

    return () => clearTimeout(timeoutId);
  }, [searchText, statusFilter, loadCategories, dispatch]);

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
    const query = {};
    if (statusFilter !== "all") {
      query.status = statusFilter;
    }
    if (searchText.trim()) {
      query.keyword = searchText.trim();
    }
    dispatch(categoryListRequest(query));
    
    // Also refresh stats
    dispatch(categoryStatsRequest());
    
    setTimeout(() => setLoading(false), 450);
  }, [dispatch, statusFilter, searchText]);

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
        render: (date) => (
          <span style={{ color: "#999" }}>
            {date
              ? new Date(date).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A"}
          </span>
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
    [handleOpenDetailModal, handleOpenUpdateModal]
  );

  const tablePagination = useMemo(
    () => ({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: filteredCategories.length,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ["5", "10", "20", "50"],
      showTotal: (total, range) => (
        <span style={{ color: "#0D364C" }}>
          Hiển thị {range[0]}-{range[1]} trong tổng số {total} categories
          {hasActiveFilters && <span style={{ color: "#13C2C2" }}> (đã lọc)</span>}
        </span>
      ),
      onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
      onShowSizeChange: (current, size) => setPagination({ current, pageSize: size }),
    }),
    [filteredCategories.length, pagination, hasActiveFilters]
  );

  const dataForPage = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredCategories.slice(start, end);
  }, [filteredCategories, pagination]);

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
          </Space>
          <Space>
            <Button onClick={handleRefresh} icon={<ReloadOutlined />} loading={loading} style={{ borderColor: "#13C2C2", color: "#13C2C2" }}>Làm mới</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)} style={{ backgroundColor: "#0D364C", borderColor: "#0D364C" }}>Thêm Category</Button>
          </Space>
        </div>

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


