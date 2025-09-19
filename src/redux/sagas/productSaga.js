import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { toast } from "react-toastify";
import {
  PRODUCT_LIST_REQUEST,
  productListSuccess,
  productListFailure,
  PRODUCT_DETAIL_REQUEST,
  productDetailSuccess,
  productDetailFailure,
  PRODUCT_CREATE_REQUEST,
  productCreateSuccess,
  productCreateFailure,
  PRODUCT_UPDATE_REQUEST,
  productUpdateSuccess,
  productUpdateFailure,
  PRODUCT_DELETE_REQUEST,
  productDeleteSuccess,
  productDeleteFailure,
  PRODUCT_STATS_REQUEST,
  productStatsSuccess,
  productStatsFailure,
} from "../actions/productActions";

// NOTE: Backend runs at 3002 and exposes routes under /api
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
  
  // Add category filter if provided
  if (query.categoryName && query.categoryName.trim()) {
    params.append("categoryName", query.categoryName.trim());
  }
  
  const queryString = params.toString();
  const url = queryString ? `${API_BASE_URL}/products?${queryString}` : `${API_BASE_URL}/products`;
  
  const res = await axios.get(url, { headers: getAuthHeaders() });
  return res.data;
};

const apiDetail = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/products/${id}`, { headers: getAuthHeaders() });
  return res.data;
};

const apiCreate = async (payload) => {
  console.log("=== ProductSaga apiCreate ===");
  console.log("Received payload:", payload);
  console.log("payload.short_desc:", payload.short_desc);
  console.log("payload.detail_desc:", payload.detail_desc);
  
  // Check if payload contains image files (FormData needed)
  const hasImageFiles = payload.images && Array.isArray(payload.images) && 
    payload.images.some(img => typeof File !== 'undefined' && img instanceof File);
  let data = payload;
  
  if (hasImageFiles) {
    const formData = new FormData();
    formData.append("name", payload.name);
    if (payload.short_desc !== undefined && payload.short_desc !== "") formData.append("short_desc", payload.short_desc);
    formData.append("price", payload.price);
    formData.append("quantity", payload.stockQuantity);
    if (payload.category) formData.append("category_id", payload.category);
    if (payload.brand !== undefined && payload.brand !== "") formData.append("brand", payload.brand);
    if (payload.detail_desc !== undefined && payload.detail_desc !== "") formData.append("detail_desc", payload.detail_desc);
    if (payload.status !== undefined) formData.append("status", payload.status);
    
    // Append image files
    payload.images.forEach((image) => {
      if (image instanceof File) {
        formData.append("images", image);
      }
    });
    
    data = formData;
    console.log("=== Final FormData entries ===");
    for (let [key, value] of formData.entries()) {
      console.log(key + ": " + value);
    }
  } else {
    console.log("Using JSON payload (no images)");
  }
  
  console.log("=== Sending to backend ===");
  console.log("URL:", `${API_BASE_URL}/products`);
  console.log("Data type:", hasImageFiles ? "FormData" : "JSON");
  
  const res = await axios.post(`${API_BASE_URL}/products`, data, { headers: getAuthHeaders(hasImageFiles) });
  console.log("Backend response:", res.data);
  return res.data;
};

const apiUpdate = async (id, payload) => {
  // Check if payload contains image files (FormData needed)
  const hasImageFiles = payload.images && Array.isArray(payload.images) && 
    payload.images.some(img => typeof File !== 'undefined' && img instanceof File);
  let data = payload;
  
  if (hasImageFiles) {
    const formData = new FormData();
    formData.append("name", payload.name);
    if (payload.short_desc !== undefined && payload.short_desc !== "") formData.append("short_desc", payload.short_desc);
    formData.append("price", payload.price);
    formData.append("quantity", payload.stockQuantity);
    if (payload.category) formData.append("category_id", payload.category);
    if (payload.brand !== undefined && payload.brand !== "") formData.append("brand", payload.brand);
    if (payload.detail_desc !== undefined && payload.detail_desc !== "") formData.append("detail_desc", payload.detail_desc);
    if (payload.status !== undefined) formData.append("status", payload.status);
    
    // Append image files
    payload.images.forEach((image) => {
      if (image instanceof File) {
        formData.append("images", image);
      }
    });
    
    data = formData;
  }
  
  const res = await axios.put(`${API_BASE_URL}/products/${id}`, data, { headers: getAuthHeaders(hasImageFiles) });
  return res.data;
};

const apiDelete = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/products/${id}`, { headers: getAuthHeaders() });
  return res.data;
};

