import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import {
    favoriteListRequest,
    favoriteToggleRequest,
    favoriteClearMessages
} from '../../redux/actions/favoriteActions';

const WishlistPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux state - using new favorite reducer
    const favoriteState = useSelector(state => state?.favorite) || {};

    let favorites, favoritesLoading, favoritesError, favoritesPagination;
    let toggleFavoriteLoading, toggleFavoriteError;

    try {
        favorites = favoriteState.items || [];
        favoritesLoading = favoriteState.loading || false;
        favoritesError = favoriteState.error || null;
        favoritesPagination = favoriteState.pagination || null;
        
        toggleFavoriteLoading = favoriteState.toggleLoading || false;
        toggleFavoriteError = favoriteState.toggleError || null;
        
    } catch (error) {
        console.error('❌ Error destructuring Redux state:', error);
        favorites = [];
        favoritesLoading = false;
        favoritesError = 'Destructuring error';
        favoritesPagination = null;
        toggleFavoriteLoading = false;
        toggleFavoriteError = null;
    }

    // Local state
    const [searchTerm, setSearchTerm] = useState('');
    const [cartItems, setCartItems] = useState(3);
    const [sortBy, setSortBy] = useState('default');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(8);
    const [shouldReloadFavorites, setShouldReloadFavorites] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + '₫';
    };


    const addToCart = () => {
        setCartItems(prev => prev + 1);
        // Add cart logic here
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleToggleFavorite = (productId) => {
        dispatch(favoriteToggleRequest(productId));
        setShouldReloadFavorites(true);
    };


    // Fallback products data when API fails
    const fallbackProducts = useMemo(() => [
        {
            _id: 'sample-1',
            name: 'MacBook Pro M3 14 inch',
            price: 52990000,
            originalPrice: 59990000,
            discount: 12,
            rating: 4.8,
            reviews: 124,
            images: ['https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_3__8_97_1.png'],
            tags: ['Chip M3', '16GB RAM', '512GB SSD'],
            badges: ['Mới nhất'],
            category: 'laptops',
            stockQuantity: 10,
            brand: 'Apple',
            description: 'MacBook Pro M3 với hiệu năng vượt trội cho công việc chuyên nghiệp'
        },
        {
            _id: 'sample-2',
            name: 'iPad Pro 12.9 inch M2',
            price: 28990000,
            originalPrice: 32990000,
            discount: 12,
            rating: 4.9,
            reviews: 89,
            images: ['https://cdn2.fptshop.com.vn/unsafe/750x0/filters:format(webp):quality(75)/i_Pad_A16_Wi_Fi_Blue_PDP_Image_Position_1_VN_VI_7db84c95a3.jpg'],
            tags: ['Chip M2', 'Liquid Retina XDR', 'Hỗ trợ Apple Pencil'],
            badges: ['Bán chạy'],
            category: 'tablets',
            stockQuantity: 15,
            brand: 'Apple',
            description: 'iPad Pro với màn hình Liquid Retina XDR tuyệt đẹp'
        },
        {
            _id: 'sample-3',
            name: 'ASUS ROG Strix G15',
            price: 25990000,
            originalPrice: 29990000,
            discount: 13,
            rating: 4.7,
            reviews: 156,
            images: ['https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_3__8_97_1.png'],
            tags: ['RTX 4060', 'AMD Ryzen 7', '16GB DDR5'],
            badges: ['Gaming'],
            category: 'laptops',
            stockQuantity: 8,
            brand: 'ASUS',
            description: 'Laptop gaming mạnh mẽ với RTX 4060'
        }
    ], []);

    // Use fallback products if API fails or favorites is null/undefined
    const displayProducts = useMemo(() => {
        return (favoritesError || !favorites || !Array.isArray(favorites)) ? fallbackProducts : favorites;
    }, [favoritesError, favorites, fallbackProducts]);

    // Load favorites from API on component mount
    useEffect(() => {
        dispatch(favoriteListRequest({
            page: currentPage,
            limit: pageSize
        }));
    }, [dispatch, currentPage, pageSize]);

    // Load favorites with filters when search/sort changes
    useEffect(() => {
        const query = {
            page: currentPage,
            limit: pageSize
        };

        // Add search keyword
        if (searchTerm.trim()) {
            query.keyword = searchTerm.trim();
        }

        // Add sort parameters
        switch (sortBy) {
            case 'price-low':
                query.sortBy = 'price';
                query.sortOrder = 'asc';
                break;
            case 'price-high':
                query.sortBy = 'price';
                query.sortOrder = 'desc';
                break;
            case 'rating':
                query.sortBy = 'rating';
                query.sortOrder = 'desc';
                break;
            case 'newest':
                query.sortBy = 'createdat';
                query.sortOrder = 'desc';
                break;
            default:
                break;
        }

        dispatch(favoriteListRequest(query));
    }, [dispatch, currentPage, pageSize, searchTerm, sortBy]);

    // Reset currentPage về 1 khi filter thay đổi (with debounce)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (currentPage !== 1) {
                setCurrentPage(1);
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, sortBy, currentPage]);

    // Use displayProducts directly as favorites from API
    const wishlistProducts = displayProducts;

    // Reload favorites after successful toggle
    useEffect(() => {
        if (shouldReloadFavorites && !toggleFavoriteLoading && !toggleFavoriteError) {
            // Toggle was successful, reload favorites
            const query = {
                page: currentPage,
                limit: pageSize
            };

            // Add search keyword
            if (searchTerm.trim()) {
                query.keyword = searchTerm.trim();
            }

            // Add sort parameters
            switch (sortBy) {
                case 'price-low':
                    query.sortBy = 'price';
                    query.sortOrder = 'asc';
                    break;
                case 'price-high':
                    query.sortBy = 'price';
                    query.sortOrder = 'desc';
                    break;
                case 'rating':
                    query.sortBy = 'rating';
                    query.sortOrder = 'desc';
                    break;
                case 'newest':
                    query.sortBy = 'createdat';
                    query.sortOrder = 'desc';
                    break;
                default:
                    break;
            }

            dispatch(favoriteListRequest(query));
            setShouldReloadFavorites(false);
        }
    }, [shouldReloadFavorites, toggleFavoriteLoading, toggleFavoriteError, dispatch, currentPage, pageSize, searchTerm, sortBy]);

    // Clear errors when component unmounts
    useEffect(() => {
        return () => {
            dispatch(favoriteClearMessages());
        };
    }, [dispatch]);

    const StarRating = ({ rating }) => {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    StarRating.propTypes = {
        rating: PropTypes.number.isRequired,
    };

    const ProductCard = ({ product }) => {
        const isInStock = product.stockQuantity > 0;
        const mainImage = product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.jpg';
        const productId = product._id || product.id;
        
        return (
            <div className="group bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative">
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => handleProductClick(productId)}
                    />
                    {product.discount && product.discount > 0 && (
                        <div className="absolute top-3 left-3">
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                -{product.discount}%
                            </span>
                        </div>
                    )}
                    {product.badges && product.badges.map((badge, index) => (
                        <div key={index} className="absolute top-3 right-3">
                            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                                {badge}
                            </span>
                        </div>
                    ))}
                    <button
                        onClick={() => handleToggleFavorite(productId)}
                        disabled={toggleFavoriteLoading}
                        className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className={`text-lg text-red-500`}>
                            ❤️
                        </span>
                    </button>
                    {!isInStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                                Hết hàng
                            </span>
                        </div>
                    )}
                </div>
                <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer" onClick={() => handleProductClick(productId)}>
                        {product.name}
                    </h3>
                    {(product.description || product.short_desc) && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {product.description || product.short_desc}
                        </p>
                    )}
                    {product.brand && (
                        <div className="flex items-center mb-3">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {product.brand}
                            </span>
                        </div>
                    )}
                    {product.tags && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {product.tags.map((tag, index) => (
                                <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                    {(product.rating || product.reviews) && (
                        <div className="flex items-center mb-3">
                            <StarRating rating={product.rating || 0} />
                            <span className="text-sm text-gray-500 ml-2">
                                {product.rating || 0} ({product.reviews || 0})
                            </span>
                        </div>
                    )}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <span className="text-lg font-bold text-red-600">
                                {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-sm text-gray-400 line-through ml-2">
                                    {formatPrice(product.originalPrice)}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={addToCart}
                            disabled={!isInStock}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isInStock ? 'Thêm giỏ hàng' : 'Hết hàng'}
                        </button>
                        <button 
                            onClick={() => handleProductClick(productId)}
                            className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                        >
                            Xem chi tiết
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    ProductCard.propTypes = {
        product: PropTypes.shape({
            _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            originalPrice: PropTypes.number,
            discount: PropTypes.number,
            rating: PropTypes.number,
            reviews: PropTypes.number,
            images: PropTypes.array,
            stockQuantity: PropTypes.number,
            tags: PropTypes.arrayOf(PropTypes.string),
            badges: PropTypes.arrayOf(PropTypes.string),
            brand: PropTypes.string,
            description: PropTypes.string,
            short_desc: PropTypes.string,
            favorite: PropTypes.bool,
        }).isRequired,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} cartItems={cartItems} />

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                    <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
                    <span>›</span>
                    <span className="text-gray-900">Sản phẩm yêu thích</span>
                </div>

                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-500 text-2xl">❤️</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Sản phẩm yêu thích</h1>
                            <p className="text-gray-600">Danh sách sản phẩm bạn đã lưu</p>
                        </div>
                    </div>
                </div>

                {/* Filters and Sort */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Search */}
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm trong danh sách yêu thích..."
                                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Sort */}
                        <div className="flex items-center space-x-4">
                            <label className="text-sm font-medium text-gray-700">Sắp xếp:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="default">Mặc định</option>
                                <option value="price-low">Giá thấp đến cao</option>
                                <option value="price-high">Giá cao đến thấp</option>
                                <option value="rating">Đánh giá cao</option>
                                <option value="newest">Mới nhất</option>
                            </select>
                        </div>

                        {/* Clear Wishlist Button */}
                        {favoritesPagination && favoritesPagination.total > 0 && (
                            <button
                                onClick={() => {
                                    // Clear all favorites by calling toggle for each product
                                    favorites.forEach(product => {
                                        dispatch(favoriteToggleRequest(product._id));
                                    });
                                }}
                                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                            >
                                Xóa tất cả
                            </button>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600">
                        {favoritesLoading ? (
                            <span>Đang tải sản phẩm yêu thích...</span>
                        ) : (
                            <>
                                Hiển thị <span className="font-medium text-gray-900">{wishlistProducts.length}</span> sản phẩm yêu thích
                                {favoritesPagination && favoritesPagination.total && (
                                    <span> / {favoritesPagination.total} tổng cộng</span>
                                )}
                                {favoritesError && (
                                    <span className="text-orange-500 ml-2">(Sử dụng dữ liệu mẫu)</span>
                                )}
                            </>
                        )}
                    </p>
                </div>

                {/* Backend Connection Warning */}
                {favoritesError && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-2">
                            <span className="text-orange-500 text-lg">⚠️</span>
                            <div>
                                <h4 className="text-orange-800 font-medium">Không thể kết nối đến server</h4>
                                <p className="text-orange-700 text-sm">
                                    Hiện tại đang sử dụng dữ liệu mẫu. Vui lòng kiểm tra kết nối mạng hoặc liên hệ quản trị viên.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toggle Favorite Error */}
                {toggleFavoriteError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-2">
                            <span className="text-red-500 text-lg">❌</span>
                            <div>
                                <h4 className="text-red-800 font-medium">Lỗi cập nhật yêu thích</h4>
                                <p className="text-red-700 text-sm">{toggleFavoriteError}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                {favoritesLoading ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">⏳</div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Đang tải sản phẩm yêu thích...</h3>
                        <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
                    </div>
                ) : favoritesError ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Lỗi tải sản phẩm yêu thích</h3>
                        <p className="text-gray-600 mb-6">{favoritesError}</p>
                        <button
                            onClick={() => {
                                dispatch(favoriteListRequest({
                                    page: currentPage,
                                    limit: pageSize
                                }));
                            }}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : wishlistProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlistProducts.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-8xl mb-6">❤️</div>
                        {!favoritesError && favoritesPagination && favoritesPagination.total === 0 ? (
                            <>
                                <h3 className="text-2xl font-medium text-gray-900 mb-4">Danh sách yêu thích trống</h3>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    Bạn chưa có sản phẩm nào trong danh sách yêu thích. Hãy khám phá các sản phẩm và thêm vào danh sách yêu thích của bạn.
                                </p>
                                <button
                                    onClick={() => navigate('/products')}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Khám phá sản phẩm
                                </button>
                            </>
                        ) : (
                            <>
                                <h3 className="text-2xl font-medium text-gray-900 mb-4">Không tìm thấy sản phẩm</h3>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    Không có sản phẩm nào trong danh sách yêu thích khớp với từ khóa tìm kiếm của bạn.
                                </p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Xóa bộ lọc
                                </button>
                            </>
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default WishlistPage;
