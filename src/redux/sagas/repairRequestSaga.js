import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { toast } from "react-toastify";
import {
  REPAIR_REQUEST_CREATE_REQUEST,
  repairRequestCreateSuccess,
  repairRequestCreateFailure,
  REPAIR_REQUEST_UPDATE_REQUEST,
  repairRequestUpdateSuccess,
  repairRequestUpdateFailure,
  REPAIR_REQUEST_CANCEL_REQUEST,
  repairRequestCancelSuccess,
  repairRequestCancelFailure,
  REPAIR_REQUEST_LIST_ALL_REQUEST,
  repairRequestListAllSuccess,
  repairRequestListAllFailure,
  REPAIR_REQUEST_ASSIGN_REQUEST,
  repairRequestAssignSuccess,
  repairRequestAssignFailure,
  REPAIR_REQUEST_STATUS_UPDATE_REQUEST,
  repairRequestStatusUpdateSuccess,
  repairRequestStatusUpdateFailure,
  REPAIR_REQUEST_LIST_ASSIGNED_REQUEST,
  repairRequestListAssignedSuccess,
  repairRequestListAssignedFailure,
} from "../actions/repairRequestActions";

const API_BASE_URL = 'http://localhost:3000';

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers = { accept: "application/json", "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

// API helpers
const apiCreate = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}/repair/api/repairs`, payload, { headers: getAuthHeaders() });
  return res.data;
};

const apiUpdate = async (id, payload) => {
  const res = await axios.put(`${API_BASE_URL}/repair/api/repairs/${id}`, payload, { headers: getAuthHeaders() });
  return res.data;
};

const apiCancel = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/repair/api/repairs/${id}`, { headers: getAuthHeaders() });
  return res.data;
};


const apiAssign = async (id, technicianId) => {
  const res = await axios.patch(`${API_BASE_URL}/repair/api/repairs/${id}/assign`, { technicianId }, { headers: getAuthHeaders() });
  return res.data;
};

const apiStatusUpdate = async (id, status) => {
  const res = await axios.patch(`${API_BASE_URL}/repair/api/repairs/${id}/status`, { status }, { headers: getAuthHeaders() });
  return res.data;
};

const apiListAssigned = async () => {
  const res = await axios.get(`${API_BASE_URL}/repair/api/repairs/assigned/me`, { headers: getAuthHeaders() });
  return res.data;
};

// Workers
function* createWorker(action) {
  try {
    const data = yield call(apiCreate, action.payload);
    if (data.status === "OK") {
      yield put(repairRequestCreateSuccess(data.data, data.message));
      toast.success(data.message || "Tạo yêu cầu sửa chữa thành công");
    } else {
      throw new Error(data.message || "Tạo yêu cầu thất bại");
    }
  } catch (error) {
    const friendly = error?.response?.data?.message || error.message;
    yield put(repairRequestCreateFailure(friendly));
    toast.error(friendly);
  }
}

function* updateWorker(action) {
  try {
    const { id, payload } = action.payload;
    const data = yield call(apiUpdate, id, payload);
    if (data.status === "OK") {
      yield put(repairRequestUpdateSuccess(data.data, data.message));
      toast.success(data.message || "Cập nhật yêu cầu thành công");
    } else {
      throw new Error(data.message || "Cập nhật yêu cầu thất bại");
    }
  } catch (error) {
    const friendly = error?.response?.data?.message || error.message;
    yield put(repairRequestUpdateFailure(friendly));
    toast.error(friendly);
  }
}

function* cancelWorker(action) {
  try {
    const { id } = action.payload;
    const data = yield call(apiCancel, id);
    if (data.status === "OK") {
      yield put(repairRequestCancelSuccess(id, data.message));
      toast.success(data.message || "Hủy yêu cầu thành công");
    } else {
      throw new Error(data.message || "Hủy yêu cầu thất bại");
    }
  } catch (error) {
    yield put(repairRequestCancelFailure(error.message));
    toast.error(error.message);
  }
}

function* listAllWorker(action) {
  try {
    const searchParams = action.payload || {};
    const params = new URLSearchParams();
    
    params.append('username', searchParams.username || '');
    params.append('status', searchParams.status || '');
    params.append('_t', Date.now());
    
    const url = `${API_BASE_URL}/repair/api/repairs?${params.toString()}`;
    const res = yield call(axios.get, url, { headers: getAuthHeaders() });
    const data = res.data;
    
    if (data.status === "OK") {
      yield put(repairRequestListAllSuccess(data.data || []));
    } else {
      throw new Error(data.message || "Không thể tải danh sách yêu cầu");
    }
  } catch (error) {
    yield put(repairRequestListAllFailure(error.message));
    toast.error(error.message);
  }
}

function* assignWorker(action) {
  try {
    const { id, technicianId } = action.payload;
    const data = yield call(apiAssign, id, technicianId);
    if (data.status === "OK") {
      yield put(repairRequestAssignSuccess(data.data, data.message));
      toast.success(data.message || "Phân công kỹ thuật viên thành công");
    } else {
      throw new Error(data.message || "Phân công thất bại");
    }
  } catch (error) {
    const friendly = error?.response?.data?.message || error.message;
    yield put(repairRequestAssignFailure(friendly));
    toast.error(friendly);
  }
}

function* statusUpdateWorker(action) {
  try {
    const { id, status } = action.payload;
    const data = yield call(apiStatusUpdate, id, status);
    if (data.status === "OK") {
      yield put(repairRequestStatusUpdateSuccess(data.data, data.message));
      toast.success(data.message || "Cập nhật trạng thái thành công");
    } else {
      throw new Error(data.message || "Cập nhật trạng thái thất bại");
    }
  } catch (error) {
    const friendly = error?.response?.data?.message || error.message;
    yield put(repairRequestStatusUpdateFailure(friendly));
    toast.error(friendly);
  }
}

function* listAssignedWorker() {
  try {
    const data = yield call(apiListAssigned);
    if (data.status === "OK") {
      yield put(repairRequestListAssignedSuccess(data.data || []));
    } else {
      throw new Error(data.message || "Không thể tải danh sách được giao");
    }
  } catch (error) {
    yield put(repairRequestListAssignedFailure(error.message));
    toast.error(error.message);
  }
}

export default function* repairRequestSaga() {
  yield takeLatest(REPAIR_REQUEST_CREATE_REQUEST, createWorker);
  yield takeLatest(REPAIR_REQUEST_UPDATE_REQUEST, updateWorker);
  yield takeLatest(REPAIR_REQUEST_CANCEL_REQUEST, cancelWorker);
  yield takeLatest(REPAIR_REQUEST_LIST_ALL_REQUEST, listAllWorker);
  yield takeLatest(REPAIR_REQUEST_ASSIGN_REQUEST, assignWorker);
  yield takeLatest(REPAIR_REQUEST_STATUS_UPDATE_REQUEST, statusUpdateWorker);
  yield takeLatest(REPAIR_REQUEST_LIST_ASSIGNED_REQUEST, listAssignedWorker);
}


