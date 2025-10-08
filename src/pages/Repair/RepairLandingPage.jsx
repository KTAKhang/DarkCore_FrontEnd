import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { repairServiceListRequest } from "../../redux/actions/repairServiceActions";

const RepairLandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const servicesState = useSelector(s => s?.repairService?.list) || { items: [], loading: false, error: null };

  useEffect(() => {
    dispatch(repairServiceListRequest());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold mb-3">Dịch vụ sửa chữa chuyên nghiệp</h1>
          <p className="text-blue-100 mb-4">Chẩn đoán nhanh, báo giá rõ ràng, kỹ thuật viên giàu kinh nghiệm.</p>
          <button onClick={() => navigate('/repair/create')} className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50">Tạo yêu cầu sửa chữa</button>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Bảng giá dịch vụ</h2>
          {servicesState.loading && <div>Đang tải dịch vụ...</div>}
          {servicesState.error && <div className="text-red-600">{servicesState.error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(servicesState.items || []).map(s => (
              <div key={s._id} className="border rounded-xl p-4 hover:shadow-md flex flex-col h-full">
                <div className="font-semibold text-gray-900">{s.name}</div>
                <div className="text-sm text-gray-600 mt-1 flex-grow">{s.description}</div>
                <div className="mt-3 text-blue-600 font-bold">{new Intl.NumberFormat('vi-VN').format(s.basePrice)}₫</div>
                <button onClick={() => navigate('/repair/create')} className="mt-4 w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50">Chọn và tạo yêu cầu</button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RepairLandingPage;


