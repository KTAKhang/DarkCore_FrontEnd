import { call, put, takeEvery } from "redux-saga/effects";
import apiClient from "../../utils/axiosConfig";
import {
  ORDER_LIST_REQUEST,
  ORDER_DETAIL_REQUEST,
  ORDER_UPDATE_STATUS_REQUEST,
  ORDER_STATS_REQUEST,
  ORDER_STATUSES_REQUEST,
  ORDER_HISTORY_REQUEST,
  ORDER_CREATE_REQUEST,
  orderListSuccess,
  orderListFailed,
  orderDetailSuccess,
  orderDetailFailed,
  orderUpdateStatusSuccess,
  orderUpdateStatusFailed,
  orderStatsSuccess,
  orderStatsFailed,
  orderStatusesSuccess,
  orderStatusesFailed,
  orderHistorySuccess,
  orderHistoryFailure,
  orderCreateSuccess,
  orderCreateFailure,
} from "../actions/orderActions";

// API call functions
function* fetchOrdersApi(params) {
  const response = yield call(apiClient.get, "/order/orders", {
    params,
  });
  return response.data;
}

function* fetchOrderDetailApi(id) {
  const response = yield call(apiClient.get, `/order/orders/${id}`);
  return response.data;
}

function* updateOrderStatusApi(id, payload) {
  const response = yield call(apiClient.put, `/order/orders/${id}/status`, payload);
  return response.data;
}

// Removed unused function - using direct API call in saga

// Mock data removed - using real API only

// Saga functions
function* fetchOrdersSaga(action) {
  try {
    console.log("🚀 fetchOrdersSaga called with action:", action);
    console.log("🔄 Calling real API...");
    
    const response = yield call(fetchOrdersApi, action.payload);
    console.log("✅ API response:", response);
    
    if (response.status === "OK") {
      yield put(orderListSuccess(response.data, response.pagination));
    } else {
      yield put(orderListFailed(response.message || "Lỗi khi tải danh sách đơn hàng"));
    }
    
    // Real API only - no fallback
  } catch (error) {
    console.log("❌ API Error:", error);
    const errorMessage = error.response?.data?.message || error.message || "Lỗi kết nối server";
    yield put(orderListFailed(errorMessage));
  }
}

