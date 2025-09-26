import { call, put, takeEvery } from "redux-saga/effects";
import {
    PRODUCT_HOME_LIST_REQUEST,
    PRODUCT_HOME_DETAIL_REQUEST,
    PRODUCT_HOME_FEATURED_REQUEST,
    PRODUCT_HOME_BY_CATEGORY_REQUEST,
    PRODUCT_HOME_BRANDS_REQUEST,
    PRODUCT_HOME_FAVORITES_REQUEST,
    PRODUCT_HOME_TOGGLE_FAVORITE_REQUEST,
    productHomeListSuccess,
    productHomeListFailure,
    productHomeDetailSuccess,
    productHomeDetailFailure,
    productHomeFeaturedSuccess,
    productHomeFeaturedFailure,
    productHomeByCategorySuccess,
    productHomeByCategoryFailure,
    productHomeBrandsSuccess,
    productHomeBrandsFailure,
    productHomeFavoritesSuccess,
    productHomeFavoritesFailure,
    productHomeToggleFavoriteSuccess,
    productHomeToggleFavoriteFailure,
} from "../actions/productHomeActions";

// API base URL
const API_BASE_URL = "http://localhost:3000/cataloghome/api";

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

// Saga for getting products list
function* getProductsForHome(action) {
    try {
        const { query } = action.payload;

        // Build query string
        const queryParams = new URLSearchParams();
        if (query.page) queryParams.append("page", query.page);
        if (query.limit) queryParams.append("limit", query.limit);
        if (query.keyword) queryParams.append("keyword", query.keyword);
        if (query.name) queryParams.append("name", query.name);
        if (query.categoryName) queryParams.append("categoryName", query.categoryName);
        if (query.brand) queryParams.append("brand", query.brand);
        if (query.minPrice !== undefined && query.minPrice !== "") queryParams.append("minPrice", query.minPrice);
        if (query.maxPrice !== undefined && query.maxPrice !== "") queryParams.append("maxPrice", query.maxPrice);
        if (query.sortBy) queryParams.append("sortBy", query.sortBy);
        if (query.sortOrder) queryParams.append("sortOrder", query.sortOrder);

        const url = `${API_BASE_URL}/producthome?${queryParams.toString()}`;
        const result = yield call(apiCall, url);

        if (result.status === "OK") {
            yield put(productHomeListSuccess(result.data, result.pagination));
        } else {
            yield put(productHomeListFailure(result.message || "Lỗi khi tải danh sách sản phẩm"));
        }
    } catch (error) {
        yield put(productHomeListFailure(error.message || "Lỗi kết nối server"));
    }
}

// Saga for getting product detail
function* getProductByIdForHome(action) {
    try {
        const { id } = action.payload;
        const url = `${API_BASE_URL}/producthome/${id}`;
        const result = yield call(apiCall, url);

        if (result.status === "OK") {
            yield put(productHomeDetailSuccess(result.data));
        } else {
            yield put(productHomeDetailFailure(result.message || "Không tìm thấy sản phẩm"));
        }
    } catch (error) {
        yield put(productHomeDetailFailure(error.message || "Lỗi kết nối server"));
    }
}

// Saga for getting featured products
function* getFeaturedProducts(action) {
    try {
        const { limit } = action.payload;
        const url = `${API_BASE_URL}/producthome/featured?limit=${limit}`;
        const result = yield call(apiCall, url);

        if (result.status === "OK") {
            yield put(productHomeFeaturedSuccess(result.data));
        } else {
            yield put(productHomeFeaturedFailure(result.message || "Lỗi khi tải sản phẩm nổi bật"));
        }
    } catch (error) {
        yield put(productHomeFeaturedFailure(error.message || "Lỗi kết nối server"));
    }
}

