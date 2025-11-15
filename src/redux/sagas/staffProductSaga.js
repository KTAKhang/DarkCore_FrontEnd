// src/redux/sagas/staffProductSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import { message } from "antd";
import axios from "axios";
import {
    STAFF_PRODUCT_LIST_REQUEST,
    staffProductListSuccess,
    staffProductListFailure,
    STAFF_PRODUCT_DETAIL_REQUEST,
    staffProductDetailSuccess,
    staffProductDetailFailure,
    STAFF_PRODUCT_CREATE_REQUEST,
    staffProductCreateSuccess,
    staffProductCreateFailure,
    STAFF_PRODUCT_UPDATE_REQUEST,
    staffProductUpdateSuccess,
    staffProductUpdateFailure,
    STAFF_PRODUCT_DELETE_REQUEST,
    staffProductDeleteSuccess,
    staffProductDeleteFailure,
    STAFF_PRODUCT_STATS_REQUEST,
    staffProductStatsSuccess,
    staffProductStatsFailure,
} from "../actions/staffProductActions";

// DÙNG PORT TRỰC TIẾP TRONG SAGA
const API_BASE_URL = "http://localhost:3000/product-staff";

// ✅ TẠO AXIOS INSTANCE - KHÔNG SET HEADERS MẶC ĐỊNH
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// ✅ INTERCEPTOR CHỈ SET Content-Type KHI KHÔNG PHẢI FormData
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Chỉ set JSON cho non-FormData requests
    if (!(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
    }
    
    return config;
});

// Tự động xử lý FormData
const handleFormData = (data) => {
    if (data instanceof FormData) {
        // Browser tự set boundary
        return data;
    }
    return data;
};

// API Functions
const apiList = async (query = {}) => {
    const params = new URLSearchParams();
    if (query.page) params.append("page", query.page);
    if (query.limit) params.append("limit", query.limit);
    if (query.status && query.status !== "all")
        params.append("status", query.status === "active" ? "true" : "false");
    if (query.keyword?.trim()) params.append("keyword", query.keyword.trim());
    if (query.categoryName?.trim()) params.append("categoryName", query.categoryName.trim());
    if (query.sortBy && !["default", "none", ""].includes(query.sortBy))
        params.append("sortBy", query.sortBy);
    if (query.sortOrder && ["asc", "desc"].includes(query.sortOrder))
        params.append("sortOrder", query.sortOrder);

    const url = `/product${params.toString() ? `?${params.toString()}` : ""}`;
    const res = await api.get(url);
    return res.data;
};

const apiDetail = async (id) => {
    const res = await api.get(`/product/${id}`);
    return res.data;
};

// staffProductSaga.js
const apiCreate = async (payload) => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("price", payload.price);
  
  // ✅ SỬA: stockQuantity → quantity
  formData.append("quantity", payload.quantity); // ← DÒNG NÀY
  
  formData.append("category_id", payload.category_id);

  if (payload.short_desc) formData.append("short_desc", payload.short_desc);
  if (payload.detail_desc) formData.append("detail_desc", payload.detail_desc);
  if (payload.brand) formData.append("brand", payload.brand);
  if (payload.status !== undefined) formData.append("status", payload.status);

  payload.images.forEach((file) => {
    if (file instanceof File) {
      formData.append("images", file);
    }
  });

  const token = localStorage.getItem("token");
  const res = await axios.post("http://localhost:3000/product-staff/", formData, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return res.data;
};

const apiUpdate = async (id, payload) => {
    let data = payload;
    if (payload.images?.some((img) => img instanceof File)) {
        const formData = new FormData();
        formData.append("name", payload.name);
        if (payload.short_desc) formData.append("short_desc", payload.short_desc);
        formData.append("price", payload.price);
        formData.append("quantity", payload.quantity);
        formData.append("category", payload.category_id);
        if (payload.brand) formData.append("brand", payload.brand);
        if (payload.detail_desc) formData.append("detail_desc", payload.detail_desc);
        if (payload.status !== undefined) formData.append("status", payload.status);
        payload.images.forEach((img) => img instanceof File && formData.append("images", img));
        data = formData;
    }
    const res = await api.put(`/${id}`, handleFormData(data));
    return res.data;
};

const apiDelete = async (id) => {
    const res = await api.delete(`/${id}`);
    return res.data;
};

const apiStats = async () => {
    const res = await api.get("/product/stats");
    return res.data;
};

// Workers
function* listWorker(action) {
    try {
        const data = yield call(apiList, action.payload?.query);
        if (data.status === "OK") {
            yield put(staffProductListSuccess(data.data || [], data.pagination));
        } else throw new Error(data.message || "Lỗi tải danh sách");
    } catch (error) {
        yield put(staffProductListFailure(error.response?.data?.message || error.message));
    }
}

function* detailWorker(action) {
    try {
        const data = yield call(apiDetail, action.payload.id);
        if (data.status === "OK") yield put(staffProductDetailSuccess(data.data));
        else throw new Error(data.message);
    } catch (error) {
        yield put(staffProductDetailFailure(error.response?.data?.message || error.message));
    }
}

// staffProductSaga.js

function* createWorker(action) {
    try {
        const data = yield call(apiCreate, action.payload);

        if (data.status === "OK") {
            yield put(staffProductCreateSuccess(data.data, data.message));
            message.success(data.message || "Tạo sản phẩm thành công!");
        } else {
            throw new Error(data.message || "Tạo sản phẩm thất bại");
        }
    } catch (error) {
        const msg = error.response?.data?.message || error.message || "Lỗi không xác định";
        yield put(staffProductCreateFailure(msg));
        message.error(msg);
    }
}

function* updateWorker(action) {
    try {
        const { id, payload } = action.payload;
        const data = yield call(apiUpdate, id, payload);
        if (data.status === "OK") {
            yield put(staffProductUpdateSuccess(data.data, data.message));
            message.success(data.message || "Cập nhật sản phẩm thành công!");
        } else {
            throw new Error(data.message || "Cập nhật sản phẩm thất bại");
        }
    } catch (error) {
        const msg = error.response?.data?.message || error.message || "Lỗi không xác định";
        yield put(staffProductUpdateFailure(msg));
        message.error(msg);
    }
}

function* deleteWorker(action) {
    try {
        const data = yield call(apiDelete, action.payload.id);
        if (data.status === "OK") yield put(staffProductDeleteSuccess(action.payload.id, data.message));
        else throw new Error(data.message);
    } catch (error) {
        yield put(staffProductDeleteFailure(error.response?.data?.message || error.message));
    }
}

function* statsWorker() {
    try {
        const data = yield call(apiStats);
        if (data.status === "OK") yield put(staffProductStatsSuccess(data.data));
        else throw new Error(data.message);
    } catch (error) {
        yield put(staffProductStatsFailure(error.response?.data?.message || error.message));
    }
}

export default function* staffProductSaga() {
    yield takeLatest(STAFF_PRODUCT_LIST_REQUEST, listWorker);
    yield takeLatest(STAFF_PRODUCT_DETAIL_REQUEST, detailWorker);
    yield takeLatest(STAFF_PRODUCT_CREATE_REQUEST, createWorker);
    yield takeLatest(STAFF_PRODUCT_UPDATE_REQUEST, updateWorker);
    yield takeLatest(STAFF_PRODUCT_DELETE_REQUEST, deleteWorker);
    yield takeLatest(STAFF_PRODUCT_STATS_REQUEST, statsWorker);
}