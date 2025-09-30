import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { useWishlist } from '../contexts/WishlistContext';
import {
    productHomeFeaturedRequest,
    productHomeToggleFavoriteRequest,
    productHomeClearMessages
} from '../redux/actions/productHomeActions';

// Service data
const services = [
  {
    id: 1,
    title: "Sửa chữa laptop",
    description: "Chẩn đoán và sửa chữa mọi sự cố laptop nhanh chóng",
    image: "https://giatin.com.vn/wp-content/uploads/2019/11/sua-laptop-tai-da-nang.jpg",
    icon: "💻",
    services: ["Thay màn hình", "Sửa bàn phím", "Thay pin", "Làm sạch quạt tản nhiệt"],
    priceFrom: "200.000₫",
    duration: "1-3 ngày"
  },
  {
    id: 2,
    title: "Thay màn hình",
    description: "Thay thế màn hình laptop, tablet chất lượng cao",
    image: "https://giatin.com.vn/wp-content/uploads/2019/11/sua-laptop-tai-da-nang.jpg",
    icon: "📺",
    services: ["Màn hình chính hãng", "Bảo hành 6 tháng", "Test kỹ trước giao", "Hỗ trợ tận nhà"],
    priceFrom: "1.500.000₫",
    duration: "2-4 giờ"
  },
  {
    id: 3,
    title: "Nâng cấp phần cứng",
    description: "Nâng cấp RAM, SSD, ổ cứng để tăng hiệu suất",
    image: "https://giatin.com.vn/wp-content/uploads/2019/11/sua-laptop-tai-da-nang.jpg",
    icon: "🔧",
    services: ["Tư vấn miễn phí", "Linh kiện chính hãng", "Tối ưu hiệu suất", "Backup dữ liệu"],
    priceFrom: "500.000₫",
    duration: "1-2 giờ"
  },
  {
    id: 4,
    title: "Vệ sinh laptop",
    description: "Làm sạch bụi bẩn, thay keo tản nhiệt chuyên nghiệp",
    image: "https://giatin.com.vn/wp-content/uploads/2019/11/sua-laptop-tai-da-nang.jpg",
    icon: "🧹",
    services: ["Vệ sinh toàn diện", "Thay keo tản nhiệt", "Kiểm tra quạt", "Tối ưu nhiệt độ"],
    priceFrom: "300.000₫",
    duration: "2-3 giờ"
  }
];


