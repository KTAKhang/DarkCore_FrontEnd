import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { repairServiceListRequest } from "../../redux/actions/repairServiceActions";
import { repairRequestCreateRequest } from "../../redux/actions/repairRequestActions";

const RepairRequestPage = () => {
  const dispatch = useDispatch();
  const servicesState = useSelector(state => state?.repairService?.list) || { items: [], loading: false, error: null };

  const [form, setForm] = useState({
    deviceName: "Laptop",
    deviceBrand: "",
    deviceModel: "",
    serialNumber: "",
    description: "",
    appointmentDate: "",
    services: [],
  });

  const totalPrice = useMemo(() => {
    const map = new Map(servicesState.items.map(s => [s._id, s]));
    return (form.services || []).reduce((sum, id) => sum + (map.get(id)?.basePrice || 0), 0);
  }, [form.services, servicesState.items]);

  useEffect(() => {
    dispatch(repairServiceListRequest());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (id) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(id)
        ? prev.services.filter(sid => sid !== id)
        : [...prev.services, id],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.deviceBrand || !form.deviceModel || !form.description || !form.appointmentDate || form.services.length === 0) return;
    dispatch(repairRequestCreateRequest(form));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Đặt lịch sửa chữa</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Thông tin thiết bị</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Loại thiết bị</label>
                <select name="deviceName" value={form.deviceName} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                  <option>Laptop</option>
                  <option>PC</option>
                  <option>Printer</option>
                  <option>Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Thương hiệu</label>
                <input name="deviceBrand" value={form.deviceBrand} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" placeholder="VD: Dell, Asus..." />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Model</label>
                <input name="deviceModel" value={form.deviceModel} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" placeholder="VD: XPS 13..." />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Số seri (tuỳ chọn)</label>
                <input name="serialNumber" value={form.serialNumber} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" placeholder="SN..." />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-600 mb-1">Mô tả lỗi</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full border rounded-lg px-3 py-2" placeholder="Máy bị..." />
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-600 mb-1">Ngày hẹn</label>
              <input type="datetime-local" name="appointmentDate" value={form.appointmentDate} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-2">Chọn dịch vụ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(servicesState.items || []).map(s => (
                <label key={s._id} className="flex items-center gap-3 border rounded-lg p-3 hover:border-blue-300">
                  <input type="checkbox" checked={form.services.includes(s._id)} onChange={() => handleServiceToggle(s._id)} />
                  <div className="flex-1">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-sm text-gray-500">{s.description}</div>
                  </div>
                  <div className="text-blue-600 font-semibold">{new Intl.NumberFormat('vi-VN').format(s.basePrice)}₫</div>
                </label>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-gray-700">Tổng tạm tính:</div>
              <div className="text-2xl font-bold text-blue-600">{new Intl.NumberFormat('vi-VN').format(totalPrice)}₫</div>
            </div>

            <button type="submit" className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Gửi yêu cầu sửa chữa</button>
          </form>

          <aside className="bg-blue-50 rounded-xl p-6 h-fit">
            <h3 className="text-lg font-semibold mb-2">Lợi ích khi đặt lịch</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Tư vấn miễn phí</li>
              <li>Đặt lịch nhanh chóng</li>
              <li>Báo giá minh bạch</li>
              <li>Bảo hành dịch vụ</li>
            </ul>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RepairRequestPage;


