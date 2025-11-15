import { call, put, takeLatest } from "redux-saga/effects"; // Import các hàm từ redux-saga để quản lý side effects
import { toast } from "react-toastify"; // Import toast để hiển thị thông báo người dùng
import axios from "axios"; // Import axios để thực hiện các yêu cầu HTTP
import * as actions from "../actions/newsActions"; // Import tất cả action creators từ newsActions

// ================================
// 1️⃣ Cấu hình base URL backend
// Định nghĩa URL cơ bản của API backend
// ================================
const API_BASE_URL = "http://localhost:3000"; // URL gốc của API backend (có thể là server hoặc gateway)

// ================================
// 2️⃣ Hàm gọi API chung
// Hàm tiện ích để thực hiện các yêu cầu HTTP (GET, POST, PUT, DELETE)
// ================================
/**
 * apiCall là helper để gọi tất cả các API
 * - Tự động thêm token nếu có trong localStorage
 * - Hỗ trợ FormData cho upload ảnh
 * - GET request: gắn params
 * - POST/PUT/DELETE: gắn body
 * @param {string} method - Phương thức HTTP (GET, POST, PUT, DELETE)
 * @param {string} url - Đường dẫn endpoint API
 * @param {object|FormData} data - Dữ liệu gửi đi (có thể là object hoặc FormData)
 * @param {boolean} isForm - Xác định có phải FormData không, mặc định false
 */
const apiCall = async (method, url, data, isForm = false) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  // Tạo headers, thêm Authorization nếu có token
  let headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };

  // Cấu hình request cho axios
  let config = {
    method, // Phương thức HTTP
    url: `${API_BASE_URL}${url}`, // URL đầy đủ của API
    headers, // Headers (bao gồm Authorization nếu có)
    withCredentials: true, // Gửi cookie để hỗ trợ refresh token hoặc xác thực
  };

  // Nếu data là FormData, tự động đặt isForm = true
  if (data instanceof FormData) {
    isForm = true;
  }

  // Xử lý dữ liệu theo phương thức HTTP
  if (method.toLowerCase() === "get" && data && typeof data === "object") {
    config.params = data; // GET: gắn data vào params
  } else if (data) {
    // POST/PUT/DELETE: gắn data vào body
    if (!isForm) headers["Content-Type"] = "application/json"; // Đặt Content-Type là JSON nếu không phải FormData
    config.data = data; // Gắn data vào body
  }

  // Thực hiện gọi API và trả về dữ liệu
  return (await axios(config)).data;
};

// ================================
// 3️⃣ Saga lấy danh sách tin tức
// Xử lý action NEWS_LIST_REQUEST để lấy danh sách tin tức
// ================================
function* listNewsSaga(action) {
  try {
    // Gọi API GET /news với payload (các filter như tìm kiếm, pagination)
    const res = yield call(() => apiCall("get", "/news", action.payload));

    console.log("🔄 News API res:", res); // Ghi log response để debug
    if (import.meta.env.DEV) {
      console.log("🔄 News data length:", res.data?.length || 0); // Debug: log số lượng tin tức trả về
    }

    // Dispatch action success để lưu danh sách tin tức vào redux
    yield put(actions.newsListSuccess(res));
  } catch (err) {
    // Xử lý lỗi
    console.error("🔄 News API err:", err.response || err); // Ghi log lỗi chi tiết
    const errorMsg = err.response?.data?.message || err.message || "Lỗi không xác định"; // Lấy thông báo lỗi

    // Nếu lỗi 401 (unauthorized - thiếu token), không hiển thị toast vì đã redirect đến trang đăng ký
    if (err.response?.status === 401) {
      console.log("🔄 News API 401 - User not authenticated, redirecting to register");
      yield put(actions.newsListFailure(errorMsg));
      return; // Không hiển thị toast error
    }

    // Dispatch action failure để lưu lỗi vào redux
    yield put(actions.newsListFailure(errorMsg));
    // Hiển thị thông báo lỗi cho người dùng (chỉ cho các lỗi khác 401)
    toast.error(errorMsg);
  }
}

// ================================
// 4️⃣ Saga lấy chi tiết tin tức theo ID
// Xử lý action NEWS_GET_REQUEST để lấy chi tiết một tin tức
// ================================
function* getNewsSaga(action) {
  try {
    // Gọi API GET /news/:id với ID từ payload
    const res = yield call(() => apiCall("get", `/news/${action.payload}`));

    console.log("🔄 News GET API res:", res); // Ghi log response để debug

    // Dispatch action success để lưu chi tiết tin tức vào redux
    yield put(actions.newsGetSuccess(res));
  } catch (err) {
    console.error("🔄 News GET API err:", err.response || err); // Ghi log lỗi
    const errorMsg = err.response?.data?.message || err.message || "Lỗi không xác định"; // Lấy thông báo lỗi

    // Nếu lỗi 401 (unauthorized - thiếu token), không hiển thị toast vì đã redirect đến trang đăng ký
    if (err.response?.status === 401) {
      console.log("🔄 News GET API 401 - User not authenticated, redirecting to register");
      yield put(actions.newsGetFailure(errorMsg));
      return; // Không hiển thị toast error
    }

    // Dispatch action failure để lưu lỗi vào redux
    yield put(actions.newsGetFailure(errorMsg));
    // Hiển thị thông báo lỗi (chỉ cho các lỗi khác 401)
    toast.error(errorMsg);
  }
}

