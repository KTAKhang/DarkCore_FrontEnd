import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { repairServiceListRequest, repairServiceCreateRequest, repairServiceUpdateRequest, repairServiceDeleteRequest } from "../../../redux/actions/repairServiceActions";

const emptyForm = { name: "", description: "", basePrice: 0 };

const RepairAdminServices = () => {
  const dispatch = useDispatch();
  const list = useSelector(s => s?.repairService?.list) || { items: [], loading: false, error: null };
  const create = useSelector(s => s?.repairService?.create) || { loading: false };
  const update = useSelector(s => s?.repairService?.update) || { loading: false };
  const remove = useSelector(s => s?.repairService?.remove) || { loading: false };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { dispatch(repairServiceListRequest()); }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(repairServiceUpdateRequest(editingId, { ...form, basePrice: Number(form.basePrice) }));
    } else {
      dispatch(repairServiceCreateRequest({ ...form, basePrice: Number(form.basePrice) }));
    }
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({ name: item.name, description: item.description || "", basePrice: item.basePrice || 0 });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dịch vụ sửa chữa</h1>

      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input placeholder="Tên dịch vụ" className="border rounded-lg px-3 py-2" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <input placeholder="Mô tả" className="border rounded-lg px-3 py-2" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <input type="number" min={0} placeholder="Giá cơ bản" className="border rounded-lg px-3 py-2" value={form.basePrice} onChange={e => setForm(f => ({ ...f, basePrice: e.target.value }))} required />
        </div>
        <div className="mt-3">
          <button type="submit" disabled={create.loading || update.loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            {editingId ? 'Cập nhật' : 'Tạo mới'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="ml-2 border px-4 py-2 rounded-lg">Hủy</button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto bg-white rounded-xl border">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">Tên</th>
              <th className="p-3">Mô tả</th>
              <th className="p-3">Giá</th>
              <th className="p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {(list.items || []).map(item => (
              <tr key={item._id} className="border-t">
                <td className="p-3 font-medium">{item.name}</td>
                <td className="p-3 text-gray-600">{item.description}</td>
                <td className="p-3 text-blue-600 font-semibold">{new Intl.NumberFormat('vi-VN').format(item.basePrice)}₫</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => handleEdit(item)} className="border px-3 py-1 rounded hover:bg-gray-50">Sửa</button>
                  <button onClick={() => dispatch(repairServiceDeleteRequest(item._id))} disabled={remove.loading} className="border px-3 py-1 rounded hover:bg-gray-50">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepairAdminServices;


