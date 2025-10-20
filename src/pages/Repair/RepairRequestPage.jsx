import { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { repairServiceListRequest } from "../../redux/actions/repairServiceActions";
import { repairRequestCreateRequest } from "../../redux/actions/repairRequestActions";

const RepairRequestPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const servicesState = useSelector(state => state?.repairService?.list) || { items: [], loading: false, error: null };
  const createState = useSelector(state => state?.repairRequest?.create) || { item: null, loading: false, error: null, message: null };
  //set giá trị mặc định cho form
  const [form, setForm] = useState({
    deviceName: "Laptop",
    deviceBrand: "",
    deviceModel: "",
    serialNumber: "",
    description: "",
    appointmentDate: "",
    services: [],
  });

  const [showError, setShowError] = useState(false);
  //flag để track submit
  const isSubmitting = useRef(false);
// tính tổng tiền dựa trên dịch vụ đã chọn
  const totalPrice = useMemo(() => {
    const map = new Map(servicesState.items.map(s => [s._id, s]));
    return (form.services || []).reduce((sum, id) => sum + (map.get(id)?.basePrice || 0), 0);
  }, [form.services, servicesState.items]);

  useEffect(() => {
    dispatch(repairServiceListRequest());
  }, [dispatch]);

  // Chỉ điều hướng khi đã submit VÀ có item trả về
  useEffect(() => {
    if (isSubmitting.current && createState.item && !createState.loading) {
      navigate('/repair/history');
    }
  }, [createState.item, createState.loading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (showError) setShowError(false);
  };

  const handleServiceToggle = (id) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(id)
        ? prev.services.filter(sid => sid !== id)
        : [...prev.services, id],
    }));
    if (showError) setShowError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!form.deviceBrand || !form.deviceModel || !form.description || !form.appointmentDate || form.services.length === 0) {
      setShowError(true);
      return;
    }

    // Set flag trước khi dispatch
    isSubmitting.current = true;
    dispatch(repairRequestCreateRequest(form));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Đặt lịch sửa chữa</h1>

        {showError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
            <span className="font-medium">Phải nhập đầy đủ thông tin</span>
            <button onClick={() => setShowError(false)} className="text-red-600 hover:text-red-800">
              ✕
            </button>
          </div>
        )}

        {createState.error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <span className="font-medium">{createState.error}</span>
          </div>
        )}

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
                <label className="block text-sm text-gray-600 mb-1">
                  Thương hiệu <span className="text-red-500">*</span>
                </label>
                <input
                  name="deviceBrand"
                  value={form.deviceBrand}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 ${showError && !form.deviceBrand ? 'border-red-500' : ''}`}
                  placeholder="VD: Dell, Asus..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  name="deviceModel"
                  value={form.deviceModel}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 ${showError && !form.deviceModel ? 'border-red-500' : ''}`}
                  placeholder="VD: XPS 13..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Số seri (tuỳ chọn)</label>
                <input name="serialNumber" value={form.serialNumber} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" placeholder="SN..." />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-600 mb-1">
                Mô tả lỗi <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className={`w-full border rounded-lg px-3 py-2 ${showError && !form.description ? 'border-red-500' : ''}`}
                placeholder="Máy bị..."
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-600 mb-1">
                Ngày hẹn <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="appointmentDate"
                value={form.appointmentDate}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 ${showError && !form.appointmentDate ? 'border-red-500' : ''}`}
              />
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-2">
              Chọn dịch vụ <span className="text-red-500">*</span>
            </h2>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${showError && form.services.length === 0 ? 'border-2 border-red-500 rounded-lg p-2' : ''}`}>
              {(servicesState.items || []).map(s => (
                <label key={s._id} className="flex items-center gap-3 border rounded-lg p-3 hover:border-blue-300 cursor-pointer">
                  <input type="checkbox" checked={form.services.includes(s._id)} onChange={() => handleServiceToggle(s._id)} className="cursor-pointer" />
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

            <button
              type="submit"
              disabled={createState.loading}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {createState.loading ? 'Đang gửi...' : 'Gửi yêu cầu sửa chữa'}
            </button>
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