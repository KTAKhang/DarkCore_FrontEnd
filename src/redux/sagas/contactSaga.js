import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import axios from "axios";
import * as actions from "../actions/contactActions";

// ================================
// 1️⃣ Base URL Backend
// ================================
// Định nghĩa URL gốc của API backend để sử dụng trong các request
const API_BASE_URL = "http://localhost:3000"; // Gateway hoặc contact-service URL

// ================================
// 2️⃣ API Helper chung
// ================================
/**
 * Hàm helper chung để thực hiện các API call
 * @param {string} method - HTTP method (get, post, put, delete)
 * @param {string} url - Endpoint URL (phần sau base URL)
 * @param {object|FormData} data - Dữ liệu gửi lên (body hoặc params)
 * @param {boolean} isForm - Flag để xác định có phải FormData hay không
 * @returns {Promise} - Trả về response data từ API
 */
const apiCall = async (method, url, data, isForm = false) => {
  // Lấy token từ localStorage để authenticate
  const token = localStorage.getItem("token");
  // Tạo headers với token nếu có
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  // Cấu hình cơ bản cho axios request
  let config = {
    method,
    url: `${API_BASE_URL}${url}`, // Ghép base URL với endpoint
    headers,
    withCredentials: true, // Cho phép gửi cookies cùng request
  };

  // Kiểm tra xem data có phải là FormData không
  if (data instanceof FormData) isForm = true;
  
  // Nếu là GET request và có data, chuyển data thành query params
  if (method.toLowerCase() === "get" && data && typeof data === "object") {
    config.params = data;
  } else if (data) {
    // Nếu không phải FormData, set Content-Type là JSON
    if (!isForm) headers["Content-Type"] = "application/json";
    config.data = data; // Gán data vào body của request
  }

  // Log thông tin request để debug
  console.log(`🚀 [API Call] ${method.toUpperCase()} ${API_BASE_URL}${url}`);
  if (data) console.log("📡 Payload:", data);
  
  try {
    // Thực hiện API call bằng axios
    const response = await axios(config);
    // Log response thành công
    console.log(`✅ [API Response] ${method.toUpperCase()} ${API_BASE_URL}${url}`, response.data);
    return response.data;
  } catch (err) {
    // Log chi tiết lỗi nếu request thất bại
    console.error(`❌ [API Error] ${method.toUpperCase()} ${API_BASE_URL}${url}`);
    console.error("📌 Error response data:", err.response?.data || err.message);
    console.error("📌 Status:", err.response?.status);
    console.error("📌 Payload sent:", data);
    throw err; // Throw lỗi để saga xử lý tiếp
  }
};

// ================================
// 3️⃣ GET: Danh sách contact
// ================================
/**
 * Saga xử lý lấy danh sách contact với filters/pagination
 */
function* listContactSaga(action) {
  try {
    // Log payload để debug (có thể chứa filters, page, limit...)
    console.log("🚀 [Saga] listContactSaga payload:", action.payload);
    
    // Gọi API để lấy danh sách contact
    const res = yield call(() => apiCall("get", "/contacts", action.payload));
    console.log("✅ [Saga] listContactSaga response:", res);
    
    // Dispatch action SUCCESS với dữ liệu nhận được
    yield put(actions.contactListSuccess(res));
  } catch (err) {
    // Lấy thông báo lỗi từ response hoặc message mặc định
    const errorMsg = err.response?.data?.message || err.message;
    // Dispatch action FAILURE
    yield put(actions.contactListFailure(errorMsg));
    // Hiển thị toast thông báo lỗi cho user
    toast.error(`List Contacts Error: ${errorMsg}`);
  }
}

// ================================
// 4️⃣ GET: Chi tiết contact + reply
// ================================
/**
 * Saga xử lý lấy chi tiết một contact theo ID (bao gồm cả replies)
 */
function* getContactSaga(action) {
  try {
    // Log ID của contact cần lấy
    console.log("🚀 [Saga] getContactSaga payload:", action.payload);
    
    // Gọi API để lấy chi tiết contact với ID từ payload
    const res = yield call(() => apiCall("get", `/contacts/${action.payload}`));
    console.log("✅ [Saga] getContactSaga response:", res);
    
    // Dispatch action SUCCESS với dữ liệu contact chi tiết
    yield put(actions.contactGetSuccess(res));
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message;
    yield put(actions.contactGetFailure(errorMsg));
    toast.error(`Get Contact Error: ${errorMsg}`);
  }
}

// ================================
// 5️⃣ POST: Tạo contact mới
// ================================
/**
 * Saga xử lý tạo contact mới (user gửi liên hệ)
 */
function* createContactSaga(action) {
  try {
    // Log dữ liệu contact mới (name, email, message...)
    console.log("🚀 [Saga] createContactSaga payload:", action.payload);
    
    // Gọi API POST để tạo contact mới
    const res = yield call(() => apiCall("post", "/contacts", action.payload));
    console.log("✅ [Saga] createContactSaga response:", res);
    
    // Dispatch action SUCCESS với contact vừa tạo
    yield put(actions.contactCreateSuccess(res));
    // Hiển thị thông báo thành công
    toast.success("Gửi liên hệ thành công!");
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message;
    console.error("❌ Create Contact Error:", err.response?.data || err.message);
    yield put(actions.contactCreateFailure(errorMsg));
    toast.error(`Create Contact Error: ${errorMsg}`);
  }
}

// ================================
// 6️⃣ POST: Admin hoặc user gửi reply
// ================================
/**
 * Saga xử lý gửi reply cho một contact (admin trả lời hoặc user reply lại)
 */
