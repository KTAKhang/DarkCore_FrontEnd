import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { repairRequestStatusUpdateRequest } from "../../../redux/actions/repairRequestActions";
import { ArrowLeft, Clock, CheckCircle, AlertCircle, User, Calendar, DollarSign, Wrench } from "lucide-react";
import axios from "axios";

const API_BASE_URL = 'http://localhost:3000';
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { accept: 'application/json', 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const RepairStaffJobDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadJobDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/repair/api/repairs/${id}`, { headers: getAuthHeaders() });
      if (res.data?.status === 'OK') {
        setJob(res.data.data);
      } else {
        setError(res.data?.message || 'Không tải được chi tiết');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
// load chi tiết công việc khi id thay đổi
  useEffect(() => {
    loadJobDetail();
  }, [id]);

  const handleStatusUpdate = (newStatus) => {
    // Show confirmation for completed status
    if (newStatus === 'completed') {
      if (!window.confirm('⚠️ Xác nhận hoàn thành?\n\nSau khi hoàn thành, trạng thái sẽ bị khóa và không thể thay đổi.\nEmail thông báo sẽ được gửi đến khách hàng.')) {
        return;
      }
    }
    
    dispatch(repairRequestStatusUpdateRequest(id, newStatus));
    // Reload after status update
    setTimeout(() => {
      loadJobDetail();
    }, 1000);
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'waiting':
        return { 
          text: 'Chờ xử lý', 
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="h-4 w-4" />
        };
      case 'in-progress':
        return { 
          text: 'Đang xử lý', 
          color: 'bg-blue-100 text-blue-800',
          icon: <AlertCircle className="h-4 w-4" />
        };
      case 'completed':
        return { 
          text: 'Hoàn thành', 
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="h-4 w-4" />
        };
      case 'canceled':
        return { 
          text: 'Đã hủy', 
          color: 'bg-red-100 text-red-800',
          icon: <AlertCircle className="h-4 w-4" />
        };
      default:
        return { 
          text: status, 
          color: 'bg-gray-100 text-gray-800',
          icon: <AlertCircle className="h-4 w-4" />
        };
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
          onClick={() => navigate('/staff/jobs')}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Quay lại
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy công việc</h3>
        <button 
          onClick={() => navigate('/staff/jobs')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const statusInfo = getStatusInfo(job.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/staff/jobs')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Quay lại
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chi tiết công việc</h1>
          <p className="text-gray-600">{job.deviceBrand} {job.deviceModel}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Device Info */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin thiết bị</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Tên thiết bị</label>
                <p className="text-gray-900">{job.deviceName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Thương hiệu</label>
                <p className="text-gray-900">{job.deviceBrand}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Model</label>
                <p className="text-gray-900">{job.deviceModel}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Số series</label>
                <p className="text-gray-900">{job.serialNumber || 'Không có'}</p>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-600">Mô tả vấn đề</label>
              <p className="text-gray-900 mt-1">{job.description}</p>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dịch vụ sửa chữa</h2>
            <div className="space-y-3">
              {(job.services || []).map(service => (
                <div key={service._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                  <div className="text-blue-600 font-semibold">
                    {new Intl.NumberFormat('vi-VN').format(service.basePrice)}₫
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                <span className="text-xl font-bold text-blue-600">
                  {new Intl.NumberFormat('vi-VN').format(job.estimatedCost)}₫
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái</h2>
            <div className="flex items-center space-x-2 mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                {statusInfo.icon}
                <span className="ml-1">{statusInfo.text}</span>
              </span>
            </div>
            
            {/* Status Actions */}
            <div className="space-y-2">
              {job.status === 'in-progress' && (
                <div className="space-y-2">
                  <button
                    onClick={() => handleStatusUpdate('completed')}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Đánh dấu hoàn thành
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('waiting')}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Chuyển về chờ xử lý
                  </button>
                </div>
              )}
              {job.status === 'waiting' && (
                <div className="space-y-2">
                  <button
                    onClick={() => handleStatusUpdate('in-progress')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Wrench className="h-4 w-4 mr-2" />
                    Bắt đầu xử lý
                  </button>
                </div>
              )}
              {job.status === 'completed' && (
                <div className="space-y-2">
                  <div className="text-center py-2">
                    <div className="text-green-600 font-medium">✓ Công việc đã hoàn thành</div>
                    <div className="text-gray-500 text-sm mt-1">Trạng thái đã bị khóa</div>
                  </div>
                </div>
              )}
              {job.status === 'canceled' && (
                <div className="text-center py-2">
                  <div className="text-red-600 font-medium">✗ Công việc đã bị hủy</div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin khách hàng</h2>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                <span className="font-medium text-gray-600">Tên:</span>
                <span className="ml-2 text-gray-900">{job.user?.user_name || job.user?.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span className="font-medium text-gray-600">Lịch hẹn:</span>
                <span className="ml-2 text-gray-900">{new Date(job.appointmentDate).toLocaleString('vi-VN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default RepairStaffJobDetail;
