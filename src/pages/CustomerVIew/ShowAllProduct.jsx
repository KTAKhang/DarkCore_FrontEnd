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

// <-- IMPORT CART ACTIONS -->
import { cartAddRequest, cartGetRequest } from '../../redux/actions/cartActions';

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
    const cart = useSelector(state => state?.cart) || { items: [] }; // an toàn
    const cartItems = cart.items || [];

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

    // <-- FIXED: define handleAddToCart (correct name) -->
    const handleAddToCart = (productId) => {
        // dispatch add request (saga should handle API), then refresh cart to be safe
        dispatch(cartAddRequest(productId, 1));
        // optional: refresh cart after add to ensure UI update if saga doesn't return new cart automatically
        dispatch(cartGetRequest());
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

        // optionally load cart on mount (if not loaded elsewhere)
        dispatch(cartGetRequest());
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

        // Add category filter
        if (selectedCategory !== 'all') {
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
                            onClick={() => handleAddToCart(product._id)}
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
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} cartItems={cartItems.length || 0} />

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* ... rest of UI unchanged ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayProducts.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ShowAllProduct;