function* replyContactSaga(action) {
  try {
    // Destructure để lấy ID contact và data reply
    const { id, data } = action.payload;
    console.log("🚀 [Saga] replyContactSaga payload:", { id, data });
    
    // Gọi API POST để thêm reply vào contact có ID tương ứng
    const res = yield call(() => apiCall("post", `/contacts/${id}/replies`, data));
    console.log("✅ [Saga] replyContactSaga response:", res);
    
    // Dispatch action SUCCESS với reply vừa tạo
    yield put(actions.contactReplySuccess(res));
    toast.success("Gửi phản hồi thành công!");
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message;
    console.error("❌ Reply Contact Error:", err.response?.data || err.message);
    yield put(actions.contactReplyFailure(errorMsg));
    toast.error(`Reply Contact Error: ${errorMsg}`);
  }
}

// ================================
// 7️⃣ PUT: Admin cập nhật contact (status + reply)
// ================================
/**
 * Saga xử lý cập nhật thông tin contact (chủ yếu là status: pending/resolved/closed)
 */
function* updateContactSaga(action) {
  // Destructure để lấy contactId và data cần update
  const { contactId, data } = action.payload;
  console.log("🚀 updateContactSaga contactId:", contactId);
  console.log("🚀 updateContactSaga data:", data);

  // Validate dữ liệu đầu vào
  if (!contactId || !data) {
    console.error("❌ Invalid contactId or payload in saga", action.payload);
    return; // Dừng saga nếu thiếu dữ liệu
  }

  // Gọi API PUT để cập nhật contact
  const res = yield call(() => apiCall("put", `/contacts/${contactId}`, data));
  
  // Dispatch action SUCCESS với contact đã update
  yield put(actions.contactUpdateSuccess(res));
  toast.success("Cập nhật liên hệ thành công!");
}


// ================================
// 8️⃣ DELETE: Xóa contact
// ================================
/**
 * Saga xử lý xóa một contact (chỉ admin)
 */
function* deleteContactSaga(action) {
  try {
    // Log ID của contact cần xóa
    console.log("🚀 [Saga] deleteContactSaga payload:", action.payload);
    
    // Gọi API DELETE để xóa contact theo ID
    const res = yield call(() => apiCall("delete", `/contacts/${action.payload}`));
    console.log("✅ [Saga] deleteContactSaga response:", res);
    
    // Dispatch action SUCCESS (thường trả về ID của contact đã xóa)
    yield put(actions.contactDeleteSuccess(res));
    toast.success("Xóa liên hệ thành công!");
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message;
    console.error("❌ Delete Contact Error:", err.response?.data || err.message);
    yield put(actions.contactDeleteFailure(errorMsg));
    toast.error(`Delete Contact Error: ${errorMsg}`);
  }
}

// ================================
// 9️⃣ GET: Thống kê contact
// ================================
/**
 * Saga xử lý lấy thống kê về contacts (tổng số, pending, resolved, closed)
 */
function* statsContactSaga(action) {
  try {
    // Log payload (có thể là filters cho stats)
    console.log("🚀 [Saga] statsContactSaga payload:", action.payload || "No payload");
    
    // Gọi API để lấy thống kê
    const res = yield call(() => apiCall("get", "/contacts/stats", action.payload));
    console.log("✅ [Saga] statsContactSaga response:", res);

    // Lấy data từ res.data và set giá trị mặc định nếu không có
    const statsData = res.data || { total: 0, pending: 0, resolved: 0, closed: 0 };

    // Dispatch action SUCCESS với dữ liệu thống kê đã format
    yield put(actions.contactStatsSuccess({
      total: statsData.total || 0,      // Tổng số contact
      pending: statsData.pending || 0,   // Số contact đang pending
      resolved: statsData.resolved || 0, // Số contact đã resolved
      closed: statsData.closed || 0      // Số contact đã closed
    }));
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message;
    console.error("❌ [Saga] statsContactSaga error:", err.response?.data || err.message);
    yield put(actions.contactStatsFailure(errorMsg));
  }
}


// ================================
// 🔟 Root Saga
// ================================
/**
 * Root saga để đăng ký tất cả các saga watchers
 * takeLatest: Chỉ xử lý action mới nhất, hủy các action trước đó nếu chưa hoàn thành
 */
export default function* contactSaga() {
  // Lắng nghe action LIST_REQUEST và gọi listContactSaga
  yield takeLatest(actions.CONTACT_LIST_REQUEST, listContactSaga);
  
  // Lắng nghe action GET_REQUEST và gọi getContactSaga
  yield takeLatest(actions.CONTACT_GET_REQUEST, getContactSaga);
  
  // Lắng nghe action CREATE_REQUEST và gọi createContactSaga
  yield takeLatest(actions.CONTACT_CREATE_REQUEST, createContactSaga);
  
  // Lắng nghe action REPLY_REQUEST và gọi replyContactSaga
  yield takeLatest(actions.CONTACT_REPLY_REQUEST, replyContactSaga);
  
  // Lắng nghe action UPDATE_REQUEST và gọi updateContactSaga
  yield takeLatest(actions.CONTACT_UPDATE_REQUEST, updateContactSaga);
  
  // Lắng nghe action DELETE_REQUEST và gọi deleteContactSaga
  yield takeLatest(actions.CONTACT_DELETE_REQUEST, deleteContactSaga);
  
  // Lắng nghe action STATS_REQUEST và gọi statsContactSaga
  yield takeLatest(actions.CONTACT_STATS_REQUEST, statsContactSaga);
}