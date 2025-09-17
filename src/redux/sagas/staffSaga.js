import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";
import { toast } from "react-toastify";
import {
  STAFF_LIST_REQUEST,
  STAFF_LIST_SUCCESS,
  STAFF_LIST_FAILURE,
  STAFF_CREATE_REQUEST,
  STAFF_CREATE_SUCCESS,
  STAFF_CREATE_FAILURE,
  STAFF_UPDATE_REQUEST,
  STAFF_UPDATE_SUCCESS,
  STAFF_UPDATE_FAILURE,
  STAFF_DETAIL_REQUEST,
  STAFF_DETAIL_SUCCESS,
  STAFF_DETAIL_FAILURE,
} from "../actions/staffActions";

// Use API Gateway base and attach JWT
const API_BASE_URL = "http://localhost:3000";
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const headers = { accept: "application/json", "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

// 📌 Lấy danh sách staff
function* fetchStaffList(action) {
  try {
    console.log("📌 [Saga] Fetch staff list, params:", action.payload);

    const params = action.payload || {};
    let request;
    if (params.keyword && params.keyword.trim()) {
      request = axios.get(`${API_BASE_URL}/staff/search`, { params: { keyword: params.keyword.trim() }, headers: getAuthHeaders() });
    } else if ((params.role && params.role.trim()) || (params.status && params.status.trim())) {
      const filterParams = {};
      if (params.role) filterParams.role = params.role;
      if (params.status) filterParams.status = params.status;
      request = axios.get(`${API_BASE_URL}/staff/filter`, { params: filterParams, headers: getAuthHeaders() });
    } else {
      request = axios.get(`${API_BASE_URL}/staff`, { headers: getAuthHeaders() });
    }
    const res = yield call(() => request);

    console.log("📌 [Saga] Staff list response:", res.data);

    yield put({ type: STAFF_LIST_SUCCESS, payload: res.data });
  } catch (err) {
    console.error("❌ [Saga] Fetch staff list error:", err);
    yield put({
      type: STAFF_LIST_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
  }
}

// 📌 Tạo staff
function* createStaff(action) {
  try {
    console.log("📌 [Saga] Create staff, data:", action.payload);

    // Backend create route is POST /staff (but router defines /staff POST under base "/")
    // Our gateway mounts staff service at /staff, but router has POST /staff
    yield call(() => axios.post(`${API_BASE_URL}/staff/staff`, action.payload, { headers: getAuthHeaders() }));

    yield put({ type: STAFF_CREATE_SUCCESS });
    toast.success("Tạo nhân viên thành công");
    yield put({ type: STAFF_LIST_REQUEST });
  } catch (err) {
    console.error("❌ [Saga] Create staff error:", err);
    yield put({
      type: STAFF_CREATE_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
  }
}

// 📌 Cập nhật staff
function* updateStaff(action) {
  try {
    const { id, data } = action.payload;
    console.log("📌 [Saga] Update staff:", id, data);

    // Update status endpoint
    yield call(() => axios.put(`${API_BASE_URL}/staff/status/${id}`, data, { headers: getAuthHeaders() }));

    yield put({ type: STAFF_UPDATE_SUCCESS });
    toast.success("Cập nhật trạng thái nhân viên thành công");
    yield put({ type: STAFF_LIST_REQUEST });
  } catch (err) {
    console.error("❌ [Saga] Update staff error:", err);
    const message = err.response?.data?.message || err.message;
    yield put({ type: STAFF_UPDATE_FAILURE, payload: message });
    toast.error(message);
  }
}

// 📌 Lấy chi tiết staff
function* fetchStaffDetail(action) {
  try {
    console.log("📌 [Saga] Fetch staff detail id:", action.payload);

    const res = yield call(() =>
      axios.get(`${API_BASE_URL}/staff/${action.payload}`, { headers: getAuthHeaders() })
    );

    console.log("📌 [Saga] Staff detail response:", res.data);

    yield put({ type: STAFF_DETAIL_SUCCESS, payload: res.data });
  } catch (err) {
    console.error("❌ [Saga] Fetch staff detail error:", err);
    yield put({
      type: STAFF_DETAIL_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
  }
}

export default function* staffSaga() {
  yield takeLatest(STAFF_LIST_REQUEST, fetchStaffList);
  yield takeLatest(STAFF_CREATE_REQUEST, createStaff);
  yield takeLatest(STAFF_UPDATE_REQUEST, updateStaff);
  yield takeLatest(STAFF_DETAIL_REQUEST, fetchStaffDetail);
}
