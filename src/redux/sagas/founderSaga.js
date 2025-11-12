import { call, put, takeLatest } from "redux-saga/effects";
import apiClient from "../../utils/axiosConfig";
import apiClientNoCredentials from "../../utils/axiosConfigNoCredentials";
import {
  FOUNDER_PUBLIC_LIST_REQUEST,
  founderPublicListSuccess,
  founderPublicListFailure,
  FOUNDER_LIST_REQUEST,
  founderListSuccess,
  founderListFailure,
  FOUNDER_DETAIL_REQUEST,
  founderDetailSuccess,
  founderDetailFailure,
  FOUNDER_CREATE_REQUEST,
  founderCreateSuccess,
  founderCreateFailure,
  FOUNDER_UPDATE_REQUEST,
  founderUpdateSuccess,
  founderUpdateFailure,
  FOUNDER_DELETE_REQUEST,
  founderDeleteSuccess,
  founderDeleteFailure,
  FOUNDER_UPDATE_SORT_ORDER_REQUEST,
  founderUpdateSortOrderSuccess,
  founderUpdateSortOrderFailure,
} from "../actions/founderActions";
import { toast } from "react-toastify";

// Helper function để xử lý lỗi
const handleError = (error) => {
  console.log('🔍 FounderSaga handleError:', error.response?.status, error.response?.data);
  const errorMessage = error.response?.data?.message || error.message;
  console.log('🚫 Error occurred:', errorMessage);
  return errorMessage;
};

// API helpers - Public endpoint (không cần auth)
const apiListPublicFounders = async () => {
  const res = await apiClientNoCredentials.get('/about/founders');
  return res.data;
};

const apiGetPublicFounderDetail = async (id) => {
  const res = await apiClientNoCredentials.get(`/about/founders/${id}`);
  return res.data;
};

// API helpers - Admin endpoint (cần auth)
const apiListFounders = async (query = {}) => {
  const params = new URLSearchParams();
  
  // Pagination params
  if (query.page) params.append("page", query.page);
  if (query.limit) params.append("limit", query.limit);
  
  // Filter params
  if (query.status !== undefined) params.append("status", query.status);
  if (query.search) params.append("search", query.search);
  
  const queryString = params.toString();
  const url = queryString ? `/about/admin/founders?${queryString}` : `/about/admin/founders`;
  
  const res = await apiClient.get(url);
  return res.data;
};

const apiGetFounderDetail = async (id) => {
  const res = await apiClient.get(`/about/admin/founders/${id}`);
  return res.data;
};

const apiCreateFounder = async (payload) => {
  // Check if payload contains avatar file (FormData needed)
  const hasAvatarFile = payload.avatarFile && typeof File !== 'undefined' && payload.avatarFile instanceof File;
  let data = payload;
  
  if (hasAvatarFile) {
    const formData = new FormData();
    
    // Append fields explicitly like productSaga does
    if (payload.fullName !== undefined) formData.append("fullName", payload.fullName);
    if (payload.position !== undefined) formData.append("position", payload.position);
    if (payload.bio !== undefined) formData.append("bio", payload.bio);
    if (payload.quote !== undefined) formData.append("quote", payload.quote);
    if (payload.email !== undefined) formData.append("email", payload.email);
    if (payload.phone !== undefined) formData.append("phone", payload.phone);
    if (payload.sortOrder !== undefined) formData.append("sortOrder", payload.sortOrder);
    if (payload.status !== undefined) formData.append("status", payload.status.toString());
    
    // Append objects and arrays as JSON strings (backend will parse them)
    if (payload.socialMedia) {
      formData.append("socialMedia", JSON.stringify(payload.socialMedia));
    }
    if (payload.achievements) {
      formData.append("achievements", JSON.stringify(payload.achievements));
    }
    
    // Append avatar file with field name 'avatar'
    formData.append('avatar', payload.avatarFile);
    
    data = formData;
  }
  
  const res = await apiClient.post('/about/admin/founders', data);
  return res.data;
};

const apiUpdateFounder = async (id, payload) => {
  console.log("=== FounderSaga apiUpdate ===");
  console.log("ID:", id);
  console.log("Payload:", payload);
  
  // Check if payload contains avatar file (FormData needed)
  const hasAvatarFile = payload.avatarFile && typeof File !== 'undefined' && payload.avatarFile instanceof File;
  let data = payload;
  
  console.log("Has avatar file:", hasAvatarFile);
  
  if (hasAvatarFile) {
    const formData = new FormData();
    
    // Append fields explicitly like productSaga does
    if (payload.fullName !== undefined) formData.append("fullName", payload.fullName);
    if (payload.position !== undefined) formData.append("position", payload.position);
    if (payload.bio !== undefined) formData.append("bio", payload.bio);
    if (payload.quote !== undefined) formData.append("quote", payload.quote);
    if (payload.email !== undefined) formData.append("email", payload.email);
    if (payload.phone !== undefined) formData.append("phone", payload.phone);
    if (payload.sortOrder !== undefined) formData.append("sortOrder", payload.sortOrder);
    if (payload.status !== undefined) formData.append("status", payload.status.toString());
    
    // Append objects and arrays as JSON strings (backend will parse them)
    if (payload.socialMedia) {
      const socialMediaStr = JSON.stringify(payload.socialMedia);
      console.log("SocialMedia JSON:", socialMediaStr);
      formData.append("socialMedia", socialMediaStr);
    }
    if (payload.achievements) {
      const achievementsStr = JSON.stringify(payload.achievements);
      console.log("Achievements JSON:", achievementsStr);
      formData.append("achievements", achievementsStr);
    }
    
    // Append avatar file with field name 'avatar'
    formData.append('avatar', payload.avatarFile);
    
    data = formData;
    console.log("FormData created with entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof File ? `File(${value.name})` : value);
    }
  }
  
  console.log("Sending request to:", `/about/admin/founders/${id}`);
  console.log("Data type:", data instanceof FormData ? "FormData" : "JSON");
  
  const res = await apiClient.put(`/about/admin/founders/${id}`, data);
  console.log("Update response:", res.data);
  return res.data;
};

