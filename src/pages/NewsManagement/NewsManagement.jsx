import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
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
    message,
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
    DeleteOutlined,
    EyeInvisibleOutlined,  // THÊM: Icon cho views
} from "@ant-design/icons";

import CreateNews from "./CreateNews";
import UpdateNews from "./UpdateNews";
import ViewNewsDetail from "./ViewNewsDetail";
import {
    newsListRequest,
    newsCreateRequest,
    newsUpdateRequest,
    newsStatsRequest,  // THÊM: Action mới để fetch stats tổng (không filter)
} from "../../redux/actions/newsActions";

const { Title, Text } = Typography;  // SỬA: Thêm Text vào destructuring từ Typography để tránh TypeError

// Placeholder colors for news avatars if no image
const NEWS_COLORS = ["#13C2C2", "#52c41a", "#fa8c16", "#722ED1", "#0D364C"];

const NewsManagement = () => {
    const dispatch = useDispatch();
    const {
        list,
        stats,  // SỬ DỤNG: stats từ Redux (tổng, không filter)
        pagination: apiPagination,
        loadingList,
        loadingStats,
        creating,
        updating,
        error
    } = useSelector((state) => state.news);

    const [filters, setFilters] = useState({
        searchText: "",
        status: "all"
    });
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
    const [sort, setSort] = useState({ sortBy: "createdAt", sortOrder: "desc" });
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);

    const filtersRef = useRef(filters);
    const paginationRef = useRef(pagination);
    const sortRef = useRef(sort);

    useEffect(() => { filtersRef.current = filters; }, [filters]);
    useEffect(() => { paginationRef.current = pagination; }, [pagination]);
    useEffect(() => { sortRef.current = sort; }, [sort]);

    // THÊM: Fetch stats tổng riêng (không filter)
    const fetchStats = useCallback(() => {
        dispatch(newsStatsRequest({}));  // Gửi empty query để lấy tổng stats
    }, [dispatch]);

    const fetchNews = useCallback((params = {}) => {
        const currentFilters = filtersRef.current;
        const currentPagination = paginationRef.current;
        const currentSort = sortRef.current;

        const query = {
            page: currentPagination.current,
            limit: currentPagination.pageSize,
            sortBy: currentSort.sortBy,
            order: currentSort.sortOrder,
            ...params
        };

        if (currentFilters.status !== "all") {
            query.status = currentFilters.status;
        }

        if (currentFilters.searchText.trim()) {
            query.q = currentFilters.searchText.trim();
        }

        console.log("🔄 fetchNews called with params:", params);
        console.log("🔄 Full query sent to API:", query);

        dispatch(newsListRequest(query));
    }, [dispatch]);

    // SỬA: useEffect mount - fetch cả news và stats
    useEffect(() => {
        fetchStats();  // Fetch stats tổng trước
        fetchNews({ page: 1 });
        setIsInitialLoad(false);
    }, [fetchNews, fetchStats]);

    // THÊM: useEffect để fetch stats khi refresh (handleRefresh)
    useEffect(() => {
        if (!isInitialLoad) {
            fetchStats();  // Refetch stats tổng khi component update (nếu cần)
        }
    }, [isInitialLoad, fetchStats]);

    useEffect(() => {
        if (isInitialLoad) return;

        const timeoutId = setTimeout(() => {
            setPagination(prev => ({ ...prev, current: 1 }));
            fetchNews({ page: 1 });
        }, filters.searchText.trim() ? 500 : 0);

        return () => clearTimeout(timeoutId);
    }, [filters, fetchNews, isInitialLoad]);

    useEffect(() => {
        if (isInitialLoad) return;
        fetchNews();
    }, [sort, fetchNews, isInitialLoad]);

    // MỚI: Sync local pagination.current từ apiPagination sau mỗi fetch
    useEffect(() => {
        if (apiPagination?.page && apiPagination.page !== pagination.current) {
            setPagination(prev => ({ ...prev, current: apiPagination.page }));
        }
    }, [apiPagination?.page]);

    // SỬA: displayStats dùng từ stats Redux (tổng, không phụ thuộc filter)
    const displayStats = useMemo(() => {
        return stats || {  // Fallback nếu stats chưa load
            total: 0,
            published: 0,
            draft: 0,
            archived: 0,
        };
    }, [stats]);

    const newsItems = useMemo(() => {
        return (list?.data || []);
    }, [list]);

    const hasActiveFilters = filters.searchText.trim() || filters.status !== "all";

    const getFilterSummary = useMemo(() => {
        const filtersArr = [];
        if (filters.status !== "all") {
            const statusMap = { published: "Đã xuất bản", draft: "Bản nháp", archived: "Đã lưu trữ" };
            filtersArr.push(`Trạng thái: ${statusMap[filters.status] || filters.status}`);
        }
        if (filters.searchText.trim()) {
            filtersArr.push(`Tìm kiếm: "${filters.searchText.trim()}"`);
        }
        return filtersArr.length > 0 ? filtersArr.join(" • ") : "";
    }, [filters]);

    const handleRefresh = useCallback(() => {
        fetchStats();  // SỬA: Refetch stats tổng
        fetchNews();
    }, [fetchNews, fetchStats]);

    const handleOpenUpdateModal = useCallback((news) => {
        setSelectedNews(news);
        setIsUpdateModalVisible(true);
    }, []);

    const handleOpenDetailModal = useCallback((news) => {
        setSelectedNews(news);
        setIsViewDetailModalVisible(true);
    }, []);

    const handleCreateSuccess = useCallback((createdNews) => {
        // message.success("Tạo tin tức thành công!");
        setIsCreateModalVisible(false);
        setPagination(prev => ({ ...prev, current: 1 }));
        fetchStats();  // SỬA: Refetch stats sau create (vì total thay đổi)
        setTimeout(() => fetchNews({ page: 1 }), 1000);
    }, [fetchNews, fetchStats]);

    const handleUpdateSuccess = useCallback((updatedNews) => {
        // message.success("Cập nhật tin tức thành công!");
        setIsUpdateModalVisible(false);
        setSelectedNews(null);
        fetchStats();  // SỬA: Refetch stats sau update (nếu status thay đổi)
        setTimeout(() => fetchNews(), 1000);
    }, [fetchNews, fetchStats]);

    // SỬA: Xóa title sort, giữ newest/oldest/views-desc, thống nhất sortBy="createdAt"
    const handleSortChange = useCallback((value) => {
        const sortMap = {
            default: { sortBy: "createdAt", sortOrder: "desc" },
            newest: { sortBy: "createdAt", sortOrder: "desc" },
            oldest: { sortBy: "createdAt", sortOrder: "asc" },
            "views-desc": { sortBy: "views", sortOrder: "desc" }  // Giữ: Sort theo views desc (nhiều xem nhất)
        };
        setSort(sortMap[value] || sortMap.default);
    }, []);

    // SỬA: Columns - Thêm cột "Lượt xem" (views) với sorter, thống nhất "createdAt"
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
                            backgroundColor: image ? "transparent" : NEWS_COLORS[index % NEWS_COLORS.length],
                            border: image ? "1px solid #d9d9d9" : "none"
                        }}
                    />
                ),
            },
            {
                title: "Thông tin News",
                key: "news",
                render: (_, record) => (
                    <div>
                        <div style={{ color: "#0D364C", fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>
                            {record.title}
                        </div>
                        {record.excerpt && (
                            <div style={{ color: "#666", fontSize: 14, marginBottom: 4 }}>
                                {record.excerpt.slice(0, 80)}{record.excerpt.length > 80 ? "..." : ""}
                            </div>
                        )}
                        {record.tags && record.tags.length > 0 && (
                            <Space style={{ marginBottom: 4 }}>
                                {record.tags.slice(0, 3).map((tag, idx) => (
                                    <Tag key={idx} color="#13C2C2">{tag}</Tag>
                                ))}
                                {record.tags.length > 3 && <Tag style={{ color: "#999" }}> +{record.tags.length - 3}</Tag>}
                            </Space>
                        )}
                        <div style={{ fontSize: 12, color: "#999", marginBottom: 2 }}>
                            Tác giả: {record.author?.name || "N/A"}
                        </div>
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
                render: (status) => {
                    let color, icon, text;
                    switch (status) {
                        case "published":
                            color = "#52c41a"; icon = <CheckCircleOutlined />; text = "Đã xuất bản";
                            break;
                        case "draft":
                            color = "#faad14"; icon = <StopOutlined />; text = "Bản nháp";
                            break;
                        case "archived":
                            color = "#ff4d4f"; icon = <DeleteOutlined />; text = "Đã lưu trữ";
                            break;
                        default:
                            color = "#d9d9d9"; icon = null; text = status;
                    }
                    return (
                        <Badge
                            status={status === "published" ? "success" : status === "draft" ? "warning" : "error"}
                            text={
                                <Tag
                                    color={color}
                                    icon={icon}
                                    style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }}
                                >
                                    {text}
                                </Tag>
                            }
                        />
                    );
                },
            },
            // THÊM: Cột mới "Lượt xem" (views) với sorter
            {
                title: "Lượt xem",
                dataIndex: "views",
                key: "views",
                width: 100,
                // sorter: true,  // Enable sorter cho column này
                // sortOrder: sort.sortBy === 'views' ? (sort.sortOrder === 'asc' ? 'ascend' : 'descend') : null,
                // render: (views) => (
                //     <Space>
                //         <EyeInvisibleOutlined style={{ color: "#13C2C2" }} />
                //         <Text>{views || 0}</Text>  {/* SỬA: Bây giờ <Text> đã được import đúng */}
                //     </Space>
                // ),
            },
            {
                title: "Ngày tạo",
                dataIndex: "createdAt",
                key: "createdAt",
                // sorter: true,
                // sortOrder: sort.sortBy === 'createdAt' ? (sort.sortOrder === 'asc' ? 'ascend' : 'descend') : null,
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
        [handleOpenDetailModal, handleOpenUpdateModal, sort]
    );

    // SỬA: handleTableChange - Cải thiện cancel sort (lần 3): Force clear và fetch default nếu cancel, thống nhất "createdAt"
    const handleTableChange = (paginationData, tableFilters, sorter) => {
        if (sorter && sorter.field && sorter.order) {
            let newSortBy, newSortOrder;
            if (sorter.field === "createdAt") {
                newSortBy = "createdAt";
                newSortOrder = sorter.order === "ascend" ? "asc" : "desc";
            } else if (sorter.field === "views") {  // THÊM: Handle sort views từ table header
                newSortBy = "views";
                newSortOrder = sorter.order === "ascend" ? "asc" : "desc";
            }
            if (newSortBy) {
                setSort({ sortBy: newSortBy, sortOrder: newSortOrder });
            }
        } else if (sorter?.field && !sorter?.order) {
            // SỬA: Khi cancel (lần 3), set về default và force fetch page 1 để clear visual
            setSort({ sortBy: "createdAt", sortOrder: "desc" });
            setPagination(prev => ({ ...prev, current: 1 }));  // Reset page về 1
            fetchNews({ page: 1 });  // Force fetch với default sort
        }
    };

    const tablePagination = useMemo(() => {
        console.log("🔄 tablePagination computed:", {
            current: apiPagination?.page || pagination.current,
            pageSize: pagination.pageSize,
            total: apiPagination?.total || 0,
            localPagination: pagination,
            apiPagination
        });

        return {
            current: apiPagination?.page || pagination.current,
            pageSize: pagination.pageSize,
            total: apiPagination?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ["5", "10", "20", "50", "100"],
            showTotal: (total, range) => (
                <div style={{ color: "#0D364C" }}>
                    Hiển thị {range[0]}-{range[1]} trong tổng số {total} news
                    {hasActiveFilters && <span style={{ color: "#13C2C2" }}> (đã lọc)</span>}
                </div>
            ),
            onChange: (page, pageSize) => {
                console.log("🔄 onChange triggered:", { page, pageSize });
                setPagination({ current: page, pageSize: pageSize || pagination.pageSize });
                fetchNews({ page, limit: pageSize });
            },
            onShowSizeChange: (current, size) => {
                console.log("🔄 onShowSizeChange triggered:", { current, size });
                setPagination({ current, pageSize: size });
                fetchNews({ page: current, limit: size });
            },
        };
    }, [apiPagination, pagination, hasActiveFilters, fetchNews]);

    const noDataMessage = useMemo(() => {
        if (loadingList) return "Đang tải...";
        if ((apiPagination?.total ?? 0) === 0 && !error) return "Chưa có news nào. Thêm mới để bắt đầu!";
        return undefined;
    }, [loadingList, apiPagination, error]);

    useEffect(() => {
        console.log("🔄 apiPagination updated after fetch:", apiPagination);
        console.log("🔄 Current local pagination:", pagination);
        console.log("🔄 Data length:", newsItems.length);
    }, [apiPagination, pagination, newsItems]);

    return (
        <div
            style={{
                padding: 24,
                background: "linear-gradient(135deg, #13C2C205 0%, #0D364C05 100%)",
                minHeight: "100vh",
            }}
        >
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={6}>
                    <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
                        <Spin spinning={loadingStats} size="small">
                            <Statistic title={<span style={{ color: "#0D364C" }}>Tổng news</span>} value={displayStats.total} prefix={<AppstoreOutlined style={{ color: "#13C2C2" }} />} valueStyle={{ color: "#13C2C2", fontWeight: "bold" }} />
                        </Spin>
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
                        <Spin spinning={loadingStats} size="small">
                            <Statistic title={<span style={{ color: "#0D364C" }}>Đã xuất bản</span>} value={displayStats.published} prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />} valueStyle={{ color: "#52c41a", fontWeight: "bold" }} />
                        </Spin>
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
                        <Spin spinning={loadingStats} size="small">
                            <Statistic title={<span style={{ color: "#0D364C" }}>Bản nháp</span>} value={displayStats.draft} prefix={<StopOutlined style={{ color: "#faad14" }} />} valueStyle={{ color: "#faad14", fontWeight: "bold" }} />
                        </Spin>
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
                        <Spin spinning={loadingStats} size="small">
                            <Statistic title={<span style={{ color: "#0D364C" }}>Đã lưu trữ</span>} value={displayStats.archived} prefix={<DeleteOutlined style={{ color: "#ff4d4f" }} />} valueStyle={{ color: "#ff4d4f", fontWeight: "bold" }} />
                        </Spin>
                    </Card>
                </Col>
            </Row>

            <Card
                style={{ borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #13C2C220" }}
                title={
                    <Space>
                        <Avatar style={{ backgroundColor: "#13C2C2" }} icon={<AppstoreOutlined />} />
                        <Title level={3} style={{ margin: 0, color: "#0D364C" }}>Quản lý News</Title>
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
                            placeholder="Tìm kiếm theo tiêu đề, nội dung hoặc ID..."
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
                            onChange={(val) => setFilters(prev => ({ ...prev, status: val }))}
                            style={{ width: 150 }}
                            size="large"
                            placeholder="Lọc theo trạng thái"
                            suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}
                        >
                            <Select.Option value="all">Tất cả</Select.Option>
                            <Select.Option value="published">Đã xuất bản</Select.Option>
                            <Select.Option value="draft">Bản nháp</Select.Option>
                            <Select.Option value="archived">Đã lưu trữ</Select.Option>
                        </Select>
                        {/* SỬA: Xóa title options, giữ newest/oldest/views-desc, cập nhật computed value */}
                        <Select
                            value={(() => {
                                if (sort.sortBy === "createdAt" && sort.sortOrder === "desc") return "newest";
                                if (sort.sortBy === "createdAt" && sort.sortOrder === "asc") return "oldest";
                                if (sort.sortBy === "views" && sort.sortOrder === "desc") return "views-desc";
                                return "default";
                            })()}
                            onChange={handleSortChange}
                            style={{ width: 180 }}
                            size="large"
                            placeholder="Sắp xếp"
                            suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}
                        >
                            <Select.Option value="default">Mặc định</Select.Option>
                            <Select.Option value="newest">Mới nhất</Select.Option>
                            <Select.Option value="oldest">Cũ nhất</Select.Option>
                            <Select.Option value="views-desc">Xem nhiều nhất</Select.Option>  {/* Giữ: Option views */}
                        </Select>
                    </Space>
                    <Space>
                        <Button onClick={handleRefresh} icon={<ReloadOutlined />} loading={loadingList} style={{ borderColor: "#13C2C2", color: "#13C2C2" }}>Làm mới</Button>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)} style={{ backgroundColor: "#0D364C", borderColor: "#0D364C" }}>Thêm News</Button>
                    </Space>
                </div>

                {/* {error && (
                    <Alert
                        message={error}
                        type="error"
                        showIcon
                        closable
                        onClose={() => {}}
                        style={{
                            marginBottom: 16,
                            borderColor: "#ff4d4f",
                            backgroundColor: "#fff2f0"
                        }}
                    />
                )} */}

                {hasActiveFilters && (
                    <Alert
                        message={`Đang hiển thị kết quả đã lọc: ${getFilterSummary}`}
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
                                    setFilters({ searchText: "", status: "all" });
                                    setSort({ sortBy: "createdAt", sortOrder: "desc" });
                                    setPagination((p) => ({ ...p, current: 1 }));
                                }}
                                style={{ color: "#13C2C2" }}
                            >
                                Xóa bộ lọc
                            </Button>
                        }
                    />
                )}

                {(!loadingList && (apiPagination?.total ?? 0) === 0 && hasActiveFilters) && (
                    <Alert message="Không tìm thấy news phù hợp với bộ lọc" type="warning" showIcon style={{ marginBottom: 16 }} />
                )}

                <Spin spinning={loadingList || creating || updating} tip={loadingList ? "Đang tải trang..." : undefined}>
                    <Table
                        rowKey={(record) => record._id}
                        columns={columns}
                        dataSource={newsItems}
                        pagination={tablePagination}
                        onChange={handleTableChange}
                        locale={{ emptyText: noDataMessage }}
                        style={{ borderRadius: 12, overflow: "hidden" }}
                        scroll={{ x: true }}
                        size="middle"
                    />
                </Spin>
            </Card>

            <CreateNews visible={isCreateModalVisible} onClose={() => setIsCreateModalVisible(false)} onSuccess={handleCreateSuccess} />

            {selectedNews && (
                <UpdateNews visible={isUpdateModalVisible} newsData={selectedNews} onClose={() => { setIsUpdateModalVisible(false); setSelectedNews(null); }} onSuccess={handleUpdateSuccess} />
            )}

            {selectedNews && (
                <ViewNewsDetail visible={isViewDetailModalVisible} newsData={selectedNews} onClose={() => { setIsViewDetailModalVisible(false); setSelectedNews(null); }} />
            )}
        </div>
    );
};

export default NewsManagement;