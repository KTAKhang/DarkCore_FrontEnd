import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { toast } from "react-toastify";

import {
  CREATE_PAYMENT_REQUEST,
  CREATE_PAYMENT_FAILURE,
  PAYMENT_RESULT_REQUEST,
  paymentResultSuccess,
  paymentResultFailure,
  createPaymentSuccess,
  createPaymentFailure,
} from "../actions/paymentActions";

const API_BASE_URL = "http://localhost:3007/api/payment";

// --- Saga tạo payment ---
function* handleCreatePayment(action) {
  try {
    const { orderId, amount } = action.payload;
    const parsedAmount = Number(amount);
    const token = localStorage.getItem("token");

    // Gửi request tạo thanh toán
    const res = yield call(() =>
      axios.post(
        `${API_BASE_URL}/vnpay/create`,
        { orderId, amount: parsedAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    );

    // Lưu thông tin payment vào redux (nếu muốn hiển thị tạm thời)
    yield put(
      createPaymentSuccess({
        paymentUrl: res.data.paymentUrl,
        orderId,
        amount: parsedAmount,
      })
    );

    // Hiển thị thông báo
    toast.info("Đang chuyển đến cổng thanh toán VNPAY...");

    // ✅ Chuyển sang trang thanh toán (redirect 1 lần duy nhất)
    window.location.href = res.data.paymentUrl;
    
  } catch (err) {
    yield put(createPaymentFailure(err.message));
    toast.error(err.message || "Tạo thanh toán thất bại!");
  }
}

// --- Saga kiểm tra kết quả payment ---
function* handlePaymentResult(action) {
  try {
    const { txnRef, responseCode } = action.payload;

    // Gọi backend verify
    yield call(() =>
      axios.get(
        `${API_BASE_URL}/vnpay/callback?vnp_TxnRef=${txnRef}&vnp_ResponseCode=${responseCode}`
      )
    );

    const status = responseCode === "00" ? "success" : "failed";
    yield put(paymentResultSuccess({ status, orderId: txnRef }));

    if (status === "success") toast.success("Thanh toán thành công!");
    else toast.error("Thanh toán thất bại!");
  } catch (err) {
    yield put(paymentResultFailure(err.message || "Payment verification failed"));
    toast.error("Xảy ra lỗi khi xác thực thanh toán");
  }
}

// --- root saga ---
export default function* paymentSaga() {
  yield takeLatest(CREATE_PAYMENT_REQUEST, handleCreatePayment);
  yield takeLatest(PAYMENT_RESULT_REQUEST, handlePaymentResult);
}
