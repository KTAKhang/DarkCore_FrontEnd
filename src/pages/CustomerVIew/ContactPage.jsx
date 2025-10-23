import { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { contactCreateRequest, contactListRequest } from "../../redux/actions/contactActions";

const ContactPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createState = useSelector(state => state.contact) || {};
  const { creating, error, current } = createState;

  const [form, setForm] = useState({
    subject: "",
    reason: "",
    priority: "Medium",
    message: "",
  });

  const [showError, setShowError] = useState(false);
  const isSubmitting = useRef(false);

  useEffect(() => {
    // Redirect hoặc reset form sau khi tạo contact thành công
    if (isSubmitting.current && current && !creating) {
      navigate("/customer/contact/history");
    }
  }, [current, creating, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (showError) setShowError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.subject || !form.reason || !form.message) {
      setShowError(true);
      return;
    }

    isSubmitting.current = true;
    dispatch(contactCreateRequest(form));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Liên hệ với chúng tôi</h1>

        {showError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
            <span className="font-medium">Vui lòng nhập đầy đủ thông tin</span>
            <button onClick={() => setShowError(false)} className="text-red-600 hover:text-red-800">
              ✕
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Chủ đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="VD: Yêu cầu hỗ trợ"
              className={`w-full border rounded-lg px-3 py-2 ${showError && !form.subject ? "border-red-500" : ""}`}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Loại vấn đề <span className="text-red-500">*</span>
            </label>
            <select
              name="reason"
              value={form.reason}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 ${showError && !form.reason ? "border-red-500" : ""}`}
            >
              <option value="">-- Chọn loại vấn đề --</option>
              <option value="Order">Order</option>
              <option value="Product">Product</option>
              <option value="Service">Service</option>
              <option value="Warranty">Warranty</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Mức độ ưu tiên
            </label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="High">Cao</option>
              <option value="Medium">Trung bình</option>
              <option value="Low">Thấp</option>
            </select>
          </div> */}

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Nội dung liên hệ <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={6}
              placeholder="Nhập nội dung..."
              className={`w-full border rounded-lg px-3 py-2 ${showError && !form.message ? "border-red-500" : ""}`}
            />
          </div>

          <button
            type="submit"
            disabled={creating}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {creating ? "Đang gửi..." : "Gửi liên hệ"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
