import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import axios from "axios";
import {
    GET_PRODUCT_REVIEWS_REQUEST,
    GET_REVIEW_BY_ORDER_ID_REQUEST,
    GET_ALL_REVIEWS_ADMIN_REQUEST,
    GET_REVIEW_DETAIL_REQUEST,
    getProductReviewsSuccess,
    getProductReviewsFailure,
    getReviewByOrderIdSuccess,
    getReviewByOrderIdFailure,
    getAllReviewsForAdminSuccess,
    getAllReviewsForAdminFailure,
    getReviewDetailSuccess,
    getReviewDetailFailure,
    CREATE_PRODUCT_REVIEW_REQUEST,
    createProductReviewSuccess,
    createProductReviewFailure,
    UPDATE_PRODUCT_REVIEW_REQUEST,
    updateProductReviewSuccess,
    updateProductReviewFailure,
    UPDATE_REVIEW_STATUS_REQUEST,
    updateReviewStatusSuccess,
    updateReviewStatusFailure,
} from "../actions/reviewActions";

const API_BASE_URL = "http://localhost:3000";



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


function* getProductReviewsSaga(action) {
    try {
        const { productId, params = {} } = action.payload || {};
        const q = new URLSearchParams();
        if (params.rating) q.append("rating", params.rating);
        q.append("page", params.page ? String(params.page) : "1");
        q.append("limit", params.limit ? String(params.limit) : "5");
        if (params.sortBy) q.append("sortBy", params.sortBy);

        const response = yield call(() => apiCall("get", `/review/product/${productId}?${q.toString()}`));
        if (response && response.success === true) {
            yield put(getProductReviewsSuccess(response));
        } else {
            throw new Error(response?.message || "Không thể lấy đánh giá sản phẩm");
        }
    } catch (error) {
        yield put(getProductReviewsFailure(error.message || "Lỗi khi lấy đánh giá sản phẩm"));
        toast.error(error.message || "Lỗi khi lấy đánh giá sản phẩm");
    }
}

function* getOrderReviewSaga(action) {
    try {
        const response = yield call(() => apiCall("get", `/review/order/${action.payload}`));
        if (response.success === true) {
            console.log("response", response.data);
            yield put(getReviewByOrderIdSuccess(response.data));
        }
        else {
            throw new Error(response.message || "Không thể lấy dữ liệu đánh giá");
        }
    } catch (error) {

        yield put(getReviewByOrderIdFailure("Không thể lấy dữ liệu đánh giá"));
        toast.error(error.message || "Lỗi khi lấy chi tiết đánh giá");
    }
}


function* getReviewDetailSaga(action) {
    try {
        const reviewId = action.payload;
        if (!reviewId) throw new Error("Missing review id");
        const response = yield call(() => apiCall("get", `/review/detail/${reviewId}`));
        if (response && response.success === true) {
            yield put(getReviewDetailSuccess(response));
        } else {
            throw new Error(response?.message || "Không thể lấy chi tiết đánh giá");
        }
    } catch (error) {
        yield put(getReviewDetailFailure(error.message || "Lỗi khi lấy chi tiết đánh giá"));
        toast.error(error.message || "Lỗi khi lấy chi tiết đánh giá");
    }
}


function* getAllReviewsForAdminSaga(action) {
    try {
        const params = action.payload || {};
        const q = new URLSearchParams();
        if (params.page) q.append("page", String(params.page));
        if (params.limit) q.append("limit", String(params.limit));
        if (params.search) q.append("search", String(params.search));
        if (typeof params.rating !== "undefined") q.append("rating", String(params.rating));
        if (typeof params.status !== "undefined") q.append("status", String(params.status));
        if (params.sortBy) q.append("sortBy", params.sortBy);

        const response = yield call(() => apiCall("get", `/review/admin/viewlist?${q.toString()}`));
        if (response && response.success === true) {
            yield put(getAllReviewsForAdminSuccess(response));
        } else {
            throw new Error(response?.message || "Không thể lấy danh sách đánh giá cho admin");
        }
    } catch (error) {
        yield put(getAllReviewsForAdminFailure(error.message || "Lỗi khi lấy danh sách đánh giá"));
        toast.error(error.message || "Lỗi khi lấy danh sách đánh giá");
    }
}

function* createProductReviewSaga(action) {
    try {
        const response = yield call(() =>
            apiCall("post", "/review/create", action.payload)
        );
        if (response.success === true) {
            yield put(createProductReviewSuccess(response.review));
            toast.success(response.message);
        } else {
            throw new Error(response.message || "Không thể tạo đánh giá");
        }
    } catch (error) {
        yield put(createProductReviewFailure(error.message || "Lỗi khi tạo đánh giá"));
        toast.error(error.message || "Lỗi khi tạo đánh giá");
    }
}

function* updateProductReviewSaga(action) {
    try {
        const { review_id, updateData, user_id } = action.payload;
        const response = yield call(() =>
            apiCall("put", `/review/update/${review_id}`, { ...updateData, user_id })
        );
        if (response.success === true) {
            yield put(updateProductReviewSuccess(response.review));
            toast.success(response.message);
        } else {
            throw new Error(response.message || "Không thể cập nhật đánh giá");
        }
    } catch (error) {
        yield put(updateProductReviewFailure(error.message || "Lỗi khi cập nhật đánh giá"));
        toast.error(error.message || "Lỗi khi cập nhật đánh giá");
    }
}

function* updateReviewStatusSaga(action) {
    try {
        const { reviewId, status } = action.payload || {};
        if (!reviewId) throw new Error("Missing reviewId");
        const response = yield call(() => apiCall("put", `/review/hidden/${reviewId}`, { status }));
        if (response && response.success === true) {
            const data = response.data || response.review || response;
            yield put(updateReviewStatusSuccess(data));
            if (response.message) toast.success(response.message);
        } else {
            throw new Error(response?.message || "Không thể cập nhật trạng thái đánh giá");
        }
    } catch (error) {
        const msg = (error && error.message) || "Lỗi khi cập nhật trạng thái đánh giá";
        yield put(updateReviewStatusFailure(msg));
        toast.error(msg);
    }
}

export default function* reviewSaga() {
    yield takeLatest(GET_PRODUCT_REVIEWS_REQUEST, getProductReviewsSaga);
    yield takeLatest(GET_REVIEW_BY_ORDER_ID_REQUEST, getOrderReviewSaga);
    yield takeLatest(GET_ALL_REVIEWS_ADMIN_REQUEST, getAllReviewsForAdminSaga);
    yield takeLatest(GET_REVIEW_DETAIL_REQUEST, getReviewDetailSaga);
    yield takeLatest(CREATE_PRODUCT_REVIEW_REQUEST, createProductReviewSaga);
    yield takeLatest(UPDATE_PRODUCT_REVIEW_REQUEST, updateProductReviewSaga);
    yield takeLatest(UPDATE_REVIEW_STATUS_REQUEST, updateReviewStatusSaga);
}
