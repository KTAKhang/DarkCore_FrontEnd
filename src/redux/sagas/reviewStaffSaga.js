import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import axios from "axios";
import {
    GET_ALL_REVIEWS_STAFF_REQUEST,
    GET_REVIEW_DETAIL_STAFF_REQUEST,
    UPDATE_REVIEW_STATUS_STAFF_REQUEST,
    getAllReviewsForStaffSuccess,
    getAllReviewsForStaffFailure,
    getReviewDetailStaffSuccess,
    getReviewDetailStaffFailure,
    updateReviewStatusStaffSuccess,
    updateReviewStatusStaffFailure,
} from "../actions/reviewStaffActions";

const API_BASE_URL = "http://localhost:3000";

const apiCall = async (method, url, data = null, isForm = false) => {
    const token = localStorage.getItem("token");
    try {
        const res = await axios({
            method,
            url: `${API_BASE_URL}${url}`,
            data,
            withCredentials: true,
            timeout: 30000, // 30 seconds timeout
            headers: {
                "Content-Type": isForm ? "multipart/form-data" : "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        // Handle timeout errors
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            console.error("⏱️ Request timeout:", url);
            throw new Error("Request timeout. Server đang phản hồi chậm. Vui lòng thử lại sau.");
        }

        // Handle 504 Gateway Timeout
        if (error.response?.status === 504) {
            console.error("⏱️ Gateway Timeout:", url);
            throw new Error("Gateway timeout. Backend server đang không phản hồi. Vui lòng thử lại sau hoặc liên hệ admin.");
        }

        // Handle 502 Bad Gateway
        if (error.response?.status === 502) {
            console.error("🔥 Bad Gateway:", url);
            throw new Error("Bad Gateway. Server đang gặp vấn đề. Vui lòng thử lại sau.");
        }

        if (error.response?.status === 401) {
            console.log("401");
            try {
                const refreshRes = await axios.post(
                    `${API_BASE_URL}/auth/refresh-token`,
                    {},
                    { 
                        withCredentials: true,
                        timeout: 10000 // 10 seconds for refresh token
                    }
                );
                const newToken = refreshRes.data?.token?.access_token;
                if (newToken) {
                    localStorage.setItem("token", newToken);
                    // Retry request with new token
                    const retryRes = await axios({
                        method,
                        url: `${API_BASE_URL}${url}`,
                        data,
                        withCredentials: true,
                        timeout: 30000,
                        headers: {
                            "Content-Type": isForm ? "multipart/form-data" : "application/json",
                            Authorization: `Bearer ${newToken}`,
                        },
                    });
                    return retryRes.data;
                }
            } catch (_refreshError) {
                console.error("🔁 Refresh token failed:", _refreshError);
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

function* getAllReviewsForStaffSaga(action) {
    try {
        const params = action.payload || {};
        const q = new URLSearchParams();
        if (params.page) q.append("page", String(params.page));
        if (params.limit) q.append("limit", String(params.limit));
        if (params.product_id) q.append("product_id", String(params.product_id));
        if (params.user_id) q.append("user_id", String(params.user_id));
        if (typeof params.status !== "undefined") q.append("status", String(params.status));
        if (params.rating) q.append("rating", String(params.rating));
        if (params.search) q.append("search", String(params.search));
        if (params.sort) q.append("sort", String(params.sort));

        const response = yield call(() => apiCall("get", `/review-staff/api/reviews/staff/viewlist?${q.toString()}`));
        if (response && response.status === "OK") {
            yield put(getAllReviewsForStaffSuccess(response));
        } else {
            throw new Error(response?.message || "Không thể lấy danh sách đánh giá cho staff");
        }
    } catch (error) {
        yield put(getAllReviewsForStaffFailure(error.message || "Lỗi khi lấy danh sách đánh giá"));
        toast.error(error.message || "Lỗi khi lấy danh sách đánh giá");
    }
}

function* getReviewDetailStaffSaga(action) {
    try {
        const reviewId = action.payload;
        if (!reviewId) throw new Error("Missing review id");
        const response = yield call(() => apiCall("get", `/review-staff/api/reviews/detail/${reviewId}`));
        if (response && response.status === "OK") {
            yield put(getReviewDetailStaffSuccess(response));
        } else {
            throw new Error(response?.message || "Không thể lấy chi tiết đánh giá");
        }
    } catch (error) {
        yield put(getReviewDetailStaffFailure(error.message || "Lỗi khi lấy chi tiết đánh giá"));
        toast.error(error.message || "Lỗi khi lấy chi tiết đánh giá");
    }
}

function* updateReviewStatusStaffSaga(action) {
    try {
        const { reviewId, status } = action.payload || {};
        if (!reviewId) throw new Error("Missing reviewId");
        const response = yield call(() => apiCall("put", `/review-staff/api/reviews/hidden/${reviewId}`, { status }));
        if (response && response.status === "OK") {
            const data = response.data || response.review || response;
            yield put(updateReviewStatusStaffSuccess(data));
            if (response.message) toast.success(response.message);
        } else {
            throw new Error(response?.message || "Không thể cập nhật trạng thái đánh giá");
        }
    } catch (error) {
        const msg = (error && error.message) || "Lỗi khi cập nhật trạng thái đánh giá";
        yield put(updateReviewStatusStaffFailure(msg));
        toast.error(msg);
    }
}

export default function* reviewStaffSaga() {
    yield takeLatest(GET_ALL_REVIEWS_STAFF_REQUEST, getAllReviewsForStaffSaga);
    yield takeLatest(GET_REVIEW_DETAIL_STAFF_REQUEST, getReviewDetailStaffSaga);
    yield takeLatest(UPDATE_REVIEW_STATUS_STAFF_REQUEST, updateReviewStatusStaffSaga);
}

