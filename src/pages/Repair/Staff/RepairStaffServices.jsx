import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { repairServiceListRequest, repairServiceCreateRequest, repairServiceUpdateRequest, repairServiceDeleteRequest } from "../../../redux/actions/repairServiceActions";
import { Plus, Edit, Trash2, Package } from "lucide-react";

const RepairStaffServices = () => {
  const dispatch = useDispatch();
  const list = useSelector(s => s?.repairService?.list) || { items: [], loading: false, error: null };
  const create = useSelector(s => s?.repairService?.create) || { loading: false };
  const update = useSelector(s => s?.repairService?.update) || { loading: false };
  const remove = useSelector(s => s?.repairService?.remove) || { loading: false };
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: ''
  });

  useEffect(() => {
    dispatch(repairServiceListRequest());
  }, [dispatch]);

  // Refresh list after create/update/delete success
  useEffect(() => {
    if (create.success || update.success || remove.success) {
      dispatch(repairServiceListRequest());
    }
  }, [create.success, update.success, remove.success, dispatch]);

  const handleAdd = () => {
    setShowAddForm(true);
    setEditingService(null);
    setFormData({ name: '', description: '', basePrice: '' });
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      basePrice: service.basePrice.toString()
    });
    setShowAddForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingService) {
      dispatch(repairServiceUpdateRequest(editingService._id, { 
        ...formData, 
        basePrice: Number(formData.basePrice) 
      }));
    } else {
      dispatch(repairServiceCreateRequest({ 
        ...formData, 
        basePrice: Number(formData.basePrice) 
      }));
    }
    setFormData({ name: '', description: '', basePrice: '' });
    setEditingService(null);
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingService(null);
    setFormData({ name: '', description: '', basePrice: '' });
  };

  const handleDelete = (serviceId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      dispatch(repairServiceDeleteRequest(serviceId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Repair Services</h1>
          <p className="text-gray-600 mt-1">Quản lý các dịch vụ sửa chữa</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm dịch vụ
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingService ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên dịch vụ</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá cơ bản (₫)</label>
              <input
                type="number"
                value={formData.basePrice}
                onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={create.loading || update.loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {create.loading || update.loading ? 'Đang xử lý...' : (editingService ? 'Cập nhật' : 'Thêm')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading */}
      {list.loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      )}

      {/* Error */}
      {list.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{list.error}</div>
        </div>
      )}

      {/* Services List */}
      {!list.loading && !list.error && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Danh sách dịch vụ</h2>
          </div>
          
          {list.items?.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có dịch vụ nào</h3>
              <p className="text-gray-600">Hãy thêm dịch vụ đầu tiên để bắt đầu.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {list.items?.map(service => (
                    <tr key={service._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{service.description || 'Không có mô tả'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-blue-600">
                          {new Intl.NumberFormat('vi-VN').format(service.basePrice)}₫
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(service)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(service._id)}
                            disabled={remove.loading}
                            className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default RepairStaffServices;
