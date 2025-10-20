import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const OrderPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);

    // Nhận orderId từ query param (?orderId=...)
    const query = new URLSearchParams(location.search);
    const orderId = query.get("orderId");

    useEffect(() => {
        if (!orderId) {
            toast.error("Không tìm thấy đơn hàng!");
            navigate("/cart");
            return;
        }

        const token = localStorage.getItem("token");
        fetch(`http://localhost:3007/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setOrder(data.order))
            .catch(() => toast.error("Không tải được thông tin đơn hàng"));
    }, [orderId, navigate]);

    const handlePay = async () => {
        if (!phone || !address) {
            toast.error("Vui lòng nhập đầy đủ địa chỉ và số điện thoại");
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            // 🧩 Gọi API cập nhật thông tin nhận hàng
            await fetch(`http://localhost:3007/api/orders/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    receiverAddress: address,
                    receiverPhone: phone,
                    note,
                }),
            });

            // 🧾 Tạo liên kết thanh toán VNPay
            const payRes = await fetch(
                "http://localhost:3007/api/payment/vnpay/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        orderId,
                        amount: order?.totalPrice || 0,
                    }),
                }
            );

            const payData = await payRes.json();

            if (payData?.paymentUrl) {
                window.location.href = payData.paymentUrl;
            } else {
                toast.error("Không tạo được liên kết thanh toán");
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi thanh toán VNPay");
        } finally {
            setLoading(false);
        }
    };

    if (!order)
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-gray-800">Đang tải đơn hàng...</h2>
            </div>
        );

    return (
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Xác nhận đơn hàng</h1>

            <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                    <span>Mã đơn hàng:</span>
                    <span className="font-bold text-blue-600">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span>Tổng tiền:</span>
                    <span className="font-bold text-red-600">
                        {new Intl.NumberFormat("vi-VN").format(order.totalPrice)}₫
                    </span>
                </div>
            </div>

            <div className="mt-6">
                <label className="block mb-2 font-medium">Địa chỉ nhận hàng</label>
                <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nhập địa chỉ nhận hàng"
                    className="w-full border rounded-lg p-2"
                />
            </div>

            <div className="mt-4">
                <label className="block mb-2 font-medium">Số điện thoại</label>
                <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nhập số điện thoại"
                    className="w-full border rounded-lg p-2"
                />
            </div>

            <div className="mt-4">
                <label className="block mb-2 font-medium">Ghi chú</label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ghi chú cho đơn hàng"
                    className="w-full border rounded-lg p-2"
                />
            </div>

            <button
                onClick={handlePay}
                disabled={loading}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
            >
                {loading ? "Đang xử lý..." : "Thanh toán VNPay"}
            </button>
        </div>
    );
};

export default OrderPage;
