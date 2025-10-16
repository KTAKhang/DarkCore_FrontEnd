import { call, put, takeLatest } from "redux-saga/effects"; // Import các hàm từ redux-saga để quản lý side effects
import { toast } from "react-toastify"; // Import toast để hiển thị thông báo
import axios from "axios"; // Import axios để gọi API
import {
  CART_GET_REQUEST,
  cartGetSuccess,
  cartGetFailure,
  CART_ADD_REQUEST,
  cartAddSuccess,
  cartAddFailure,
  CART_UPDATE_REQUEST,
  cartUpdateSuccess,
  cartUpdateFailure,
  CART_REMOVE_REQUEST,
  cartRemoveSuccess,
  cartRemoveFailure,
  CART_CLEAR_REQUEST,
  cartClearSuccess,
  cartClearFailure,
} from "../actions/cartActions"; // Import các action types và creators từ cartActions

// ===== CẤU HÌNH =====
// Định nghĩa URL cơ bản của backend
const API_BASE_URL = "http://localhost:3000"; // URL gốc của API backend
console.log("🟢 cartSaga loaded"); // Ghi log để debug khi saga được load

// ================================
// 1️⃣ Hàm gọi API chung (gửi request)
// Hàm tiện ích để thực hiện các yêu cầu HTTP với axios
// ================================
const apiCall = async (method, url, data, isForm = false) => {
  console.log("🔴 apiCall: Starting", { method, url, data }); // Ghi log thông tin request để debug

  // Lấy token từ localStorage để xác thực
  const token = localStorage.getItem("token");
  console.log("🔴 apiCall: Token exists?", !!token); // Ghi log trạng thái token
  if (!token) {
    console.error("🔴 apiCall: No token found"); // Ghi log lỗi nếu không có token
    throw new Error("No token found"); // Ném lỗi nếu không tìm thấy token
  }

  try {
    // Cấu hình request cho axios
    const config = {
      method, // Phương thức HTTP (get, post, put, delete)
      url: `${API_BASE_URL}${url}`, // URL đầy đủ của API
      withCredentials: true, // Gửi cookie nếu có (dùng cho refresh token)
      headers: {
        "Content-Type": isForm ? "multipart/form-data" : "application/json", // Định dạng dữ liệu
        Authorization: `Bearer ${token}`, // Thêm token vào header
      },
      timeout: 5000, // Timeout 5 giây
    };

    // Thêm dữ liệu vào config nếu có
    if (data !== undefined && data !== null) {
      config.data = data;
    }

    // Thực hiện gọi API
    const res = await axios(config);
    return res.data; // Trả về dữ liệu từ response
  } catch (error) {
    // Xử lý trường hợp token hết hạn (401)
    if (error.response?.status === 401) {
      try {
        // Gọi API refresh token để lấy token mới
        const refreshRes = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true } // Gửi cookie để refresh token
        );
        const newToken = refreshRes.data?.token?.access_token; // Lấy token mới từ response
        if (newToken) {
          // Lưu token mới vào localStorage
          localStorage.setItem("token", newToken);

          // Retry request với token mới
          const retryConfig = {
            method,
            url: `${API_BASE_URL}${url}`,
            withCredentials: true,
            headers: {
              "Content-Type": isForm
                ? "multipart/form-data"
                : "application/json",
              Authorization: `Bearer ${newToken}`, // Sử dụng token mới
            },
            timeout: 5000,
          };
          if (data !== undefined && data !== null) {
            retryConfig.data = data;
          }
          const retryRes = await axios(retryConfig); // Thực hiện lại request
          return retryRes.data; // Trả về dữ liệu từ retry
        }
      } catch (refreshError) {
        // Nếu refresh token thất bại, xóa token và user, chuyển hướng đến login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login"; // Chuyển hướng về trang đăng nhập
        throw new Error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại"); // Ném lỗi
      }
    }

    // Xử lý các lỗi khác
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Request failed"; // Lấy thông báo lỗi từ response hoặc mặc định

    console.error(
      `API Error [${method.toUpperCase()} ${url}]:`,
      msg,
      error.response?.data
    ); // Ghi log lỗi chi tiết

    throw error; // Ném lỗi để saga xử lý
  }
};

