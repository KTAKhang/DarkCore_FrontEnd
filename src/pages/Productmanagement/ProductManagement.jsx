import { useMemo, useState, useCallback, useEffect, useRef } from "react";
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
  Tooltip,
  Spin,
  Select,
  Alert,
  message,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import CreateProduct from "./CreateProduct";
import UpdateProduct from "./UpdateProduct";
import ViewProductDetail from "./ViewProductDetail";
import {
  productListRequest,
  productCreateRequest,
  productUpdateRequest,
  productStatsRequest,
  productClearMessages,
} from "../../redux/actions/productActions";
import { categoryListRequest } from "../../redux/actions/categoryActions";

const { Title, Text } = Typography;

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { items: productItems, stats, pagination: apiPagination, loadingList, loadingStats, creating, updating, deleting, error, message: successMessage } = useSelector((state) => state.product);
  const { items: categoryItems } = useSelector((state) => state.category);
  
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "active", "inactive"
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [sortBy, setSortBy] = useState("default"); // "default", "price", "createdat", "name"
  const [sortOrder, setSortOrder] = useState(""); // "asc", "desc", "" (empty for default)
  const [priceClickCount, setPriceClickCount] = useState(0); // Track clicks on price column
  const [createdAtClickCount, setCreatedAtClickCount] = useState(0); // Track clicks on createdAt column
  const paginationRef = useRef(pagination);
  const prevFiltersRef = useRef({ searchText, statusFilter, categoryFilter });
  
  // Default sort state - cố định không thay đổi (không sort gì cả)
  const defaultSort = { sortBy: "default", sortOrder: "" };
  
  // Update ref when pagination changes
  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Load data on component mount
  useEffect(() => {
    dispatch(productListRequest({ page: 1, limit: 5, sortBy: "default", sortOrder: "" }));
    dispatch(productStatsRequest());
    dispatch(categoryListRequest({})); // Load categories for filters
  }, [dispatch]);

  // Auto-load when filters change with debounce for search
  useEffect(() => {
    // Check if filters actually changed
    const prevFilters = prevFiltersRef.current;
    const filtersChanged = prevFilters.searchText !== searchText || 
                          prevFilters.statusFilter !== statusFilter || 
                          prevFilters.categoryFilter !== categoryFilter;
    
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
      
      if (categoryFilter !== "all") {
        const selectedCategory = categoryItems.find(c => c._id === categoryFilter);
        if (selectedCategory) {
          query.categoryName = selectedCategory.name;
        }
      }
      
      dispatch(productListRequest(query));
      
      // Reset to first page when filtering
      if (paginationRef.current.current !== 1) {
        setPagination(prev => ({ ...prev, current: 1 }));
      }
      
      // Update prev filters
      prevFiltersRef.current = { searchText, statusFilter, categoryFilter };
    }, searchText.trim() ? 500 : 0); // 500ms debounce for search

    return () => clearTimeout(timeoutId);
  }, [searchText, statusFilter, categoryFilter, sortBy, sortOrder, dispatch, categoryItems]);

  // Handle sort changes without resetting pagination
  useEffect(() => {
    console.log("🔄 Sort change - dispatching API call");
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
    
    if (categoryFilter !== "all") {
      const selectedCategory = categoryItems.find(c => c._id === categoryFilter);
      if (selectedCategory) {
        query.categoryName = selectedCategory.name;
      }
    }
    
    dispatch(productListRequest(query));
  }, [sortBy, sortOrder, dispatch, statusFilter, searchText, categoryFilter, categoryItems]);

  // Map backend product data to frontend format
  const products = useMemo(() => {
    return (productItems || []).map(product => ({
      ...product,
      // Map backend fields to frontend expected fields
      quantity: product.stockQuantity,
      category_id: product.category?._id,
      categoryDetail: product.category ? { 
        _id: product.category._id, 
        name: product.category.name, 
        status: product.category.status // ✅ FIX: Sử dụng status thực từ category thay vì hardcode true
      } : null,
      image: product.images && product.images.length > 0 ? product.images[0] : "",
      // Map description fields with backend aliases fallback
      short_desc: product.short_desc ?? product.description ?? "",
      detail_desc: product.detail_desc ?? product.warrantyDetails ?? "",
    }));
  }, [productItems]);

  // Backend handles filtering, so we use products directly
  const filteredProducts = products;

  // Check if any filters are active
  const hasActiveFilters = searchText.trim() || statusFilter !== "all" || categoryFilter !== "all";
  
  // Create filter summary text
  const getFilterSummary = () => {
    const filters = [];
    if (statusFilter !== "all") {
      filters.push(`Trạng thái: ${statusFilter === "active" ? "Đang hiển thị" : "Đang ẩn"}`);
    }
    if (categoryFilter !== "all") {
      const selectedCategory = categoryItems.find(c => c._id === categoryFilter);
      if (selectedCategory) {
        filters.push(`Danh mục: ${selectedCategory.name}`);
      }
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
    
    if (categoryFilter !== "all") {
      const selectedCategory = categoryItems.find(c => c._id === categoryFilter);
      if (selectedCategory) {
        query.categoryName = selectedCategory.name;
      }
    }
    
    dispatch(productListRequest(query));
    dispatch(productStatsRequest());
    
    setTimeout(() => setLoading(false), 450);
  }, [dispatch, statusFilter, searchText, categoryFilter, pagination, sortBy, sortOrder, categoryItems]);

  const handleOpenUpdateModal = (product) => {
    setSelectedProduct(product);
    setIsUpdateModalVisible(true);
  };

  const handleOpenViewDetailModal = (product) => {
    setSelectedProduct(product);
    setIsViewDetailModalVisible(true);
  };

  const handleCreateSuccess = useCallback((created) => {
    console.log("=== ProductManagement handleCreateSuccess ===");
    console.log("created.short_desc:", created.short_desc);
    console.log("created.detail_desc:", created.detail_desc);
    console.log("Full created object:", created);
    
    // Map frontend format to backend format
    const payload = {
      name: created.name,
      price: created.price,
      stockQuantity: created.quantity || 1,
      category: created.category_id,
      status: created.status !== undefined ? created.status : true,
    };
    
    // Only add description fields if they have actual content
    if (created.short_desc && created.short_desc.trim() !== "") {
      console.log("Adding short_desc to payload:", created.short_desc.trim());
      payload.short_desc = created.short_desc.trim();
    } else {
      console.log("short_desc is empty or undefined, not adding to payload");
    }
    if (created.detail_desc && created.detail_desc.trim() !== "") {
      console.log("Adding detail_desc to payload:", created.detail_desc.trim());
      payload.detail_desc = created.detail_desc.trim();
    } else {
      console.log("detail_desc is empty or undefined, not adding to payload");
    }
    if (created.brand && created.brand.trim() !== "") {
      payload.brand = created.brand.trim();
    }
    
    console.log("=== Final payload to saga ===");
    console.log("payload:", payload);
    
    // Handle images
    if (created.images && Array.isArray(created.images)) {
      payload.images = created.images;
    } else if (created.image) {
      payload.images = [created.image];
    }
    
    dispatch(productCreateRequest(payload));
    setIsCreateModalVisible(false);
    setPagination((p) => ({ ...p, current: 1 }));
    
    // Refresh the list and stats after create
    setTimeout(() => {
      handleRefresh();
    }, 1000);
  }, [dispatch, handleRefresh]);

  const handleUpdateSuccess = useCallback((updated) => {
    if (!updated?._id) return;
    
    // Map frontend format to backend format
    const payload = {
      name: updated.name,
      price: updated.price,
      stockQuantity: updated.quantity || 1,
      category: updated.category_id,
      status: updated.status !== undefined ? updated.status : true,
    };
    
    // Only add description fields if they have actual content
    if (updated.short_desc && updated.short_desc.trim() !== "") {
      payload.short_desc = updated.short_desc.trim();
    }
    if (updated.detail_desc && updated.detail_desc.trim() !== "") {
      payload.detail_desc = updated.detail_desc.trim();
    }
    if (updated.brand && updated.brand.trim() !== "") {
      payload.brand = updated.brand.trim();
    }
    
    // Handle images
    if (updated.images && Array.isArray(updated.images)) {
      payload.images = updated.images;
    } else if (updated.image) {
      payload.images = [updated.image];
    }
    
    dispatch(productUpdateRequest(updated._id, payload));
    setIsUpdateModalVisible(false);
    setSelectedProduct(null);
    
    // Refresh the list and stats after update
    setTimeout(() => {
      handleRefresh();
    }, 1000);
  }, [dispatch, handleRefresh]);

  const handleTableChange = (pagination, filters, sorter) => {
    // Xử lý khi click vào price column (cả khi có field và khi field undefined nhưng đang sort price)
    if ((sorter && sorter.field === 'price') || (sorter && !sorter.field && sortBy === 'price')) {
      const newClickCount = priceClickCount + 1;
      setPriceClickCount(newClickCount);
      
      // Cycle through 3 states: asc → desc → reset to default
      if (newClickCount % 3 === 1) {
        // Click 1, 4, 7... → asc
        setSortBy("price");
        setSortOrder("asc");
      } else if (newClickCount % 3 === 2) {
        // Click 2, 5, 8... → desc  
        setSortBy("price");
        setSortOrder("desc");
      } else {
        // Click 3, 6, 9... → reset to default (no sort)
        setSortBy("default");
        setSortOrder("");
        
        // Không dispatch ở đây, để useEffect xử lý
      }
    }
    
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
      case "price-asc":
        setSortBy("price");
        setSortOrder("asc");
        break;
      case "price-desc":
        setSortBy("price");
        setSortOrder("desc");
        break;
      default:
        setSortBy(defaultSort.sortBy);
        setSortOrder(defaultSort.sortOrder);
    }
  };


  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => (
        <Space>
          <Avatar src={record.image} icon={<ShoppingCartOutlined />} style={{ backgroundColor: "#13C2C2" }} onError={() => false} />
          <div>
            <Text strong style={{ color: "#0D364C", display: "block", fontSize: 16 }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: 12, cursor: "pointer" }} onClick={() => {
              navigator.clipboard.writeText(record._id);
              message.success("Đã copy ID vào clipboard");
            }} title="Click để copy ID">
              <ShoppingCartOutlined style={{ marginRight: 4 }} />ID: {record._id}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Danh mục",
      key: "category",
      render: (_, record) => (
        <div>
          <Text strong style={{ color: "#0D364C", display: "block", fontSize: 14 }}>{record.categoryDetail?.name || "N/A"}</Text>
          {record.categoryDetail && (
            <Tag color={record.categoryDetail.status ? "#52c41a" : "#ff4d4f"} style={{ fontSize: 11, marginTop: 4 }}>
              {record.categoryDetail.status ? "Hoạt động" : "Ngừng hoạt động"}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      sorter: {
        multiple: false,
      },
      sortOrder: sortBy === 'default' ? null : (sortBy === 'price' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null),
      render: (price) => (
        <Tag color="#13C2C2" style={{ borderRadius: 16, padding: "4px 12px", fontSize: 14, fontWeight: 500 }}>
          {(price || 0).toLocaleString("vi-VN")}đ
        </Tag>
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
      render: (createdAt) => (
        <div>
          <Text style={{ color: "#0D364C", fontSize: 14, display: "block" }}>
            {createdAt ? new Date(createdAt).toLocaleDateString("vi-VN") : "N/A"}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {createdAt ? new Date(createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }) : ""}
          </Text>
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
            <Tag color={status ? "#52c41a" : "#ff4d4f"} style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }}>
              {status ? "Hiển thị" : "Ẩn"}
            </Tag>
          }
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined />} onClick={() => handleOpenViewDetailModal(record)} style={{ color: "#13C2C2" }} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenUpdateModal(record)} style={{ color: "#0D364C" }} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const tablePagination = useMemo(
    () => ({
      current: apiPagination?.page || pagination.current,
      pageSize: apiPagination?.limit || pagination.pageSize,
      total: apiPagination?.total || 0,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ["5", "10", "20", "50", "100"],
      showTotal: (total, range) => (
        <Text style={{ color: "#0D364C" }}>
          Hiển thị {range[0]}-{range[1]} trong tổng số {total} sản phẩm
          {hasActiveFilters && <span style={{ color: "#13C2C2" }}> (đã lọc)</span>}
        </Text>
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
        if (categoryFilter !== "all") {
          const selectedCategory = categoryItems.find(c => c._id === categoryFilter);
          if (selectedCategory) query.categoryName = selectedCategory.name;
        }
        
        dispatch(productListRequest(query));
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
        if (categoryFilter !== "all") {
          const selectedCategory = categoryItems.find(c => c._id === categoryFilter);
          if (selectedCategory) query.categoryName = selectedCategory.name;
        }
        
        dispatch(productListRequest(query));
      },
    }),
    [apiPagination, pagination, hasActiveFilters, statusFilter, searchText, categoryFilter, categoryItems, sortBy, sortOrder, dispatch]
  );

  // Backend handles pagination, so we use products directly
  const dataForPage = filteredProducts;

  return (
    <div style={{ padding: 24, background: "linear-gradient(135deg, #13C2C205 0%, #0D364C05 100%)", minHeight: "100vh" }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={loadingStats} size="small">
              <Statistic title={<Text style={{ color: "#0D364C" }}>Tổng sản phẩm</Text>} value={displayStats.total} prefix={<ShoppingCartOutlined style={{ color: "#13C2C2" }} />} valueStyle={{ color: "#13C2C2", fontWeight: "bold" }} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={loadingStats} size="small">
              <Statistic title={<Text style={{ color: "#0D364C" }}>Đang hiển thị</Text>} value={displayStats.active} prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />} valueStyle={{ color: "#52c41a", fontWeight: "bold" }} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={loadingStats} size="small">
              <Statistic title={<Text style={{ color: "#0D364C" }}>Đang ẩn</Text>} value={displayStats.inactive} prefix={<StopOutlined style={{ color: "#ff4d4f" }} />} valueStyle={{ color: "#ff4d4f", fontWeight: "bold" }} />
            </Spin>
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #13C2C220" }} title={<Space><Avatar style={{ backgroundColor: "#13C2C2" }} icon={<ShoppingCartOutlined />} /><Title level={3} style={{ margin: 0, color: "#0D364C" }}>Quản lý Sản phẩm</Title></Space>}>
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <Space size="middle" style={{ flex: 1, flexWrap: "wrap" }}>
            <Input.Search placeholder="Tìm kiếm theo tên sản phẩm hoặc ID..." value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: 320, maxWidth: "100%" }} size="large" prefix={<SearchOutlined style={{ color: "#13C2C2" }} />} allowClear onSearch={(value) => setSearchText(value)} />
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
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: 180 }}
              size="large"
              placeholder="Lọc theo danh mục"
              suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}
            >
              <Select.Option value="all">Tất cả danh mục</Select.Option>
              {(categoryItems || []).filter(cat => cat.status).map((cat) => (
                <Select.Option key={cat._id} value={cat._id}>{cat.name}</Select.Option>
              ))}
            </Select>
            <Select
              value={sortBy === "default" ? "default" : `${sortBy}-${sortOrder}`}
              onChange={handleSortChange}
              style={{ width: 200 }}
              size="large"
              placeholder="Sắp xếp"
              suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}
            >
              <Select.Option value="default">Mặc định</Select.Option>
              <Select.Option value="newest">Mới nhất</Select.Option>
              <Select.Option value="oldest">Cũ nhất</Select.Option>
              <Select.Option value="price-asc">Giá thấp đến cao</Select.Option>
              <Select.Option value="price-desc">Giá cao đến thấp</Select.Option>
            </Select>
          </Space>
          <Space>
            <Button onClick={handleRefresh} icon={<ReloadOutlined />} loading={loading} style={{ borderColor: "#13C2C2", color: "#13C2C2" }}>Làm mới</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)} style={{ backgroundColor: "#0D364C", borderColor: "#0D364C" }}>Thêm Sản phẩm</Button>
          </Space>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => dispatch(productClearMessages())}
            style={{ 
              marginBottom: 16, 
              borderColor: "#ff4d4f", 
              backgroundColor: "#fff2f0"
            }}
          />
        )}
        
        {successMessage && (
          <Alert
            message={successMessage}
            type="success"
            showIcon
            closable
            onClose={() => dispatch(productClearMessages())}
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
                  setCategoryFilter("all");
                }}
                style={{ color: "#13C2C2" }}
              >
                Xóa bộ lọc
              </Button>
            }
          />
        )}

        <Spin spinning={loading || loadingList || creating || updating || deleting} tip={loadingList ? "Đang tải sản phẩm..." : undefined}>
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

      <CreateProduct visible={isCreateModalVisible} onClose={() => setIsCreateModalVisible(false)} onSuccess={handleCreateSuccess} categories={(categoryItems || []).filter((c) => c.status)} />

      {selectedProduct && (
        <UpdateProduct visible={isUpdateModalVisible} productData={selectedProduct} onClose={() => { setIsUpdateModalVisible(false); setSelectedProduct(null); }} onSuccess={handleUpdateSuccess} categories={categoryItems || []} />
      )}

      {selectedProduct && (
        <ViewProductDetail visible={isViewDetailModalVisible} productData={selectedProduct} onClose={() => { setIsViewDetailModalVisible(false); setSelectedProduct(null); }} />
      )}
    </div>
  );
};

export default ProductManagement;