// Saga for getting products by category
function* getProductsByCategoryForHome(action) {
    try {
        const { categoryId, query } = action.payload;

        // Build query string
        const queryParams = new URLSearchParams();
        if (query.page) queryParams.append("page", query.page);
        if (query.limit) queryParams.append("limit", query.limit);
        if (query.keyword) queryParams.append("keyword", query.keyword);
        if (query.name) queryParams.append("name", query.name);
        if (query.brand) queryParams.append("brand", query.brand);
        if (query.minPrice !== undefined && query.minPrice !== "") queryParams.append("minPrice", query.minPrice);
        if (query.maxPrice !== undefined && query.maxPrice !== "") queryParams.append("maxPrice", query.maxPrice);
        if (query.sortBy) queryParams.append("sortBy", query.sortBy);
        if (query.sortOrder) queryParams.append("sortOrder", query.sortOrder);

        const url = `${API_BASE_URL}/producthome/category/${categoryId}?${queryParams.toString()}`;
        const result = yield call(apiCall, url);

        if (result.status === "OK") {
            yield put(productHomeByCategorySuccess(result.data, result.pagination, result.category));
        } else {
            yield put(productHomeByCategoryFailure(result.message || "Lỗi khi tải sản phẩm theo danh mục"));
        }
    } catch (error) {
        yield put(productHomeByCategoryFailure(error.message || "Lỗi kết nối server"));
    }
}

// Saga for getting brands list
function* getBrands() {
    try {
        const url = `${API_BASE_URL}/producthome/brands`;
        const result = yield call(apiCall, url);

        if (result.status === "OK") {
            yield put(productHomeBrandsSuccess(result.data));
        } else {
            yield put(productHomeBrandsFailure(result.message || "Lỗi khi tải danh sách thương hiệu"));
        }
    } catch (error) {
        yield put(productHomeBrandsFailure(error.message || "Lỗi kết nối server"));
    }
}

// Saga for getting favorite products
function* getFavoriteProducts(action) {
    try {
        const { query } = action.payload;

        // Build query string
        const queryParams = new URLSearchParams();
        if (query.page) queryParams.append("page", query.page);
        if (query.limit) queryParams.append("limit", query.limit);
        if (query.keyword) queryParams.append("keyword", query.keyword);
        if (query.name) queryParams.append("name", query.name);
        if (query.categoryName) queryParams.append("categoryName", query.categoryName);
        if (query.brand) queryParams.append("brand", query.brand);
        if (query.minPrice !== undefined && query.minPrice !== "") queryParams.append("minPrice", query.minPrice);
        if (query.maxPrice !== undefined && query.maxPrice !== "") queryParams.append("maxPrice", query.maxPrice);
        if (query.sortBy) queryParams.append("sortBy", query.sortBy);
        if (query.sortOrder) queryParams.append("sortOrder", query.sortOrder);

        const url = `${API_BASE_URL}/producthome/favorites?${queryParams.toString()}`;
        const result = yield call(apiCall, url);

        if (result.status === "OK") {
            yield put(productHomeFavoritesSuccess(result.data, result.pagination));
        } else {
            yield put(productHomeFavoritesFailure(result.message || "Lỗi khi tải danh sách sản phẩm yêu thích"));
        }
    } catch (error) {
        yield put(productHomeFavoritesFailure(error.message || "Lỗi kết nối server"));
    }
}

// Saga for toggling favorite status
function* toggleFavoriteProduct(action) {
    try {
        const { id } = action.payload;
        const url = `${API_BASE_URL}/producthome/${id}/favorite`;
        
        const result = yield call(apiCall, url, {
            method: 'PUT'
        });

        if (result.status === "OK") {
            yield put(productHomeToggleFavoriteSuccess(result.data));
        } else {
            yield put(productHomeToggleFavoriteFailure(result.message || "Lỗi khi cập nhật trạng thái yêu thích"));
        }
    } catch (error) {
        yield put(productHomeToggleFavoriteFailure(error.message || "Lỗi kết nối server"));
    }
}

// Root saga for product home
export default function* productHomeSaga() {
    yield takeEvery(PRODUCT_HOME_LIST_REQUEST, getProductsForHome);
    yield takeEvery(PRODUCT_HOME_DETAIL_REQUEST, getProductByIdForHome);
    yield takeEvery(PRODUCT_HOME_FEATURED_REQUEST, getFeaturedProducts);
    yield takeEvery(PRODUCT_HOME_BY_CATEGORY_REQUEST, getProductsByCategoryForHome);
    yield takeEvery(PRODUCT_HOME_BRANDS_REQUEST, getBrands);
    yield takeEvery(PRODUCT_HOME_FAVORITES_REQUEST, getFavoriteProducts);
    yield takeEvery(PRODUCT_HOME_TOGGLE_FAVORITE_REQUEST, toggleFavoriteProduct);
}