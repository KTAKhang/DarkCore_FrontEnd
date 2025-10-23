import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import axios from "axios";
import * as actions from "../actions/contactActions";

// ================================
// 1️⃣ Base URL Backend
// ================================
const API_BASE_URL = "http://localhost:3000"; // Gateway hoặc contact-service URL

// ================================
// 2️⃣ API Helper chung
// ================================
const apiCall = async (method, url, data, isForm = false) => {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  let config = {
    method,
    url: `${API_BASE_URL}${url}`,
    headers,
    withCredentials: true,
  };

  if (data instanceof FormData) isForm = true;
  if (method.toLowerCase() === "get" && data && typeof data === "object") {
    config.params = data;
  } else if (data) {
    if (!isForm) headers["Content-Type"] = "application/json";
    config.data = data;
  }

  console.log(`🚀 [API Call] ${method.toUpperCase()} ${API_BASE_URL}${url}`);
  if (data) console.log("📡 Payload:", data);
  try {
    const response = await axios(config);
    console.log(`✅ [API Response] ${method.toUpperCase()} ${API_BASE_URL}${url}`, response.data);
    return response.data;
  } catch (err) {
    console.error(`❌ [API Error] ${method.toUpperCase()} ${API_BASE_URL}${url}`);
    console.error("📌 Error response data:", err.response?.data || err.message);
    console.error("📌 Status:", err.response?.status);
    console.error("📌 Payload sent:", data);
    throw err;
  }
};

// ================================
// 3️⃣ GET: Danh sách contact
// ================================
function* listContactSaga(action) {
  try {
    console.log("🚀 [Saga] listContactSaga payload:", action.payload);
    const res = yield call(() => apiCall("get", "/contacts", action.payload));
    console.log("✅ [Saga] listContactSaga response:", res);
    yield put(actions.contactListSuccess(res));
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message;
    yield put(actions.contactListFailure(errorMsg));
    toast.error(`List Contacts Error: ${errorMsg}`);
  }
}

// ================================
// 4️⃣ GET: Chi tiết contact + reply
// ================================
function* getContactSaga(action) {
  try {
    console.log("🚀 [Saga] getContactSaga payload:", action.payload);
    const res = yield call(() => apiCall("get", `/contacts/${action.payload}`));
    console.log("✅ [Saga] getContactSaga response:", res);
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
function* createContactSaga(action) {
  try {
    console.log("🚀 [Saga] createContactSaga payload:", action.payload);
    const res = yield call(() => apiCall("post", "/contacts", action.payload));
    console.log("✅ [Saga] createContactSaga response:", res);
    yield put(actions.contactCreateSuccess(res));
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
function* replyContactSaga(action) {
  try {
    const { id, data } = action.payload;
    console.log("🚀 [Saga] replyContactSaga payload:", { id, data });
    const res = yield call(() => apiCall("post", `/contacts/${id}/replies`, data));
    console.log("✅ [Saga] replyContactSaga response:", res);
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
function* updateContactSaga(action) {
  const { contactId, data } = action.payload;
  console.log("🚀 updateContactSaga contactId:", contactId);
  console.log("🚀 updateContactSaga data:", data);

  if (!contactId || !data) {
    console.error("❌ Invalid contactId or payload in saga", action.payload);
    return;
  }

  const res = yield call(() => apiCall("put", `/contacts/${contactId}`, data));
  yield put(actions.contactUpdateSuccess(res));
  toast.success("Cập nhật liên hệ thành công!");
}


// ================================
// 8️⃣ DELETE: Xóa contact
// ================================
function* deleteContactSaga(action) {
  try {
    console.log("🚀 [Saga] deleteContactSaga payload:", action.payload);
    const res = yield call(() => apiCall("delete", `/contacts/${action.payload}`));
    console.log("✅ [Saga] deleteContactSaga response:", res);
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
function* statsContactSaga(action) {
  try {
    console.log("🚀 [Saga] statsContactSaga payload:", action.payload || "No payload");
    const res = yield call(() => apiCall("get", "/contacts/stats", action.payload));
    console.log("✅ [Saga] statsContactSaga response:", res);

    // Lấy data từ res.data
    const statsData = res.data || { total: 0, pending: 0, resolved: 0, closed: 0 };

    yield put(actions.contactStatsSuccess({
      total: statsData.total || 0,
      pending: statsData.pending || 0,
      resolved: statsData.resolved || 0,
      closed: statsData.closed || 0
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
export default function* contactSaga() {
  yield takeLatest(actions.CONTACT_LIST_REQUEST, listContactSaga);
  yield takeLatest(actions.CONTACT_GET_REQUEST, getContactSaga);
  yield takeLatest(actions.CONTACT_CREATE_REQUEST, createContactSaga);
  yield takeLatest(actions.CONTACT_REPLY_REQUEST, replyContactSaga);
  yield takeLatest(actions.CONTACT_UPDATE_REQUEST, updateContactSaga);
  yield takeLatest(actions.CONTACT_DELETE_REQUEST, deleteContactSaga);
  yield takeLatest(actions.CONTACT_STATS_REQUEST, statsContactSaga);
}