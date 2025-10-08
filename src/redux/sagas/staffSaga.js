import { takeLatest, call, put, select } from "redux-saga/effects";
import apiClient from "../../utils/axiosConfigNoCredentials";
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

const API_BASE_URL = "http://localhost:3000";
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const headers = { accept: "application/json", "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

//Lấy danh sách staff
function* fetchStaffList(action) {
  try {
    const params = action.payload || {};
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      sortBy: params.sortBy || undefined,
      sortOrder: params.sortOrder || undefined,
    };
    if (params.keyword && params.keyword.trim()) {
      queryParams.keyword = params.keyword.trim();
    }
    if (params.role && params.role !== "all") {
      queryParams.role = params.role;
    }
    if (params.status && params.status !== "all") {
      queryParams.status = params.status;
    }

    let request;
    if (queryParams.keyword && !queryParams.role && !queryParams.status) {
      request = axios.get(`${API_BASE_URL}/staff/search`, {
        params: queryParams,
        headers: getAuthHeaders(),
      });
    } else if ((queryParams.role || queryParams.status) && !queryParams.keyword) {
      const { role, status, page, limit, sortBy, sortOrder } = queryParams;
      request = axios.get(`${API_BASE_URL}/staff/filter`, {
        params: { role, status, page, limit, sortBy, sortOrder },
        headers: getAuthHeaders(),
      });
    } else {
      request = axios.get(`${API_BASE_URL}/staff`, {
        params: queryParams,
        headers: getAuthHeaders(),
      });
    }

    const res = yield call(() => request);
    let payload = res.data;

    if (payload && payload.data && payload.pagination) {
      // OK rồi
    } else if (Array.isArray(payload)) {
      payload = {
        data: payload,
        pagination: { page: 1, limit: payload.length, total: payload.length },
      };
    }

    yield put({ type: STAFF_LIST_SUCCESS, payload });
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
    yield call(() =>
      axios.post(`${API_BASE_URL}/staff/staff`, action.payload, {
        headers: getAuthHeaders(),
      })
    );

    yield put({ type: STAFF_CREATE_SUCCESS });
    toast.success("Tạo nhân viên thành công");

    // ✅ reload list với params hiện tại
    const currentParams = yield select((state) => state.staff.params);
    yield put({ type: STAFF_LIST_REQUEST, payload: currentParams });
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
    yield call(() =>
      axios.put(`${API_BASE_URL}/staff/status/${id}`, data, {
        headers: getAuthHeaders(),
      })
    );

    yield put({ type: STAFF_UPDATE_SUCCESS });
    toast.success("Cập nhật trạng thái nhân viên thành công");

    // ✅ reload list với params hiện tại
    const currentParams = yield select((state) => state.staff.params);
    yield put({ type: STAFF_LIST_REQUEST, payload: currentParams });
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
    const res = yield call(() =>
      axios.get(`${API_BASE_URL}/staff/${action.payload}`, {
        headers: getAuthHeaders(),
      })
    );
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
