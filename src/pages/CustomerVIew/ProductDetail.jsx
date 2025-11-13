import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { Star } from "lucide-react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { productHomeDetailRequest, productHomeClearMessages } from "../../redux/actions/productHomeActions";
import { cartAddRequest, cartClearMessage } from "../../redux/actions/cartActions";
import {
    favoriteToggleRequest,
    favoriteCheckRequest,
    favoriteClearMessages,
} from "../../redux/actions/favoriteActions";
import { getProductReviewsRequest } from "../../redux/actions/reviewActions";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // product detail redux
    const productHomeState = useSelector((state) => state.productHome || {});
    const detail = productHomeState?.detail || {};
    const product = detail?.item;
    const loading = detail?.loading || false;
    const error = detail?.error || null;

    // cart / favorite redux
    const { loading: cartLoading, error: cartError } = useSelector((state) => state.cart || {});
    const favoriteState = useSelector((state) => state.favorite || {});
    const isFavorite = favoriteState.favoriteStatus?.[id] || false;
    const toggleFavoriteLoading = favoriteState.toggleLoading || false;

    // reviews redux
    const productReviewsState = useSelector((state) => state.review?.productReviews || {});
    const {
        reviews: apiReviews = [],
        loading: reviewsLoading = false,
        error: reviewsError = null,
        page: reviewsPage,
        limit: reviewsLimit,
        hasMore = false,
        averageRating = 0,
        ratingCounts = [],
        totalAllReviews = 0,
    } = productReviewsState;

    // local ui state
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("specifications");
    const [filterRating, setFilterRating] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const productId = product?._id || product?.id || id;
    const isInStock = product?.stockQuantity > 0;

    useEffect(() => {
        if (cartError) {
            dispatch(cartClearMessage());
        }
    }, [cartError, dispatch]);

    useEffect(() => {
        if (id) {
            dispatch(productHomeClearMessages());
            dispatch(favoriteClearMessages());
            dispatch(productHomeDetailRequest(id));

            const token = localStorage.getItem("token");
            if (token) {
                dispatch(favoriteCheckRequest(id));
            }
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (error && error.includes("Không tìm thấy sản phẩm")) {
            navigate("/products");
        }
    }, [error, navigate]);

    // fetch reviews when productId / filters / sort changes
    useEffect(() => {
        if (!productId) return;
        dispatch(getProductReviewsRequest(productId, { rating: filterRating, page: 1, limit: reviewsLimit, sortBy }));
    }, [dispatch, productId, filterRating, sortBy, reviewsLimit]);

    const loadMoreReviews = () => {
        if (!hasMore || reviewsLoading) return;
        dispatch(getProductReviewsRequest(productId, { rating: filterRating, page: (reviewsPage || 1) + 1, limit: reviewsLimit, sortBy }));
    };

    const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price) + "₫";

    const toggleWishlist = (productId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Vui lòng đăng nhập để thêm vào yêu thích");
            navigate("/login");
            return;
        }
        dispatch(favoriteToggleRequest(productId));
    };

    const addToCart = (productId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
            navigate("/login");
            return;
        }
        dispatch(cartAddRequest(productId, quantity));
    };

    const renderStars = (rating) =>
        [...Array(5)].map((_, index) => (
            <Star key={index} className={`w-4 h-4 ${index < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
        ));

    const StarRating = ({ rating }) => (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-lg ${i < Math.floor(rating || 0) ? "text-yellow-400" : "text-gray-300"}`}>
                    ★
                </span>
            ))}
        </div>
    );
    StarRating.propTypes = { rating: PropTypes.number };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <div className="text-6xl mb-4">⏳</div>
                        <p className="text-gray-600">Đang tải sản phẩm...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <div className="text-6xl mb-4">❌</div>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button onClick={() => navigate("/products")} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Quay lại danh sách sản phẩm
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <p className="text-gray-600 mb-4">Không tìm thấy sản phẩm</p>
                        <button onClick={() => navigate("/products")} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Quay lại danh sách sản phẩm
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <main className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                    <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
                    <span>›</span>
                    <Link to="/products" className="hover:text-blue-600">Sản phẩm</Link>
                    <span>›</span>
                    <span className="text-gray-900">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-white rounded-xl overflow-hidden border border-gray-200">
                            <img
                                src={product.images && product.images.length > 0 ? product.images[selectedImage] : "https://via.placeholder.com/500x500?text=No+Image"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/500x500?text=No+Image";
                                }}
                            />
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="flex space-x-2">
                                {product.images.map((img, index) => (
                                    <button key={index} onClick={() => setSelectedImage(index)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === index ? "border-blue-600" : "border-gray-200"}`}>
                                        <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                {product.badges && product.badges.map((badge, index) => (
                                    <span key={index} className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">{badge}</span>
                                ))}
                                {product.discount && <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">-{product.discount}%</span>}
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

                            <div className="flex items-center space-x-4 mb-2">
                                <StarRating rating={averageRating || product.rating || 0} />
                                <span className="text-gray-600">
                                    {averageRating || product.rating || 0} ({totalAllReviews || product.reviews || 0} đánh giá)
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <span className="text-3xl font-bold text-red-600">{formatPrice(product.price)}</span>
                                {product.originalPrice && product.originalPrice > product.price && <span className="text-lg text-gray-400 line-through ml-3">{formatPrice(product.originalPrice)}</span>}
                                <div className="mt-2">
                                    <span className={`text-sm font-medium ${product.stockQuantity > 0 ? "text-green-600" : "text-red-600"}`}>
                                        {product.stockQuantity > 0 ? `Còn ${product.stockQuantity} sản phẩm` : "Hết hàng"}
                                    </span>
                                </div>
                            </div>

                            {product.tags && product.tags.length > 0 && <div className="flex flex-wrap gap-2">{product.tags.map((tag, index) => <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{tag}</span>)}</div>}

                            {product.short_desc && <div className="bg-blue-50 border border-blue-200 rounded-lg p-4"><h3 className="font-medium text-blue-900 mb-2">Mô tả ngắn</h3><p className="text-blue-800 text-sm leading-relaxed">{product.short_desc}</p></div>}

                            {product.detail_desc && <div><h3 className="font-medium text-gray-900 mb-2">Mô tả chi tiết</h3><p className="text-gray-700 leading-relaxed">{product.detail_desc}</p></div>}

                            {!product.short_desc && !product.detail_desc && product.description && <p className="text-gray-700 leading-relaxed">{product.description}</p>}

                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <label className="text-sm font-medium text-gray-700">Số lượng:</label>
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-100 transition-colors">-</button>
                                        <span className="px-4 py-2 border-x border-gray-200">{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-gray-100 transition-colors">+</button>
                                    </div>
                                </div>
                                <button onClick={() => toggleWishlist(productId)} disabled={toggleFavoriteLoading} className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isFavorite ? "bg-red-50 border-red-200 text-red-600" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                                    <span className="text-lg">{isFavorite ? "❤️" : "🤍"}</span>
                                    <span className="text-sm">{isFavorite ? "Đã yêu thích" : "Yêu thích"}</span>
                                </button>
                            </div>

                            <div className="flex space-x-4">
                                <button onClick={() => addToCart(productId)} disabled={!isInStock || cartLoading} className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-colors ${isInStock && !cartLoading ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}>
                                    {isInStock ? (cartLoading ? "Đang thêm..." : "Thêm giỏ hàng") : "Hết hàng"}
                                </button>
                               
                            </div>

                            {(!product.stockQuantity || product.stockQuantity <= 0 || !product.status) && <div className="bg-red-50 border border-red-200 rounded-lg p-4"><p className="text-red-600 font-medium">{!product.status ? "Sản phẩm tạm ngừng kinh doanh" : "Sản phẩm hiện đang hết hàng"}</p><p className="text-red-500 text-sm mt-1">Vui lòng liên hệ để được thông báo khi có hàng</p></div>}
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="border-b">
                        <div className="flex space-x-8 px-6">
                            <button onClick={() => setActiveTab("specifications")} className={`py-4 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === "specifications" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}>Thông số kỹ thuật</button>
                            <button onClick={() => setActiveTab("description")} className={`py-4 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === "description" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}>Mô tả sản phẩm</button>
                            <button onClick={() => setActiveTab("reviews")} className={`py-4 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === "reviews" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}>Đánh giá ({totalAllReviews})</button>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Specifications Tab */}
                        {activeTab === "specifications" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex justify-between py-2 border-b border-gray-100"><span className="font-medium text-gray-700">Tên sản phẩm:</span><span className="text-gray-900">{product.name}</span></div>
                                <div className="flex justify-between py-2 border-b border-gray-100"><span className="font-medium text-gray-700">Giá bán:</span><span className="text-gray-900 font-semibold">{formatPrice(product.price)}</span></div>
                                <div className="flex justify-between py-2 border-b border-gray-100"><span className="font-medium text-gray-700">Số lượng tồn kho:</span><span className={`font-medium ${product.stockQuantity > 0 ? "text-green-600" : "text-red-600"}`}>{product.stockQuantity}</span></div>
                                {product.brand && <div className="flex justify-between py-2 border-b border-gray-100"><span className="font-medium text-gray-700">Thương hiệu:</span><span className="text-gray-900">{product.brand}</span></div>}
                                <div className="flex justify-between py-2 border-b border-gray-100"><span className="font-medium text-gray-700">Danh mục:</span><span className="text-gray-900">{typeof product.category === "object" ? product.category.name : product.category}</span></div>
                                <div className="flex justify-between py-2 border-b border-gray-100"><span className="font-medium text-gray-700">Trạng thái:</span><span className={`font-medium ${product.status ? "text-green-600" : "text-red-600"}`}>{product.status ? "Đang kinh doanh" : "Ngừng kinh doanh"}</span></div>
                            </div>
                        )}

                        {/* Description Tab */}
                        {activeTab === "description" && (
                            <div className="prose max-w-none">
                                <p className="text-gray-700 leading-relaxed">{product.detail_desc || product.short_desc || product.description || "Chưa có mô tả chi tiết"}</p>
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === "reviews" && (
                            <div className="space-y-6">
                                {/* Rating Summary */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-gray-900 mb-2">{averageRating || 0}/5</div>
                                            <div className="flex justify-center mb-2">{renderStars(5)}</div>
                                            <div className="text-sm text-gray-600">{totalAllReviews} đánh giá</div>
                                        </div>
                                        <div className="space-y-2">
                                            {ratingCounts.map((stat) => (
                                                <div key={stat.star} className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-600 w-6">{stat.star}</span>
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${stat.percentage}%` }}></div>
                                                    </div>
                                                    <span className="text-sm text-gray-600 w-8">{stat.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Filters and Sort */}
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <label className="text-sm font-medium text-gray-700">Lọc theo:</label>
                                            <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8">
                                                <option value="all">Tất cả</option>
                                                <option value="5">5 sao</option>
                                                <option value="4">4 sao</option>
                                                <option value="3">3 sao</option>
                                                <option value="2">2 sao</option>
                                                <option value="1">1 sao</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm font-medium text-gray-700">Sắp xếp:</label>
                                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8">
                                            <option value="newest">Mới nhất</option>
                                            <option value="oldest">Cũ nhất</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Reviews List */}
                                <div className="space-y-4">
                                    {reviewsLoading ? (
                                        <div className="text-center py-8 text-gray-500">Đang tải đánh giá...</div>
                                    ) : reviewsError ? (
                                        <div className="text-center py-8 text-red-500">Lỗi: {reviewsError}</div>
                                    ) : apiReviews.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">Chưa có đánh giá nào.</div>
                                    ) : (
                                        apiReviews.map((r) => {
                                            const userName = r.user?.name || "Người dùng";
                                            const userInitial = (userName && userName[0]) || "U";
                                            const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleString("vi-VN") : "";
                                            return (
                                                <div key={r._id} className="border border-gray-200 rounded-lg p-6">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                                                                {r.user?.avatar ? <img src={r.user.avatar} alt={userName} className="w-full h-full object-cover" /> : <span className="text-white font-medium text-sm">{userInitial}</span>}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900">{userName}</div>
                                                                <div className="text-sm text-gray-500">Đã mua hàng</div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="flex items-center space-x-1 mb-1">{renderStars(r.rating)}</div>
                                                            <div className="text-sm text-gray-500">{dateStr}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-gray-700 leading-relaxed">{r.content}</div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                <div className="text-center pt-6 border-t border-gray-200">
                                    <button onClick={loadMoreReviews} disabled={!hasMore || reviewsLoading} className="bg-blue-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap">
                                        {reviewsLoading ? "Đang tải..." : hasMore ? "Tải thêm" : "Không còn đánh giá"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
