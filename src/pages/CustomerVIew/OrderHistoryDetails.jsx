import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, Package, Truck, CheckCircle, Clock, User, CreditCard, MapPin, Phone, XCircle } from 'lucide-react';

const OrderHistoryDetails = ({ isOpen, onClose, order, loading = false }) => {
  // Close modal on ESC key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  // Debug log to see the order data structure
  console.log("🔍 OrderHistoryDetails - order:", order);
  console.log("🔍 OrderHistoryDetails - orderDetails:", order.orderDetails);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusName = (orderStatusId) => {
    if (!orderStatusId) return 'pending';
    if (typeof orderStatusId === 'string') return orderStatusId;
    return orderStatusId.name || 'pending';
  };

  const statusName = getStatusName(order.orderStatusId);

  const getValidImageUrl = (item) => {
    const imageUrl = item.productImage || item.productId?.images?.[0];
    if (imageUrl && !imageUrl.includes('example.com')) {
      return imageUrl;
    }
    return 'https://via.placeholder.com/80x80?text=No+Image';
  };

  // Tạo timeline từ order data
  const generateTimeline = () => {
    const timeline = [];

    // Bước 1: Đơn hàng đã đặt (luôn có)
    timeline.push({
      status: 'Đơn hàng đã đặt',
      date: order.createdAt ? formatDate(order.createdAt) : '',
      completed: true
    });

    // Xử lý các trạng thái đặc biệt: cancelled và returned
    if (statusName === 'cancelled') {
      // Đơn hàng đã hủy
      timeline.push({
        status: 'Đã hủy',
        date: order.cancelledAt ? formatDate(order.cancelledAt) : (order.updatedAt ? formatDate(order.updatedAt) : ''),
        completed: true,
        isCancelled: true
      });
    } else if (statusName === 'returned') {
      // Đơn hàng đã trả hàng - phải đã giao mới có thể trả
      timeline.push({
        status: 'Đã xác nhận',
        date: '',
        completed: true
      });

      timeline.push({
        status: 'Đã giao hàng',
        date: order.deliveredAt ? formatDate(order.deliveredAt) : '',
        completed: true
      });

      timeline.push({
        status: 'Đã trả hàng',
        date: order.updatedAt ? formatDate(order.updatedAt) : '',
        completed: true,
        isReturned: true
      });
    } else {
      // Luồng bình thường: pending → confirmed → processing → shipping/shipped → delivered
      timeline.push({
        status: 'Đã xác nhận',
        date: statusName !== 'pending' && order.updatedAt ? formatDate(order.updatedAt) : '',
        completed: ['confirmed', 'processing', 'shipping', 'shipped', 'delivered'].includes(statusName)
      });

      timeline.push({
        status: 'Đang giao hàng',
        date: ['shipping', 'shipped'].includes(statusName) && order.updatedAt ? formatDate(order.updatedAt) : '',
        completed: ['shipping', 'shipped', 'delivered'].includes(statusName)
      });

      timeline.push({
        status: 'Đã giao hàng',
        date: order.deliveredAt ? formatDate(order.deliveredAt) : '',
        completed: statusName === 'delivered'
      });
    }

    return timeline;
  };

  const timeline = generateTimeline();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 z-10 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải chi tiết đơn hàng...</p>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h2>
            <p className="text-sm text-gray-500 mt-1">Mã đơn: #{order._id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Order Status Timeline */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Trạng thái đơn hàng
              </h3>
              <div className="space-y-4">
                {timeline.map((step, index) => {
                  // Xác định màu sắc và icon dựa trên trạng thái
                  let bgColor = 'bg-gray-200';
                  let icon = <Clock className="w-5 h-5 text-gray-400" />;
                  
                  if (step.completed) {
                    if (step.isCancelled) {
                      // Đã hủy - màu đỏ
                      bgColor = 'bg-red-100';
                      icon = <XCircle className="w-5 h-5 text-red-600" />;
                    } else if (step.isReturned) {
                      // Đã trả hàng - màu cam
                      bgColor = 'bg-orange-100';
                      icon = <XCircle className="w-5 h-5 text-orange-600" />;
                    } else {
                      // Bình thường - màu xanh
                      bgColor = 'bg-green-100';
                      icon = <CheckCircle className="w-5 h-5 text-green-600" />;
                    }
                  }
                  
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${bgColor}`}>
                        {icon}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          step.completed ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {step.status}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Sản phẩm đã đặt ({(order.orderDetails || order.orderdetails || []).length || 0} sản phẩm)
              </h3>
              <div className="space-y-4">
                {(order.orderDetails || order.orderdetails || []).map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={getValidImageUrl(item)}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        if (e.target.src !== 'https://via.placeholder.com/80x80?text=No+Image') {
                          e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                        }
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{item.productName}</h4>
                      <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                      <p className="text-sm text-gray-500">Đơn giá: {formatPrice(item.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-lg">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Tổng cộng:</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatPrice(order.totalPrice)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  Thông tin giao hàng
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Người nhận:
                    </p>
                    <p className="text-gray-900 font-medium">{order.receiverName || order.userId?.user_name || order.customer?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Số điện thoại:
                    </p>
                    <p className="text-gray-900 font-medium">{order.receiverPhone || order.userId?.phone || order.customer?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Địa chỉ:
                    </p>
                    <p className="text-gray-900 font-medium">{order.receiverAddress || 'Địa chỉ chưa được cung cấp'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Thông tin thanh toán
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phương thức:</p>
                    <p className="text-gray-900 font-medium">
                      {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ngày đặt:</p>
                    <p className="text-gray-900 font-medium">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  {order.updatedAt && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Ngày cập nhật gần nhất:</p>
                      <p className="text-gray-900 font-medium">
                        {formatDate(order.updatedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-3">
            {statusName === 'pending' && (
              <button
                onClick={() => {
                  if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
                    // TODO: Implement cancel order
                    console.log('Cancel order:', order._id);
                  }
                }}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Hủy đơn hàng
              </button>
            )}
            {statusName === 'delivered' && (
              <button
                onClick={() => {
                  // TODO: Implement reorder
                  console.log('Reorder:', order._id);
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Mua lại
              </button>
            )}
            <button
              onClick={() => {
                // TODO: Implement contact support
                console.log('Contact support');
              }}
              className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Liên hệ hỗ trợ
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

OrderHistoryDetails.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  order: PropTypes.object,
  loading: PropTypes.bool,
};

export default OrderHistoryDetails;

