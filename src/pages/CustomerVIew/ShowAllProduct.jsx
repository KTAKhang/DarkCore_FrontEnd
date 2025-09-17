import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import {
    categoryHomeListRequest,
    categoryHomeClearMessages
} from '../../redux/actions/categoryHomeActions';
import {
    productHomeListRequest,
    productHomeBrandsRequest,
    productHomeClearMessages
} from '../../redux/actions/productHomeActions';


// Brands data
const brands = [
    { id: "all", name: "Tất cả thương hiệu" },
];

const ShowAllProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux state
    const {
        list: {
            items: categories,
            loading: categoriesLoading,
            error: categoriesError
        }
    } = useSelector(state => state.categoryHome);

    const {
        list: {
            items: products,
            loading: productsLoading,
            error: productsError,
            pagination: productsPagination
        },
        brands: {
            items: brandsFromDB,
            loading: brandsLoading,
            error: brandsError
        }
    } = useSelector(state => state.productHome);

    // Local state
    const [searchTerm, setSearchTerm] = useState('');
    const [cartItems, setCartItems] = useState(3);
    const [wishlist, setWishlist] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedBrand, setSelectedBrand] = useState('all');

    // Track selectedBrand changes
    useEffect(() => {
        // selectedBrand changed
    }, [selectedBrand]);
    const [sortBy, setSortBy] = useState('default');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(8);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + '₫';
    };

    const toggleWishlist = (productId) => {
        setWishlist(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const addToCart = () => {
        setCartItems(prev => prev + 1);
        // Add cart logic here
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    // Load categories, products and brands on component mount
    useEffect(() => {
        dispatch(categoryHomeListRequest({ page: 1, limit: 8 }));
        dispatch(productHomeListRequest({
            page: currentPage,
            limit: pageSize
        }));

        // Gọi API brands để lấy danh sách thương hiệu
        dispatch(productHomeBrandsRequest());
    }, [dispatch, currentPage, pageSize]);

    // Reset selectedBrand khi brands data thay đổi (nếu selectedBrand không còn hợp lệ)
    useEffect(() => {
        if (brandsFromDB && brandsFromDB.length > 0 && selectedBrand !== 'all') {
            const isValidBrand = brandsFromDB.includes(selectedBrand);
            if (!isValidBrand) {
                setSelectedBrand('all');
            }
        }
    }, [brandsFromDB, selectedBrand]);

    // Reset currentPage về 1 khi filter thay đổi
    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [searchTerm, selectedCategory, selectedBrand, sortBy, currentPage]);

    // Track data changes
    useEffect(() => {
        // Data updated
    }, [categories, categoriesLoading, categoriesError, products, productsLoading, productsError, brandsFromDB, brandsLoading, brandsError]);

    // Fallback categories data when API fails
    const fallbackCategories = [
        { _id: 'laptops', name: 'Laptop' },
        { _id: 'tablets', name: 'Máy tính bảng' },
        { _id: 'accessories', name: 'Phụ kiện' }
    ];

    // Use fallback data if API fails
    const displayCategories = categoriesError ? fallbackCategories : categories;

    // Prepare brands data with fallback
    const displayBrands = useMemo(() => {
        const result = brandsError ? brands : [
            { id: "all", name: "Tất cả thương hiệu" },
            ...(brandsFromDB || []).map(brand => ({
                id: brand,
                name: brand
            }))
        ];
        return result;
    }, [brandsError, brandsFromDB]);

    // Clear errors when component unmounts
    useEffect(() => {
        return () => {
            dispatch(categoryHomeClearMessages());
            dispatch(productHomeClearMessages());
        };
    }, [dispatch]);

    // Load products with filters
    useEffect(() => {
        const query = {
            page: currentPage,
            limit: pageSize
        };

        // Add search keyword
        if (searchTerm.trim()) {
            query.keyword = searchTerm.trim();
        }

        // Add category filter
        if (selectedCategory !== 'all') {
            const selectedCategoryData = displayCategories.find(cat => cat._id === selectedCategory);
            if (selectedCategoryData) {
                query.categoryName = selectedCategoryData.name;
            }
        }

        // Add brand filter
        if (selectedBrand !== 'all' && selectedBrand) {
            query.brand = selectedBrand;
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

        dispatch(productHomeListRequest(query));
    }, [dispatch, currentPage, pageSize, searchTerm, selectedCategory, selectedBrand, sortBy, displayCategories, displayBrands]);

    const ProductCard = ({ product }) => {
        const isInStock = product.stockQuantity > 0;
        const mainImage = product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.jpg';

        return (
            <div className="group bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative">
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => handleProductClick(product._id)}
                    />
                    {product.discount && product.discount > 0 && (
                        <div className="absolute top-3 left-3">
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                -{product.discount}%
                            </span>
                        </div>
                    )}
                    <button
                        onClick={() => toggleWishlist(product._id)}
                        className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                    >
                        <span className={`text-lg ${wishlist.includes(product._id) ? 'text-red-500' : 'text-gray-600'}`}>
                            {wishlist.includes(product._id) ? '❤️' : '🤍'}
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
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer" onClick={() => handleProductClick(product._id)}>
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
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <span className="text-lg font-bold text-red-600">
                                {formatPrice(product.price)}
                            </span>
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
                            onClick={() => handleProductClick(product._id)}
                            className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                        >
                            Xem chi tiết
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // PropTypes for ProductCard
    ProductCard.propTypes = {
        product: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            stockQuantity: PropTypes.number,
            images: PropTypes.array,
            discount: PropTypes.number,
            description: PropTypes.string,
            short_desc: PropTypes.string,
            brand: PropTypes.string
        }).isRequired
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
                    <span className="text-gray-900">Sản phẩm</span>
                </div>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Tất cả sản phẩm</h1>
                    <p className="text-gray-600">Khám phá bộ sưu tập sản phẩm công nghệ đa dạng</p>
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
                                    placeholder="Tìm kiếm sản phẩm..."
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

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                        </button>
                    </div>

                    {/* Filters */}
                    <div className={`mt-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Danh mục</label>
                                <div className="flex flex-wrap gap-2">
                                    {/* All categories button */}
                                    <button
                                        onClick={() => setSelectedCategory('all')}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === 'all'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <span>📱</span>
                                        <span>Tất cả</span>
                                    </button>

                                    {/* Dynamic categories from Redux */}
                                    {categoriesLoading ? (
                                        <div className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm text-gray-500">
                                            <span>⏳</span>
                                            <span>Đang tải...</span>
                                        </div>
                                    ) : categoriesError ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm text-orange-500 bg-orange-50">
                                                <span>⚠️</span>
                                                <span>Sử dụng dữ liệu mẫu (Backend chưa sẵn sàng)</span>
                                            </div>
                                            {displayCategories.map(category => (
                                                <button
                                                    key={category._id}
                                                    onClick={() => setSelectedCategory(category._id)}
                                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category._id
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    <span>📂</span>
                                                    <span>{category.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        displayCategories.map(category => (
                                            <button
                                                key={category._id}
                                                onClick={() => setSelectedCategory(category._id)}
                                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category._id
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <span>📂</span>
                                                <span>{category.name}</span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Brand Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Thương hiệu</label>
                                {brandsLoading ? (
                                    <div className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500">
                                        Đang tải thương hiệu...
                                    </div>
                                ) : (
                                    <select
                                        value={selectedBrand}
                                        onChange={(e) => {
                                            setSelectedBrand(e.target.value);
                                        }}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {displayBrands.map(brand => (
                                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600">
                        {productsLoading ? (
                            <span>Đang tải sản phẩm...</span>
                        ) : (
                            <>
                                Hiển thị <span className="font-medium text-gray-900">{products.length}</span> sản phẩm
                                {productsPagination && productsPagination.total && (
                                    <span> / {productsPagination.total} tổng cộng</span>
                                )}
                            </>
                        )}
                    </p>
                </div>

                {/* Products Grid */}
                {productsLoading ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">⏳</div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Đang tải sản phẩm...</h3>
                        <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
                    </div>
                ) : productsError ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Lỗi tải sản phẩm</h3>
                        <p className="text-gray-600 mb-6">{productsError}</p>
                        <button
                            onClick={() => {
                                dispatch(productHomeListRequest({
                                    page: currentPage,
                                    limit: pageSize
                                }));
                            }}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                        <p className="text-gray-600 mb-6">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('all');
                                setSelectedBrand('all');
                                setSortBy('default');
                                setCurrentPage(1);
                            }}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                )}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ShowAllProduct;