import { call, put, takeLatest } from "redux-saga/effects";
import apiClient from "../../utils/axiosConfig";
import apiClientNoCredentials from "../../utils/axiosConfigNoCredentials";
import {
  ABOUT_PUBLIC_INFO_REQUEST,
  aboutPublicInfoSuccess,
  aboutPublicInfoFailure,
  ABOUT_INFO_REQUEST,
  aboutInfoSuccess,
  aboutInfoFailure,
  ABOUT_CREATE_OR_UPDATE_REQUEST,
  aboutCreateOrUpdateSuccess,
  aboutCreateOrUpdateFailure,
  ABOUT_UPDATE_STATUS_REQUEST,
  aboutUpdateStatusSuccess,
  aboutUpdateStatusFailure,
  ABOUT_UPDATE_STATS_REQUEST,
  aboutUpdateStatsSuccess,
  aboutUpdateStatsFailure,
  ABOUT_DELETE_REQUEST,
  aboutDeleteSuccess,
  aboutDeleteFailure,
} from "../actions/aboutActions";
import { toast } from "react-toastify";

// Helper function để xử lý lỗi
const handleError = (error) => {
  console.log('🔍 AboutSaga handleError:', error.response?.status, error.response?.data);
  const errorMessage = error.response?.data?.message || error.message;
  console.log('🚫 Error occurred:', errorMessage);
  return errorMessage;
};

// API helpers - Public endpoint (không cần auth)
const apiGetAboutInfo = async () => {
  const res = await apiClientNoCredentials.get('/about/about');
  return res.data;
};

// API helpers - Admin endpoint (cần auth)
const apiGetAboutInfoForAdmin = async () => {
  const res = await apiClient.get('/about/admin/about');
  return res.data;
};

const apiCreateOrUpdateAbout = async (payload) => {
  console.log("=== AboutSaga apiCreateOrUpdate ===");
  console.log("Payload:", payload);
  
  // Check if payload contains logo file (FormData needed)
  const hasLogoFile = payload.logoFile && typeof File !== 'undefined' && payload.logoFile instanceof File;
  let data = payload;
  
  console.log("Has logo file:", hasLogoFile);
  
  if (hasLogoFile) {
    const formData = new FormData();
    
    // Append basic string fields
    if (payload.storeName !== undefined) formData.append("storeName", payload.storeName);
    if (payload.slogan !== undefined) formData.append("slogan", payload.slogan);
    if (payload.story !== undefined) formData.append("story", payload.story);
    if (payload.mission !== undefined) formData.append("mission", payload.mission);
    if (payload.vision !== undefined) formData.append("vision", payload.vision);
    if (payload.email !== undefined) formData.append("email", payload.email);
    if (payload.phone !== undefined) formData.append("phone", payload.phone);
    if (payload.address !== undefined) formData.append("address", payload.address);
    if (payload.workingHours !== undefined) formData.append("workingHours", payload.workingHours);
    if (payload.status !== undefined) formData.append("status", payload.status.toString());
    
    // Append objects and arrays as JSON strings (backend will parse them)
    if (payload.coreValues) {
      const coreValuesStr = JSON.stringify(payload.coreValues);
      console.log("CoreValues JSON:", coreValuesStr);
      formData.append("coreValues", coreValuesStr);
    }
    if (payload.socialMedia) {
      const socialMediaStr = JSON.stringify(payload.socialMedia);
      console.log("SocialMedia JSON:", socialMediaStr);
      formData.append("socialMedia", socialMediaStr);
    }
    if (payload.stats) {
      const statsStr = JSON.stringify(payload.stats);
      console.log("Stats JSON:", statsStr);
      formData.append("stats", statsStr);
    }
    if (payload.images && Array.isArray(payload.images) && payload.images.length > 0) {
      const imagesStr = JSON.stringify(payload.images);
      console.log("Images JSON:", imagesStr);
      formData.append("images", imagesStr);
    }
    
    // Append logo file with field name 'logo'
    formData.append('logo', payload.logoFile);
    
    data = formData;
    console.log("FormData created with entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof File ? `File(${value.name})` : value);
    }
  }
  
  console.log("Sending request to: /about/admin/about");
  console.log("Data type:", data instanceof FormData ? "FormData" : "JSON");
  
  const res = await apiClient.post('/about/admin/about', data);
  console.log("Create/Update response:", res.data);
  return res.data;
};

