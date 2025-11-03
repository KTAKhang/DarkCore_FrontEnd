import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import axios from "axios";
import {
    STAFF_ORDER_LIST_REQUEST,
    STAFF_ORDER_DETAIL_REQUEST,
    STAFF_ORDER_UPDATE_STATUS_REQUEST,
    STAFF_ORDER_STATUSES_REQUEST,
    STAFF_ORDER_STATS_REQUEST,
    staffOrderListSuccess,
    staffOrderListFailed,
    staffOrderDetailSuccess,
    staffOrderDetailFailed,
    staffOrderUpdateStatusSuccess,
    staffOrderUpdateStatusFailed,
    staffOrderStatusesSuccess,
    staffOrderStatusesFailed,
    staffOrderStatsSuccess,
    staffOrderStatsFailed,
} from "../actions/orderStaffAction";

const API_BASE_URL = "http://localhost:3000";



const apiCall = async (method, url, data = null, isForm = false) => {
    const token = localStorage.getItem("token");
    try {
        const res = await axios({
            method,
            url: `${API_BASE_URL}${url}`,
            data: data ? data : undefined,
            withCredentials: true,
            headers: {
                "Content-Type": isForm ? "multipart/form-data" : "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        if (error.response?.status === 401) {
            console.log("401");
            try {
                const refreshRes = await axios.post(
                    `${API_BASE_URL}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );
                const newToken = refreshRes.data?.token?.access_token;
                if (newToken) {
                    localStorage.setItem("token", newToken);
                    // thử gọi lại request với token mới
                    const retryRes = await axios({
                        method,
                        url: `${API_BASE_URL}${url}`,
                        data,
                        withCredentials: true,
                        headers: {
                            "Content-Type": isForm ? "multipart/form-data" : "application/json",
                            Authorization: `Bearer ${newToken}`,
                        },
                    });
                    return retryRes.data;
                }
            } catch (refreshError) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
            }
        }

        if (error.response?.status === 403) {
            alert("Tài khoản của bạn đã bị khóa bởi admin.");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }

        throw error;
    }
};

// ========== 🧩 Saga: Lấy danh sách đơn hàng ==========
function* fetchOrdersSaga(action) {
    try {
        const query = new URLSearchParams(action.payload).toString();
        const response = yield call(apiCall, "get", `/sale-staff/orders?${query}`);

        if (response.status === "OK") {
            yield put(staffOrderListSuccess(response.data, response.pagination));
        } else {
            yield put(staffOrderListFailed(response.message));
            toast.error(response.message);
        }
    } catch (error) {
        yield put(staffOrderListFailed(error.message));
        toast.error("Lỗi khi tải danh sách đơn hàng");
    }
}

// ========== 🧩 Saga: Lấy chi tiết đơn hàng ==========
function* fetchOrderDetailSaga(action) {
    try {
        const response = yield call(apiCall, "get", `/sale-staff/orders/${action.payload}`);
        if (response.status === "OK") {
            yield put(staffOrderDetailSuccess(response.data));
        } else {
            yield put(staffOrderDetailFailed(response.message));
            toast.error(response.message);
        }
    } catch (error) {
        yield put(staffOrderDetailFailed(error.message));
        toast.error("Lỗi khi lấy chi tiết đơn hàng");
    }
}

// ========== 🧩 Saga: Cập nhật trạng thái đơn hàng ==========
function* updateOrderStatusSaga(action) {
    try {
        const { id, payload } = action.payload;
        const response = yield call(apiCall, "put", `/sale-staff/orders/${id}/status`, payload);

        if (response.status === "OK") {
            yield put(staffOrderUpdateStatusSuccess(response.data));
            toast.success("Cập nhật trạng thái đơn hàng thành công");
        } else {
            yield put(staffOrderUpdateStatusFailed(response.message));
            toast.error(response.message);
        }
    } catch (error) {
        yield put(staffOrderUpdateStatusFailed(error.message));
        toast.error("Lỗi khi cập nhật trạng thái đơn hàng");
    }
}

// ========== 🧩 Saga: Lấy danh sách trạng thái ==========
function* fetchOrderStatusesSaga() {
    try {
        const response = yield call(apiCall, "get", `/sale-staff/order-statuses`);
        if (response.status === "OK") {
            yield put(staffOrderStatusesSuccess(response.data));
        } else {
            yield put(staffOrderStatusesFailed(response.message));
            toast.error(response.message);
        }
    } catch (error) {
        yield put(staffOrderStatusesFailed(error.message));
        toast.error("Lỗi khi lấy danh sách trạng thái");
    }
}

// ========== 🧩 Saga: Lấy thống kê đơn hàng ==========
function* fetchOrderStatsSaga() {
    try {
        const response = yield call(apiCall, "get", "/sale-staff/orders/stats");
        if (response.status === "OK") {
            yield put(staffOrderStatsSuccess(response.data));
        } else {
            yield put(staffOrderStatsFailed(response.message));
            toast.error(response.message);
        }
    } catch (error) {
        yield put(staffOrderStatsFailed(error.message));
        toast.error("Lỗi khi lấy thống kê đơn hàng");
    }
}

// ========== 🧠 Root Saga ==========
export default function* orderStaffSaga() {
    yield takeLatest(STAFF_ORDER_LIST_REQUEST, fetchOrdersSaga);
    yield takeLatest(STAFF_ORDER_DETAIL_REQUEST, fetchOrderDetailSaga);
    yield takeLatest(STAFF_ORDER_UPDATE_STATUS_REQUEST, updateOrderStatusSaga);
    yield takeLatest(STAFF_ORDER_STATUSES_REQUEST, fetchOrderStatusesSaga);
    yield takeLatest(STAFF_ORDER_STATS_REQUEST, fetchOrderStatsSaga);
}
