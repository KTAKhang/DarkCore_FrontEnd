// src/pages/staff/StaffProductManagement.jsx
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
import StaffCreateProduct from "./StaffCreateProduct";
import StaffUpdateProduct from "./StaffUpdateProduct";
import StaffViewProductDetail from "./StaffViewProductDetail";
import {
    staffProductListRequest,
    staffProductCreateRequest,
    staffProductUpdateRequest,
    staffProductStatsRequest,
} from "../../redux/actions/staffProductActions";
import { categoryListRequest } from "../../redux/actions/categoryActions";

const { Title, Text } = Typography;

const StaffProductManagement = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(staffProductListRequest({ page: 1, limit: 20 }));
        dispatch(staffProductStatsRequest());
    }, [dispatch]);
    const {
        items: productItems,
        stats,
        pagination: apiPagination,
        loadingList,
        loadingStats,
        creating,
        updating,
        deleting
    } = useSelector((state) => state.staffProduct); // Dùng state.staffProduct
    const { items: categoryItems } = useSelector((state) => state.category);

    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        searchText: "",
        status: "all",
        category: "all"
    });
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
    const [sort, setSort] = useState({ sortBy: "default", sortOrder: "" });

    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const filtersRef = useRef(filters);
    const paginationRef = useRef(pagination);
    const sortRef = useRef(sort);
    const categoryItemsRef = useRef(categoryItems);

    useEffect(() => { filtersRef.current = filters; }, [filters]);
    useEffect(() => { paginationRef.current = pagination; }, [pagination]);
    useEffect(() => { sortRef.current = sort; }, [sort]);
    useEffect(() => { categoryItemsRef.current = categoryItems; }, [categoryItems]);

    const fetchProducts = useCallback((params = {}) => {
        const currentFilters = filtersRef.current;
        const currentPagination = paginationRef.current;
        const currentSort = sortRef.current;
        const currentCategoryItems = categoryItemsRef.current;

        const query = {
            page: currentPagination.current,
            limit: currentPagination.pageSize,
            sortBy: currentSort.sortBy,
            sortOrder: currentSort.sortOrder,
            ...params
        };

        if (currentFilters.status !== "all") query.status = currentFilters.status;
        if (currentFilters.searchText.trim()) query.keyword = currentFilters.searchText.trim();
        if (currentFilters.category !== "all") {
            const selectedCategory = currentCategoryItems.find(c => c._id === currentFilters.category);
            if (selectedCategory) query.categoryName = selectedCategory.name;
        }

        dispatch(staffProductListRequest(query)); // Dùng action staff
    }, [dispatch]);

    useEffect(() => {
        fetchProducts({ page: 1 });
        dispatch(staffProductStatsRequest()); // Dùng stats staff
        dispatch(categoryListRequest({ page: 1, limit: 100, status: "active" }));
    }, [dispatch, fetchProducts]);

    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        if (isInitialLoad) {
            setIsInitialLoad(false);
            return;
        }

        const timeoutId = setTimeout(() => {
            setPagination(prev => ({ ...prev, current: 1 }));
            fetchProducts({ page: 1 });
        }, filters.searchText.trim() ? 500 : 0);

        return () => clearTimeout(timeoutId);
    }, [filters, fetchProducts, isInitialLoad]);

    useEffect(() => {
        if (isInitialLoad) return;
        fetchProducts();
    }, [sort, fetchProducts, isInitialLoad]);

    const products = useMemo(() => {
        return (productItems || []).map(product => ({
            ...product,
            quantity: product.stockQuantity,
            category_id: product.category?._id,
            categoryDetail: product.category ? {
                _id: product.category._id,
                name: product.category.name,
                status: product.category.status
            } : null,
            image: product.images?.[0] || "",
            short_desc: product.short_desc ?? product.description ?? "",
            detail_desc: product.detail_desc ?? product.warrantyDetails ?? "",
        }));
    }, [productItems]);

    const hasActiveFilters = filters.searchText.trim() || filters.status !== "all" || filters.category !== "all";

    const getFilterSummary = () => {
        const activeFilters = [];
        if (filters.status !== "all") {
            activeFilters.push(`Trạng thái: ${filters.status === "active" ? "Đang hiển thị" : "Đang ẩn"}`);
        }
        if (filters.category !== "all") {
            const selectedCategory = categoryItems.find(c => c._id === filters.category);
            if (selectedCategory) activeFilters.push(`Danh mục: ${selectedCategory.name}`);
        }
        if (filters.searchText.trim()) {
            activeFilters.push(`Tìm kiếm: "${filters.searchText.trim()}"`);
        }
        return activeFilters.join(" • ");
    };

    const displayStats = {
        total: stats.total || 0,
        active: stats.visible || 0,
        inactive: stats.hidden || 0,
    };

    const handleRefresh = useCallback(() => {
        setLoading(true);
        fetchProducts();
        dispatch(staffProductStatsRequest());
        setTimeout(() => setLoading(false), 450);
    }, [dispatch, fetchProducts]);

    const handleOpenUpdateModal = (product) => {
        setSelectedProduct(product);
        setIsUpdateModalVisible(true);
    };

    const handleOpenViewDetailModal = (product) => {
        setSelectedProduct(product);
        setIsViewDetailModalVisible(true);
    };

    const mapProductData = (product) => ({
        name: product.name,
        price: product.price,
        stockQuantity: product.quantity || 1,
        category_id: product.category_id, // ← GIỮ NGUYÊN
        status: product.status !== undefined ? product.status : true,
        short_desc: product.short_desc?.trim() || "",
        detail_desc: product.detail_desc?.trim() || "",
        brand: product.brand?.trim() || "",
        images: Array.isArray(product.images) ? product.images : (product.image ? [product.image] : [])
    });

    // StaffProductManagement.jsx
    const handleCreateSuccess = useCallback((created) => {
        console.log("handleCreateSuccess received:", created); // ← LOG
        console.log("category_id in handleCreateSuccess:", created.category_id);

        // KHÔNG DÙNG mapProductData → nó xóa category_id
        dispatch(staffProductCreateRequest(created)); // ← GỌI TRỰC TIẾP

        setIsCreateModalVisible(false);
        setPagination(prev => ({ ...prev, current: 1 }));
        setTimeout(handleRefresh, 1000);
    }, [dispatch, handleRefresh]);

    const handleUpdateSuccess = useCallback((updated) => {
        if (!updated?._id) return;
        dispatch(staffProductUpdateRequest(updated._id, mapProductData(updated))); // Dùng staff update
        setIsUpdateModalVisible(false);
        setSelectedProduct(null);
        setTimeout(handleRefresh, 1000);
    }, [dispatch, handleRefresh]);

    const handleTableChange = (paginationData, tableFilters, sorter) => {
        if (sorter?.field && sorter?.order) {
            const sortMap = {
                price: { field: 'price', order: sorter.order === 'ascend' ? 'asc' : 'desc' },
                createdAt: { field: 'createdat', order: sorter.order === 'ascend' ? 'asc' : 'desc' }
            };

            const sortConfig = sortMap[sorter.field];
            if (sortConfig) {
                setSort({ sortBy: sortConfig.field, sortOrder: sortConfig.order });
            }
        } else if (sorter?.field && !sorter?.order) {
            setSort({ sortBy: "default", sortOrder: "" });
        }
    };

    const handleSortChange = (value) => {
        const sortMap = {
            default: { sortBy: "default", sortOrder: "" },
            newest: { sortBy: "createdat", sortOrder: "desc" },
            oldest: { sortBy: "createdat", sortOrder: "asc" },
            "price-asc": { sortBy: "price", sortOrder: "asc" },
            "price-desc": { sortBy: "price", sortOrder: "desc" }
        };

        setSort(sortMap[value] || sortMap.default);
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
                            ID: {record._id}
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
            sorter: { multiple: false },
            sortOrder: sort.sortBy === 'default' ? null : (sort.sortBy === 'price' ? (sort.sortOrder === 'asc' ? 'ascend' : 'descend') : null),
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
            sortOrder: sort.sortBy === 'default' ? null : (sort.sortBy === 'createdat' ? (sort.sortOrder === 'asc' ? 'ascend' : 'descend') : null),
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

    const tablePagination = useMemo(() => ({
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
            fetchProducts({ page, limit: pageSize });
        },
        onShowSizeChange: (current, size) => {
            setPagination({ current, pageSize: size });
            fetchProducts({ page: current, limit: size });
        },
    }), [apiPagination, pagination, hasActiveFilters, fetchProducts]);

    const dataForPage = products;

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

            <Card style={{ borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #13C2C220" }}
                title={
                    <Space>
                        <Avatar style={{ backgroundColor: "#13C2C2" }} icon={<ShoppingCartOutlined />} />
                        <Title level={3} style={{ margin: 0, color: "#0D364C" }}>Quản lý Sản phẩm (Nhân viên)</Title>
                    </Space>
                }>
                <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                    <Space size="middle" style={{ flex: 1, flexWrap: "wrap" }}>
                        <Input.Search
                            placeholder="Tìm kiếm theo tên sản phẩm hoặc ID..."
                            value={filters.searchText}
                            onChange={(e) => setFilters(prev => ({ ...prev, searchText: e.target.value }))}
                            style={{ width: 320, maxWidth: "100%" }}
                            size="large"
                            prefix={<SearchOutlined style={{ color: "#13C2C2" }} />}
                            allowClear
                            onSearch={(value) => setFilters(prev => ({ ...prev, searchText: value }))}
                        />
                        <Select
                            value={filters.status}
                            onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
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
                            value={filters.category}
                            onChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
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
                            value={(() => {
                                if (sort.sortBy === "default") return "default";
                                if (sort.sortBy === "createdat" && sort.sortOrder === "desc") return "newest";
                                if (sort.sortBy === "createdat" && sort.sortOrder === "asc") return "oldest";
                                if (sort.sortBy === "price" && sort.sortOrder === "asc") return "price-asc";
                                if (sort.sortBy === "price" && sort.sortOrder === "desc") return "price-desc";
                                return "default";
                            })()}
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

                {hasActiveFilters && (
                    <Alert
                        message={`Đang hiển thị kết quả đã lọc: ${getFilterSummary()}`}
                        type="info"
                        showIcon
                        closable={false}
                        style={{ marginBottom: 16, borderColor: "#13C2C2", backgroundColor: "#f0fdff", border: "1px solid #13C2C220" }}
                        action={
                            <Button size="small" type="link" onClick={() => setFilters({ searchText: "", status: "all", category: "all" })} style={{ color: "#13C2C2" }}>
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

            {/* Dùng component Staff riêng */}
            <StaffCreateProduct
                visible={isCreateModalVisible}
                onClose={() => setIsCreateModalVisible(false)}
                onSuccess={handleCreateSuccess}
                categories={categoryItems?.filter(c => c.status === true) || []}
            />

            {selectedProduct && (
                <StaffUpdateProduct
                    visible={isUpdateModalVisible}
                    productData={selectedProduct}
                    onClose={() => { setIsUpdateModalVisible(false); setSelectedProduct(null); }}
                    onSuccess={handleUpdateSuccess}
                    categories={(categoryItems || []).filter((c) => c.status === true)}
                />
            )}

            {selectedProduct && (
                <StaffViewProductDetail
                    visible={isViewDetailModalVisible}
                    productData={selectedProduct}
                    onClose={() => { setIsViewDetailModalVisible(false); setSelectedProduct(null); }}
                />
            )}
        </div>
    );
};

export default StaffProductManagement;