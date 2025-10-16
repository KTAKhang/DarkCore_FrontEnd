import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Search,
  Calendar,
  Percent,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import {
  discountListRequest,
  discountDeactivateRequest,
  discountClearMessages,
} from '@/redux/actions/discountActions';
import DiscountModal from '@/components/DiscountModal';

const AdminDiscountPage = () => {
  const dispatch = useDispatch();
  const { items, loadingList, error, success, deactivating } = useSelector((state) => state.discount);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [viewingDiscount, setViewingDiscount] = useState(null);

  useEffect(() => {
    dispatch(discountListRequest());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(discountClearMessages());
    }
    if (success) {
      toast.success(success);
      dispatch(discountClearMessages());
    }
  }, [error, success, dispatch]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const isActive = (discount) => {
    const now = new Date();
    return discount.isActive && 
           now >= new Date(discount.startDate) && 
           now <= new Date(discount.endDate);
  };

  const handleCreate = () => {
    setEditingDiscount(null);
    setViewingDiscount(null);
    setIsModalOpen(true);
  };

  const handleEdit = (discount) => {
    setEditingDiscount(discount);
    setViewingDiscount(null);
    setIsModalOpen(true);
  };

  const handleView = (discount) => {
    setViewingDiscount(discount);
    setEditingDiscount(null);
    setIsModalOpen(true);
  };

  const handleDeactivate = (discount) => {
    if (window.confirm(`Bạn có chắc chắn muốn vô hiệu hóa mã "${discount.code}"?`)) {
      dispatch(discountDeactivateRequest(discount._id));
    }
  };

  const filteredDiscounts = items.filter(discount =>
    discount.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý mã giảm giá</h1>
          <p className="text-gray-600">Tạo và quản lý các mã giảm giá cho khách hàng</p>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm mã giảm giá..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tạo mã giảm giá
            </button>
          </div>
        </div>

        {/* Loading */}
        {loadingList && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Đang tải danh sách...</h3>
          </div>
        )}

        {/* Table */}
        {!loadingList && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã giảm giá
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phần trăm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đơn tối thiểu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giới hạn tối đa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDiscounts.map((discount) => (
                    <tr key={discount._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {discount.code}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Percent className="w-4 h-4 mr-1 text-green-500" />
                          {discount.discountPercent}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <DollarSign className="w-4 h-4 mr-1 text-blue-500" />
                          {formatPrice(discount.minOrderValue)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <DollarSign className="w-4 h-4 mr-1 text-red-500" />
                          {discount.maxDiscountAmount ? formatPrice(discount.maxDiscountAmount) : 'Không giới hạn'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                            <span className="text-xs">Từ: {formatDate(discount.startDate)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-gray-400" />
                            <span className="text-xs">Đến: {formatDate(discount.endDate)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {isActive(discount) ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Đang hoạt động
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle className="w-3 h-3 mr-1" />
                              Không hoạt động
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(discount)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(discount)}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeactivate(discount)}
                            disabled={deactivating || !discount.isActive}
                            className="text-red-600 hover:text-red-900 p-1 rounded disabled:opacity-50"
                            title="Vô hiệu hóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDiscounts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎫</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {searchTerm ? 'Không tìm thấy mã giảm giá' : 'Chưa có mã giảm giá nào'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Tạo mã giảm giá đầu tiên để bắt đầu'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={handleCreate}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Tạo mã giảm giá
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        <DiscountModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingDiscount(null);
            setViewingDiscount(null);
          }}
          discount={editingDiscount || viewingDiscount}
          isViewMode={!!viewingDiscount}
          onSuccess={() => {
            setIsModalOpen(false);
            setEditingDiscount(null);
            setViewingDiscount(null);
            dispatch(discountListRequest());
          }}
        />
      </div>
    </div>
  );
};

export default AdminDiscountPage;
