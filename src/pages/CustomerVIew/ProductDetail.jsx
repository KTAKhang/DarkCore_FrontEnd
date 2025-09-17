import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { productHomeDetailRequest, productHomeClearMessages } from '../../redux/actions/productHomeActions';


const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const { 
    detail: { item: product, loading, error },
  } = useSelector(state => state.productHome);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState(3);
  const [wishlist, setWishlist] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      // Clear previous messages
      dispatch(productHomeClearMessages());
      // Fetch product detail from API
      dispatch(productHomeDetailRequest(id));
    }
  }, [id, dispatch]);

  // Handle navigation if product not found
  useEffect(() => {
    if (error && error.includes('Không tìm thấy sản phẩm')) {
      navigate('/products');
    }
  }, [error, navigate]);

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

  const addToCart = (productId, qty) => {
    setCartItems(prev => prev + qty);
    // Add cart logic here
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-lg ${i < Math.floor(rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  StarRating.propTypes = {
    rating: PropTypes.number
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại danh sách sản phẩm
          </button>
        </div>
      </div>
    );
  }

  // No product found
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-600 mb-4">Không tìm thấy sản phẩm</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại danh sách sản phẩm
          </button>
        </div>
      </div>
    );
  }

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
          <Link to="/products" className="hover:text-blue-600">Sản phẩm</Link>
          <span>›</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-xl overflow-hidden border border-gray-200">
              <img
                src={product.images && product.images.length > 0 ? product.images[selectedImage] : 'https://via.placeholder.com/500x500?text=No+Image'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                }}
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
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
                  <span key={index} className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {badge}
                  </span>
                ))}
                {product.discount && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    -{product.discount}%
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              {/* Brand and Category */}
              <div className="flex items-center space-x-4 mb-2">
                {product.brand && (
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    Thương hiệu: {product.brand}
                  </span>
                )}
                {product.category && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    Danh mục: {typeof product.category === 'object' ? product.category.name : product.category}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <StarRating rating={product.rating || 0} />
                <span className="text-gray-600">
                  {product.rating || 0} ({product.reviews || 0} đánh giá)
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-gray-400 line-through ml-3">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {/* Stock Quantity */}
                <div className="mt-2">
                  <span className={`text-sm font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stockQuantity > 0 ? `Còn ${product.stockQuantity} sản phẩm` : 'Hết hàng'}
                  </span>
                </div>
              </div>

              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Short Description */}
              {product.short_desc && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Mô tả ngắn</h3>
                  <p className="text-blue-800 text-sm leading-relaxed">{product.short_desc}</p>
                </div>
              )}

              {/* Detailed Description */}
              {product.detail_desc && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Mô tả chi tiết</h3>
                  <p className="text-gray-700 leading-relaxed">{product.detail_desc}</p>
                </div>
              )}

              {/* Fallback description */}
              {!product.short_desc && !product.detail_desc && product.description && (
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              )}

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Số lượng:</label>
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-200">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    wishlist.includes(product.id)
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">
                    {wishlist.includes(product.id) ? '❤️' : '🤍'}
                  </span>
                  <span className="text-sm">
                    {wishlist.includes(product.id) ? 'Đã yêu thích' : 'Yêu thích'}
                  </span>
                </button>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => addToCart(product.id, quantity)}
                  disabled={!product.stockQuantity || product.stockQuantity <= 0 || !product.status}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {product.stockQuantity > 0 && product.status ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                </button>
                <button className="flex-1 border border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                  Mua ngay
                </button>
              </div>

              {(!product.stockQuantity || product.stockQuantity <= 0 || !product.status) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 font-medium">
                    {!product.status ? 'Sản phẩm tạm ngừng kinh doanh' : 'Sản phẩm hiện đang hết hàng'}
                  </p>
                  <p className="text-red-500 text-sm mt-1">Vui lòng liên hệ để được thông báo khi có hàng</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button className="py-4 px-1 border-b-2 border-blue-600 text-blue-600 font-medium">
                Thông số kỹ thuật
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium">
                Tính năng nổi bật
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium">
                Đánh giá
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Product Information Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Tên sản phẩm:</span>
                <span className="text-gray-900">{product.name}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Giá bán:</span>
                <span className="text-gray-900 font-semibold">{formatPrice(product.price)}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Số lượng tồn kho:</span>
                <span className={`font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stockQuantity}
                </span>
              </div>
              
              {product.brand && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Thương hiệu:</span>
                  <span className="text-gray-900">{product.brand}</span>
                </div>
              )}
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Danh mục:</span>
                <span className="text-gray-900">
                  {typeof product.category === 'object' ? product.category.name : product.category}
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Trạng thái:</span>
                <span className={`font-medium ${product.status ? 'text-green-600' : 'text-red-600'}`}>
                  {product.status ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
                </span>
              </div>
              
              {product.images && product.images.length > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Số lượng hình ảnh:</span>
                  <span className="text-gray-900">{product.images.length}</span>
                </div>
              )}
              
              {product.createdAt && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Ngày tạo:</span>
                  <span className="text-gray-900">
                    {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}
              
              {product.updatedAt && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Cập nhật lần cuối:</span>
                  <span className="text-gray-900">
                    {new Date(product.updatedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}
            </div>

            {/* Custom specifications if available */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông số kỹ thuật bổ sung</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features if available */}
            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tính năng nổi bật</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="text-green-500 text-sm">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Debug Information (only in development) */}
            {import.meta.env.DEV && (
              <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Debug - Raw Product Data</h3>
                <pre className="text-xs text-gray-600 overflow-auto max-h-96">
                  {JSON.stringify(product, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductDetail;
