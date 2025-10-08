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
    const {
        list,
        stats,
        pagination: apiPagination,
        loadingList,
        loadingStats,
        creating,
        updating,
        error
    } = useSelector((state) => state.news);

    // Filters / sort / search
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // "all", "published", "draft", "archived"
    const [sortBy, setSortBy] = useState("publishedAt"); // Default: "publishedAt", "title"
    const [sortOrder, setSortOrder] = useState("desc"); // "asc", "desc"

    // Modals state
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);

    // Debounce ref for search / filter changes
    const debounceRef = useRef(null);
    const prevFiltersRef = useRef({ searchText, statusFilter, sortBy, sortOrder });

    // Local pagination state controlled by UI
    const [localPagination, setLocalPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });

    // Sync apiPagination -> localPagination (when backend returns new pagination)
    useEffect(() => {
        if (apiPagination) {
            setLocalPagination((prev) => ({
                ...prev,
                current: apiPagination.page || prev.current,
                pageSize: apiPagination.limit || prev.pageSize,
                total: apiPagination.total ?? prev.total,
            }));
        }
    }, [apiPagination]);

    // Initial load: dispatch first page (uses localPagination defaults)
    useEffect(() => {
        dispatch(newsListRequest({
            page: localPagination.current,
            limit: localPagination.pageSize,
            sortBy,
            order: sortOrder
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]); // only initial dispatch; subsequent dispatches happen in other handlers

    // Debounced fetch on filter/sort/search change: reset to page 1
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            // Reset UI pagination to page 1 on filter/search/sort change
            setLocalPagination((prev) => ({ ...prev, current: 1 }));

            const query = {
                page: 1,
                limit: localPagination.pageSize,
                sortBy,
                order: sortOrder,
            };

            if (statusFilter !== "all") {
                query.status = statusFilter;
            }

            if (searchText.trim()) {
                query.q = searchText.trim();
            }

            console.log("🔄 News Filter/Sort query (debounced):", query);
            dispatch(newsListRequest(query));

            // Update prev filters
            prevFiltersRef.current = { searchText, statusFilter, sortBy, sortOrder };
        }, 500); // Debounce 500ms for all changes

        return () => clearTimeout(debounceRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText, statusFilter, sortBy, sortOrder, dispatch]);

    // Compute stats from list if no API stats
    const displayStats = useMemo(() => {
        const data = list?.data || [];
        return {
            total: list?.total || data.length,
            published: data.filter(n => n.status === "published").length,
            draft: data.filter(n => n.status === "draft").length,
            archived: data.filter(n => n.status === "archived").length,
        };
    }, [list]);

    const newsItems = useMemo(() => {
        // If your redux `list` is structured as { data: [...], total: n },
        // use list.data; else adjust accordingly.
        return (list?.data || []);
    }, [list]);

    // Check if any filters are active
    const hasActiveFilters = searchText.trim() || statusFilter !== "all";

    // Create filter summary text
    const getFilterSummary = useMemo(() => {
        const filters = [];
        if (statusFilter !== "all") {
            const statusMap = { published: "Đã xuất bản", draft: "Bản nháp", archived: "Đã lưu trữ" };
            filters.push(`Trạng thái: ${statusMap[statusFilter] || statusFilter}`);
        }
        if (searchText.trim()) {
            filters.push(`Tìm kiếm: "${searchText.trim()}"`);
        }
        return filters.length > 0 ? filters.join(" • ") : "";
    }, [searchText, statusFilter]);

    // Refresh using current localPagination & filters/sort
    const handleRefresh = useCallback(() => {
        const query = {
            page: localPagination.current || 1,
            limit: localPagination.pageSize || 5,
            sortBy,
            order: sortOrder,
        };

        if (statusFilter !== "all") {
            query.status = statusFilter;
        }

        if (searchText.trim()) {
            query.q = searchText.trim();
        }

        console.log("🔄 handleRefresh query:", query);
        dispatch(newsListRequest(query));
    }, [dispatch, localPagination, statusFilter, searchText, sortBy, sortOrder]);

    const handleOpenUpdateModal = useCallback((news) => {
        setSelectedNews(news);
        setIsUpdateModalVisible(true);
    }, []);

    const handleOpenDetailModal = useCallback((news) => {
        setSelectedNews(news);
        setIsViewDetailModalVisible(true);
    }, []);

    const handleCreateSuccess = useCallback((createdNews) => {
        message.success("Tạo tin tức thành công!");
        setIsCreateModalVisible(false);

        // After create, reload current page (could also go to page 1 if you prefer)
        handleRefresh();
    }, [handleRefresh]);

    const handleUpdateSuccess = useCallback((updatedNews) => {
        message.success("Cập nhật tin tức thành công!");
        setIsUpdateModalVisible(false);
        setSelectedNews(null);

        // After update, reload current page
        handleRefresh();
    }, [handleRefresh]);

    // Handle sort option change from dropdown
    const handleSortChange = useCallback((value) => {
        switch (value) {
            case "default":
                setSortBy("publishedAt");
                setSortOrder("desc");
                break;
            case "newest":
                setSortBy("publishedAt");
                setSortOrder("desc");
                break;
            case "oldest":
                setSortBy("publishedAt");
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
                setSortBy("publishedAt");
                setSortOrder("desc");
        }
        // reset to page 1 when sorting changes (debounced effect above will handle dispatch)
        setLocalPagination((prev) => ({ ...prev, current: 1 }));
    }, []);

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
                sorter: true, // Enable Antd sorter (we map it in handleTableChange)
                sortOrder: (sortBy === "publishedAt" || sortBy === "createdAt") ? (sortOrder === "asc" ? "ascend" : "descend") : false,
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

    // Table onChange handles pagination & sorter & filters
    const handleTableChange = (pagination, filters, sorter) => {
        const newPage = pagination.current;
        const newPageSize = pagination.pageSize;

        let newSortBy = sortBy;
        let newSortOrder = sortOrder;
        if (sorter && sorter.field && sorter.order) {
            if (sorter.field === "createdAt") {
                newSortBy = "publishedAt";
                newSortOrder = sorter.order === "ascend" ? "asc" : "desc";
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
            }
        }

        const query = {
            page: newPage,
            limit: newPageSize,
            sortBy: newSortBy,
            order: newSortOrder,
        };

        if (statusFilter !== "all") query.status = statusFilter;
        if (searchText.trim()) query.q = searchText.trim();

        // Dispatch API fetch
        dispatch(newsListRequest(query));

        // Update pagination state để Table nhận pageSize mới
        // FIX: cập nhật luôn state pagination của reducer
        // Nếu không muốn chỉnh reducer, có thể dùng local state:
        // setPagination({ page: newPage, limit: newPageSize });
    };


    // Pagination object passed to Table (controlled)
    const tablePagination = useMemo(() => ({
        current: apiPagination?.page || 1,
        pageSize: apiPagination?.limit || 5,  // ← phải lấy từ reducer sau khi fetch
        total: apiPagination?.total || 0,
        showSizeChanger: true,
        onChange: (page, pageSize) => {
            handleTableChange({ current: page, pageSize }, {}, {});
        },
        onShowSizeChange: (current, size) => {
            handleTableChange({ current, pageSize: size }, {}, {});
        },
    }), [apiPagination, statusFilter, searchText, sortBy, sortOrder, loadingList]);


    // No data fallback message
    const noDataMessage = useMemo(() => {
        if (loadingList) return "Đang tải...";
        if ((apiPagination?.total ?? 0) === 0 && !error) return "Chưa có news nào. Thêm mới để bắt đầu!";
        return undefined;
    }, [loadingList, apiPagination, error]);

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
                            onChange={(val) => { setStatusFilter(val); setLocalPagination((p) => ({ ...p, current: 1 })); }}
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
                                if (sortBy === "publishedAt" && sortOrder === "desc") return "newest";
                                if (sortBy === "publishedAt" && sortOrder === "asc") return "oldest";
                                if (sortBy === "title" && sortOrder === "asc") return "title-asc";
                                if (sortBy === "title" && sortOrder === "desc") return "title-desc";
                                return "default";
                            })()}
                            onChange={(val) => { handleSortChange(val); setLocalPagination((p) => ({ ...p, current: 1 })); }}
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
                        <Button onClick={handleRefresh} icon={<ReloadOutlined />} loading={loadingList} style={{ borderColor: "#13C2C2", color: "#13C2C2" }}>Làm mới</Button>
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
                        onClose={() => { /* Clear error if action exists */ }}
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
                                    setSearchText("");
                                    setStatusFilter("all");
                                    setSortBy("publishedAt");
                                    setSortOrder("desc");
                                    setLocalPagination((p) => ({ ...p, current: 1 }));
                                }}
                                style={{ color: "#13C2C2" }}
                            >
                                Xóa bộ lọc
                            </Button>
                        }
                    />
                )}

                {/* No results for filters */}
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
