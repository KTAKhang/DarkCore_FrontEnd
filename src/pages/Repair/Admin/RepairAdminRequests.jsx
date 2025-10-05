import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { repairRequestListAllRequest } from "../../../redux/actions/repairRequestActions";

const RepairAdminRequests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector(s => s?.repairRequest?.listAll) || { items: [], loading: false, error: null };
  
  const [searchParams, setSearchParams] = useState({
    username: '',
    status: ''
  });

  const handleSearch = () => {
    dispatch(repairRequestListAllRequest(searchParams));
  };

  const handleReset = () => {
    const resetParams = { username: '', status: '' };
    setSearchParams(resetParams);
    dispatch(repairRequestListAllRequest(resetParams));
  };

  useEffect(() => {
    dispatch(repairRequestListAllRequest());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách yêu cầu sửa chữa</h1>
      
      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm theo tên khách hàng</label>
            <input
              type="text"
              placeholder="Nhập tên khách lại hoặc email..."
              value={searchParams.username}
              onChange={(e) => setSearchParams({...searchParams, username: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lọc theo trạng thái</label>
            <select
              value={searchParams.status}
              onChange={(e) => setSearchParams({...searchParams, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="waiting">Chờ xử lý</option>
              <option value="in-progress">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="canceled">Đã hủy</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Tìm kiếm
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Đặt lại
            </button>
          </div>
        </div>
      </div>
      
      {state.loading && <div className="text-center py-4">Đang tải...</div>}
      {state.error && <div className="text-red-600 bg-red-50 p-3 rounded-md mb-4">{state.error}</div>}
      {!state.loading && !state.error && (!state.items || state.items.length === 0) && (
        <div className="text-center py-8 text-gray-500">Không có dữ liệu để hiển thị</div>
      )}
      <div className="overflow-x-auto bg-white rounded-xl border">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">Khách hàng</th>
              <th className="p-3">Thiết bị</th>
              <th className="p-3">Dịch vụ</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Kỹ thuật</th>
              <th className="p-3">Ước tính</th>
              <th className="p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {(state.items || []).map(item => (
              <tr key={item._id} className="border-t">
                <td className="p-3">{item.user?.user_name || item.user?.email}</td>
                <td className="p-3">{item.deviceBrand} {item.deviceModel}</td>
                <td className="p-3">{(item.services || []).map(s => s.name).join(", ")}</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded text-xs bg-gray-100">{item.status}</span>
                </td>
                <td className="p-3">{item.assignedTechnician?.user_name || '-'}</td>
                <td className="p-3 text-blue-600 font-semibold">{new Intl.NumberFormat('vi-VN').format(item.estimatedCost)}₫</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => navigate(`/admin/repair/requests/${item._id}`)} className="border px-3 py-1 rounded hover:bg-gray-50">Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepairAdminRequests;


