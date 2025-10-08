import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import axios from "axios";
import * as actions from "../actions/newsActions";

const API_BASE_URL = "http://localhost:3000"; // Giữ nguyên vì dùng gateway

// ===== API CALL HELPER (FIX: Tự detect FormData cho upload ảnh) =====
const apiCall = async (method, url, data, isForm = false) => {
  const token = localStorage.getItem("token");
  let headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };

  let config = {
    method,
    url: `${API_BASE_URL}${url}`,
    headers,
    withCredentials: true,
  };

  if (data instanceof FormData) {
    isForm = true;
  }

  if (method.toLowerCase() === "get" && data && typeof data === "object") {
    // GET request -> params
    config.params = data;
  } else if (data) {
    // POST, PUT, DELETE
    if (!isForm) headers["Content-Type"] = "application/json";
    config.data = data;
  }

  return (await axios(config)).data;
};

// ===== SAGAS =====
function* listNewsSaga(action) {
  try {
    const res = yield call(() => apiCall("get", "/news", action.payload)); // GET: Không cần data
    console.log("🔄 News API res:", res); // Log response để debug
    if (import.meta.env.DEV) {
      console.log("🔄 News data length:", res.data?.length || 0);
    }
    yield put(actions.newsListSuccess(res));
  } catch (err) {
    console.error("🔄 News API err:", err.response || err); // Log full err
    const errorMsg =
      err.response?.data?.message || err.message || "Lỗi không xác định";
    yield put(actions.newsListFailure(errorMsg));
    toast.error(errorMsg);
  }
}

function* getNewsSaga(action) {
  try {
    const res = yield call(() => apiCall("get", `/news/${action.payload}`));
    console.log("🔄 News GET API res:", res);
    yield put(actions.newsGetSuccess(res));
  } catch (err) {
    console.error("🔄 News GET API err:", err.response || err);
    const errorMsg =
      err.response?.data?.message || err.message || "Lỗi không xác định";
    yield put(actions.newsGetFailure(errorMsg));
    toast.error(errorMsg);
  }
}

function* getNewsSlugSaga(action) {
  try {
    const res = yield call(() => apiCall("get", `/news/${action.payload}`));
    console.log("🔄 News Slug API res:", res);
    yield put(actions.newsGetSlugSuccess(res));
  } catch (err) {
    console.error("🔄 News Slug API err:", err.response || err);
    const errorMsg =
      err.response?.data?.message || err.message || "Lỗi không xác định";
    yield put(actions.newsGetSlugFailure(errorMsg));
    toast.error(errorMsg);
  }
}

function* createNewsSaga(action) {
  try {
    const res = yield call(() => apiCall("post", `/news`, action.payload));
    console.log("🔄 News Create API res:", res);
    yield put(actions.newsCreateSuccess(res));
    toast.success("Tạo tin tức thành công!");
  } catch (err) {
    console.error("🔄 News Create API err:", err.response || err);
    const errorMsg =
      err.response?.data?.message || err.message || "Lỗi không xác định";
    yield put(actions.newsCreateFailure(errorMsg));
    toast.error(errorMsg);
  }
}

function* updateNewsSaga(action) {
  try {
    const { id, data } = action.payload;
    const res = yield call(() => apiCall("put", `/news/${id}`, data));
    console.log("🔄 News Update API res:", res);
    yield put(actions.newsUpdateSuccess(res));
    toast.success("Cập nhật tin tức thành công!");
  } catch (err) {
    console.error("🔄 News Update API err:", err.response || err);
    const errorMsg =
      err.response?.data?.message || err.message || "Lỗi không xác định";
    yield put(actions.newsUpdateFailure(errorMsg));
    toast.error(errorMsg);
  }
}

function* deleteNewsSaga(action) {
  try {
    const res = yield call(() => apiCall("delete", `/news/${action.payload}`));
    console.log("🔄 News Delete API res:", res);
    yield put(actions.newsDeleteSuccess(res));
    toast.success("Xóa tin tức thành công!");
  } catch (err) {
    console.error("🔄 News Delete API err:", err.response || err);
    const errorMsg =
      err.response?.data?.message || err.message || "Lỗi không xác định";
    yield put(actions.newsDeleteFailure(errorMsg));
    toast.error(errorMsg);
  }
}

// ===== ROOT NEWS SAGA =====
export default function* newsSaga() {
  yield takeLatest(actions.NEWS_LIST_REQUEST, listNewsSaga);
  yield takeLatest(actions.NEWS_GET_REQUEST, getNewsSaga);
  yield takeLatest(actions.NEWS_GET_SLUG_REQUEST, getNewsSlugSaga);
  yield takeLatest(actions.NEWS_CREATE_REQUEST, createNewsSaga);
  yield takeLatest(actions.NEWS_UPDATE_REQUEST, updateNewsSaga);
  yield takeLatest(actions.NEWS_DELETE_REQUEST, deleteNewsSaga);
}