// ================================
// 2️⃣ Saga lấy giỏ hàng
// Xử lý action CART_GET_REQUEST để lấy thông tin giỏ hàng
// ================================
function* getCartSaga() {
  try {
    // Gọi API GET /cart để lấy giỏ hàng
    const response = yield call(() => apiCall("get", "/cart"));

    // Kiểm tra trạng thái response
    if (response.status === "OK") {
      yield put(cartGetSuccess(response.cart)); // Dispatch action success với dữ liệu giỏ hàng
      // toast.success(response.message || "Lấy giỏ hàng thành công!"); // Hiển thị thông báo thành công
    } else {
      throw new Error(response.message || "Lấy giỏ hàng thất bại"); // Ném lỗi nếu response không OK
    }
  } catch (error) {
    const msg = error.message || "Lấy giỏ hàng thất bại"; // Lấy thông báo lỗi
    console.error("getCartSaga error:", msg, error); // Ghi log lỗi
    yield put(cartGetFailure(msg)); // Dispatch action failure
    toast.error(msg); // Hiển thị thông báo lỗi
  }
}

// ================================
// 3️⃣ Saga thêm sản phẩm vào giỏ
// Xử lý action CART_ADD_REQUEST để thêm sản phẩm vào giỏ hàng
// ================================
function* addCartSaga(action) {
  try {
    // Gọi API POST /cart/add với payload từ action
    const response = yield call(() =>
      apiCall("post", "/cart/add", action.payload)
    );

    // Kiểm tra trạng thái response
    if (response.status === "OK") {
      yield put(cartAddSuccess(response.cart)); // Dispatch action success với dữ liệu giỏ hàng
      toast.success(response.message || "Thêm vào giỏ hàng thành công!"); // Hiển thị thông báo thành công
    } else {
      throw new Error(response.message || "Thêm vào giỏ hàng thất bại"); // Ném lỗi nếu response không OK
    }
  } catch (error) {
    // Lấy thông báo lỗi từ backend
    let backendMsg = "";
    if (error.response) {
      backendMsg = error.response.data?.message || error.message || "";
    } else {
      backendMsg = error.message || "";
    }

    // Xử lý thông báo đặc biệt
    if (backendMsg.includes("exceeds stock")) {
      toast.warning("Số lượng sản phẩm vượt quá tồn kho!"); // Thông báo nếu vượt quá tồn kho
    } else if (backendMsg.includes("not found")) {
      toast.error("Sản phẩm không tồn tại hoặc đã bị xóa!"); // Thông báo nếu sản phẩm không tồn tại
    } else {
      toast.error(backendMsg || "Thêm vào giỏ hàng thất bại!"); // Thông báo lỗi chung
    }

    yield put(cartAddFailure(backendMsg || "Thêm vào giỏ hàng thất bại")); // Dispatch action failure
  }
}

// ================================
// 4️⃣ Saga cập nhật số lượng sản phẩm
// Xử lý action CART_UPDATE_REQUEST để cập nhật số lượng sản phẩm trong giỏ
// ================================
function* updateCartSaga(action) {
  try {
    const { productId, quantity } = action.payload; // Lấy productId và quantity từ payload
    // Gọi API PUT /cart/update/:productId với body { quantity }
    const response = yield call(() =>
      apiCall("put", `/cart/update/${productId}`, { quantity })
    );

    // Kiểm tra nếu response có lỗi
    if (response.error) {
      throw new Error(response.error);
    }

    // Kiểm tra trạng thái response
    if (response.status === "OK") {
      yield put(cartUpdateSuccess(response.cart)); // Dispatch action success với dữ liệu giỏ hàng
      toast.success(response.message || "Cập nhật giỏ hàng thành công!"); // Hiển thị thông báo thành công
    } else {
      throw new Error(response.message || "Cập nhật giỏ hàng thất bại"); // Ném lỗi nếu response không OK
    }
  } catch (error) {
    const backendMsg = error.response?.data?.message || ""; // Lấy thông báo lỗi từ backend
    if (backendMsg.includes("exceeds stock")) {
      toast.warning("Không thể tăng thêm — vượt quá tồn kho!"); // Thông báo nếu vượt quá tồn kho
    } else {
      toast.error("Sản phẩm vượt quá tồn kho"); // Thông báo lỗi chung
    }

    yield put(cartUpdateFailure(backendMsg || "Cập nhật giỏ hàng thất bại")); // Dispatch action failure
  }
}