// ================================
// 5️⃣ Saga lấy thống kê tin tức
// Xử lý action NEWS_STATS_REQUEST để lấy thống kê (total, draft, published, archived)
// ================================
function* statsNewsSaga(action) {
  try {
    // Gọi API GET /news/stats với payload (có thể rỗng)
    const res = yield call(() => apiCall("get", "/news/stats", action.payload));

    console.log("🔄 News Stats API res:", res); // Ghi log response để debug

    // Dispatch action success để lưu thống kê vào redux
    yield put(actions.newsStatsSuccess(res));
  } catch (err) {
    console.error("🔄 News Stats API err:", err.response || err); // Ghi log lỗi
    const errorMsg = err.response?.data?.message || err.message || "Lỗi tải thống kê"; // Lấy thông báo lỗi

    // Dispatch action failure để lưu lỗi vào redux
    yield put(actions.newsStatsFailure(errorMsg));
    // Hiển thị thông báo lỗi
    toast.error(errorMsg);
  }
}

// ================================
// 6️⃣ Saga tạo tin tức mới
// Xử lý action NEWS_CREATE_REQUEST để tạo tin tức
// ================================
function* createNewsSaga(action) {
  try {
    // Gọi API POST /news với payload (có thể là FormData để upload ảnh)
    const res = yield call(() => apiCall("post", `/news`, action.payload));

    console.log("🔄 News Create API res:", res); // Ghi log response để debug

    // Dispatch action success để lưu tin tức mới vào redux
    yield put(actions.newsCreateSuccess(res));
    // Hiển thị thông báo thành công
    toast.success("Tạo tin tức thành công!");
  } catch (err) {
    console.error("🔄 News Create API err:", err.response || err); // Ghi log lỗi
    const errorMsg = err.response?.data?.message || err.message || "Lỗi không xác định"; // Lấy thông báo lỗi

    // Dispatch action failure để lưu lỗi vào redux
    yield put(actions.newsCreateFailure(errorMsg));
    // Hiển thị thông báo lỗi
    toast.error(errorMsg);
  }
}

// ================================
// 7️⃣ Saga cập nhật tin tức
// Xử lý action NEWS_UPDATE_REQUEST để cập nhật tin tức
// ================================
function* updateNewsSaga(action) {
  try {
    const { id, data } = action.payload; // Lấy ID và dữ liệu từ payload

    // Gọi API PUT /news/:id với dữ liệu (có thể là FormData)
    const res = yield call(() => apiCall("put", `/news/${id}`, data));

    console.log("🔄 News Update API res:", res); // Ghi log response để debug

    // Dispatch action success để lưu tin tức đã cập nhật vào redux
    yield put(actions.newsUpdateSuccess(res));
    // Hiển thị thông báo thành công
    toast.success("Cập nhật tin tức thành công!");
  } catch (err) {
    console.error("🔄 News Update API err:", err.response || err); // Ghi log lỗi
    const errorMsg = err.response?.data?.message || err.message || "Lỗi không xác định"; // Lấy thông báo lỗi

    // Dispatch action failure để lưu lỗi vào redux
    yield put(actions.newsUpdateFailure(errorMsg));
    // Hiển thị thông báo lỗi
    toast.error(errorMsg);
  }
}

// ================================
// 8️⃣ Saga xóa tin tức
// Xử lý action NEWS_DELETE_REQUEST để xóa tin tức
// ================================
function* deleteNewsSaga(action) {
  try {
    // Gọi API DELETE /news/:id với ID từ payload
    const res = yield call(() => apiCall("delete", `/news/${action.payload}`));

    console.log("🔄 News Delete API res:", res); // Ghi log response để debug

    // Dispatch action success để cập nhật state trong redux
    yield put(actions.newsDeleteSuccess(res));
    // Hiển thị thông báo thành công
    toast.success("Xóa tin tức thành công!");
  } catch (err) {
    console.error("🔄 News Delete API err:", err.response || err); // Ghi log lỗi
    const errorMsg = err.response?.data?.message || err.message || "Lỗi không xác định"; // Lấy thông báo lỗi

    // Dispatch action failure để lưu lỗi vào redux
    yield put(actions.newsDeleteFailure(errorMsg));
    // Hiển thị thông báo lỗi
    toast.error(errorMsg);
  }
}

// ================================
// 9️⃣ Root saga: watch tất cả action
// Theo dõi các action liên quan đến tin tức và gọi saga tương ứng
// ================================
export default function* newsSaga() {
  // Sử dụng takeLatest để xử lý action mới nhất cho mỗi loại request
  yield takeLatest(actions.NEWS_LIST_REQUEST, listNewsSaga); // Theo dõi action lấy danh sách tin tức
  yield takeLatest(actions.NEWS_GET_REQUEST, getNewsSaga); // Theo dõi action lấy chi tiết tin tức
  yield takeLatest(actions.NEWS_STATS_REQUEST, statsNewsSaga); // Theo dõi action lấy thống kê
  yield takeLatest(actions.NEWS_CREATE_REQUEST, createNewsSaga); // Theo dõi action tạo tin tức
  yield takeLatest(actions.NEWS_UPDATE_REQUEST, updateNewsSaga); // Theo dõi action cập nhật tin tức
  yield takeLatest(actions.NEWS_DELETE_REQUEST, deleteNewsSaga); // Theo dõi action xóa tin tức
}