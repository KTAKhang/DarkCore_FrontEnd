import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { repairRequestListAssignedRequest } from "../../../redux/actions/repairRequestActions";
import { ClipboardList, CheckCircle, Clock, AlertCircle, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";

const RepairStaffDashboard = () => {
  const dispatch = useDispatch();
  const state = useSelector(s => s?.repairRequest?.listAssigned) || { items: [], loading: false, pagination: null };

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  // Load data with pagination
  const loadData = () => {
    dispatch(repairRequestListAssignedRequest({ page: currentPage, limit: pageSize }));
  };

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (!state.pagination) return null;

    const { page, totalPages } = state.pagination;
    const pages = [];
    
    // Show page numbers
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md text-sm ${
            i === page
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Hiển thị {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, state.pagination.total)} trong tổng số {state.pagination.total} công việc
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="p-2 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {pages}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-2 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const pendingJobs = state.items?.filter(item => item.status === 'in-progress') || [];
  const completedJobs = state.items?.filter(item => item.status === 'completed') || [];
  const waitingJobs = state.items?.filter(item => item.status === 'waiting') || [];
  const totalJobs = state.items?.length || 0;

  const completionRate = totalJobs > 0 ? Math.round((completedJobs.length / totalJobs) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Tổng quan công việc sửa chữa</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Jobs */}
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardList className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng công việc</p>
                <p className="text-2xl font-semibold text-gray-900">{totalJobs}</p>
              </div>
            </div>
          </div>
          {/* Pending Jobs */}
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang xử lý</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingJobs.length}</p>
              </div>
            </div>
          </div>

          {/* Completed Jobs */}
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
                <p className="text-2xl font-semibold text-gray-900">{completedJobs.length}</p>
              </div>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tỷ lệ hoàn thành</p>
                <p className="text-2xl font-semibold text-gray-900">{completionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Công việc gần đây</h2>
          </div>
          
          {state.loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Đang tải...</p>
            </div>
          ) : state.items?.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có công việc nào</h3>
              <p className="text-gray-600">Bạn chưa được giao công việc sửa chữa nào.</p>
            </div>
          ) : (
            <div className="divide-y">
              {state.items?.slice(0, 5).map((job) => {
                const getStatusInfo = (status) => {
                  switch (status) {
                    case 'waiting':
                      return { color: 'bg-yellow-100 text-yellow-800', text: 'Chờ xử lý' };
                    case 'in-progress':
                      return { color: 'bg-blue-100 text-blue-800', text: 'Đang xử lý' };
                    case 'completed':
                      return { color: 'bg-green-100 text-green-800', text: 'Hoàn thành' };
                    case 'canceled':
                      return { color: 'bg-red-100 text-red-800', text: 'Đã hủy' };
                    default:
                      return { color: 'bg-gray-100 text-gray-800', text: status };
                  }
                };
                
                const statusInfo = getStatusInfo(job.status);
                
                return (
                  <div key={job._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {job.deviceBrand} {job.deviceModel}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.text}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Khách hàng:</span> {job.user?.user_name || job.user?.email}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Lịch hẹn:</span> {new Date(job.appointmentDate).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-blue-600">
                          {new Intl.NumberFormat('vi-VN').format(job.estimatedCost)}₫
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
};

export default RepairStaffDashboard;
