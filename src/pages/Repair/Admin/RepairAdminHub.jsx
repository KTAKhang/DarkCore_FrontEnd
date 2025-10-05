import { useNavigate } from "react-router-dom";

const RepairAdminHub = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Repair Service</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={() => navigate('/admin/repair/requests')} className="border rounded-lg p-6 text-left hover:border-blue-400">
          <div className="text-xl font-semibold">Danh sách yêu cầu</div>
          <div className="text-gray-600">Xem và quản lý các yêu cầu sửa chữa</div>
        </button>
        <button onClick={() => navigate('/admin/repair/services')} className="border rounded-lg p-6 text-left hover:border-blue-400">
          <div className="text-xl font-semibold">Dịch vụ & Bảng giá</div>
          <div className="text-gray-600">Xem các dịch vụ sửa chữa</div>
        </button>
      </div>
    </div>
  );
};

export default RepairAdminHub;


