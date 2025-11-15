import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Card,
    Row,
    Col,
    Typography,
    Spin,
    Modal,
    Image,
    Button,
} from "antd";
import {
    CalendarOutlined,
    AppstoreOutlined,
} from "@ant-design/icons";
import {
    newsListRequest,
    newsGetRequest,
} from "../../redux/actions/newsActions";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const { Title, Text, Paragraph } = Typography;

const NewsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { list, current: selectedNews, loadingList, loadingGet, error } =
        useSelector((state) => state.news);

    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 9 });

    // Check if user is guest (not authenticated) and redirect to register - same logic as contact
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/register");
            return; // Don't proceed if redirecting
        }
    }, [navigate]);

    // Fetch published news - only if user is authenticated
    const fetchNews = useCallback(
        (params = {}) => {
            const storedUser = localStorage.getItem("user");
            // Don't fetch if user is guest
            if (!storedUser) {
                return;
            }
            const query = {
                status: "published",
                sortBy: "createdAt",
                order: "desc",
                page: pagination.current,
                limit: pagination.pageSize,
                ...params,
            };
            dispatch(newsListRequest(query));
        },
        [dispatch, pagination]
    );

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        // Only fetch if user is authenticated
        if (storedUser) {
            fetchNews({ page: 1 });
        }
    }, [fetchNews]);

    const handlePaginationChange = (page, pageSize) => {
        setPagination({ current: page, pageSize });
        fetchNews({ page, limit: pageSize });
    };

    const handleOpenDetail = useCallback(
        (newsId) => {
            dispatch(newsGetRequest(newsId));
            setIsDetailModalVisible(true);
        },
        [dispatch]
    );

    const handleCloseDetail = () => setIsDetailModalVisible(false);

    const newsItems = useMemo(() => list?.data || [], [list]);
    const hasNews = newsItems.length > 0;

    return (
        <>
            {/* Header */}
            <Header />

            {/* Nội dung chính */}
            <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center mb-10">
                    <Title level={2} className="font-bold text-gray-800 mb-2">
                        Tin Tức Mới Nhất
                    </Title>
                    <Text className="text-gray-500">
                        Cập nhật những bài viết mới nhất từ đội ngũ biên tập của chúng tôi
                    </Text>
                </div>

                {/* Loading */}
                {loadingList && (
                    <div className="flex justify-center items-center py-12">
                        <Spin size="large" />
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="text-center text-red-500 mb-6">
                        <Text type="danger">{error}</Text>
                    </div>
                )}

                {/* News Grid */}
                {!loadingList && (
                    <div className="max-w-7xl mx-auto">
                        {hasNews ? (
                            <>
                                <Row gutter={[24, 24]}>
                                    {newsItems.map((news) => (
                                        <Col xs={24} sm={12} lg={8} key={news._id}>
                                            <Card
                                                hoverable
                                                className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 h-full"
                                                cover={
                                                    news.image ? (
                                                        <Image
                                                            src={news.image}
                                                            alt={news.title}
                                                            preview={false}
                                                            className="h-52 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-52 bg-gray-200 flex items-center justify-center">
                                                            <AppstoreOutlined className="text-4xl text-gray-400" />
                                                        </div>
                                                    )
                                                }
                                                onClick={() => handleOpenDetail(news._id)}
                                            >
                                                <div className="space-y-2">
                                                    <Title
                                                        level={4}
                                                        className="text-gray-900 font-semibold line-clamp-2"
                                                    >
                                                        {news.title}
                                                    </Title>

                                                    {news.excerpt && (
                                                        <Paragraph
                                                            ellipsis={{ rows: 2 }}
                                                            className="text-gray-600 text-sm mb-0"
                                                        >
                                                            {news.excerpt}
                                                        </Paragraph>
                                                    )}

                                                    <div className="flex items-center text-gray-500 text-xs mt-3">
                                                        <span>
                                                            <CalendarOutlined className="mr-1" />
                                                            {news.createdAt
                                                                ? new Date(news.createdAt).toLocaleDateString(
                                                                    "vi-VN"
                                                                )
                                                                : "N/A"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>

                                {/* Pagination */}
                                {list?.pages > 1 && (
                                    <div className="flex justify-center mt-10 space-x-2">
                                        <Button
                                            onClick={() => handlePaginationChange(1)}
                                            disabled={pagination.current === 1}
                                        >
                                            Trang đầu
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handlePaginationChange(pagination.current - 1)
                                            }
                                            disabled={pagination.current === 1}
                                        >
                                            Trước
                                        </Button>
                                        <Text className="px-4 pt-1">
                                            Trang {pagination.current} / {list?.pages}
                                        </Text>
                                        <Button
                                            onClick={() =>
                                                handlePaginationChange(pagination.current + 1)
                                            }
                                            disabled={pagination.current === list?.pages}
                                        >
                                            Sau
                                        </Button>
                                        <Button
                                            onClick={() => handlePaginationChange(list?.pages)}
                                            disabled={pagination.current === list?.pages}
                                        >
                                            Trang cuối
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <AppstoreOutlined className="text-6xl text-gray-300 mb-4" />
                                <Title level={3} className="text-gray-500 mb-2">
                                    Chưa có tin tức nào
                                </Title>
                                <Text className="text-gray-400">
                                    Hãy quay lại sau để xem các bài viết mới nhé!
                                </Text>
                            </div>
                        )}
                    </div>
                )}

                {/* Modal Chi tiết */}
                <Modal
                    open={isDetailModalVisible}
                    onCancel={handleCloseDetail}
                    footer={null}
                    width={800}
                    centered
                    bodyStyle={{
                        padding: "24px 32px",
                        maxHeight: "80vh",
                        overflowY: "auto",
                    }}
                >
                    {loadingGet ? (
                        <div className="flex justify-center py-8">
                            <Spin />
                        </div>
                    ) : selectedNews ? (
                        <div className="space-y-6">
                            {selectedNews.image && (
                                <div className="text-center">
                                    <Image
                                        src={selectedNews.image}
                                        alt={selectedNews.title}
                                        className="rounded-lg shadow-md mb-6 max-h-[400px] object-contain"
                                    />
                                </div>
                            )}

                            <Title
                                level={3}
                                className="text-gray-900 text-center mb-2 font-semibold"
                            >
                                {selectedNews.title}
                            </Title>

                            <Text className="block text-center text-gray-500 text-sm mb-4">
                                <CalendarOutlined className="mr-1" />
                                {selectedNews.createdAt
                                    ? new Date(selectedNews.createdAt).toLocaleDateString("vi-VN")
                                    : "N/A"}
                            </Text>

                            <Paragraph className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                                {selectedNews.content}
                            </Paragraph>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            Không tìm thấy bài viết
                        </div>
                    )}
                </Modal>
            </div>

            {/* Footer */}
            <Footer />
        </>
    );
};

export default NewsPage;
