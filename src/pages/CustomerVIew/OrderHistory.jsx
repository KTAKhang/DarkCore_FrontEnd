import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Package, Truck, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { orderHistoryRequest, orderClearMessages } from '../../redux/actions/orderActions';
import Footer from '../../components/Footer/Footer';

const OrderHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Lấy user từ localStorage
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const userId = storedUser?._id || storedUser?.id;

  // Lấy data từ Redux
  const { history, loadingHistory, error, success, historyPagination } = useSelector((state) => state.order || {});

  // Load orders khi component mount hoặc khi filter/page thay đổi
  useEffect(() => {
    if (userId) {
      const query = {
        page: currentPage,
        limit: 10,
      };
      
      // Thêm filter theo status nếu có
      if (selectedStatus !== 'all') {
        query.status = selectedStatus;
      }
      
      dispatch(orderHistoryRequest(userId, query));
    }
  }, [dispatch, userId, selectedStatus, currentPage]);

  // Show toast messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(orderClearMessages());
    }
    if (success) {
      toast.success(success);
      dispatch(orderClearMessages());
    }
  }, [error, success, dispatch]);

  // Redirect nếu chưa login
  useEffect(() => {
    if (!userId) {
      toast.error('Vui lòng đăng nhập để xem lịch sử đơn hàng');
      navigate('/login');
    }
  }, [userId, navigate]);

  // Sử dụng data thực từ Redux - không cần mock data nữa

  const statusConfig = {
    all: { label: 'Tất cả', color: 'gray', icon: Package },
    pending: { label: 'Chờ xác nhận', color: 'yellow', icon: Clock },
    confirmed: { label: 'Đã xác nhận', color: 'blue', icon: CheckCircle },
    shipping: { label: 'Đang giao', color: 'purple', icon: Truck },
    delivered: { label: 'Đã giao', color: 'green', icon: CheckCircle },
    cancelled: { label: 'Đã hủy', color: 'red', icon: XCircle }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status];
    const colorClasses = {
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      blue: 'bg-blue-100 text-blue-700 border-blue-300',
      purple: 'bg-purple-100 text-purple-700 border-purple-300',
      green: 'bg-green-100 text-green-700 border-green-300',
      red: 'bg-red-100 text-red-700 border-red-300'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorClasses[config.color]}`}>
        {config.label}
      </span>
    );
  };

  // Lấy status name từ orderStatusId object
  const getStatusName = (orderStatusId) => {
    if (!orderStatusId) return 'pending';
    if (typeof orderStatusId === 'string') return orderStatusId;
    return orderStatusId.name || 'pending';
  };

  // Filter theo search term (client-side filtering)
  const filteredOrders = (history || []).filter(order => {
    if (!searchTerm) return true;
    
    const orderIdMatch = order._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const productMatch = order.orderDetails?.some(item => 
      item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return orderIdMatch || productMatch;
  });

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Tạo timeline từ order data
  const generateTimeline = (order) => {
    const statusName = getStatusName(order.orderStatusId);
    const timeline = [];

    // Đơn hàng đã đặt
    timeline.push({
      status: 'Đơn hàng đã đặt',
      date: order.createdAt ? formatDate(order.createdAt) : '',
      completed: true
    });

    // Các trạng thái tiếp theo
    if (statusName === 'cancelled') {
      timeline.push({
        status: 'Đã hủy',
        date: order.cancelledAt ? formatDate(order.cancelledAt) : '',
        completed: true
      });
    } else {
      // Confirmed
      timeline.push({
        status: 'Đã xác nhận',
        date: statusName !== 'pending' && order.createdAt ? formatDate(order.createdAt) : '',
        completed: ['confirmed', 'processing', 'shipped', 'delivered'].includes(statusName)
      });

      // Shipping
      timeline.push({
        status: 'Đang giao hàng',
        date: '',
        completed: ['shipped', 'delivered'].includes(statusName)
      });

      // Delivered
      timeline.push({
        status: 'Đã giao hàng',
        date: order.deliveredAt ? formatDate(order.deliveredAt) : '',
        completed: statusName === 'delivered'
      });
    }

    return timeline;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử đơn hàng</h1>
          <p className="text-gray-600">Quản lý và theo dõi tất cả đơn hàng của bạn</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {Object.entries(statusConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedStatus(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedStatus === key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loadingHistory ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">⏳</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Đang tải lịch sử đơn hàng...</h3>
            <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedStatus !== 'all'
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Bạn chưa có đơn hàng nào'}
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Khám phá sản phẩm
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900">Đơn hàng #{order._id}</h3>
                          {getStatusBadge(getStatusName(order.orderStatusId))}
                        </div>
                        <p className="text-sm text-gray-500">
                          Đặt ngày: {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Tổng tiền</p>
                        <p className="text-xl font-bold text-blue-600">{formatPrice(order.totalPrice)}</p>
                      </div>
                      <button
                        onClick={() => toggleOrderDetails(order._id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {expandedOrder === order._id ? (
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="space-y-3">
                    {(order.orderDetails || []).map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <img
                          src={item.productImage || item.productId?.images?.[0] || '/placeholder-product.jpg'}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.productName}</h4>
                          <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order._id && (
                  <div className="border-t border-gray-100 bg-gray-50 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Order Timeline */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Clock className="w-5 h-5 text-blue-600" />
                          Trạng thái đơn hàng
                        </h4>
                        <div className="space-y-4">
                          {generateTimeline(order).map((step, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                step.completed ? 'bg-green-100' : 'bg-gray-200'
                              }`}>
                                {step.completed ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                  <Clock className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                                  {step.status}
                                </p>
                                {step.date && (
                                  <p className="text-sm text-gray-500">{step.date}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery & Payment Info */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Truck className="w-5 h-5 text-blue-600" />
                            Thông tin giao hàng
                          </h4>
                          <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-2">
                            <div>
                              <p className="text-sm text-gray-600">Người nhận:</p>
                              <p className="text-gray-900 font-medium">{order.receiverName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Số điện thoại:</p>
                              <p className="text-gray-900 font-medium">{order.receiverPhone}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Địa chỉ giao hàng:</p>
                              <p className="text-gray-900 font-medium">{order.receiverAddress}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Package className="w-5 h-5 text-blue-600" />
                            Phương thức thanh toán
                          </h4>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-gray-900 font-medium">
                              {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                          {getStatusName(order.orderStatusId) === 'pending' && (
                            <button 
                              onClick={() => {
                                if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
                                  // TODO: Implement cancel order
                                  toast.info('Chức năng hủy đơn hàng đang được phát triển');
                                }
                              }}
                              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                              Hủy đơn hàng
                            </button>
                          )}
                          {getStatusName(order.orderStatusId) === 'delivered' && (
                            <button 
                              onClick={() => {
                                // TODO: Implement reorder
                                toast.info('Chức năng mua lại đang được phát triển');
                              }}
                              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                              Mua lại
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              toast.info('Vui lòng liên hệ: 0123.456.789');
                            }}
                            className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                          >
                            Liên hệ hỗ trợ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}


        {/* Pagination */}
        {historyPagination && historyPagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!historyPagination.hasPrevPage || loadingHistory}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trang trước
            </button>
            <span className="px-4 py-2 text-gray-700">
              Trang {historyPagination.page} / {historyPagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(historyPagination.totalPages, prev + 1))}
              disabled={!historyPagination.hasNextPage || loadingHistory}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trang sau
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrderHistory;