const apiDeleteFounder = async (id) => {
  // Backend đã đổi sang permanent delete
  const res = await apiClient.delete(`/about/admin/founders/${id}`);
  return res.data;
};

const apiUpdateSortOrder = async (id, sortOrder) => {
  const res = await apiClient.put(`/about/admin/founders/${id}/sort-order`, { sortOrder });
  return res.data;
};

// Workers
function* listPublicFoundersWorker() {
  try {
    const data = yield call(apiListPublicFounders);
    if (data.status === "OK") {
      yield put(founderPublicListSuccess(data.data || []));
    } else {
      throw new Error(data.message || "Không thể tải danh sách Founder");
    }
  } catch (error) {
    const errorMessage = handleError(error);
    yield put(founderPublicListFailure(errorMessage));
  }
}

function* listFoundersWorker(action) {
  try {
    const query = action.payload?.query || {};
    const data = yield call(apiListFounders, query);
    if (data.status === "OK") {
      // Backend trả về data và pagination riêng biệt
      yield put(founderListSuccess(data.data || [], data.pagination));
    } else {
      throw new Error(data.message || "Không thể tải danh sách Founder");
    }
  } catch (error) {
    const errorMessage = handleError(error);
    yield put(founderListFailure(errorMessage));
  }
}

function* getFounderDetailWorker(action) {
  try {
    // Thử dùng public endpoint trước (cho customer view)
    let data;
    try {
      data = yield call(apiGetPublicFounderDetail, action.payload.id);
    } catch {
      // Nếu public endpoint fail (có thể do không có auth), thử admin endpoint
      data = yield call(apiGetFounderDetail, action.payload.id);
    }
    
    if (data.status === "OK") {
      yield put(founderDetailSuccess(data.data));
    } else {
      throw new Error(data.message || "Không thể tải chi tiết Founder");
    }
  } catch (error) {
    const errorMessage = handleError(error);
    yield put(founderDetailFailure(errorMessage));
  }
}

function* createFounderWorker(action) {
  try {
    const data = yield call(apiCreateFounder, action.payload);
    if (data.status === "OK") {
      yield put(founderCreateSuccess(data.data, data.message));
      toast.success(data.message || "Tạo Founder thành công!");
    } else {
      throw new Error(data.message || "Tạo Founder thất bại");
    }
  } catch (error) {
    const errorMessage = handleError(error);
    yield put(founderCreateFailure(errorMessage));
    toast.error(errorMessage || "Tạo Founder thất bại!");
  }
}

function* updateFounderWorker(action) {
  try {
    const { id, payload } = action.payload;
    const data = yield call(apiUpdateFounder, id, payload);
    if (data.status === "OK") {
      yield put(founderUpdateSuccess(data.data, data.message));
      toast.success(data.message || "Cập nhật Founder thành công!");
    } else {
      throw new Error(data.message || "Cập nhật Founder thất bại");
    }
  } catch (error) {
    const errorMessage = handleError(error);
    yield put(founderUpdateFailure(errorMessage));
    toast.error(errorMessage || "Cập nhật Founder thất bại!");
  }
}

function* deleteFounderWorker(action) {
  try {
    const { id } = action.payload;
    const data = yield call(apiDeleteFounder, id);
    if (data.status === "OK") {
      yield put(founderDeleteSuccess(id, data.message));
      toast.success(data.message || "Xóa Founder thành công!");
    } else {
      throw new Error(data.message || "Xóa Founder thất bại");
    }
  } catch (error) {
    const errorMessage = handleError(error);
    yield put(founderDeleteFailure(errorMessage));
    toast.error(errorMessage || "Xóa Founder thất bại!");
  }
}

function* updateSortOrderWorker(action) {
  try {
    const { id, sortOrder } = action.payload;
    const data = yield call(apiUpdateSortOrder, id, sortOrder);
    if (data.status === "OK") {
      yield put(founderUpdateSortOrderSuccess(data.data, data.message));
      toast.success(data.message || "Cập nhật thứ tự thành công!");
    } else {
      throw new Error(data.message || "Cập nhật thứ tự thất bại");
    }
  } catch (error) {
    const errorMessage = handleError(error);
    yield put(founderUpdateSortOrderFailure(errorMessage));
    toast.error(errorMessage || "Cập nhật thứ tự thất bại!");
  }
}

// Watchers
export default function* founderSaga() {
  yield takeLatest(FOUNDER_PUBLIC_LIST_REQUEST, listPublicFoundersWorker);
  yield takeLatest(FOUNDER_LIST_REQUEST, listFoundersWorker);
  yield takeLatest(FOUNDER_DETAIL_REQUEST, getFounderDetailWorker);
  yield takeLatest(FOUNDER_CREATE_REQUEST, createFounderWorker);
  yield takeLatest(FOUNDER_UPDATE_REQUEST, updateFounderWorker);
  yield takeLatest(FOUNDER_DELETE_REQUEST, deleteFounderWorker);
  yield takeLatest(FOUNDER_UPDATE_SORT_ORDER_REQUEST, updateSortOrderWorker);
}