import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import axios from "axios";
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
} from "../actions/cartActions";

const API_BASE_URL = "http://localhost:3000";
console.log("🟢 cartSaga loaded");
// ===== API CALLS CƠ BẢN =====
const apiCall = async (method, url, data, isForm = false) => {
  console.log("🔴 apiCall: Starting", { method, url, data });

  const token = localStorage.getItem("token");
  console.log("🔴 apiCall: Token exists?", !!token);
  if (!token) {
    console.error("🔴 apiCall: No token found");
    throw new Error("No token found");
  }

  try {
    console.log("🔴 apiCall: Making request to", `${API_BASE_URL}${url}`);
    // Cấu hình request cơ bản
    const config = {
      method,
      url: `${API_BASE_URL}${url}`,
      withCredentials: true,
      headers: {
        "Content-Type": isForm ? "multipart/form-data" : "application/json",
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,
    };

    // Chỉ thêm data khi thật sự có
    if (data !== undefined && data !== null) {
      config.data = data;
    }
    console.log("🔴 apiCall: Config", config);

    const res = await axios(config);
    console.log("🔴 apiCall: Response received", res.data);
    return res.data;
  } catch (error) {
    // Nếu access token hết hạn → gọi refresh
    if (error.response?.status === 401) {
      try {
        const refreshRes = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        const newToken = refreshRes.data?.token?.access_token;

        if (newToken) {
          localStorage.setItem("token", newToken);

          const retryConfig = {
            method,
            url: `${API_BASE_URL}${url}`,
            withCredentials: true,
            headers: {
              "Content-Type": isForm
                ? "multipart/form-data"
                : "application/json",
              Authorization: `Bearer ${newToken}`,
            },
            timeout: 5000,
          };

          if (data !== undefined && data !== null) {
            retryConfig.data = data;
          }

          const retryRes = await axios(retryConfig);
          return retryRes.data;
        }
      } catch (refreshError) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
      }
    }

    // Xử lý lỗi chung
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Request failed";
    console.error(
      `API Error [${method.toUpperCase()} ${url}]:`,
      msg,
      error.response?.data
    );
    throw new Error(msg);
  }
};

// ===== SAGAS =====
function* getCartSaga() {
  try {
    const response = yield call(() => apiCall("get", "/cart"));
    if (response.status === "OK") {
      yield put(cartGetSuccess(response.cart));
      // toast.success(response.message || "Lấy giỏ hàng thành công!");
      toast.success(response.message);
    } else {
      throw new Error(response.message || "Lấy giỏ hàng thất bại");
    }
  } catch (error) {
    const msg = error.message || "Lấy giỏ hàng thất bại";
    console.error("getCartSaga error:", msg, error);
    yield put(cartGetFailure(msg));
    toast.error(msg);
  }
}

function* addCartSaga(action) {
  console.log("🟢 watchCartAdd started");
  console.log("Saga received:", action.payload);
  try {
    console.log("🔴 addCartSaga: Before apiCall");
    const response = yield call(() =>
      apiCall("post", "/cart/add", action.payload)
    );
    console.log("🔴 addCartSaga: After apiCall", response);
    if (response.status === "OK") {
      yield put(cartAddSuccess(response.cart));
      toast.success(response.message || "Thêm vào giỏ hàng thành công!");
    } else {
      throw new Error(response.message || "Thêm vào giỏ hàng thất bại");
    }
  } catch (error) {
    console.error("🔴 addCartSaga: CATCH ERROR", error);
    const msg = error.message || "Thêm vào giỏ hàng thất bại";
    console.error("addCartSaga error:", msg, error);
    yield put(cartAddFailure(msg));
    // toast.error(msg);
  }
}

function* updateCartSaga(action) {
  try {
    const { productId, quantity } = action.payload;
    const response = yield call(() =>
      apiCall("put", `/cart/update/${productId}`, { quantity })
    );

    // KIỂM TRA NẾU CÓ LỖI TỪ BACKEND
    if (response.error) {
      throw new Error(response.error);
    }

    if (response.status === "OK") {
      yield put(cartUpdateSuccess(response.cart));
      toast.success(response.message || "Cập nhật giỏ hàng thành công!");
    } else {
      throw new Error(response.message || "Cập nhật giỏ hàng thất bại");
    }
  } catch (error) {
    const msg = error.message || "Cập nhật giỏ hàng thất bại";
    console.error("updateCartSaga error:", msg, error);
    yield put(cartUpdateFailure(msg));
    // toast.error(msg); // CHỈ HIỂN THỞ TOAST Ở ĐÂY
  }
}

function* removeCartSaga(action) {
  try {
    const { productId } = action.payload;
    console.log("removeCartSaga: Attempting to remove item", { productId });
    const response = yield call(() =>
      apiCall("delete", `/cart/remove/${productId}`)
    );
    if (response.status === "OK") {
      yield put(cartRemoveSuccess(response.cart));
      toast.success(
        response.message || "Xóa sản phẩm khỏi giỏ hàng thành công!"
      );
    } else {
      throw new Error(
        response.message || "Xóa sản phẩm khỏi giỏ hàng thất bại"
      );
    }
  } catch (error) {
    const msg = error.message || "Xóa sản phẩm khỏi giỏ hàng thất bại";
    console.error("removeCartSaga error:", msg, error.response?.data);
    yield put(cartRemoveFailure(msg));
    toast.error(msg);
  }
}

function* clearCartSaga() {
  try {
    const response = yield call(() => apiCall("delete", "/cart/clear"));
    if (response.status === "OK") {
      yield put(cartClearSuccess(response.cart));
      toast.success(response.message || "Xóa toàn bộ giỏ hàng thành công!");
    } else {
      throw new Error(response.message || "Xóa toàn bộ giỏ hàng thất bại");
    }
  } catch (error) {
    const msg = error.message || "Xóa toàn bộ giỏ hàng thất bại";
    console.error("clearCartSaga error:", msg, error);
    yield put(cartClearFailure(msg));
    toast.error(msg);
  }
}

// ===== ROOT SAGA =====
// TRONG cartSaga.js - THÊM TRY-CATCH
export default function* cartSaga() {
  try {
    console.log("🔴 cartSaga: Starting execution");
    yield takeLatest(CART_GET_REQUEST, getCartSaga);
    yield takeLatest(CART_ADD_REQUEST, addCartSaga);
    yield takeLatest(CART_UPDATE_REQUEST, updateCartSaga);
    yield takeLatest(CART_REMOVE_REQUEST, removeCartSaga);
    yield takeLatest(CART_CLEAR_REQUEST, clearCartSaga);
    console.log("🔴 cartSaga: All takeLatest registered");
  } catch (error) {
    console.error("🔴 cartSaga ERROR:", error);
  }
}
