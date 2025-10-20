import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { toast } from "react-toastify";
import {
  REPAIR_SERVICE_LIST_REQUEST,
  repairServiceListSuccess,
  repairServiceListFailure,
  REPAIR_SERVICE_CREATE_REQUEST,
  repairServiceCreateSuccess,
  repairServiceCreateFailure,
  REPAIR_SERVICE_UPDATE_REQUEST,
  repairServiceUpdateSuccess,
  repairServiceUpdateFailure,
  REPAIR_SERVICE_DELETE_REQUEST,
  repairServiceDeleteSuccess,
  repairServiceDeleteFailure,
} from "../actions/repairServiceActions";

const API_BASE_URL = 'http://localhost:3000';

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers = { accept: "application/json", "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

const apiList = async (query = {}) => {
  const params = new URLSearchParams();
  if (query.page) params.append('page', query.page);
  if (query.limit) params.append('limit', query.limit);
  
  const url = `${API_BASE_URL}/repair/api/services${params.toString() ? '?' + params.toString() : ''}`;
  const res = await axios.get(url, { headers: getAuthHeaders() });
  return res.data;
};

const apiCreate = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}/repair/api/services`, payload, { headers: getAuthHeaders() });
  return res.data;
};

const apiUpdate = async (id, payload) => {
  const res = await axios.put(`${API_BASE_URL}/repair/api/services/${id}`, payload, { headers: getAuthHeaders() });
  return res.data;
};

const apiDelete = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/repair/api/services/${id}`, { headers: getAuthHeaders() });
  return res.data;
};

function* listWorker(action) {
  try {
    const query = action.payload || {};
    const data = yield call(apiList, query);
    if (data.status === "OK") {
      // Handle both old format (array) and new format (object with services and pagination)
      if (Array.isArray(data.data)) {
        // Old format - just array of services
        yield put(repairServiceListSuccess(data.data, null));
      } else if (data.data && data.data.services) {
        // New format - object with services and pagination
        yield put(repairServiceListSuccess(data.data.services, data.data.pagination));
      } else {
        // Fallback
        yield put(repairServiceListSuccess(data.data, null));
      }
    } else {
      throw new Error(data.message || "Không thể tải danh sách dịch vụ sửa chữa");
    }
  } catch (error) {
    yield put(repairServiceListFailure(error.message));
    toast.error(error.message);
  }
}

function* createWorker(action) {
  try {
    const data = yield call(apiCreate, action.payload);
    if (data.status === "OK") {
      yield put(repairServiceCreateSuccess(data.data, data.message));
      toast.success(data.message || "Tạo dịch vụ thành công");
    } else {
      throw new Error(data.message || "Tạo dịch vụ thất bại");
    }
  } catch (error) {
    const friendly = error?.response?.data?.message || error.message;
    yield put(repairServiceCreateFailure(friendly));
    toast.error(friendly);
  }
}

function* updateWorker(action) {
  try {
    const { id, payload } = action.payload;
    const data = yield call(apiUpdate, id, payload);
    if (data.status === "OK") {
      yield put(repairServiceUpdateSuccess(data.data, data.message));
      toast.success(data.message || "Cập nhật dịch vụ thành công");
    } else {
      throw new Error(data.message || "Cập nhật dịch vụ thất bại");
    }
  } catch (error) {
    const friendly = error?.response?.data?.message || error.message;
    yield put(repairServiceUpdateFailure(friendly));
    toast.error(friendly);
  }
}

function* deleteWorker(action) {
  try {
    const { id } = action.payload;
    const data = yield call(apiDelete, id);
    if (data.status === "OK") {
      yield put(repairServiceDeleteSuccess(id, data.message));
      toast.success(data.message || "Xóa dịch vụ thành công");
    } else {
      throw new Error(data.message || "Xóa dịch vụ thất bại");
    }
  } catch (error) {
    yield put(repairServiceDeleteFailure(error.message));
    toast.error(error.message);
  }
}

export default function* repairServiceSaga() {
  yield takeLatest(REPAIR_SERVICE_LIST_REQUEST, listWorker);
  yield takeLatest(REPAIR_SERVICE_CREATE_REQUEST, createWorker);
  yield takeLatest(REPAIR_SERVICE_UPDATE_REQUEST, updateWorker);
  yield takeLatest(REPAIR_SERVICE_DELETE_REQUEST, deleteWorker);
}