const apiStats = async () => {
  const res = await axios.get(`${API_BASE_URL}/products/stats`, { headers: getAuthHeaders() });
  return res.data;
};

// Workers
function* listWorker(action) {
  try {
    const query = action.payload?.query || {};
    const data = yield call(apiList, query);
    if (data.status === "OK") {
      yield put(productListSuccess(data.data || [], data.pagination));
    } else {
      throw new Error(data.message || "Failed to fetch products");
    }
  } catch (error) {
    yield put(productListFailure(error.message));
    toast.error(error.message);
  }
}

function* detailWorker(action) {
  try {
    const data = yield call(apiDetail, action.payload.id);
    if (data.status === "OK") {
      yield put(productDetailSuccess(data.data));
    } else {
      throw new Error(data.message || "Failed to fetch product detail");
    }
  } catch (error) {
    yield put(productDetailFailure(error.message));
    toast.error(error.message);
  }
}

function* createWorker(action) {
  try {
    const data = yield call(apiCreate, action.payload);
    if (data.status === "OK") {
      yield put(productCreateSuccess(data.data, data.message));
      toast.success(data.message || "Product created");
    } else {
      // Bubble up server message with full details for debugging
      const message = typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
      throw new Error(message || "Create product failed");
    }
  } catch (error) {
    const friendly = error?.response?.data?.message || error.message;
    yield put(productCreateFailure(friendly));
    toast.error(friendly);
  }
}

function* updateWorker(action) {
  try {
    const { id, payload } = action.payload;
    const data = yield call(apiUpdate, id, payload);
    if (data.status === "OK") {
      yield put(productUpdateSuccess(data.data, data.message));
      toast.success(data.message || "Product updated");
    } else {
      const message = typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
      throw new Error(message || "Update product failed");
    }
  } catch (error) {
    const friendly = error?.response?.data?.message || error.message;
    yield put(productUpdateFailure(friendly));
    toast.error(friendly);
  }
}

function* deleteWorker(action) {
  try {
    const { id } = action.payload;
    const data = yield call(apiDelete, id);
    if (data.status === "OK") {
      yield put(productDeleteSuccess(id, data.message));
      toast.success(data.message || "Product deleted");
    } else {
      throw new Error(data.message || "Delete product failed");
    }
  } catch (error) {
    yield put(productDeleteFailure(error.message));
    toast.error(error.message);
  }
}

function* statsWorker() {
  try {
    const data = yield call(apiStats);
    if (data.status === "OK") {
      yield put(productStatsSuccess(data.data));
    } else {
      throw new Error(data.message || "Failed to fetch product stats");
    }
  } catch (error) {
    yield put(productStatsFailure(error.message));
    toast.error(error.message);
  }
}

// Watchers
export default function* productSaga() {
  yield takeLatest(PRODUCT_LIST_REQUEST, listWorker);
  yield takeLatest(PRODUCT_DETAIL_REQUEST, detailWorker);
  yield takeLatest(PRODUCT_CREATE_REQUEST, createWorker);
  yield takeLatest(PRODUCT_UPDATE_REQUEST, updateWorker);
  yield takeLatest(PRODUCT_DELETE_REQUEST, deleteWorker);
  yield takeLatest(PRODUCT_STATS_REQUEST, statsWorker);
}