const apiUpdateAboutStatus = async (payload) => {
  const res = await apiClient.put('/about/admin/about/status', payload);
  return res.data;
};

const apiUpdateStats = async (stats) => {
  const res = await apiClient.put('/about/admin/about/stats', { stats });
  return res.data;
};

const apiDeleteAbout = async () => {
  const res = await apiClient.delete('/about/admin/about');
  return res.data;
};

// Workers
function* getPublicAboutInfoWorker() {
  try {
    const data = yield call(apiGetAboutInfo);
    if (data.status === "OK") {
      yield put(aboutPublicInfoSuccess(data.data));
    } else {
      throw new Error(data.message || "Không thể tải thông tin About Us");
    }
  } catch (error) {
    const errorMessage = handleError(error);
    yield put(aboutPublicInfoFailure(errorMessage));
  }
}

function* getAboutInfoWorker() {
  try {
    const data = yield call(apiGetAboutInfoForAdmin);
    if (data.status === "OK") {
      yield put(aboutInfoSuccess(data.data));
    } else {
      throw new Error(data.message || "Không thể tải thông tin About Us");
    }
  } catch (error) {
    const errorMessage = handleError(error);
    yield put(aboutInfoFailure(errorMessage));
  }
}

function* createOrUpdateAboutWorker(action) {
  try {
    const data = yield call(apiCreateOrUpdateAbout, action.payload);
    if (data.status === "OK") {
      yield put(aboutCreateOrUpdateSuccess(data.data, data.message));
      toast.success(data.message || "Lưu thông tin About Us thành công!");
    } else {
      throw new Error(data.message || "Lưu thông tin About Us thất bại");
    }
  } catch (error) {
    const errorMessage = handleError(error);
    yield put(aboutCreateOrUpdateFailure(errorMessage));
    toast.error(errorMessage || "Lưu thông tin About Us thất bại!");
  }
}

function* updateAboutStatusWorker(action) {
  try {
    const data = yield call(apiUpdateAboutStatus, action.payload);
    if (data.status === "OK") {
      yield put(aboutUpdateStatusSuccess(data.data, data.message));
      toast.success(data.message || "Cập nhật trạng thái thành công!");
    } else {
      throw new Error(data.message || "Cập nhật trạng thái thất bại");
    }
  } catch (error) {
    const errorMessage = handleError(error);
    yield put(aboutUpdateStatusFailure(errorMessage));
    toast.error(errorMessage || "Cập nhật trạng thái thất bại!");
  }
}

function* updateStatsWorker(action) {
  try {
    const data = yield call(apiUpdateStats, action.payload);
    if (data.status === "OK") {
      yield put(aboutUpdateStatsSuccess(data.data, data.message));
      toast.success(data.message || "Cập nhật thống kê thành công!");
    } else {
      throw new Error(data.message || "Cập nhật thống kê thất bại");
    }
  } catch (error) {
    const errorMessage = handleError(error);
    yield put(aboutUpdateStatsFailure(errorMessage));
    toast.error(errorMessage || "Cập nhật thống kê thất bại!");
  }
}

function* deleteAboutWorker() {
  try {
    const data = yield call(apiDeleteAbout);
    if (data.status === "OK") {
      yield put(aboutDeleteSuccess(data.message));
      toast.success(data.message || "Xóa thông tin About Us thành công!");
    } else {
      throw new Error(data.message || "Xóa thông tin About Us thất bại");
    }
  } catch (error) {
    const errorMessage = handleError(error);
    yield put(aboutDeleteFailure(errorMessage));
    toast.error(errorMessage || "Xóa thông tin About Us thất bại!");
  }
}

// Watchers
export default function* aboutSaga() {
  yield takeLatest(ABOUT_PUBLIC_INFO_REQUEST, getPublicAboutInfoWorker);
  yield takeLatest(ABOUT_INFO_REQUEST, getAboutInfoWorker);
  yield takeLatest(ABOUT_CREATE_OR_UPDATE_REQUEST, createOrUpdateAboutWorker);
  yield takeLatest(ABOUT_UPDATE_STATUS_REQUEST, updateAboutStatusWorker);
  yield takeLatest(ABOUT_UPDATE_STATS_REQUEST, updateStatsWorker);
  yield takeLatest(ABOUT_DELETE_REQUEST, deleteAboutWorker);
}