const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlist, toggleWishlist } = useWishlist();
  
  // Redux state with safe destructuring
  const productHomeState = useSelector(state => state?.productHome) || {};

  let featuredProducts, featuredLoading, featuredError;
  let toggleFavoriteLoading, toggleFavoriteError;

  try {
    const featuredData = productHomeState?.featured || {};
    featuredProducts = featuredData.items || [];
    featuredLoading = featuredData.loading || false;
    featuredError = featuredData.error || null;
    
    const toggleData = productHomeState?.toggleFavorite || {};
    toggleFavoriteLoading = toggleData.loading || false;
    toggleFavoriteError = toggleData.error || null;
    
  } catch (error) {
    console.error('❌ Error destructuring Redux state:', error);
    featuredProducts = [];
    featuredLoading = false;
    featuredError = 'Destructuring error';
    toggleFavoriteLoading = false;
    toggleFavoriteError = null;
  }

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState(3);
  const [shouldReloadFavorites, setShouldReloadFavorites] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };


  const addToCart = () => {
    setCartItems(prev => prev + 1);
    // Add cart logic here
  };

  const handleToggleFavorite = (productId) => {
    dispatch(productHomeToggleFavoriteRequest(productId));
    setShouldReloadFavorites(true);
  };

  // Load featured products on component mount
  useEffect(() => {
    dispatch(productHomeFeaturedRequest({ limit: 4 }));
  }, [dispatch]);

  // Reset shouldReloadFavorites flag after toggle
  useEffect(() => {
    if (shouldReloadFavorites && !toggleFavoriteLoading && !toggleFavoriteError) {
      // Toggle was successful, Redux state is already updated automatically
      setShouldReloadFavorites(false);
    }
  }, [shouldReloadFavorites, toggleFavoriteLoading, toggleFavoriteError]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(productHomeClearMessages());
    };
  }, [dispatch]);


  // Fallback products data when API fails
  const fallbackProducts = useMemo(() => [
    {
      _id: 1,
      name: "MacBook Pro M3 14 inch",
      price: 52990000,
      originalPrice: 59990000,
      discount: 12,
      rating: 4.8,
      reviews: 124,
      images: ["https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_3__8_97_1.png?_gl=1*apgeb1*_gcl_aw*R0NMLjE3NTc2NjA2MTEuQ2p3S0NBandpWV9HQmhCRUVpd0FGYWdodmk3OFpYeTd2YzFhLU1nQ1Znb2hnaTNaNTNfdlk5ektoRHQ2MXZfcU1CS1dmclIyQ2VjbmpSb0M1TFFRQXZEX0J3RQ..*_gcl_au*ODU3MjE3NDQuMTc1NzY2MDYxMA..*_ga*MTIyNDM0ODEyMC4xNjY4OTQ3MjM3*_ga_QLK8WFHNK9*czE3NTc2NjA2MTAkbzE1JGcxJHQxNzU3NjYwNjE0JGo1NiRsMCRoMTU0NjQ3NDM1NQ.."],
      tags: ["Chip M3", "16GB RAM", "512GB SSD"],
      badges: ["Mới nhất"],
      category: "laptops",
      stockQuantity: 10,
      brand: "Apple",
      description: "MacBook Pro M3 với hiệu năng vượt trội cho công việc chuyên nghiệp"
    },
    {
      _id: 2,
      name: "iPad Pro 12.9 inch M2",
      price: 28990000,
      originalPrice: 32990000,
      discount: 12,
      rating: 4.9,
      reviews: 89,
      images: ["https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_3__8_97_1.png?_gl=1*apgeb1*_gcl_aw*R0NMLjE3NTc2NjA2MTEuQ2p3S0NBandpWV9HQmhCRUVpd0FGYWdodmk3OFpYeTd2YzFhLU1nQ1Znb2hnaTNaNTNfdlk5ektoRHQ2MXZfcU1CS1dmclIyQ2VjbmpSb0M1TFFRQXZEX0J3RQ..*_gcl_au*ODU3MjE3NDQuMTc1NzY2MDYxMA..*_ga*MTIyNDM0ODEyMC4xNjY4OTQ3MjM3*_ga_QLK8WFHNK9*czE3NTc2NjA2MTAkbzE1JGcxJHQxNzU3NjYwNjE0JGo1NiRsMCRoMTU0NjQ3NDM1NQ.."],
      tags: ["Chip M2", "Liquid Retina XDR", "Hỗ trợ Apple Pencil"],
      badges: ["Bán chạy"],
      category: "tablets",
      stockQuantity: 15,
      brand: "Apple",
      description: "iPad Pro với màn hình Liquid Retina XDR tuyệt đẹp"
    },
    {
      _id: 3,
      name: "ASUS ROG Strix G15",
      price: 25990000,
      originalPrice: 29990000,
      discount: 13,
      rating: 4.7,
      reviews: 156,
      images: ["https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_3__8_97_1.png?_gl=1*apgeb1*_gcl_aw*R0NMLjE3NTc2NjA2MTEuQ2p3S0NBandpWV9HQmhCRUVpd0FGYWdodmk3OFpYeTd2YzFhLU1nQ1Znb2hnaTNaNTNfdlk5ektoRHQ2MXZfcU1CS1dmclIyQ2VjbmpSb0M1TFFRQXZEX0J3RQ..*_gcl_au*ODU3MjE3NDQuMTc1NzY2MDYxMA..*_ga*MTIyNDM0ODEyMC4xNjY4OTQ3MjM3*_ga_QLK8WFHNK9*czE3NTc2NjA2MTAkbzE1JGcxJHQxNzU3NjYwNjE0JGo1NiRsMCRoMTU0NjQ3NDM1NQ.."],
      tags: ["RTX 4060", "AMD Ryzen 7", "16GB DDR5"],
      badges: ["Gaming"],
      category: "laptops",
      stockQuantity: 8,
      brand: "ASUS",
      description: "Laptop gaming mạnh mẽ với RTX 4060"
    },
    {
      _id: 4,
      name: "Dell XPS 13 Plus",
      price: 32990000,
      originalPrice: 36990000,
      discount: 11,
      rating: 4.6,
      reviews: 78,
      images: ["https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_3__8_97_1.png?_gl=1*apgeb1*_gcl_aw*R0NMLjE3NTc2NjA2MTEuQ2p3S0NBandpWV9HQmhCRUVpd0FGYWdodmk3OFpYeTd2YzFhLU1nQ1Znb2hnaTNaNTNfdlk5ektoRHQ2MXZfcU1CS1dmclIyQ2VjbmpSb0M1TFFRQXZEX0J3RQ..*_gcl_au*ODU3MjE3NDQuMTc1NzY2MDYxMA..*_ga*MTIyNDM0ODEyMC4xNjY4OTQ3MjM3*_ga_QLK8WFHNK9*czE3NTc2NjA2MTAkbzE1JGcxJHQxNzU3NjYwNjE0JGo1NiRsMCRoMTU0NjQ3NDM1NQ.."],
      tags: ["Intel i7-1360P", "13.4\" OLED", "512GB SSD"],
      badges: ["Cao cấp"],
      category: "laptops",
      stockQuantity: 5,
      brand: "Dell",
      description: "Laptop cao cấp với màn hình OLED tuyệt đẹp"
    }
  ], []);


  // Use fallback products if API fails or featuredProducts is null/undefined
  const displayProducts = useMemo(() => {
    const products = (featuredError || !featuredProducts || !Array.isArray(featuredProducts)) ? fallbackProducts : featuredProducts;
    // Giới hạn tối đa 4 sản phẩm hiển thị trên trang chủ
    return products.slice(0, 4);
  }, [featuredError, featuredProducts, fallbackProducts]);

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
            onClick={() => navigate(`/product/${productId}`)}
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
                        className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                    >
                        <span className={`text-lg ${product.favorite ? 'text-red-500' : 'text-gray-600'}`}>
                            {product.favorite ? '❤️' : '🤍'}
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
          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer" onClick={() => navigate(`/product/${productId}`)}>
            {product.name}
          </h3>
          {(product.description || product.short_desc) && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {(product.description || product.short_desc).length > 50 
                ? (product.description || product.short_desc).substring(0, 50) + '...'
                : (product.description || product.short_desc)
              }
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
              onClick={() => navigate(`/product/${productId}`)}
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
    }).isRequired,
  };

  const ServiceCard = ({ service }) => (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-40 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <span className="text-xl">{service.icon}</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{service.description}</p>
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2 text-sm">Dịch vụ bao gồm:</h4>
          <ul className="space-y-1">
            {service.services.map((item, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <span className="text-green-500 text-xs mr-2">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-between mb-4 text-sm">
          <div>
            <span className="text-gray-500">Giá từ:</span>
            <span className="font-bold text-blue-600 ml-1">{service.priceFrom}</span>
          </div>
          <div>
            <span className="text-gray-500">Thời gian:</span>
            <span className="font-medium text-gray-900 ml-1">{service.duration}</span>
          </div>
        </div>
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          Đặt lịch sửa chữa
        </button>
      </div>
    </div>
  );

  ServiceCard.propTypes = {
    service: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      services: PropTypes.arrayOf(PropTypes.string).isRequired,
      priceFrom: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
    }).isRequired,
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} cartItems={cartItems} />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 to-purple-700 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: "url('https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2022_8_16_637962581110697805_cong-nghe-man-hinh-laptop-a.jpg')" }}></div>
          <div className="relative container mx-auto px-4 py-20">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                Công nghệ hàng đầu<br />
                <span className="text-yellow-300">cho cuộc sống hiện đại</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Khám phá bộ sưu tập laptop, máy tính bảng và thiết bị công nghệ mới nhất với giá tốt nhất.
                Chúng tôi cũng cung cấp dịch vụ sửa chữa chuyên nghiệp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/products')}
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-colors text-center"
                >
                  Xem sản phẩm
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-blue-600 transition-colors text-center">
                  Dịch vụ sửa chữa
                </button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
        </section>


        {/* Featured Products Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Sản phẩm nổi bật</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Những sản phẩm công nghệ hàng đầu được khách hàng yêu thích nhất
              </p>
            </div>

            {/* Backend Connection Warning for Products */}
            {featuredError && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-orange-500 text-lg">⚠️</span>
                  <div>
                    <h4 className="text-orange-800 font-medium">Không thể tải sản phẩm từ server</h4>
                    <p className="text-orange-700 text-sm">
                      Hiện tại đang sử dụng dữ liệu mẫu. Vui lòng kiểm tra kết nối mạng hoặc liên hệ quản trị viên.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {featuredLoading ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⏳</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Đang tải sản phẩm...</h3>
                <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
              </div>
            ) : displayProducts.length > 0 ? (
              <>
                {/* Hiển thị tối đa 4 sản phẩm nổi bật trên trang chủ */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {displayProducts.map(product => (
                    <ProductCard key={product._id || product.id} product={product} />
                  ))}
                </div>
                <div className="text-center">
                  <button 
                    onClick={() => navigate('/products')}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Xem tất cả sản phẩm
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Chưa có sản phẩm nổi bật</h3>
                <p className="text-gray-600 mb-6">Hiện tại chưa có sản phẩm nào được đánh dấu là nổi bật</p>
                <button
                  onClick={() => {
                    dispatch(productHomeFeaturedRequest({ limit: 4 }));
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Dịch vụ sửa chữa</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Dịch vụ sửa chữa laptop chuyên nghiệp với đội ngũ kỹ thuật viên giàu kinh nghiệm
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {services.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
            <div className="text-center">
              <div className="bg-blue-50 rounded-2xl p-8 mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">📞</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Hỗ trợ 24/7</h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  Liên hệ ngay với chúng tôi để được tư vấn và hỗ trợ kỹ thuật miễn phí
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Liên hệ ngay
                  </button>
                  <a href="tel:0123456789" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                    Gọi: 0123.456.789
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>)
}

export default HomePage;