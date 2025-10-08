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

const apiList = async () => {
  const res = await axios.get(`${API_BASE_URL}/repair/api/services`, { headers: getAuthHeaders() });
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

function* listWorker() {
  try {
    const data = yield call(apiList);
    if (data.status === "OK") {
      yield put(repairServiceListSuccess(data.data || []));
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


