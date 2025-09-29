import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { toast } from "react-toastify";
import {
    GET_ALL_CUSTOMERS_REQUEST,
    getAllCustomersSuccess,
    getAllCustomersFailure,
    GET_CUSTOMER_BY_ID_REQUEST,
    getCustomerByIdSuccess,
    getCustomerByIdFailure,
    UPDATE_CUSTOMER_STATUS_REQUEST,
    updateCustomerStatusSuccess,
    updateCustomerStatusFailure,
} from "../actions/customerAction";

const API_BASE_URL = "http://localhost:3000";

// ===== API CALL (có check refresh token) =====
const apiCall = async (method, url, data = null, isForm = false) => {
    const token = localStorage.getItem("token");
    try {
        const res = await axios({
            method,
            url: `${API_BASE_URL}${url}`,
            data,
            withCredentials: true,
            headers: {
                "Content-Type": isForm ? "multipart/form-data" : "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        if (error.response?.status === 401) {
            console.log("401 → thử refresh token");
            try {
                const refreshRes = await axios.post(
                    `${API_BASE_URL}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );
                const newToken = refreshRes.data?.token?.access_token;
                if (newToken) {
                    localStorage.setItem("token", newToken);
                    // thử gọi lại với token mới
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
        throw error;
    }
};

// ===== GET ALL CUSTOMERS =====
function* getAllCustomersSaga(action) {
    try {
        const { page, limit, search, status, isGoogleAccount, sort } = action.payload || {};
        const query = new URLSearchParams({
            page, limit, search, status, isGoogleAccount, sort
        }).toString();

        const response = yield call(() => apiCall("get", `/customer/get-all?${query}`));
        if (response.status === "OK") {
            yield put(getAllCustomersSuccess(response.data));
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        yield put(getAllCustomersFailure(error.message));
        toast.error(error.message || "Lỗi khi lấy danh sách khách hàng");
    }
}

// ===== GET CUSTOMER BY ID =====
function* getCustomerByIdSaga(action) {
    try {
        const response = yield call(() => apiCall("get", `/customer/${action.payload}`));
        if (response.status === "OK") {
            yield put(getCustomerByIdSuccess(response.data));
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        yield put(getCustomerByIdFailure(error.message));
        toast.error(error.message || "Lỗi khi lấy chi tiết khách hàng");
    }
}

// ===== UPDATE STATUS =====
function* updateCustomerStatusSaga(action) {
    try {
        const { id, status } = action.payload;
        const response = yield call(() => apiCall("put", `/customer/${id}/status`, { status }));
        if (response.status === "OK") {
            yield put(updateCustomerStatusSuccess(response.message, response.data));
            toast.success(response.message || "Cập nhật trạng thái thành công");
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        yield put(updateCustomerStatusFailure(error.message));
        toast.error(error.message || "Cập nhật trạng thái thất bại");
    }
}

export default function* customerSaga() {
    yield takeLatest(GET_ALL_CUSTOMERS_REQUEST, getAllCustomersSaga);
    yield takeLatest(GET_CUSTOMER_BY_ID_REQUEST, getCustomerByIdSaga);
    yield takeLatest(UPDATE_CUSTOMER_STATUS_REQUEST, updateCustomerStatusSaga);
}