// ================================
// 5️⃣ Saga xóa sản phẩm khỏi giỏ
// Xử lý action CART_REMOVE_REQUEST để xóa sản phẩm khỏi giỏ hàng
// ================================
function* removeCartSaga(action) {
  try {
    const { productId } = action.payload; // Lấy productId từ payload
    // Gọi API DELETE /cart/remove/:productId
    const response = yield call(() =>
      apiCall("delete", `/cart/remove/${productId}`)
    );

    // Kiểm tra trạng thái response
    if (response.status === "OK") {
      yield put(cartRemoveSuccess(response.cart)); // Dispatch action success với dữ liệu giỏ hàng
      toast.success(response.message || "Xóa sản phẩm khỏi giỏ hàng thành công!"); // Hiển thị thông báo thành công
    } else {
      throw new Error(response.message || "Xóa sản phẩm khỏi giỏ hàng thất bại"); // Ném lỗi nếu response không OK
    }
  } catch (error) {
    const msg = error.message || "Xóa sản phẩm khỏi giỏ hàng thất bại"; // Lấy thông báo lỗi
    console.error("removeCartSaga error:", msg, error.response?.data); // Ghi log lỗi
    yield put(cartRemoveFailure(msg)); // Dispatch action failure
    toast.error(msg); // Hiển thị thông báo lỗi
  }
}

// ================================
// 6️⃣ Saga xóa toàn bộ giỏ hàng
// Xử lý action CART_CLEAR_REQUEST để xóa toàn bộ giỏ hàng
// ================================
function* clearCartSaga() {
  try {
    // Gọi API DELETE /cart/clear
    const response = yield call(() => apiCall("delete", "/cart/clear"));
    // Kiểm tra trạng thái response
    if (response.status === "OK") {
      yield put(cartClearSuccess(response.cart)); // Dispatch action success với dữ liệu giỏ hàng
      toast.success(response.message || "Xóa toàn bộ giỏ hàng thành công!"); // Hiển thị thông báo thành công
    } else {
      throw new Error(response.message || "Xóa toàn bộ giỏ hàng thất bại"); // Ném lỗi nếu response không OK
    }
  } catch (error) {
    const msg = error.message || "Xóa toàn bộ giỏ hàng thất bại"; // Lấy thông báo lỗi
    console.error("clearCartSaga error:", msg, error); // Ghi log lỗi
    yield put(cartClearFailure(msg)); // Dispatch action failure
    toast.error(msg); // Hiển thị thông báo lỗi
  }
}

// ================================
// 7️⃣ Root saga: watch tất cả action liên quan giỏ
// Theo dõi các action liên quan đến giỏ hàng và gọi saga tương ứng
// ================================
export default function* cartSaga() {
  try {
    console.log("🔴 cartSaga: Starting execution"); // Ghi log khi saga bắt đầu

    // Đăng ký các action với takeLatest để xử lý lần lượt
    yield takeLatest(CART_GET_REQUEST, getCartSaga); // Theo dõi action lấy giỏ hàng
    yield takeLatest(CART_ADD_REQUEST, addCartSaga); // Theo dõi action thêm sản phẩm
    yield takeLatest(CART_UPDATE_REQUEST, updateCartSaga); // Theo dõi action cập nhật giỏ hàng
    yield takeLatest(CART_REMOVE_REQUEST, removeCartSaga); // Theo dõi action xóa sản phẩm
    yield takeLatest(CART_CLEAR_REQUEST, clearCartSaga); // Theo dõi action xóa toàn bộ giỏ hàng

    console.log("🔴 cartSaga: All takeLatest registered"); // Ghi log khi tất cả action được đăng ký
  } catch (error) {
    console.error("🔴 cartSaga ERROR:", error); // Ghi log nếu có lỗi trong root saga
  }
}