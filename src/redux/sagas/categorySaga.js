import { call, put, takeLatest } from "redux-saga/effects";
import apiClient from "../../utils/axiosConfigNoCredentials";
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



const API_BASE_URL = 'http://localhost:3000';

// Helper function để xử lý lỗi và hiển thị toast
const handleError = (error) => {
  console.log('🔍 CategorySaga handleError:', error.response?.status, error.response?.data);
  
  const errorMessage = error.response?.data?.message || error.message;
  
  // Không hiển thị toast cho 401 vì axios interceptor đã xử lý
  if (error.response?.status === 401) {
    console.log('🚫 401 error handled by axios interceptor');
    return errorMessage;
  } else if (error.response?.status === 403) {
    console.log('🚫 403 error - access denied');
    toast.error("Không có quyền truy cập. Vui lòng kiểm tra lại quyền của bạn!");
  } else {
    toast.error(errorMessage);
  }
  
  return errorMessage;
};



// API helpers
const apiList = async (query = {}) => {
  const params = new URLSearchParams();
  
  // Add pagination
  if (query.page) params.append("page", query.page);
  if (query.limit) params.append("limit", query.limit);
  
  // Add status filter if provided - backend expects boolean string
  if (query.status && query.status !== "all") {
    const statusValue = query.status === "active" ? "true" : "false";
    params.append("status", statusValue);
  }
  
  // Add keyword search if provided - backend uses both keyword and name
  if (query.keyword && query.keyword.trim()) {
    params.append("keyword", query.keyword.trim());
  }
  
  // Add sort parameters if provided - map frontend values to backend expected values
  if (query.sortBy && query.sortBy.trim()) {
    const sortBy = query.sortBy.trim().toLowerCase();
    // Map frontend sortBy to backend expected values
    if (sortBy === "default" || sortBy === "none" || sortBy === "") {
      // Default mode - không gửi sort parameters
    } else if (sortBy === "createdat" || sortBy === "created") {
      params.append("sortBy", "createdat");
    } else if (sortBy === "name") {
      params.append("sortBy", "name");
    } else {
      // Default to no sort if invalid
    }
  }
  if (query.sortOrder && query.sortOrder.trim()) {
    const sortOrder = query.sortOrder.trim().toLowerCase();
    // Validate sortOrder
    if (sortOrder === "asc" || sortOrder === "desc") {
      params.append("sortOrder", sortOrder);
    }
  }
  
  const queryString = params.toString();
  const url = queryString ? `${API_BASE_URL}/catalog/api/categories?${queryString}` : `${API_BASE_URL}/catalog/api/categories`;
  
  const res = await apiClient.get(url.replace(API_BASE_URL, ''));
  return res.data;
};

const apiDetail = async (id) => {
  const res = await apiClient.get(`/catalog/api/categories/${id}`);
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
    // Add imagePublicId if provided
    if (payload.imagePublicId) formData.append("imagePublicId", payload.imagePublicId);
    data = formData;
  }
  
  const res = await apiClient.post('/catalog/api/categories', data);
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
    // Add imagePublicId if provided
    if (payload.imagePublicId) formData.append("imagePublicId", payload.imagePublicId);
    data = formData;
  }
  
  const res = await apiClient.put(`/catalog/api/categories/${id}`, data);
  return res.data;
};

const apiDelete = async (id) => {
  const res = await apiClient.delete(`/catalog/api/categories/${id}`);
  return res.data;
};

const apiStats = async () => {
  const res = await apiClient.get('/catalog/api/categories/stats');
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
      // Backend trả về lỗi với message chi tiết
      throw new Error(data.message || "Không thể tải danh sách danh mục");
    }
  } catch (error) {
    // Xử lý lỗi từ backend hoặc network - chỉ hiển thị toast một lần
    const errorMessage = handleError(error);
    yield put(categoryListFailure(errorMessage));
  }
}

function* detailWorker(action) {
  try {
    const data = yield call(apiDetail, action.payload.id);
    if (data.status === "OK") {
      yield put(categoryDetailSuccess(data.data));
    } else {
      // Backend trả về lỗi với message chi tiết
      throw new Error(data.message || "Không thể tải chi tiết danh mục");
    }
  } catch (error) {
    // Xử lý lỗi từ backend hoặc network - chỉ hiển thị toast một lần
    const errorMessage = handleError(error);
    yield put(categoryDetailFailure(errorMessage));
  }
}

function* createWorker(action) {
  try {
    const data = yield call(apiCreate, action.payload);
    if (data.status === "OK") {
      yield put(categoryCreateSuccess(data.data, data.message));
      toast.success(data.message || "Danh mục đã được tạo thành công");
    } else {
      // Backend trả về lỗi với message chi tiết
      throw new Error(data.message || "Tạo danh mục thất bại");
    }
  } catch (error) {
    // Xử lý lỗi từ backend hoặc network - chỉ hiển thị toast một lần
    const errorMessage = handleError(error);
    yield put(categoryCreateFailure(errorMessage));
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
      // Backend trả về lỗi với message chi tiết
      throw new Error(data.message || "Cập nhật danh mục thất bại");
    }
  } catch (error) {
    // Xử lý lỗi từ backend hoặc network - chỉ hiển thị toast một lần
    const errorMessage = handleError(error);
    yield put(categoryUpdateFailure(errorMessage));
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
      // Backend trả về lỗi với message chi tiết
      throw new Error(data.message || "Xóa danh mục thất bại");
    }
  } catch (error) {
    // Xử lý lỗi từ backend hoặc network - chỉ hiển thị toast một lần
    const errorMessage = handleError(error);
    yield put(categoryDeleteFailure(errorMessage));
  }
}

function* statsWorker() {
  try {
    const data = yield call(apiStats);
    if (data.status === "OK") {
      yield put(categoryStatsSuccess(data.data));
    } else {
      // Backend trả về lỗi với message chi tiết
      throw new Error(data.message || "Không thể tải thống kê danh mục");
    }
  } catch (error) {
    // Xử lý lỗi từ backend hoặc network - chỉ hiển thị toast một lần
    const errorMessage = handleError(error);
    yield put(categoryStatsFailure(errorMessage));
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


