import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import {
  cartGetRequest,
  cartUpdateRequest,
  cartRemoveRequest,
  cartClearRequest,
  cartClearMessage,
} from '../redux/actions/cartActions';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart, loading, error } = useSelector((state) => state.cart || {});
  const { user } = useSelector((state) => state.auth || {}); // ✅ thêm dòng này
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Lấy giỏ hàng
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập để xem giỏ hàng');
      navigate('/login');
      return;
    }
    dispatch(cartGetRequest());
  }, [dispatch, navigate]);

  // Xử lý lỗi
  useEffect(() => {
    if (error) {
      console.error('CartPage error:', error);
      dispatch(cartClearMessage());
    }
  }, [error, dispatch]);

  // Format tiền
  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN').format(price) + '₫';

  const totalItems =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const calculateSubtotal = () =>
    cart?.items?.reduce((t, i) => t + i.price * i.quantity, 0) || 0;

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = (subtotal * discountPercent) / 100;
    return subtotal - discount;
  };

  const updateQuantity = (productId, change) => {
    const item = cart?.items?.find((i) => i.productId === productId);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + change);
    dispatch(cartUpdateRequest(productId, newQty));
  };

  const removeItem = (productId) => dispatch(cartRemoveRequest(productId));
  const clearCart = () => dispatch(cartClearRequest());

  const applyCoupon = () => {
    if (!couponCode.trim()) return;
    if (couponCode.toUpperCase() === 'DISCOUNT10') {
      setDiscountPercent(10);
      toast.success('Áp dụng mã giảm giá 10% thành công!');
    } else {
      setDiscountPercent(0);
      toast.error('Mã giảm giá không hợp lệ');
    }
  };

  const handleCheckout = async () => {
    if (!cart?.items || cart.items.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }

    const userId = user?._id || JSON.parse(localStorage.getItem("user"))?._id;
    if (!userId) {
      toast.error("Vui lòng đăng nhập để thanh toán");
      navigate("/login");
      return;
    }

    try {
      setCheckoutLoading(true);
      const token = localStorage.getItem("token");

      // 🧾 1. Tạo order (chưa thanh toán)
      const res = await fetch("http://localhost:3007/api/orders", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          items: cart.items,
          totalPrice: calculateTotal(),
          subtotal: calculateSubtotal(),
          shippingFee: 0,
          discount: (calculateSubtotal() * discountPercent) / 100,
          receiverName: "Chưa cập nhật",
          receiverPhone: "Chưa cập nhật", 
          receiverAddress: "Chưa cập nhật",
          note: "Đơn hàng từ giỏ hàng"
        })
      });

      const data = await res.json();
      console.log('CartPage createOrder response:', data);
      if (data.status !== "OK") throw new Error(data.message || "Không tạo được đơn hàng");

      // 🧭 2. Điều hướng sang PaymentPage và truyền dữ liệu order
      navigate("/checkout", {
        state: {
          orderId: data.data._id,
          amount: data.data.totalPrice,
          orderNumber: data.data.orderNumber,
        }
      });
    } catch (error) {
      console.error(error);
      toast.error("Không thể tạo đơn hàng");
    } finally {
      setCheckoutLoading(false);
    }
  };



  // ✅ Trả về 1 JSX duy nhất
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Giỏ hàng của bạn
          </h1>
          <p className="text-gray-600">{totalItems} sản phẩm trong giỏ hàng</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Đang tải giỏ hàng...
            </h3>
          </div>
        )}

        {/* Giỏ hàng trống */}
        {!loading && (!cart?.items || cart.items.length === 0) && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Giỏ hàng trống
            </h3>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        )}

        {/* Giỏ hàng có sản phẩm */}
        {!loading && cart?.items?.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sản phẩm */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Sản phẩm</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="p-6">
                      <div className="flex items-start gap-4">
                        <img
                          alt={item.name}
                          src={item.image || '/placeholder-product.jpg'}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">
                            {item.name}
                          </h3>
                          <div className="flex justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center border rounded-lg">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.productId, -1)
                                  }
                                  className="w-10 h-10 hover:bg-gray-50"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4 text-gray-600" />
                                </button>
                                <span className="w-12 text-center font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.productId, 1)
                                  }
                                  className="w-10 h-10 hover:bg-gray-50"
                                >
                                  <Plus className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeItem(item.productId)}
                                className="w-10 h-10 text-red-500 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="text-right font-bold text-red-600">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => navigate('/products')}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Tiếp tục mua sắm
                </button>
                <button
                  onClick={clearCart}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa tất cả
                </button>
              </div>
            </div>

            {/* Tổng kết */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Tổng kết đơn hàng
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá ({discountPercent}%)</span>
                    <span>
                      -{formatPrice(
                        (calculateSubtotal() * discountPercent) / 100
                      )}
                    </span>
                  </div>
                )}

                <div className="border-t pt-4 flex justify-between">
                  <span className="font-bold">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-red-600">
                    {formatPrice(calculateTotal())}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-bold mb-2">Ưu đãi & Mã giảm giá</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading || !cart?.items?.length}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? 'Đang tạo đơn hàng...' : 'Thanh toán ngay'}
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
