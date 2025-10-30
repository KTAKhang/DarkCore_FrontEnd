import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, CreditCard, User, Phone, MapPin, MessageSquare } from "lucide-react";
import apiClient from '../utils/axiosConfig';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const fallback = (() => {
    try {
      return JSON.parse(localStorage.getItem('pendingOrder')) || null;
    } catch {
      return null;
    }
  })();
  const orderId = state?.orderId || fallback?.orderId;
  const amount = state?.amount || fallback?.amount;
  const orderNumber = state?.orderNumber || fallback?.orderNumber;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  });

  // Kiểm tra dữ liệu từ CartPage
  useEffect(() => {
    console.log('🔍 CheckoutPage - Received state:', { orderId, amount, orderNumber });
    if (!orderId || !amount) {
      console.error('❌ CheckoutPage - Missing orderId or amount, redirecting to cart');
      toast.error('Thông tin đơn hàng không hợp lệ');
      navigate('/customer/cart');
    }
  }, [orderId, amount, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async () => {
    // Validate form
    if (!formData.fullName.trim()) {
      toast.error('Vui lòng nhập họ và tên');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại');
      return;
    }
    if (!formData.address.trim()) {
      toast.error('Vui lòng nhập địa chỉ');
      return;
    }
    try {
      setLoading(true);
      // Dùng lại orderId, amount đã được tạo từ CartPage trước đó
      const curOrderId = orderId;
      const curAmount = amount;
      if (!curOrderId || !curAmount) {
        toast.error('Không tìm thấy đơn hàng để thanh toán!');
        setLoading(false);
        return;
      }
      // Update lại thông tin địa chỉ vào localStorage cho result page dùng
      localStorage.setItem('pendingOrder', JSON.stringify({
        orderId: curOrderId,
        orderNumber,
        amount: curAmount,
        customerInfo: formData
      }));
      // Gọi API tạo VNPay payment URL qua gateway
      const { data } = await apiClient.post('/payment/vnpay/create', {
        orderId: curOrderId,
        amount: curAmount,
        bankCode: undefined
      });
      if (data.status === 'OK' && data.data.paymentUrl) {
        window.location.href = data.data.paymentUrl;
      } else {
        throw new Error(data.message || 'Không thể tạo URL thanh toán');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo thanh toán';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/customer/cart')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại giỏ hàng
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
          <p className="text-gray-600 mt-2">Hoàn tất đơn hàng của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Thông tin giao hàng */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Thông tin giao hàng</h2>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ giao hàng"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </form>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Tóm tắt đơn hàng</h2>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-medium">{orderNumber}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng tiền:</span>
                <span className="text-xl font-bold text-red-600">
                  {formatPrice(amount)}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Thanh toán VNPay
                  </>
                )}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                Bạn sẽ được chuyển hướng đến trang thanh toán VNPay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
