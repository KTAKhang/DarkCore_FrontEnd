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



const API_BASE_URL = 'http://localhost:3000';
const CATALOG_SERVICE_URL = 'http://localhost:3002'; // Direct catalog service

function getAuthHeaders(isFormData = false) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");
  
  // Debug user role for category management
  console.log("🔍 Category Management - User Role Check:");
  console.log("👤 User:", user ? JSON.parse(user) : "NO USER");
  console.log("🎭 Role:", role || "NO ROLE");
  console.log("🔑 Token:", token ? `${token.substring(0, 20)}...` : "NO TOKEN");
  
  // Debug token structure and expiration
  if (token) {
    try {
      const tokenParts = token.split('.');
      console.log("🔍 Token parts count:", tokenParts.length);
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log("🔍 Token payload:", payload);
        console.log("🔍 Token exp:", new Date(payload.exp * 1000));
        console.log("🔍 Token iat:", new Date(payload.iat * 1000));
        console.log("🔍 Current time:", new Date());
        console.log("🔍 Is token expired?", new Date() > new Date(payload.exp * 1000));
        console.log("🔍 Token user_id:", payload._id);
        console.log("🔍 Token role:", payload.role);
      }
    } catch (e) {
      console.error("❌ Error parsing token:", e);
    }
  }
  
  // Check if user has admin role
  if (role !== "admin") {
    console.warn("⚠️ User does not have admin role. Category management requires admin access.");
    console.warn("💡 Current role:", role, "- Required role: admin");
  } else {
    console.log("✅ User has admin role - access should be granted");
  }
  
  const headers = { accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";
  
  console.log("📤 Final headers being sent:", headers);
  return headers;
}

// Test token validity with a simple API call
const testTokenValidity = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("❌ No token found for testing");
      return false;
    }
    
    console.log("🧪 Testing token validity...");
    console.log("🔍 Testing with headers:", getAuthHeaders());
    
    // Test 1: Through API Gateway
    console.log("🔍 Test 1: Through API Gateway");
    try {
      await axios.get(`${API_BASE_URL}/catalog/api/categories?page=1&limit=1`, { 
        headers: getAuthHeaders() 
      });
      console.log("✅ API Gateway test successful");
      return true;
    } catch (gatewayError) {
      console.log("❌ API Gateway test failed:", gatewayError.response?.status, gatewayError.response?.data);
      
      // Test 2: Direct to catalog service (bypass gateway)
      console.log("🔍 Test 2: Direct to catalog service");
      try {
        await axios.get(`${CATALOG_SERVICE_URL}/api/categories?page=1&limit=1`, { 
          headers: getAuthHeaders() 
        });
        console.log("✅ Direct catalog service test successful");
        console.log("💡 Issue: API Gateway is not forwarding user data properly");
        return true;
      } catch (directError) {
        console.log("❌ Direct catalog service test failed:", directError.response?.status, directError.response?.data);
        return false;
      }
    }
  } catch (error) {
    console.log("❌ Token test failed:", error.response?.status, error.response?.data);
    console.log("❌ Full error:", error);
    return false;
  }
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
  
  // Add sort parameters if provided - backend expects sortBy and sortOrder
  if (query.sortBy && query.sortBy.trim()) {
    // Backend accepts "createdat" or "created" for date sorting
    const sortBy = query.sortBy.trim().toLowerCase();
    if (sortBy === "date" || sortBy === "createdat" || sortBy === "created") {
      params.append("sortBy", "createdAt");
    } else {
      params.append("sortBy", query.sortBy.trim());
    }
  }
  if (query.sortOrder && query.sortOrder.trim()) {
    params.append("sortOrder", query.sortOrder.trim());
  }
  
  const queryString = params.toString();
  const url = queryString ? `${API_BASE_URL}/catalog/api/categories?${queryString}` : `${API_BASE_URL}/catalog/api/categories`;
  
  const res = await axios.get(url, { headers: getAuthHeaders() });
  return res.data;
};

const apiDetail = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/catalog/api/categories/${id}`, { headers: getAuthHeaders() });
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
  
  const res = await axios.post(`${API_BASE_URL}/catalog/api/categories`, data, { headers: getAuthHeaders(isFormData) });
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
  
  const res = await axios.put(`${API_BASE_URL}/catalog/api/categories/${id}`, data, { headers: getAuthHeaders(isFormData) });
  return res.data;
};

const apiDelete = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/catalog/api/categories/${id}`, { headers: getAuthHeaders() });
  return res.data;
};

const apiStats = async () => {
  const res = await axios.get(`${API_BASE_URL}/catalog/api/categories/stats`, { headers: getAuthHeaders() });
  return res.data;
};

// Workers
function* listWorker(action) {
  try {
    const query = action.payload?.query || {};
    
    // Test token validity first
    console.log("🧪 Testing token before API call...");
    const isTokenValid = yield call(testTokenValidity);
    
    if (!isTokenValid) {
      throw new Error("Token không hợp lệ hoặc đã hết hạn");
    }
    
    const data = yield call(apiList, query);
    if (data.status === "OK") {
      yield put(categoryListSuccess(data.data || [], data.pagination));
    } else {
      throw new Error(data.message || "Không thể tải danh sách danh mục");
    }
  } catch (error) {
    console.error("❌ Category list error:", error);
    console.error("❌ Error response:", error.response?.data);
    console.error("❌ Error status:", error.response?.status);
    
    let errorMessage = error.response?.data?.message || error.message;
    
    // Handle specific error cases
    if (error.response?.status === 403) {
      if (error.response?.data?.message?.includes("Access denied")) {
        errorMessage = "Bạn không có quyền truy cập quản lý danh mục. Chỉ Admin mới có thể truy cập tính năng này.";
      } else {
        errorMessage = "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.";
      }
    } else if (error.response?.status === 401) {
      errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
    }
    
    yield put(categoryListFailure(errorMessage));
    toast.error(errorMessage);
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
    console.error("❌ Category detail error:", error);
    yield put(categoryDetailFailure(error.response?.data?.message || error.message));
    toast.error(error.response?.data?.message || error.message);
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
    console.error("❌ Category create error:", error);
    yield put(categoryCreateFailure(error.response?.data?.message || error.message));
    toast.error(error.response?.data?.message || error.message);
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
    console.error("❌ Category update error:", error);
    yield put(categoryUpdateFailure(error.response?.data?.message || error.message));
    toast.error(error.response?.data?.message || error.message);
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
    console.error("❌ Category delete error:", error);
    yield put(categoryDeleteFailure(error.response?.data?.message || error.message));
    toast.error(error.response?.data?.message || error.message);
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
    console.error("❌ Category stats error:", error);
    yield put(categoryStatsFailure(error.response?.data?.message || error.message));
    toast.error(error.response?.data?.message || error.message);
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


