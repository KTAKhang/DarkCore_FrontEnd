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

    // Redux state with safe destructuring
    const categoryHomeState = useSelector(state => state?.categoryHome) || {};
    const productHomeState = useSelector(state => state?.productHome) || {};

    let categories, categoriesLoading, categoriesError;
    let products, productsLoading, productsError, productsPagination;
    let brandsFromDB, brandsLoading, brandsError;

    try {
        const categoryData = categoryHomeState?.list || {};
        categories = categoryData.items || [];
        categoriesLoading = categoryData.loading || false;
        categoriesError = categoryData.error || null;
        
        const productData = productHomeState?.list || {};
        products = productData.items || [];
        productsLoading = productData.loading || false;
        productsError = productData.error || null;
        productsPagination = productData.pagination || null;
        
        const brandsData = productHomeState?.brands || {};
        brandsFromDB = brandsData.items || [];
        brandsLoading = brandsData.loading || false;
        brandsError = brandsData.error || null;
        
    } catch (error) {
        console.error('❌ Error destructuring Redux state:', error);
        categories = [];
        categoriesLoading = false;
        categoriesError = 'Destructuring error';
        products = [];
        productsLoading = false;
        productsError = 'Destructuring error';
        productsPagination = null;
        brandsFromDB = [];
        brandsLoading = false;
        brandsError = 'Destructuring error';
    }

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
        if (brandsFromDB && Array.isArray(brandsFromDB) && brandsFromDB.length > 0 && selectedBrand !== 'all') {
            const isValidBrand = brandsFromDB.includes(selectedBrand);
            if (!isValidBrand) {
                setSelectedBrand('all');
            }
        }
    }, [brandsFromDB, selectedBrand]);

    // Reset currentPage về 1 khi filter thay đổi (with debounce)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (currentPage !== 1) {
                setCurrentPage(1);
            }
        }, 100); // Small debounce to prevent rapid state updates

        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedCategory, selectedBrand, sortBy, currentPage]);

    // Track data changes
    useEffect(() => {
        // Data updated
    }, [categories, categoriesLoading, categoriesError, products, productsLoading, productsError, brandsFromDB, brandsLoading, brandsError]);

    // Memoize fallback categories to prevent re-creation on every render
    const fallbackCategories = useMemo(() => [
        { _id: 'laptops', name: 'Laptop' },
        { _id: 'tablets', name: 'Máy tính bảng' },
        { _id: 'accessories', name: 'Phụ kiện' }
    ], []);

    // Memoize fallback data to prevent re-creation on every render
    const displayCategories = useMemo(() => {
        return (categoriesError || !categories || !Array.isArray(categories)) ? fallbackCategories : categories;
    }, [categoriesError, categories, fallbackCategories]);

    // Fallback products data when API fails
    const fallbackProducts = useMemo(() => [
        {
            _id: 'sample-1',
            name: 'Sản phẩm mẫu 1',
            price: 1000000,
            stockQuantity: 10,
            images: ['/placeholder-product.jpg'],
            brand: 'Dell',
            description: 'Đây là sản phẩm mẫu khi không có kết nối backend'
        },
        {
            _id: 'sample-2', 
            name: 'Sản phẩm mẫu 2',
            price: 2000000,
            stockQuantity: 5,
            images: ['/placeholder-product.jpg'],
            brand: 'HP',
            description: 'Đây là sản phẩm mẫu khi không có kết nối backend'
        }
    ], []);

    // Use fallback products if API fails or products is null/undefined
    const displayProducts = useMemo(() => {
        return (productsError || !products || !Array.isArray(products)) ? fallbackProducts : products;
    }, [productsError, products, fallbackProducts]);

    // Prepare brands data with fallback
    const displayBrands = useMemo(() => {
        if (brandsError || !brandsFromDB || !Array.isArray(brandsFromDB)) {
            return brands; // Use fallback brands data
        }
        
        return [
            { id: "all", name: "Tất cả thương hiệu" },
            ...brandsFromDB.map(brand => ({
                id: brand,
                name: brand
            }))
        ];
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

        // Add category filter - REMOVED displayCategories from dependency to prevent infinite loop
        if (selectedCategory !== 'all') {
            const fallbackCategories = [
                { _id: 'laptops', name: 'Laptop' },
                { _id: 'tablets', name: 'Máy tính bảng' },
                { _id: 'accessories', name: 'Phụ kiện' }
            ];
            const categoriesToUse = (categoriesError || !categories || !Array.isArray(categories)) ? fallbackCategories : categories;
            const selectedCategoryData = categoriesToUse.find(cat => cat._id === selectedCategory);
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
    }, [dispatch, currentPage, pageSize, searchTerm, selectedCategory, selectedBrand, sortBy, categories, categoriesError]);

    // Early return if Redux state is not properly initialized
    if (!categoryHomeState || !productHomeState || Object.keys(categoryHomeState).length === 0 || Object.keys(productHomeState).length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">⏳</div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Đang khởi tạo ứng dụng...</h3>
                    <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
                </div>
            </div>
        );
    }

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
                                        displayCategories && Array.isArray(displayCategories) ? displayCategories.map(category => (
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
                                        )) : null
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
                                        {displayBrands && Array.isArray(displayBrands) ? displayBrands.map(brand => (
                                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                                        )) : (
                                            <option value="all">Tất cả thương hiệu</option>
                                        )}
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
                                Hiển thị <span className="font-medium text-gray-900">{displayProducts.length}</span> sản phẩm
                                {productsPagination && productsPagination.total && (
                                    <span> / {productsPagination.total} tổng cộng</span>
                                )}
                                {productsError && (
                                    <span className="text-orange-500 ml-2">(Sử dụng dữ liệu mẫu)</span>
                                )}
                            </>
                        )}
                    </p>
                </div>

                {/* Backend Connection Warning */}
                {(productsError || categoriesError || brandsError) && (
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
                ) : displayProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayProducts.map(product => (
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