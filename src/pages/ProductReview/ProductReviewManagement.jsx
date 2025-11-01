import { useState, useEffect, useMemo } from "react";
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
    Modal,
} from "antd";
import {
    EyeOutlined,
    StopOutlined,
    CheckCircleOutlined,
    ReloadOutlined,
    FilterOutlined,
    SearchOutlined,
    CommentOutlined,
    LinkOutlined,
    FileTextOutlined,
    ShoppingCartOutlined,
    ReadOutlined,
    EyeInvisibleOutlined,
} from "@ant-design/icons";
import {
    getAllReviewsForAdminRequest,
    updateReviewStatusRequest,
    clearReviewMessages,
} from "../../redux/actions/reviewActions";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const statusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "true", label: "Đang hiển thị" },
    { value: "false", label: "Đã ẩn" },
];

const sortOptions = [
    { value: "desc", label: "Mới nhất" },
    { value: "asc", label: "Cũ nhất" },
];

const ratingOptions = [
    { value: "all", label: "Tất cả sao" },
    { value: "5", label: "5 sao" },
    { value: "4", label: "4 sao" },
    { value: "3", label: "3 sao" },
    { value: "2", label: "2 sao" },
    { value: "1", label: "1 sao" },
];

const ProductReviewManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        reviews: adminReviewsList,
        total: adminTotal,
        page: adminPage,
        limit: adminLimit,
        loading: adminLoading,
        error: adminError,
    } = useSelector((state) => state.review?.adminReviews || {});
    const { updateStatusLoading, updateStatusError, updatedStatusData } = useSelector(
        (state) => ({
            updateStatusLoading: state.review?.updateStatusLoading,
            updateStatusError: state.review?.updateStatusError,
            updatedStatusData: state.review?.updatedStatusData,
        })
    );

    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [sortBy, setSortBy] = useState("desc");
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
    const [loadingTable, setLoadingTable] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

    const displayStats = {
        total: adminTotal?.totalReview || 0,
        active: adminTotal?.totalActive || 0,
        inactive: adminTotal?.totalInActive || 0,
    };

    const hasActiveFilters = searchText.trim() || statusFilter !== "all" || ratingFilter !== "all";
    const getFilterSummary = () => {
        const filters = [];
        if (statusFilter !== "all") {
            filters.push(`Trạng thái: ${statusFilter === "active" ? "Đang hiển thị" : "Đang ẩn"}`);
        }
        if (ratingFilter !== "all") {
            filters.push(`Số sao: ${["1", "2", "3", "4", "5"].includes(ratingFilter) ? "Đang chọn" : "Không"}`);
        }

        if (searchText.trim()) {
            filters.push(`Tìm kiếm: "${searchText.trim()}"`);
        }
        return filters.length > 0 ? filters.join(" • ") : "";
    };

    useEffect(() => {
        setLoadingTable(true);
        const params = {
            page: pagination.current,
            limit: pagination.pageSize,
            search: searchText.trim() ? searchText.trim() : undefined,
            rating: ratingFilter !== "all" ? ratingFilter : undefined,
            status: statusFilter !== "all" ? statusFilter : undefined,
            sortBy: sortBy || undefined,
        };
        dispatch(getAllReviewsForAdminRequest(params));
        setTimeout(() => setLoadingTable(false), 300);
    }, [dispatch, searchText, ratingFilter, statusFilter, sortBy, pagination]);

    const dataSource = useMemo(
        () =>
            (adminReviewsList || []).map((r) => ({
                _id: r._id,
                productId: r.product?._id || r.product?._id,
                productName: r.product?.name || (r.product && r.product.name) || "Unknown",
                userId: r.user?._id || (r.user && r.user._id),
                userName: r.user?.user_name || r.user?.name || "Người dùng",
                userEmail: r.user?.email || "N/A",
                rating: r.rating,
                content: r.content || r.review_content || "",
                status: typeof r.status === "boolean" ? r.status : Boolean(r.status),
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
            })),
        [adminReviewsList]
    );

    const handleToggleStatus = (record) => {
        const newStatus = !record.status;
        Modal.confirm({
            title: newStatus ? "Bạn có chắc muốn hiển thị đánh giá này?" : "Bạn có chắc muốn ẩn đánh giá này?",
            okText: newStatus ? "Hiển thị" : "Ẩn",
            cancelText: "Hủy",
            onOk() {
                dispatch(updateReviewStatusRequest(record._id, newStatus));
                message.loading({ content: "Đang gửi yêu cầu...", key: "updateStatus" });
            },
        });
    };

    useEffect(() => {
        if (updateStatusLoading === false && updatedStatusData) {
            message.success({ content: "Cập nhật trạng thái thành công", key: "updateStatus", duration: 2 });
            const params = {
                page: pagination.current,
                limit: pagination.pageSize,
                search: searchText.trim() ? searchText.trim() : undefined,
                rating: ratingFilter !== "all" ? ratingFilter : undefined,
                status: statusFilter !== "all" ? statusFilter : undefined,
                sortBy: sortBy || undefined,
            };
            dispatch(getAllReviewsForAdminRequest(params));
            dispatch(clearReviewMessages());
        }

        if (updateStatusLoading === false && updateStatusError) {
            message.error({ content: updateStatusError || "Lỗi khi cập nhật trạng thái", key: "updateStatus", duration: 3 });
            dispatch(clearReviewMessages());
        }
    }, [updateStatusLoading, updatedStatusData, updateStatusError, dispatch, pagination.current, pagination.pageSize, searchText, ratingFilter, statusFilter, sortBy]);

    const columns = [
        {
            title: "ID",
            key: "review_id",
            render: (_, record) => (
                <Space>
                    <div>
                        <Text
                            type="secondary"
                            style={{ fontSize: 12, cursor: "pointer" }}
                            onClick={() => {
                                navigator.clipboard.writeText(record._id);
                                message.success("Đã copy ID vào clipboard");
                            }}
                            title={`Click để copy ID: ${record._id}`}
                        >
                            <FileTextOutlined style={{ marginRight: 4 }} />
                            ID: {record._id.slice(0, 5)}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: "Sản phẩm",
            key: "product",
            render: (_, record) => (
                <Space>
                    <div>

                        <Text strong style={{ color: "#0D364C", display: "block" }}>
                            {record.productName}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: "Người đánh giá",
            key: "user",
            render: (_, record) => (
                <>
                    <div>
                        <Text strong style={{ color: "#0D364C", display: "block" }}>
                            {record.userName}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {record.userEmail}
                        </Text>
                    </div>
                </>


            ),
        },
        {
            title: "Sao",
            dataIndex: "rating",
            key: "rating",
            render: (r) => (
                <Tag color="#fadb14" style={{ borderRadius: 8, fontWeight: 600 }}>
                    {r} ★
                </Tag>
            ),
        },
        {
            title: "Nội dung",
            dataIndex: "content",
            key: "content",
            render: (text, record) => (
                <div style={{ maxWidth: 100 }}>
                    <Text ellipsis={{ tooltip: text }}>{text || "—"}</Text>
                </div>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (s) => (
                <Tag color={s ? "#52c41a" : "#ff4d4f"} style={{ borderRadius: 12 }}>
                    {s ? "Hiển thị" : "Đã ẩn"}
                </Tag>
            ),
        },
        {
            title: "Ngày đánh giá gần nhất",
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (dt) => dt ? new Date(dt).toLocaleString("vi-VN") : "N/A",
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<ReadOutlined />}
                            style={{ color: "#13C2C2" }}
                            onClick={() => {
                                navigate(`/admin/review/${record._id}`);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title={record.status ? "Ẩn đánh giá" : "Hiển thị đánh giá"}>
                        <Button
                            type="text"
                            icon={record.status ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            style={{ color: record.status ? "#ff4d4f" : "#52c41a" }}
                            onClick={() => handleToggleStatus(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const totalReviews = adminTotal?.totalReview || 0;

    const tablePagination = useMemo(
        () => ({
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: totalReviews,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ["5", "10", "20", "50", "100"],
            showTotal: (total, range) => (
                <Text style={{ color: "#0D364C" }}>
                    Hiển thị {range[0]}-{range[1]} trong tổng {total} đánh giá
                </Text>
            ),
            onChange: (page, pageSize) => {
                setPagination({ current: page, pageSize });
            },
            onShowSizeChange: (current, size) => {
                setPagination({ current, pageSize: size });
            },
        }),
        [pagination, totalReviews]
    );

    const handleSearch = (value) => {
        setSearchText(value);
        setPagination((prev) => ({ ...prev, current: 1 }));
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        setPagination((prev) => ({ ...prev, current: 1 }));
    };

    const handleRatingFilter = (value) => {
        setRatingFilter(value);
        setPagination((prev) => ({ ...prev, current: 1 }));
    };

    const handleSort = (value) => {
        setSortBy(value);
        setPagination((prev) => ({ ...prev, current: 1 }));
    };

    return (
        <div style={{ padding: 24, background: "linear-gradient(135deg, #13C2C205 0%, #0D364C05 100%)", minHeight: "100vh" }}>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
                        <Spin spinning={adminLoading} size="small">
                            <Statistic
                                title={<Text style={{ color: "#0D364C" }}>Tổng đánh giá</Text>}
                                value={displayStats.total}
                                prefix={<CommentOutlined style={{ color: "#13C2C2" }} />}
                                valueStyle={{ color: "#13C2C2", fontWeight: "bold" }}
                            />
                        </Spin>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
                        <Spin spinning={adminLoading} size="small">
                            <Statistic
                                title={<Text style={{ color: "#0D364C" }}>Hiển thị</Text>}
                                value={displayStats.active}
                                prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                                valueStyle={{ color: "#52c41a", fontWeight: "bold" }}
                            />
                        </Spin>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
                        <Spin spinning={adminLoading} size="small">
                            <Statistic
                                title={<Text style={{ color: "#0D364C" }}>Đã ẩn</Text>}
                                value={displayStats.inactive}
                                prefix={<StopOutlined style={{ color: "#ff4d4f" }} />}
                                valueStyle={{ color: "#ff4d4f", fontWeight: "bold" }}
                            />
                        </Spin>
                    </Card>
                </Col>
            </Row>

            <Card title={<Space><Avatar style={{ backgroundColor: "#13C2C2" }} icon={<CommentOutlined />} /><Title level={3} style={{ margin: 0, color: "#0D364C" }}>Quản lý Đánh giá Sản phẩm</Title></Space>} style={{ borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #13C2C220" }}>
                <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                    <Space size="middle" style={{ flex: 1, flexWrap: "wrap" }}>
                        <Input.Search
                            placeholder="Tìm kiếm theo user, email, ID..."
                            value={searchText}
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{ width: 360, maxWidth: "100%" }}
                            size="large"
                            prefix={<SearchOutlined style={{ color: "#13C2C2" }} />}
                            allowClear
                            onSearch={handleSearch}
                        />
                        <Select value={ratingFilter} onChange={handleRatingFilter} style={{ width: 150 }} size="large" placeholder="Lọc sao" suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}>
                            {ratingOptions.map(opt => <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>)}
                        </Select>
                        <Select value={statusFilter} onChange={handleStatusFilter} style={{ width: 160 }} size="large" placeholder="Lọc trạng thái" suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}>
                            {statusOptions.map(opt => <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>)}
                        </Select>
                        <Select value={sortBy} onChange={handleSort} style={{ width: 180 }} size="large" placeholder="Sắp xếp" suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}>
                            {sortOptions.map(opt => <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>)}
                        </Select>
                    </Space>
                    <Space>
                        <Button icon={<ReloadOutlined />} loading={loadingTable} onClick={() => {
                            setSearchText("");
                            setStatusFilter("all");
                            setRatingFilter("all");
                            setSortBy("desc");
                            setPagination({ current: 1, pageSize: 5 });
                        }} style={{ borderColor: "#13C2C2", color: "#13C2C2" }}>Làm mới</Button>
                    </Space>
                </div>

                {adminError && <Alert message={adminError} type="error" showIcon style={{ marginBottom: 16 }} />}

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
                                    setRatingFilter("all");
                                }}
                                style={{ color: "#13C2C2" }}
                            >
                                Xóa bộ lọc
                            </Button>
                        }
                    />
                )}

                <Spin spinning={loadingTable || adminLoading} tip={adminLoading ? "Đang tải..." : undefined}>
                    <Table
                        rowKey={(record) => record._id}
                        columns={columns}
                        dataSource={dataSource}
                        pagination={tablePagination}
                        scroll={{ x: true }}
                        size="middle"
                        locale={{ emptyText: "Không có đánh giá nào" }}
                    />
                </Spin>
            </Card>

            <Modal
                open={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                footer={null}
                width={800}
                centered
                destroyOnClose
                title="Chi tiết đánh giá"
            >
                {selectedReview && (
                    <div>
                        <Space style={{ marginBottom: 12 }}>
                            <Text strong>Sản phẩm:</Text>
                            <Text>{selectedReview.productName} (ID: {selectedReview.productId})</Text>
                        </Space>
                        <Space style={{ marginBottom: 12 }}>
                            <Text strong>Người đánh giá:</Text>
                            <Text>{selectedReview.userName} • {selectedReview.userEmail}</Text>
                        </Space>
                        <Space style={{ marginBottom: 12 }}>
                            <Text strong>Số sao:</Text>
                            <Text>{selectedReview.rating} ★</Text>
                        </Space>
                        <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
                            <Text strong>Nội dung:</Text>
                            <div style={{ marginTop: 8 }}>{selectedReview.content || "—"}</div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ProductReviewManagement;