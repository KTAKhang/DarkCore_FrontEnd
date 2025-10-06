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
} from "@ant-design/icons";

import CreateNews from "./CreateNews";
import UpdateNews from "./UpdateNews";
import ViewNewsDetail from "./ViewNewsDetail";
import {
    newsListRequest,
    newsCreateRequest,
    newsUpdateRequest,
} from "../../redux/actions/newsActions";

const { Title } = Typography;

// Placeholder colors for news avatars if no image
const NEWS_COLORS = ["#13C2C2", "#52c41a", "#fa8c16", "#722ED1", "#0D364C"];

const NewsManagement = () => {
    const dispatch = useDispatch();
    const { list, stats, pagination: apiPagination, loadingList, loadingStats, creating, updating, error } = useSelector((state) => state.news);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // "all", "published", "draft", "archived"
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
    const [sortBy, setSortBy] = useState("default"); // "default", "publishedat", "title"
    const [sortOrder, setSortOrder] = useState(""); // "asc", "desc", "" (empty for default)

    // Debug sort state changes
    useEffect(() => {
        if (import.meta.env.DEV) {
            console.log("🔄 News Sort state changed:", { sortBy, sortOrder });
        }
    }, [sortBy, sortOrder]);

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
    const [selectedNews, setSelectedNews] = useState(null);

    useEffect(() => {
        // Initial load - get all news and stats (only once)
        if (isInitialLoad) {
            console.log("🔄 Initial news load");
            dispatch(newsListRequest({ page: 1, limit: 5, sortBy: "publishedAt", order: "desc" }));
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
            };

            if (statusFilter !== "all") {
                query.status = statusFilter;
            }

            if (searchText.trim()) {
                query.q = searchText.trim(); // BE uses q for search
            }

            console.log("🔄 News Filter query:", query);
            dispatch(newsListRequest(query));

            // Reset to first page when filtering
            if (paginationRef.current.current !== 1) {
                setPagination(prev => ({ ...prev, current: 1 }));
            }

            // Update prev filters
            prevFiltersRef.current = { searchText, statusFilter };
        }, searchText.trim() ? 500 : 0); // 500ms debounce for search

        return () => clearTimeout(timeoutId);
    }, [searchText, statusFilter, dispatch, isInitialLoad]); // Remove sort deps to avoid loop

    // Handle sort changes without resetting pagination
    useEffect(() => {
        // Skip if this is initial load (already handled above)
        if (isInitialLoad) return;

        console.log("🔄 News Sort change - dispatching API call");
        console.log("🔄 News Current sort state:", { sortBy, sortOrder });
        console.log("🔄 News Current pagination:", paginationRef.current);

        const query = {
            page: paginationRef.current.current, // Keep current page
            limit: paginationRef.current.pageSize,
            sortBy: sortBy === "default" ? "publishedAt" : sortBy,
            order: sortOrder || "desc",
        };

        if (statusFilter !== "all") {
            query.status = statusFilter;
        }

        if (searchText.trim()) {
            query.q = searchText.trim();
        }

        console.log("🔄 News Sort query:", query);
        dispatch(newsListRequest(query));
    }, [sortBy, sortOrder, dispatch, isInitialLoad]); // Remove status/search deps to avoid re-trigger

    const newsItems = useMemo(() => {
        // Backend handles filtering, so we use list.data directly
        return (list?.data || []);
    }, [list]);

    // Backend handles filtering, so we use newsItems directly
    const filteredNews = newsItems;

    // Check if any filters are active
    const hasActiveFilters = searchText.trim() || statusFilter !== "all";

    // Create filter summary text
    const getFilterSummary = () => {
        const filters = [];
        if (statusFilter !== "all") {
            const statusMap = { published: "Đã xuất bản", draft: "Bản nháp", archived: "Đã lưu trữ" };
            filters.push(`Trạng thái: ${statusMap[statusFilter] || statusFilter}`);
        }
        if (searchText.trim()) {
            filters.push(`Tìm kiếm: "${searchText.trim()}"`);
        }
        return filters.length > 0 ? filters.join(" • ") : "";
    };

    // Use stats from API or compute from list (assume stats added)
    const displayStats = {
        total: stats?.total || list?.total || 0,
        published: stats?.published || 0,
        draft: stats?.draft || 0,
        archived: stats?.archived || 0,
    };

    const handleRefresh = useCallback(() => {
        setLoading(true);
        const query = {
            page: pagination.current,
            limit: pagination.pageSize,
            sortBy: sortBy === "default" ? "publishedAt" : sortBy,
            order: sortOrder || "desc",
        };

        if (statusFilter !== "all") {
            query.status = statusFilter;
        }

        if (searchText.trim()) {
            query.q = searchText.trim();
        }

        dispatch(newsListRequest(query));

        setTimeout(() => setLoading(false), 450);
    }, [dispatch, statusFilter, searchText, pagination, sortBy, sortOrder]);

    const handleOpenUpdateModal = useCallback((news) => {
        setSelectedNews(news);
        setIsUpdateModalVisible(true);
    }, []);

    const handleOpenDetailModal = useCallback((news) => {
        setSelectedNews(news);
        setIsViewDetailModalVisible(true);
    }, []);

    const handleCreateSuccess = useCallback((createdNews) => {
        // Payload from form: title, excerpt, content, tags, status, imageFile
        const payload = {
            title: createdNews.title,
            excerpt: createdNews.excerpt || "",
            content: createdNews.content,
            tags: createdNews.tags || [],
            status: createdNews.status || "draft",
        };

        // If image added
        if (createdNews.imageFile) {
            payload.image = createdNews.imageFile;
        }

        dispatch(newsCreateRequest(payload));
        setIsCreateModalVisible(false);
        setPagination((p) => ({ ...p, current: 1 }));

        // Refresh the list and stats after create
        setTimeout(() => {
            handleRefresh();
        }, 1000);
    }, [dispatch, handleRefresh]);

    const handleUpdateSuccess = useCallback((updatedNews) => {
        if (!updatedNews?._id) return;

        const payload = {
            title: updatedNews.title,
            excerpt: updatedNews.excerpt || "",
            content: updatedNews.content,
            tags: updatedNews.tags || [],
            status: updatedNews.status || "draft",
        };

        // If image added
        if (updatedNews.imageFile) {
            payload.image = updatedNews.imageFile;
        }

        dispatch(newsUpdateRequest(updatedNews._id, payload));
        setIsUpdateModalVisible(false);
        setSelectedNews(null);

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
        [handleOpenDetailModal, handleOpenUpdateModal, sortBy, sortOrder]
    );

    const handleTableChange = (pagination, filters, sorter) => {
        console.log("🔄 News handleTableChange called:", { pagination, sorter });

        // Chỉ xử lý sort khi có sorter.field và sorter.order (click vào column header)
        if (sorter && sorter.field && sorter.order) {
            console.log("🔄 News Column header clicked:", sorter.field, sorter.order);

            // Xử lý khi click vào createdAt column
            if (sorter.field === 'createdAt') {
                // Logic đơn giản: dựa vào sorter.order từ Ant Design
                if (sorter.order === 'descend') {
                    setSortBy("publishedat");
                    setSortOrder("desc");
                } else if (sorter.order === 'ascend') {
                    setSortBy("publishedat");
                    setSortOrder("asc");
                } else {
                    // No sort
                    setSortBy("default");
                    setSortOrder("");
                }
            }
        } else {
            console.log("🔄 News Pagination change only - no sort handling");
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
                setSortBy("publishedat");
                setSortOrder("desc");
                break;
            case "oldest":
                setSortBy("publishedat");
                setSortOrder("asc");
                break;
            case "title-asc":
                setSortBy("title");
                setSortOrder("asc");
                break;
            case "title-desc":
                setSortBy("title");
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
            total: apiPagination?.total || list?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            showTotal: (total, range) => (
                <span style={{ color: "#0D364C" }}>
                    Hiển thị {range[0]}-{range[1]} trong tổng số {total} news
                    {hasActiveFilters && <span style={{ color: "#13C2C2" }}> (đã lọc)</span>}
                </span>
            ),
            onChange: (page, pageSize) => {
                console.log("🔄 News Pagination change:", { page, pageSize, sortBy, sortOrder });
                setPagination({ current: page, pageSize });
                const query = {
                    page,
                    limit: pageSize,
                    sortBy: sortBy === "default" ? "publishedAt" : sortBy,
                    order: sortOrder || "desc",
                };

                if (statusFilter !== "all") query.status = statusFilter;
                if (searchText.trim()) query.q = searchText.trim();

                console.log("🔄 News Pagination query:", query);
                dispatch(newsListRequest(query));
            },
            onShowSizeChange: (current, size) => {
                setPagination({ current, pageSize: size });
                // Dispatch API call với page size mới
                const query = {
                    page: current,
                    limit: size,
                    sortBy: sortBy === "default" ? "publishedAt" : sortBy,
                    order: sortOrder || "desc",
                };

                if (statusFilter !== "all") query.status = statusFilter;
                if (searchText.trim()) query.q = searchText.trim();

                dispatch(newsListRequest(query));
            },
        }),
        [apiPagination, pagination, list, hasActiveFilters, statusFilter, searchText, sortBy, sortOrder, dispatch]
    );

    // Backend handles pagination, so we use filteredNews directly
    const dataForPage = filteredNews;

    // FIXED: No data fallback
    const noDataMessage = useMemo(() => {
        if (loadingList) return "Đang tải...";
        if (list?.total === 0 && !error) return "Chưa có news nào. Thêm mới để bắt đầu!";
        return undefined;
    }, [loadingList, list, error]);

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
                            <Select.Option value="published">Đã xuất bản</Select.Option>
                            <Select.Option value="draft">Bản nháp</Select.Option>
                            <Select.Option value="archived">Đã lưu trữ</Select.Option>
                        </Select>
                        <Select
                            value={(() => {
                                if (sortBy === "default") return "default";
                                if (sortBy === "publishedat" && sortOrder === "desc") return "newest";
                                if (sortBy === "publishedat" && sortOrder === "asc") return "oldest";
                                if (sortBy === "title" && sortOrder === "asc") return "title-asc";
                                if (sortBy === "title" && sortOrder === "desc") return "title-desc";
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
                            <Select.Option value="title-asc">Tiêu đề A-Z</Select.Option>
                            <Select.Option value="title-desc">Tiêu đề Z-A</Select.Option>
                        </Select>
                    </Space>
                    <Space>
                        <Button onClick={handleRefresh} icon={<ReloadOutlined />} loading={loading} style={{ borderColor: "#13C2C2", color: "#13C2C2" }}>Làm mới</Button>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)} style={{ backgroundColor: "#0D364C", borderColor: "#0D364C" }}>Thêm News</Button>
                    </Space>
                </div>

                {/* Error and Success Messages */}
                {error && (
                    <Alert
                        message={error}
                        type="error"
                        showIcon
                        closable
                        onClose={() => dispatch(newsClearMessages())}
                        style={{
                            marginBottom: 16,
                            borderColor: "#ff4d4f",
                            backgroundColor: "#fff2f0"
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

                {/* FIXED: No data warning */}
                {(!loadingList && list?.total === 0 && hasActiveFilters) && (
                    <Alert message="Không tìm thấy news phù hợp với bộ lọc" type="warning" showIcon style={{ marginBottom: 16 }} />
                )}

                <Spin spinning={loading || loadingList || creating || updating} tip={loadingList ? "Đang tải news..." : undefined}>
                    <Table
                        rowKey={(record) => record._id}
                        columns={columns}
                        dataSource={dataForPage}
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