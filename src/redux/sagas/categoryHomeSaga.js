import { call, put, takeEvery } from "redux-saga/effects";
import {
    CATEGORY_HOME_LIST_REQUEST,
    CATEGORY_HOME_DETAIL_REQUEST,
    CATEGORY_HOME_FEATURED_REQUEST,
    categoryHomeListSuccess,
    categoryHomeListFailure,
    categoryHomeDetailSuccess,
    categoryHomeDetailFailure,
    categoryHomeFeaturedSuccess,
    categoryHomeFeaturedFailure,
} from "../actions/categoryHomeActions";

// API base URL
const API_BASE_URL = "http://localhost:3004/api";

// Helper function to make API calls
function* apiCall(url, options = {}) {
    const response = yield call(fetch, url, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = yield response.json();
    return data;
}

// Saga for getting categories list
function* getCategoriesForHome(action) {
    try {
        const { query } = action.payload;

        // Build query string
        const queryParams = new URLSearchParams();
        if (query.page) queryParams.append("page", query.page);
        if (query.limit) queryParams.append("limit", query.limit);
        if (query.keyword) queryParams.append("keyword", query.keyword);
        if (query.name) queryParams.append("name", query.name);
        if (query.sortBy) queryParams.append("sortBy", query.sortBy);
        if (query.sortOrder) queryParams.append("sortOrder", query.sortOrder);

        const url = `${API_BASE_URL}/categoryhome?${queryParams.toString()}`;
        const result = yield call(apiCall, url);

        if (result.status === "OK") {
            yield put(categoryHomeListSuccess(result.data, result.pagination));
        } else {
            yield put(categoryHomeListFailure(result.message || "Lỗi khi tải danh sách danh mục"));
        }
    } catch (error) {
        yield put(categoryHomeListFailure(error.message || "Lỗi kết nối server"));
    }
}

// Saga for getting category detail
function* getCategoryByIdForHome(action) {
    try {
        const { id } = action.payload;
        const url = `${API_BASE_URL}/categoryhome/${id}`;
        const result = yield call(apiCall, url);

        if (result.status === "OK") {
            yield put(categoryHomeDetailSuccess(result.data));
        } else {
            yield put(categoryHomeDetailFailure(result.message || "Không tìm thấy danh mục"));
        }
    } catch (error) {
        yield put(categoryHomeDetailFailure(error.message || "Lỗi kết nối server"));
    }
}

// Saga for getting featured categories
function* getFeaturedCategories(action) {
    try {
        const { limit } = action.payload;
        const url = `${API_BASE_URL}/categoryhome/featured?limit=${limit}`;
        const result = yield call(apiCall, url);

        if (result.status === "OK") {
            yield put(categoryHomeFeaturedSuccess(result.data));
        } else {
            yield put(categoryHomeFeaturedFailure(result.message || "Lỗi khi tải danh mục nổi bật"));
        }
    } catch (error) {
        yield put(categoryHomeFeaturedFailure(error.message || "Lỗi kết nối server"));
    }
}

// Root saga for category home
export default function* categoryHomeSaga() {
    yield takeEvery(CATEGORY_HOME_LIST_REQUEST, getCategoriesForHome);
    yield takeEvery(CATEGORY_HOME_DETAIL_REQUEST, getCategoryByIdForHome);
    yield takeEvery(CATEGORY_HOME_FEATURED_REQUEST, getFeaturedCategories);
}