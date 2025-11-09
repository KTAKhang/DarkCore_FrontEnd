import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { staffListRequest } from "../../../redux/actions/staffActions";
import { 
  repairRequestAssignRequest, 
  repairRequestStatusUpdateRequest, 
  repairRequestListAllRequest 
} from "../../../redux/actions/repairRequestActions";
import { ArrowLeft, User, Calendar, Wrench, CheckCircle, Clock, AlertCircle } from "lucide-react";
import axios from "axios";

const API_BASE_URL = 'http://localhost:3000';
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { accept: 'application/json', 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const RepairAdminRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const staffSlice = useSelector(s => s?.staff) || {};
  const staffList = Array.isArray(staffSlice.list) ? staffSlice.list : (staffSlice.list?.data || []);
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/repair/api/repairs/${id}`, { headers: getAuthHeaders() });
      if (res.data?.status === 'OK') setItem(res.data.data);
      else setError(res.data?.message || 'Không tải được chi tiết');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
    dispatch(staffListRequest({ role: 'repair-staff', page: 1, limit: 100 }));
  }, [id, dispatch]);

  const handleAssign = (technicianId) => {
    dispatch(repairRequestAssignRequest(id, technicianId));
    setTimeout(() => {
      loadDetail();
      dispatch(repairRequestListAllRequest());
    }, 500);
  };

  const handleStatus = (status) => {
    // Show confirmation for completed status
    if (status === 'completed') {
      if (!window.confirm('⚠️ Xác nhận hoàn thành?\n\nSau khi hoàn thành, trạng thái sẽ bị khóa và không thể thay đổi.\nEmail thông báo sẽ được gửi đến khách hàng.')) {
        return;
      }
    }
    
    dispatch(repairRequestStatusUpdateRequest(id, status));
    setTimeout(() => {
      loadDetail();
      dispatch(repairRequestListAllRequest());
    }, 500);
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "waiting":
        return { text: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-4 w-4" /> };
      case "in-progress":
        return { text: "Đang xử lý", color: "bg-blue-100 text-blue-800", icon: <Wrench className="h-4 w-4" /> };
      case "completed":
        return { text: "Hoàn thành", color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-4 w-4" /> };
      case "canceled":
        return { text: "Đã hủy", color: "bg-red-100 text-red-800", icon: <AlertCircle className="h-4 w-4" /> };
      default:
        return { text: status, color: "bg-gray-100 text-gray-800", icon: <AlertCircle className="h-4 w-4" /> };
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">{error}</div>
        <button 
          onClick={() => navigate('/admin/repairs')}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Quay lại
        </button>
      </div>
    );
  }

  if (!item) return null;

  const statusInfo = getStatusInfo(item.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/repair/requests')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết yêu cầu sửa chữa</h1>
            <p className="text-gray-600">{item.deviceBrand} {item.deviceModel}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Device Info */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin thiết bị</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><span className="font-medium">Tên thiết bị:</span> {item.deviceName}</div>
                <div><span className="font-medium">Thương hiệu:</span> {item.deviceBrand}</div>
                <div><span className="font-medium">Model:</span> {item.deviceModel}</div>
                <div><span className="font-medium">Serial:</span> {item.serialNumber || "-"}</div>
              </div>
              <div className="mt-4">
                <span className="font-medium">Mô tả:</span> <p>{item.description}</p>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dịch vụ sửa chữa</h2>
              <div className="space-y-3">
                {(item.services || []).map(service => (
                  <div key={service._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                    </div>
                    <div className="text-blue-600 font-semibold">
                      {new Intl.NumberFormat('vi-VN').format(service.basePrice)}₫
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Tổng cộng:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {new Intl.NumberFormat('vi-VN').format(item.estimatedCost)}₫
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái</h2>
              <div className="flex items-center space-x-2 mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                  {statusInfo.icon}
                  <span className="ml-1">{statusInfo.text}</span>
                </span>
              </div>
              <div className="space-y-2">
                {item.status === 'completed' ? (
                  <div className="text-center py-2">
                    <div className="text-green-600 font-medium">✓ Đã hoàn thành</div>
                    <div className="text-gray-500 text-sm mt-1">Trạng thái đã bị khóa</div>
                  </div>
                ) : (
                  <>
                    <button onClick={() => handleStatus("in-progress")} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center">
                      <Wrench className="h-4 w-4 mr-2" /> Chuyển đang xử lý
                    </button>
                    <button onClick={() => handleStatus("completed")} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 mr-2" /> Hoàn thành
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Assign technician */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Phân công kỹ thuật viên</h2>
              <select onChange={(e) => handleAssign(e.target.value)} defaultValue="" className="w-full border rounded-lg px-3 py-2">
                <option value="" disabled>Chọn kỹ thuật viên</option>
                {staffList
                  .filter(u => (u.role?.name || u.role_name || "").includes("repair-staff") || u.role === "repair-staff")
                  .map(u => (
                    <option key={u._id || u.id} value={u._id || u.id}>
                      {u.user_name || u.name || u.email}
                    </option>
                  ))}
              </select>
            </div>

            {/* Customer */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin khách hàng</h2>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  {item.user?.user_name || item.user?.email}
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  {new Date(item.appointmentDate).toLocaleString("vi-VN")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default RepairAdminRequestDetail;