function* fetchOrderDetailSaga(action) {
  try {
    const { id } = action.payload;
    const response = yield call(fetchOrderDetailApi, id);
    
    if (response.status === "OK") {
      yield put(orderDetailSuccess(response.data));
    } else {
      yield put(orderDetailFailed(response.message || "Lỗi khi tải chi tiết đơn hàng"));
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Lỗi kết nối server";
    yield put(orderDetailFailed(errorMessage));
  }
}

function* updateOrderStatusSaga(action) {
  try {
    const { id, ...payload } = action.payload;
    const response = yield call(updateOrderStatusApi, id, payload);
    
    if (response.status === "OK") {
      yield put(orderUpdateStatusSuccess(response.data));
    } else {
      yield put(orderUpdateStatusFailed(response.message || "Lỗi khi cập nhật trạng thái đơn hàng"));
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Lỗi kết nối server";
    yield put(orderUpdateStatusFailed(errorMessage));
  }
}

function* fetchOrderStatsSaga() {
  try {
    console.log("🚀 fetchOrderStatsSaga called");
    console.log("🔄 Calling stats API...");
    
    const response = yield call(apiClient.get, "/order/orders/stats");
    console.log("✅ API stats response:", response);
    
    if (response.data.status === "OK") {
      yield put(orderStatsSuccess(response.data.data));
    } else {
      console.log("❌ API stats error:", response.data.message);
      yield put(orderStatsFailed(response.data.message || "Lỗi khi tải thống kê đơn hàng"));
    }
    
  } catch (error) {
    console.log("❌ API Stats Error:", error);
    const errorMessage = error.response?.data?.message || error.message || "Lỗi kết nối server";
    yield put(orderStatsFailed(errorMessage));
  }
}

function* fetchOrderStatusesSaga() {
  try {
    console.log("🚀 fetchOrderStatusesSaga called");
    console.log("🔄 Calling order statuses API...");
    
    const response = yield call(apiClient.get, "/order/order-statuses");
    console.log("✅ API order statuses response:", response);
    
    if (response.data.status === "OK") {
      yield put(orderStatusesSuccess(response.data.data));
    } else {
      console.log("❌ API order statuses error:", response.data.message);
      yield put(orderStatusesFailed(response.data.message || "Lỗi khi tải danh sách trạng thái đơn hàng"));
    }
    
  } catch (error) {
    console.log("❌ API Order Statuses Error:", error);
    const errorMessage = error.response?.data?.message || error.message || "Lỗi kết nối server";
    yield put(orderStatusesFailed(errorMessage));
  }
}

// 🆕 Lấy lịch sử đơn hàng của khách hàng
function* fetchOrderHistorySaga(action) {
  try {
    console.log("🚀 fetchOrderHistorySaga called with action:", action);
    const { userId, query } = action.payload;
    
    console.log("🔄 Calling order history API for userId:", userId, "with query:", query);
    
    const response = yield call(apiClient.get, `/order/orders/history/${userId}`, {
      params: query
    });
    console.log("✅ API order history response:", response);
    
    if (response.data.status === "OK") {
      yield put(orderHistorySuccess(response.data.data, response.data.pagination));
    } else {
      console.log("❌ API order history error:", response.data.message);
      yield put(orderHistoryFailure(response.data.message || "Lỗi khi tải lịch sử đơn hàng"));
    }
    
  } catch (error) {
    console.log("❌ API Order History Error:", error);
    const errorMessage = error.response?.data?.message || error.message || "Lỗi kết nối server";
    yield put(orderHistoryFailure(errorMessage));
  }
}

// 🆕 Tạo đơn hàng mới
function* createOrderSaga(action) {
  try {
    console.log("🚀 createOrderSaga called with action:", action);
    
    const response = yield call(apiClient.post, "/order/orders", action.payload);
    console.log("✅ API create order response:", response);
    
    if (response.data.status === "OK") {
      yield put(orderCreateSuccess(response.data.data));
    } else {
      console.log("❌ API create order error:", response.data.message);
      yield put(orderCreateFailure(response.data.message || "Lỗi khi tạo đơn hàng"));
    }
    
  } catch (error) {
    console.log("❌ API Create Order Error:", error);
    const errorMessage = error.response?.data?.message || error.message || "Lỗi kết nối server";
    yield put(orderCreateFailure(errorMessage));
  }
}

// Watcher sagas
export function* watchFetchOrders() {
  yield takeEvery(ORDER_LIST_REQUEST, fetchOrdersSaga);
}

export function* watchFetchOrderDetail() {
  yield takeEvery(ORDER_DETAIL_REQUEST, fetchOrderDetailSaga);
}

export function* watchUpdateOrderStatus() {
  yield takeEvery(ORDER_UPDATE_STATUS_REQUEST, updateOrderStatusSaga);
}

export function* watchFetchOrderStats() {
  yield takeEvery(ORDER_STATS_REQUEST, fetchOrderStatsSaga);
}

export function* watchFetchOrderStatuses() {
  yield takeEvery(ORDER_STATUSES_REQUEST, fetchOrderStatusesSaga);
}

export function* watchFetchOrderHistory() {
  yield takeEvery(ORDER_HISTORY_REQUEST, fetchOrderHistorySaga);
}

export function* watchCreateOrder() {
  yield takeEvery(ORDER_CREATE_REQUEST, createOrderSaga);
}

// Root order saga
// update order status
export default function* orderSaga() {
  console.log("🚀 orderSaga root saga initialized");
  yield takeEvery(ORDER_LIST_REQUEST, fetchOrdersSaga);
  yield takeEvery(ORDER_DETAIL_REQUEST, fetchOrderDetailSaga);
  yield takeEvery(ORDER_UPDATE_STATUS_REQUEST, updateOrderStatusSaga);
  yield takeEvery(ORDER_STATS_REQUEST, fetchOrderStatsSaga);
  yield takeEvery(ORDER_STATUSES_REQUEST, fetchOrderStatusesSaga);
  yield takeEvery(ORDER_HISTORY_REQUEST, fetchOrderHistorySaga);
  yield takeEvery(ORDER_CREATE_REQUEST, createOrderSaga);
}
