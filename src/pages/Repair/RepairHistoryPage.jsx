import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const API_BASE_URL = 'http://localhost:3000';
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { accept: 'application/json', 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const RepairHistoryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/repair/api/repairs/me`, { headers: getAuthHeaders() });
        if (res.data?.status === 'OK') setItems(res.data.data || []);
        else setError(res.data?.message || 'Không tải được lịch sử');
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Lịch sử sửa chữa</h1>
        {loading && <div>Đang tải...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && (
          <div className="overflow-x-auto bg-white rounded-xl border">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-3">Ngày tạo</th>
                  <th className="p-3">Thiết bị</th>
                  <th className="p-3">Dịch vụ</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3">Kỹ thuật</th>
                  <th className="p-3">Ước tính</th>
                  <th className="p-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item._id} className="border-t">
                    <td className="p-3">{new Date(item.createdAt).toLocaleString()}</td>
                    <td className="p-3">{item.deviceBrand} {item.deviceModel} ({item.deviceName})</td>
                    <td className="p-3">{(item.services || []).map(s => s.name).join(', ')}</td>
                    <td className="p-3"><span className="px-2 py-1 rounded text-xs bg-gray-100">{item.status}</span></td>
                    <td className="p-3">{item.assignedTechnician?.user_name || '-'}</td>
                    <td className="p-3 text-blue-600 font-semibold">{new Intl.NumberFormat('vi-VN').format(item.estimatedCost)}₫</td>
                    <td className="p-3">
                      <button onClick={() => setSelected(item)} className="border px-3 py-1 rounded hover:bg-gray-50">Chi tiết</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)}></div>
          <div className="relative bg-white w-full max-w-2xl mx-4 rounded-2xl shadow-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Chi tiết yêu cầu sửa chữa</h2>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-sm text-gray-700 space-y-1">
                <div><span className="font-medium">Thiết bị:</span> {selected.deviceBrand} {selected.deviceModel} ({selected.deviceName})</div>
                <div><span className="font-medium">Serial:</span> {selected.serialNumber || '-'}</div>
                <div><span className="font-medium">Lịch hẹn:</span> {new Date(selected.appointmentDate).toLocaleString()}</div>
                <div><span className="font-medium">Trạng thái:</span> <span className="px-2 py-1 rounded text-xs bg-gray-100">{selected.status}</span></div>
                <div><span className="font-medium">Kỹ thuật:</span> {selected.assignedTechnician?.user_name || '-'}</div>
                <div><span className="font-medium">Ước tính:</span> <span className="text-blue-600 font-semibold">{new Intl.NumberFormat('vi-VN').format(selected.estimatedCost)}₫</span></div>
              </div>
              <div>
                <div className="font-medium mb-2">Dịch vụ</div>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 max-h-40 overflow-auto">
                  {(selected.services || []).map(s => (
                    <li key={s._id}>{s.name} - {new Intl.NumberFormat('vi-VN').format(s.basePrice)}₫</li>
                  ))}
                </ul>
                <div className="font-medium mt-4 mb-2">Mô tả lỗi</div>
                <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 max-h-24 overflow-auto">
                  {selected.description}
                </div>
              </div>
            </div>
            <div className="mt-6 text-right">
              <button onClick={() => setSelected(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Đóng</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default RepairHistoryPage;


