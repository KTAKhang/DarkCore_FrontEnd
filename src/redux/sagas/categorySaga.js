import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { toast } from "react-toastify";
import {
  CATEGORY_LIST_REQUEST,
  categoryListSuccess,
  categoryListFailure,
  CATEGORY_DETAIL_REQUEST,
  categoryDetailSuccess,
  categoryDetailFailure,
  CATEGORY_CREATE_REQUEST,
  categoryCreateSuccess,
  categoryCreateFailure,
  CATEGORY_UPDATE_REQUEST,
  categoryUpdateSuccess,
  categoryUpdateFailure,
  CATEGORY_DELETE_REQUEST,
  categoryDeleteSuccess,
  categoryDeleteFailure,
  CATEGORY_STATS_REQUEST,
  categoryStatsSuccess,
  categoryStatsFailure,
} from "../actions/categoryActions";

// NOTE: Backend runs at 3001 and exposes routes under /api
const API_BASE_URL = "http://localhost:3002/api";

function getAuthHeaders(isFormData = false) {
  const token = localStorage.getItem("token");
  const headers = { accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";
  return headers;
}

// API helpers
const apiList = async (query = {}) => {
  const params = new URLSearchParams();
  
  // Add pagination
  if (query.page) params.append("page", query.page);
  if (query.limit) params.append("limit", query.limit);
  
  // Add status filter if provided
  if (query.status && query.status !== "all") {
    const statusValue = query.status === "active" ? "true" : "false";
    params.append("status", statusValue);
  }
  
  // Add keyword search if provided
  if (query.keyword && query.keyword.trim()) {
    params.append("keyword", query.keyword.trim());
  }
  
  // Add sort parameters if provided
  if (query.sortBy && query.sortBy.trim()) {
    params.append("sortBy", query.sortBy.trim());
  }
  if (query.sortOrder && query.sortOrder.trim()) {
    params.append("sortOrder", query.sortOrder.trim());
  }
  
  const queryString = params.toString();
  const url = queryString ? `${API_BASE_URL}/categories?${queryString}` : `${API_BASE_URL}/categories`;
  
  const res = await axios.get(url, { headers: getAuthHeaders() });
  return res.data;
};

const apiDetail = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/categories/${id}`, { headers: getAuthHeaders() });
  return res.data;
};

const apiCreate = async (payload) => {
  // Check if payload contains image file (FormData needed)
  const isFormData = payload.image && payload.image instanceof File;
  let data = payload;
  
  if (isFormData) {
    const formData = new FormData();
    formData.append("name", payload.name);
    if (payload.description) formData.append("description", payload.description);
    if (payload.status !== undefined) formData.append("status", payload.status);
    formData.append("image", payload.image);
    data = formData;
  }
  
  const res = await axios.post(`${API_BASE_URL}/categories`, data, { headers: getAuthHeaders(isFormData) });
  return res.data;
};

const apiUpdate = async (id, payload) => {
  // Check if payload contains image file (FormData needed)
  const isFormData = payload.image && payload.image instanceof File;
  let data = payload;
  
  if (isFormData) {
    const formData = new FormData();
    formData.append("name", payload.name);
    if (payload.description) formData.append("description", payload.description);
    if (payload.status !== undefined) formData.append("status", payload.status);
    formData.append("image", payload.image);
    data = formData;
  }
  
  const res = await axios.put(`${API_BASE_URL}/categories/${id}`, data, { headers: getAuthHeaders(isFormData) });
  return res.data;
};

const apiDelete = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/categories/${id}`, { headers: getAuthHeaders() });
  return res.data;
};

const apiStats = async () => {
  const res = await axios.get(`${API_BASE_URL}/categories/stats`, { headers: getAuthHeaders() });
  return res.data;
};

// Workers
function* listWorker(action) {
  try {
    const query = action.payload?.query || {};
    const data = yield call(apiList, query);
    if (data.status === "OK") {
      yield put(categoryListSuccess(data.data || [], data.pagination));
    } else {
      throw new Error(data.message || "Không thể tải danh sách danh mục");
    }
  } catch (error) {
    yield put(categoryListFailure(error.message));
    toast.error(error.message);
  }
}

function* detailWorker(action) {
  try {
    const data = yield call(apiDetail, action.payload.id);
    if (data.status === "OK") {
      yield put(categoryDetailSuccess(data.data));
    } else {
      throw new Error(data.message || "Không thể tải chi tiết danh mục");
    }
  } catch (error) {
    yield put(categoryDetailFailure(error.message));
    toast.error(error.message);
  }
}

function* createWorker(action) {
  try {
    const data = yield call(apiCreate, action.payload);
    if (data.status === "OK") {
      yield put(categoryCreateSuccess(data.data, data.message));
      toast.success(data.message || "Danh mục đã được tạo thành công");
    } else {
      throw new Error(data.message || "Tạo danh mục thất bại");
    }
  } catch (error) {
    yield put(categoryCreateFailure(error.message));
    toast.error(error.message);
  }
}

function* updateWorker(action) {
  try {
    const { id, payload } = action.payload;
    const data = yield call(apiUpdate, id, payload);
    if (data.status === "OK") {
      yield put(categoryUpdateSuccess(data.data, data.message));
      toast.success(data.message || "Danh mục đã được cập nhật thành công");
    } else {
      throw new Error(data.message || "Cập nhật danh mục thất bại");
    }
  } catch (error) {
    yield put(categoryUpdateFailure(error.message));
    toast.error(error.message);
  }
}

function* deleteWorker(action) {
  try {
    const { id } = action.payload;
    const data = yield call(apiDelete, id);
    if (data.status === "OK") {
      yield put(categoryDeleteSuccess(id, data.message));
      toast.success(data.message || "Danh mục đã được xóa thành công");
    } else {
      throw new Error(data.message || "Xóa danh mục thất bại");
    }
  } catch (error) {
    yield put(categoryDeleteFailure(error.message));
    toast.error(error.message);
  }
}

function* statsWorker() {
  try {
    const data = yield call(apiStats);
    if (data.status === "OK") {
      yield put(categoryStatsSuccess(data.data));
    } else {
      throw new Error(data.message || "Không thể tải thống kê danh mục");
    }
  } catch (error) {
    yield put(categoryStatsFailure(error.message));
    toast.error(error.message);
  }
}

// Watchers
export default function* categorySaga() {
  yield takeLatest(CATEGORY_LIST_REQUEST, listWorker);
  yield takeLatest(CATEGORY_DETAIL_REQUEST, detailWorker);
  yield takeLatest(CATEGORY_CREATE_REQUEST, createWorker);
  yield takeLatest(CATEGORY_UPDATE_REQUEST, updateWorker);
  yield takeLatest(CATEGORY_DELETE_REQUEST, deleteWorker);
  yield takeLatest(CATEGORY_STATS_REQUEST, statsWorker);
}


