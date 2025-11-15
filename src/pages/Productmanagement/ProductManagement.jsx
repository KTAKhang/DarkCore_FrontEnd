import { useState, useEffect } from "react";
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
} from "../../redux/actions/productActions";
import { categoryListRequest } from "../../redux/actions/categoryActions";

const { Title, Text } = Typography;

const getSortQuery = (option) => {
  const sortMap = {
    default: null,
    newest: { sortBy: "createdat", sortOrder: "desc" },
    oldest: { sortBy: "createdat", sortOrder: "asc" },
    "price-asc": { sortBy: "price", sortOrder: "asc" },
    "price-desc": { sortBy: "price", sortOrder: "desc" },
  };
  return sortMap[option] || null;
};

const createProductQuery = ({ page, limit, keyword, status, categoryId, categories, sortOption }) => {
  const query = {
    page,
    limit,
  };

  if (keyword?.trim()) {
    query.keyword = keyword.trim();
  }

  if (status && status !== "all") {
    query.status = status;
  }

  if (categoryId && categoryId !== "all" && Array.isArray(categories)) {
    const foundCategory = categories.find((cat) => cat._id === categoryId);
    if (foundCategory?.name) {
      query.categoryName = foundCategory.name;
    }
  }

  const sortConfig = getSortQuery(sortOption);
  if (sortConfig?.sortBy) {
    query.sortBy = sortConfig.sortBy;
    query.sortOrder = sortConfig.sortOrder;
  }

  return query;
};

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { items: productItems, stats, pagination: apiPagination, loadingList, loadingStats, creating, updating, deleting } = useSelector((state) => state.product);
  const { items: categoryItems } = useSelector((state) => state.category);
  
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [pageInfo, setPageInfo] = useState({ current: 1, size: 5 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    dispatch(productStatsRequest());
    dispatch(categoryListRequest({ page: 1, limit: 100, status: "active" }));
    const query = createProductQuery({
      page: pageInfo.current,
      limit: pageInfo.size,
      keyword: debouncedSearchText,
      status: statusFilter,
      categoryId: categoryFilter,
      categories: categoryItems || [],
      sortOption,
    });
    dispatch(productListRequest(query));
    setTimeout(() => setIsRefreshing(false), 450);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchText(searchText);
      setPageInfo((prev) => ({ ...prev, current: 1 }));
    }, searchText.trim() ? 500 : 0);
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  useEffect(() => {
    dispatch(productStatsRequest());
    dispatch(categoryListRequest({ page: 1, limit: 100, status: "active" }));
  }, [dispatch]);

  useEffect(() => {
    const query = createProductQuery({
      page: pageInfo.current,
      limit: pageInfo.size,
      keyword: debouncedSearchText,
      status: statusFilter,
      categoryId: categoryFilter,
      categories: categoryItems || [],
      sortOption,
    });

    dispatch(productListRequest(query));
  }, [dispatch, pageInfo, debouncedSearchText, statusFilter, categoryFilter, sortOption, categoryItems]);

  // Simplified data mapping
  const products = (productItems || []).map((product) => {
    const categoryInfo = product.category
      ? {
          _id: product.category._id,
          name: product.category.name,
          status: product.category.status,
        }
      : null;

    const fallbackCategoryId = typeof product.category === "string" ? product.category : null;

    return {
      ...product,
      quantity: product.stockQuantity,
      category_id: categoryInfo ? categoryInfo._id : fallbackCategoryId,
      categoryDetail: categoryInfo,
      image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "",
      short_desc: product.short_desc ?? product.description ?? "",
      detail_desc: product.detail_desc ?? product.warrantyDetails ?? "",
    };
  });

  const hasActiveFilters = searchText.trim() || statusFilter !== "all" || categoryFilter !== "all";
  const getFilterSummary = () => {
    const activeFilters = [];
    if (statusFilter !== "all") {
      activeFilters.push(`Trạng thái: ${statusFilter === "active" ? "Đang hiển thị" : "Đang ẩn"}`);
    }
    if (categoryFilter !== "all") {
      const selectedCategory = (categoryItems || []).find((c) => c._id === categoryFilter);
      if (selectedCategory) {
        activeFilters.push(`Danh mục: ${selectedCategory.name}`);
      }
    }
    if (searchText.trim()) {
      activeFilters.push(`Tìm kiếm: "${searchText.trim()}"`);
    }
    return activeFilters.join(" • ");
  };

  const displayStats = {
    total: stats.total || 0,
    active: stats.visible || 0,
    inactive: stats.hidden || 0,
  };

  const handleOpenUpdateModal = (product) => {
    setSelectedProduct(product);
    setIsUpdateModalVisible(true);
  };

  const handleOpenViewDetailModal = (product) => {
    setSelectedProduct(product);
    setIsViewDetailModalVisible(true);
  };

  // Simplified create/update handlers
  const mapProductData = (product) => {
    const safeName = product.name ? product.name.trim() : "";
    const safeShortDesc = product.short_desc ? product.short_desc.trim() : product.description?.trim() || "";
    const safeDetailDesc = product.detail_desc ? product.detail_desc.trim() : product.warrantyDetails?.trim() || "";
    const safeBrand = product.brand ? product.brand.trim() : "";
    const rawImages = Array.isArray(product.images)
      ? product.images
      : product.image
      ? [product.image]
      : [];
    const sanitizedImages = rawImages
      .map((img) => {
        if (!img) return null;
        if (typeof img === "string") return img;
        if (typeof File !== "undefined" && img instanceof File) return img;
        if (img?.originFileObj) return img.originFileObj;
        if (typeof img === "object" && img.url) return img.url;
        return null;
      })
      .filter(Boolean);
    let resolvedCategory = null;
    if (product.category && typeof product.category === "object") {
      resolvedCategory = product.category._id;
    } else if (product.category) {
      resolvedCategory = product.category;
    } else if (product.category_id) {
      resolvedCategory = product.category_id;
    } else if (product.categoryDetail) {
      resolvedCategory = product.categoryDetail._id;
    }
    const resolvedStock = Number.isFinite(product.stockQuantity)
      ? product.stockQuantity
      : Number(product.quantity) || 0;

    const payload = {
      name: safeName,
      price: typeof product.price === "number" ? product.price : Number(product.price) || 0,
      stockQuantity: resolvedStock,
      category: resolvedCategory,
      status: typeof product.status === "boolean" ? product.status : true,
      short_desc: safeShortDesc,
      detail_desc: safeDetailDesc,
      brand: safeBrand,
    };
    if (sanitizedImages.length > 0) {
      payload.images = sanitizedImages;
    }
    return payload;
  };

  const handleCreateSuccess = (created) => {
    dispatch(productCreateRequest(mapProductData(created)));
    setIsCreateModalVisible(false);
    setPageInfo((prev) => ({ ...prev, current: 1 }));
    setTimeout(handleRefresh, 1000);
  };

  const handleUpdateSuccess = (updated) => {
    if (!updated?._id) return;
    dispatch(productUpdateRequest(updated._id, mapProductData(updated)));
    setIsUpdateModalVisible(false);
    setSelectedProduct(null);
    setTimeout(handleRefresh, 1000);
  };

  // Simplified table change handler
  const handleTableChange = (paginationData, tableFilters, sorter) => {
    if (paginationData) {
      const nextCurrent = paginationData.current || 1;
      const nextSize = paginationData.pageSize || pageInfo.size;
      if (nextCurrent !== pageInfo.current || nextSize !== pageInfo.size) {
        setPageInfo({ current: nextCurrent, size: nextSize });
      }
    }

    if (sorter?.order) {
      if (sorter.field === "price") {
        setSortOption(sorter.order === "ascend" ? "price-asc" : "price-desc");
      } else if (sorter.field === "createdAt") {
        setSortOption(sorter.order === "ascend" ? "oldest" : "newest");
      }
    } else if (!sorter?.order) {
      setSortOption("default");
    }
  };

  const handleSortChange = (value) => {
    setSortOption(value);
    setPageInfo((prev) => ({ ...prev, current: 1 }));
  };


  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      width: 360,
      render: (_, record) => (
        <Space>
          <Avatar src={record.image} icon={<ShoppingCartOutlined />} style={{ backgroundColor: "#13C2C2" }} onError={() => false} />
          <div style={{ maxWidth: 280, wordBreak: "break-word" }}>
            <Tooltip title={record.name}>
              <Text strong style={{ color: "#0D364C", display: "block", fontSize: 16, lineHeight: 1.3 }}>
                {record.name}
              </Text>
            </Tooltip>
            <Tooltip title="Click để copy ID">
              <Text
                type="secondary"
                style={{ fontSize: 12, cursor: "pointer", display: "inline-block", wordBreak: "break-word" }}
                onClick={() => {
                  navigator.clipboard.writeText(record._id);
                  message.success("Đã copy ID vào clipboard");
                }}
              >
                <ShoppingCartOutlined style={{ marginRight: 4 }} />ID: {record._id}
              </Text>
            </Tooltip>
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
      sorter: { multiple: false },
      sortOrder:
        sortOption === "price-asc"
          ? "ascend"
          : sortOption === "price-desc"
          ? "descend"
          : null,
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
      sorter: { multiple: false },
      sortOrder:
        sortOption === "newest"
          ? "descend"
          : sortOption === "oldest"
          ? "ascend"
          : null,
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
        <Tag color={status ? "#52c41a" : "#ff4d4f"} style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }}>
          {status ? "Hiển thị" : "Ẩn"}
        </Tag>
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

  const tablePagination = {
    current: apiPagination?.page || pageInfo.current,
    pageSize: apiPagination?.limit || pageInfo.size,
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
  };

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
            <Input.Search 
              placeholder="Tìm kiếm theo tên sản phẩm hoặc ID..." 
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
              onChange={(value) => {
                setStatusFilter(value);
                setPageInfo((prev) => ({ ...prev, current: 1 }));
              }}
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
              onChange={(value) => {
                setCategoryFilter(value);
                setPageInfo((prev) => ({ ...prev, current: 1 }));
              }}
              style={{ width: 180 }}
              size="large"
              placeholder="Lọc theo danh mục"
              suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}
            >
              <Select.Option value="all">Tất cả danh mục</Select.Option>
              {(categoryItems || []).filter(cat => cat.status === true).map((cat) => (
                <Select.Option key={cat._id} value={cat._id}>{cat.name}</Select.Option>
              ))}
            </Select>
            <Select
              value={sortOption}
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
            <Button onClick={handleRefresh} icon={<ReloadOutlined />} loading={isRefreshing} style={{ borderColor: "#13C2C2", color: "#13C2C2" }}>Làm mới</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)} style={{ backgroundColor: "#0D364C", borderColor: "#0D364C" }}>Thêm Sản phẩm</Button>
          </Space>
        </div>

        
        {/* Removed success message alert - using toast notification instead */}

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
                  setSortOption("default");
                  setPageInfo((prev) => ({ ...prev, current: 1 }));
                }}
                style={{ color: "#13C2C2" }}
              >
                Xóa bộ lọc
              </Button>
            }
          />
        )}

        <Spin spinning={isRefreshing || loadingList || creating || updating || deleting} tip={loadingList ? "Đang tải sản phẩm..." : undefined}>
          <Table 
            rowKey={(record) => record._id} 
            columns={columns} 
            dataSource={products} 
            pagination={tablePagination} 
            onChange={handleTableChange}
            style={{ borderRadius: 12, overflow: "hidden" }} 
            scroll={{ x: true }} 
            size="middle" 
          />
        </Spin>
      </Card>

      <CreateProduct
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
        categories={(categoryItems || []).filter((c) => c.status === true)}
        existingProducts={products}
      />

      {selectedProduct && (
        <UpdateProduct
          visible={isUpdateModalVisible}
          productData={selectedProduct}
          onClose={() => { setIsUpdateModalVisible(false); setSelectedProduct(null); }}
          onSuccess={handleUpdateSuccess}
          categories={(categoryItems || []).filter((c) => c.status === true)}
          existingProducts={products}
        />
      )}

      {selectedProduct && (
        <ViewProductDetail visible={isViewDetailModalVisible} productData={selectedProduct} onClose={() => { setIsViewDetailModalVisible(false); setSelectedProduct(null); }} />
      )}
    </div>
  );
};

export default ProductManagement;


