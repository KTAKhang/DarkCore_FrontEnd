import { call, put, takeLatest } from "redux-saga/effects";
import apiClient from "../../utils/axiosConfigNoCredentials";
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


// Helper function để xử lý lỗi - chỉ log, không hiển thị toast
const handleError = (error) => {
  console.log('🔍 ProductSaga handleError:', error.response?.status, error.response?.data);
  
  const errorMessage = error.response?.data?.message || error.message;
  
  // Chỉ log lỗi, không hiển thị toast để tránh spam thông báo
  console.log('🚫 Error occurred:', errorMessage);
  
  return errorMessage;
};


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
  
  // Add sort parameters if provided - map frontend values to backend expected values
  if (query.sortBy && query.sortBy.trim()) {
    const sortBy = query.sortBy.trim().toLowerCase();
    // Map frontend sortBy to backend expected values
    if (sortBy === "default" || sortBy === "none" || sortBy === "") {
      // Default mode - không gửi sort parameters
    } else if (sortBy === "createdat" || sortBy === "created") {
      params.append("sortBy", "createdat");
    } else if (sortBy === "price") {
      params.append("sortBy", "price");
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
  const url = queryString ? `/catalog/api/products?${queryString}` : `/catalog/api/products`;
  
  const res = await apiClient.get(url);
  return res.data;
};

const apiDetail = async (id) => {
  const res = await apiClient.get(`/catalog/api/products/${id}`);
  return res.data;
};

const apiCreate = async (payload) => {
  // Check if payload contains image files (FormData needed)
  const hasImageFiles = payload.images && Array.isArray(payload.images) && 
    payload.images.some(img => typeof File !== 'undefined' && img instanceof File);
  let data = payload;
  
  if (hasImageFiles) {
    const formData = new FormData();
    formData.append("name", payload.name);
    if (payload.short_desc !== undefined && payload.short_desc !== "") formData.append("short_desc", payload.short_desc);
    formData.append("price", payload.price);
    formData.append("stockQuantity", payload.stockQuantity);
    if (payload.category) formData.append("category", payload.category);
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
  
  const res = await apiClient.post('/catalog/api/products', data);
  return res.data;
};

const apiUpdate = async (id, payload) => {
  console.log("=== ProductSaga apiUpdate ===");
  console.log("ID:", id);
  console.log("Payload:", payload);
  
  // Check if payload contains image files (FormData needed)
  const hasImageFiles = payload.images && Array.isArray(payload.images) && 
    payload.images.some(img => typeof File !== 'undefined' && img instanceof File);
  let data = payload;
  
  console.log("Has image files:", hasImageFiles);
  
  if (hasImageFiles) {
    const formData = new FormData();
    formData.append("name", payload.name);
    if (payload.short_desc !== undefined && payload.short_desc !== "") formData.append("short_desc", payload.short_desc);
    formData.append("price", payload.price);
    formData.append("stockQuantity", payload.stockQuantity);
    if (payload.category) formData.append("category", payload.category);
    if (payload.brand !== undefined && payload.brand !== "") formData.append("brand", payload.brand);
    if (payload.detail_desc !== undefined && payload.detail_desc !== "") formData.append("detail_desc", payload.detail_desc);
    if (payload.status !== undefined) formData.append("status", payload.status);
    
    // Append image files
    payload.images.forEach((image, index) => {
      if (image instanceof File) {
        console.log(`Appending image ${index}:`, image.name, image.size);
        formData.append("images", image);
      }
    });
    
    data = formData;
    console.log("FormData created with entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof File ? `File(${value.name})` : value);
    }
  }
  
  console.log("Sending request to:", `/catalog/api/products/${id}`);
  console.log("Data type:", data instanceof FormData ? "FormData" : "JSON");
  
  const res = await apiClient.put(`/catalog/api/products/${id}`, data);
  console.log("Update response:", res.data);
  return res.data;
};

const apiDelete = async (id) => {
  const res = await apiClient.delete(`/catalog/api/products/${id}`);
  return res.data;
};

const apiStats = async () => {
  const res = await apiClient.get('/catalog/api/products/stats');
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
      throw new Error(data.message || "Không thể tải danh sách sản phẩm");
    }
  } catch (error) {
    // Xử lý lỗi từ backend hoặc network - chỉ hiển thị toast một lần
    const errorMessage = handleError(error);
    yield put(productListFailure(errorMessage));
  }
}

function* detailWorker(action) {
  try {
    const data = yield call(apiDetail, action.payload.id);
    if (data.status === "OK") {
      yield put(productDetailSuccess(data.data));
    } else {
      throw new Error(data.message || "Không thể tải chi tiết sản phẩm");
    }
  } catch (error) {
    // Xử lý lỗi từ backend hoặc network - chỉ hiển thị toast một lần
    const errorMessage = handleError(error);
    yield put(productDetailFailure(errorMessage));
  }
}

function* createWorker(action) {
  try {
    console.log("=== ProductSaga createWorker ===");
    console.log("action.payload:", action.payload);
    
    const data = yield call(apiCreate, action.payload);
    console.log("Backend response data:", data);
    console.log("data.data:", data.data);
    console.log("data.data.category:", data.data?.category);
    
    if (data.status === "OK") {
      yield put(productCreateSuccess(data.data, data.message));
    } else {
      // Backend trả về lỗi với message chi tiết
      throw new Error(data.message || "Tạo sản phẩm thất bại");
    }
  } catch (error) {
    // Xử lý lỗi từ backend hoặc network - chỉ hiển thị toast một lần
    const errorMessage = handleError(error);
    yield put(productCreateFailure(errorMessage));
  }
}

function* updateWorker(action) {
  try {
    const { id, payload } = action.payload;
    const data = yield call(apiUpdate, id, payload);
    if (data.status === "OK") {
      yield put(productUpdateSuccess(data.data, data.message));
    } else {
      // Backend trả về lỗi với message chi tiết
      throw new Error(data.message || "Cập nhật sản phẩm thất bại");
    }
  } catch (error) {
    // Xử lý lỗi từ backend hoặc network - chỉ hiển thị toast một lần
    const errorMessage = handleError(error);
    yield put(productUpdateFailure(errorMessage));
  }
}

function* deleteWorker(action) {
  try {
    const { id } = action.payload;
    const data = yield call(apiDelete, id);
    if (data.status === "OK") {
      yield put(productDeleteSuccess(id, data.message));
    } else {
      // Backend trả về lỗi với message chi tiết
      throw new Error(data.message || "Xóa sản phẩm thất bại");
    }
  } catch (error) {
    // Xử lý lỗi từ backend hoặc network - chỉ hiển thị toast một lần
    const errorMessage = handleError(error);
    yield put(productDeleteFailure(errorMessage));
  }
}

function* statsWorker() {
  try {
    const data = yield call(apiStats);
    if (data.status === "OK") {
      yield put(productStatsSuccess(data.data));
    } else {
      // Backend trả về lỗi với message chi tiết
      throw new Error(data.message || "Không thể tải thống kê sản phẩm");
    }
  } catch (error) {
    // Xử lý lỗi từ backend hoặc network - chỉ hiển thị toast một lần
    const errorMessage = handleError(error);
    yield put(productStatsFailure(errorMessage));
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
