import React, { useEffect, useState } from "react";

const StaffForm = ({ initialData = null, onClose, onSubmit }) => {
  const [user_name, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("sales-staff"); // mặc định allowed role

  useEffect(() => {
    if (initialData) {
      setUserName(initialData.user_name || initialData.name || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setAddress(initialData.address || "");
      setRole(initialData.role || initialData.role_name || "sales-staff");
    } else {
      setPassword("");
    }
  }, [initialData]);

  const submit = (e) => {
    e.preventDefault();
    const payload = { user_name, email, phone, address, role };
    // Khi tạo cần password; khi edit không bắt buộc
    if (!initialData) payload.password = password;
    onSubmit(payload, initialData ? (initialData._id || initialData.id) : null);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content p-3" style={{ maxWidth: 640, margin: "30px auto", background: "#fff" }}>
        <h5>{initialData ? "Sửa nhân viên" : "Tạo nhân viên"}</h5>
        <form onSubmit={submit}>
          <div className="mb-2">
            <label>Họ tên</label>
            <input className="form-control" value={user_name} onChange={e=>setUserName(e.target.value)} required />
          </div>
          <div className="mb-2">
            <label>Email</label>
            <input className="form-control" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          {!initialData && (
            <div className="mb-2">
              <label>Mật khẩu</label>
              <input className="form-control" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            </div>
          )}
          <div className="mb-2">
            <label>Phone</label>
            <input className="form-control" value={phone} onChange={e=>setPhone(e.target.value)} required />
          </div>
          <div className="mb-2">
            <label>Địa chỉ</label>
            <input className="form-control" value={address} onChange={e=>setAddress(e.target.value)} required />
          </div>
          <div className="mb-2">
            <label>Vai trò</label>
            <select className="form-select" value={role} onChange={e=>setRole(e.target.value)}>
              <option value="sales-staff">sales-staff</option>
              <option value="repair-staff">repair-staff</option>
            </select>
          </div>
          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary me-2" onClick={onClose}>Hủy</button>
            <button className="btn btn-primary" type="submit">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffForm;