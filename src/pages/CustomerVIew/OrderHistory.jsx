import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Package, Truck, CheckCircle, XCircle, Clock, Eye, Search } from 'lucide-react';
import { orderHistoryRequest, orderClearMessages } from '../../redux/actions/orderActions';
import Footer from '../../components/Footer/Footer';
import OrderHistoryDetails from './OrderHistoryDetails';

const OrderHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest'); // newest (mới nhất) hoặc oldest (cũ nhất)

  // Lấy user từ localStorage
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const userId = storedUser?._id || storedUser?.id;

  // Lấy data từ Redux
  const { history, loadingHistory, error, success, historyPagination } = useSelector((state) => state.order || {});

  // Load orders khi component mount hoặc khi filter/page/sort thay đổi (với debounce cho search)
  useEffect(() => {
    if (!userId) return;

    // Reset page về 1 khi filter/search/sort thay đổi (trừ khi đang ở trang 1)
    let targetPage = currentPage;
    if (currentPage !== 1 && (selectedStatus !== 'all' || searchTerm.trim() || sortBy !== 'newest')) {
      // Nếu filter thay đổi, reset về trang 1
      targetPage = 1;
      setCurrentPage(1);
    }

    const query = {
      page: targetPage,
      limit: 10,
    };

    // Thêm filter theo status nếu có
    if (selectedStatus !== 'all') {
      // Map 'shipping' thành 'shipped' để match với backend
      // Backend dùng 'shipped' nhưng UI filter dùng 'shipping'
      const statusForBackend = selectedStatus === 'shipping' ? 'shipped' : selectedStatus;
      query.status = statusForBackend;
    }

    // Thêm search nếu có (server-side search)
    if (searchTerm.trim()) {
      query.search = searchTerm.trim();
    }

    // Thêm sort (theo createdAt)
    if (sortBy === 'newest') {
      query.sortBy = 'createdat';
      query.sortOrder = 'desc';
    } else if (sortBy === 'oldest') {
      query.sortBy = 'createdat';
      query.sortOrder = 'asc';
    }

    // Debounce search để tránh gọi API quá nhiều khi user đang gõ
    const timeoutId = setTimeout(() => {
      dispatch(orderHistoryRequest(userId, query));
    }, searchTerm.trim() ? 500 : 0); // Delay 500ms nếu có search term

    return () => clearTimeout(timeoutId);
  }, [dispatch, userId, selectedStatus, currentPage, searchTerm, sortBy]);

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
    processing: { label: 'Đang xử lý', color: 'blue', icon: Clock },
    shipping: { label: 'Đang giao', color: 'purple', icon: Truck },
    delivered: { label: 'Đã giao', color: 'green', icon: CheckCircle },
    cancelled: { label: 'Đã hủy', color: 'red', icon: XCircle },
    returned: { label: 'Đã trả hàng', color: 'red', icon: XCircle }
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
    // Map 'shipped' thành 'shipping' nếu backend trả về 'shipped' (để tương thích)
    const statusKey = status === 'shipped' ? 'shipping' : status;
    const config = statusConfig[statusKey] || { label: status || 'N/A', color: 'gray' };
    const colorClasses = {
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      blue: 'bg-blue-100 text-blue-700 border-blue-300',
      purple: 'bg-purple-100 text-purple-700 border-purple-300',
      green: 'bg-green-100 text-green-700 border-green-300',
      red: 'bg-red-100 text-red-700 border-red-300',
      gray: 'bg-gray-100 text-gray-700 border-gray-300'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorClasses[config.color] || colorClasses.gray}`}>
        {config.label}
      </span>
    );
  };

  // Lấy status name từ orderStatusId object
  const getStatusName = (orderStatusId) => {
    if (!orderStatusId) return 'pending';
    if (typeof orderStatusId === 'string') return orderStatusId;
    
    // Lấy name từ orderStatusId object
    const statusName = orderStatusId.name || 'pending';
    
    // Map 'shipped' thành 'shipping' nếu backend trả về 'shipped' (để tương thích)
    if (statusName === 'shipped') return 'shipping';
    
    return statusName;
  };

  // Không cần client-side filtering nữa vì backend đã xử lý search
  const filteredOrders = history || [];

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const closeOrderDetails = () => {
    setIsDetailsOpen(false);
    setSelectedOrder(null);
  };

  // Helper để validate và lấy ảnh hợp lệ
  const getValidImageUrl = (item) => {
    const imageUrl = item.productImage || item.productId?.images?.[0];

    // Kiểm tra nếu là URL giả từ example.com
    if (imageUrl && !imageUrl.includes('example.com')) {
      return imageUrl;
    }

    // Fallback về placeholder
    return 'https://via.placeholder.com/64x64?text=No+Image';
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="container mx-auto px-4 py-8 flex-1">
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
                  placeholder="Tìm kiếm theo mã đơn hàng hoặc tên người nhận..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {Object.entries(statusConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedStatus(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedStatus === key
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
                ? 'Không tìm thấy đơn hàng phù hợp. Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
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
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Tổng tiền</p>
                      <p className="text-xl font-bold text-blue-600">{formatPrice(order.totalPrice)}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <button
                      onClick={() => openOrderDetails(order)}
                      className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      Xem chi tiết
                    </button>
                    {getStatusName(order.orderStatusId) === 'delivered' && (
                      <button
                        onClick={() => {
                          navigate(`/customer/review/${order._id}`, {
                            orderData: history,
                          });
                        }}
                        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Đánh giá đơn hàng
                      </button>
                    )}
                  </div>

                  {/* Order Items Preview */}
                  <div className="space-y-3">
                    {(order.orderDetails || []).map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <img
                          src={getValidImageUrl(item)}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            if (e.target.src !== 'https://via.placeholder.com/64x64?text=No+Image') {
                              e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                            }
                          }}
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

        {/* Order Details Modal */}
        <OrderHistoryDetails
          isOpen={isDetailsOpen}
          onClose={closeOrderDetails}
          order={selectedOrder}
        />
      </main>
      <Footer />
    </div>
  );
};

export default OrderHistory;

