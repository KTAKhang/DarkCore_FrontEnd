import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { repairRequestListAssignedRequest } from "../../../redux/actions/repairRequestActions";
import { Clock, CheckCircle, AlertCircle, User, Calendar, DollarSign } from "lucide-react";

const RepairStaffJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector(s => s?.repairRequest?.listAssigned) || { items: [], loading: false, error: null };

  useEffect(() => {
    dispatch(repairRequestListAssignedRequest());
  }, [dispatch]);

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

  const pendingJobs = state.items?.filter(item => item.status === 'in-progress') || [];
  const completedJobs = state.items?.filter(item => item.status === 'completed') || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Danh sách công việc</h1>
            <p className="text-gray-600 mt-1">Quản lý các yêu cầu sửa chữa được giao</p>
          </div>
          <div className="flex space-x-4">
            {/* Stats Cards */}
            <div className="bg-white rounded-lg border p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-orange-600">{pendingJobs.length}</div>
              <div className="text-sm text-gray-600">Đang xử lý</div>
            </div>
            <div className="bg-white rounded-lg border p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-green-600">{completedJobs.length}</div>
              <div className="text-sm text-gray-600">Đã hoàn thành</div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {state.loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        )}

        {/* Error */}
        {state.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800">{state.error}</div>
          </div>
        )}

        {/* Jobs List */}
        {!state.loading && !state.error && (
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Công việc được giao</h2>
            </div>

            {state.items?.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có công việc nào</h3>
                <p className="text-gray-600">Bạn chưa được giao công việc sửa chữa nào.</p>
              </div>
            ) : (
              <div className="divide-y">
                {state.items?.map((job) => {
                  const statusInfo = getStatusInfo(job.status);
                  return (
                    <div key={job._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {job.deviceBrand} {job.deviceModel}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                              {statusInfo.icon}
                              <span className="ml-1">{statusInfo.text}</span>
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="h-4 w-4 mr-2" />
                              <span className="font-medium">Khách hàng:</span>
                              <span className="ml-1">{job.user?.user_name || job.user?.email}</span>
                            </div>

                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span className="font-medium">Lịch hẹn:</span>
                              <span className="ml-1">{new Date(job.appointmentDate).toLocaleDateString('vi-VN')}</span>
                            </div>

                            <div className="flex items-center text-sm text-gray-600">
                              <DollarSign className="h-4 w-4 mr-2" />
                              <span className="font-medium">Ước tính:</span>
                              <span className="ml-1 text-blue-600 font-semibold">
                                {new Intl.NumberFormat('vi-VN').format(job.estimatedCost)}₫
                              </span>
                            </div>

                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Dịch vụ:</span>
                              <div className="mt-1">
                                {(job.services || []).map(service => (
                                  <span key={service._id} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-1 mb-1">
                                    {service.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {job.description && (
                            <div className="mt-3">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Mô tả:</span> {job.description}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="ml-4">
                          <button
                            onClick={() => navigate(`/staff/jobs/${job._id}`)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairStaffJobs;
