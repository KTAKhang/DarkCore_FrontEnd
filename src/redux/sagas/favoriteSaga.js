import { call, put, takeLatest } from "redux-saga/effects";
import apiClient from "../../utils/axiosConfig"; // Use authenticated axios
import { toast } from "react-toastify";
import {
    FAVORITE_LIST_REQUEST,
    FAVORITE_TOGGLE_REQUEST,
    FAVORITE_CHECK_REQUEST,
    FAVORITE_CHECK_MULTIPLE_REQUEST,
    FAVORITE_ADD_REQUEST,
    FAVORITE_REMOVE_REQUEST,
    favoriteListSuccess,
    favoriteListFailure,
    favoriteToggleSuccess,
    favoriteToggleFailure,
    favoriteCheckSuccess,
    favoriteCheckFailure,
    favoriteCheckMultipleSuccess,
    favoriteCheckMultipleFailure,
    favoriteAddSuccess,
    favoriteAddFailure,
    favoriteRemoveSuccess,
    favoriteRemoveFailure,
} from "../actions/favoriteActions";

// Helper function để xử lý lỗi
const handleError = (error) => {
    console.log('🔍 FavoriteSaga handleError:', error.response?.status, error.response?.data);
    
    const errorMessage = error.response?.data?.message || error.message;
    
    // Không hiển thị toast cho 401 vì axios interceptor đã xử lý
    if (error.response?.status === 401) {
        console.log('🚫 401 error handled by axios interceptor');
        return errorMessage;
    } else if (error.response?.status === 403) {
        console.log('🚫 403 error - access denied');
        toast.error("Không có quyền truy cập. Vui lòng đăng nhập!");
    } else {
        toast.error(errorMessage);
    }
    
    return errorMessage;
};

// API helpers - Sử dụng đúng backend routes với prefix /api
const apiFavoritesList = async (query = {}) => {
    const params = new URLSearchParams();
    
    // Add pagination
    if (query.page) params.append("page", query.page);
    if (query.limit) params.append("limit", query.limit);
    
    // Add keyword search if provided
    if (query.keyword && query.keyword.trim()) {
        params.append("keyword", query.keyword.trim());
    }
    
    // Add brand filter if provided
    if (query.brand && query.brand.trim() && query.brand !== "all") {
        params.append("brand", query.brand.trim());
    }
    
    // Add price range filters
    if (query.minPrice !== undefined && query.minPrice !== "") {
        params.append("minPrice", query.minPrice);
    }
    if (query.maxPrice !== undefined && query.maxPrice !== "") {
        params.append("maxPrice", query.maxPrice);
    }
    
    // Add sort parameters
    if (query.sortBy && query.sortBy.trim()) {
        params.append("sortBy", query.sortBy.trim());
    }
    if (query.sortOrder && query.sortOrder.trim()) {
        params.append("sortOrder", query.sortOrder.trim());
    }
    
    const queryString = params.toString();
    const url = queryString ? `/api/favorites?${queryString}` : `/api/favorites`;
    
    const res = await apiClient.get(url);
    return res.data;
};

const apiToggleFavorite = async (productId) => {
    const res = await apiClient.post(`/api/favorites/toggle/${productId}`);
    return res.data;
};

const apiCheckFavorite = async (productId) => {
    const res = await apiClient.get(`/api/favorites/check/${productId}`);
    return res.data;
};

const apiCheckMultipleFavorites = async (productIds) => {
    const res = await apiClient.post(`/api/favorites/check-multiple`, { productIds });
    return res.data;
};

const apiAddFavorite = async (productId) => {
    const res = await apiClient.post(`/api/favorites`, { productId });
    return res.data;
};

const apiRemoveFavorite = async (productId) => {
    const res = await apiClient.delete(`/api/favorites/${productId}`);
    return res.data;
};

// Workers

// Get favorites list
function* listWorker(action) {
    try {
        const query = action.payload?.query || {};
        const data = yield call(apiFavoritesList, query);
        
        if (data.status === "OK") {
            yield put(favoriteListSuccess(data.data || [], data.pagination));
        } else {
            throw new Error(data.message || "Không thể tải danh sách yêu thích");
        }
    } catch (error) {
        const errorMessage = handleError(error);
        yield put(favoriteListFailure(errorMessage));
    }
}

// Toggle favorite
function* toggleWorker(action) {
    try {
        const { productId } = action.payload;
        const data = yield call(apiToggleFavorite, productId);
        
        if (data.status === "OK") {
            yield put(favoriteToggleSuccess(productId, data.isFavorite, data.message));
            toast.success(data.message || "Đã cập nhật yêu thích");
        } else {
            throw new Error(data.message || "Không thể cập nhật yêu thích");
        }
    } catch (error) {
        const errorMessage = handleError(error);
        yield put(favoriteToggleFailure(errorMessage));
    }
}

// Check single favorite
function* checkWorker(action) {
    try {
        const { productId } = action.payload;
        const data = yield call(apiCheckFavorite, productId);
        
        if (data.status === "OK") {
            yield put(favoriteCheckSuccess(productId, data.isFavorite));
        } else {
            throw new Error(data.message || "Không thể kiểm tra trạng thái yêu thích");
        }
    } catch (error) {
        const errorMessage = handleError(error);
        yield put(favoriteCheckFailure(errorMessage));
    }
}

// Check multiple favorites
function* checkMultipleWorker(action) {
    try {
        const { productIds } = action.payload;
        const data = yield call(apiCheckMultipleFavorites, productIds);
        
        if (data.status === "OK") {
            yield put(favoriteCheckMultipleSuccess(data.data || []));
        } else {
            throw new Error(data.message || "Không thể kiểm tra trạng thái yêu thích");
        }
    } catch (error) {
        const errorMessage = handleError(error);
        yield put(favoriteCheckMultipleFailure(errorMessage));
    }
}

// Add favorite
function* addWorker(action) {
    try {
        const { productId } = action.payload;
        const data = yield call(apiAddFavorite, productId);
        
        if (data.status === "OK") {
            yield put(favoriteAddSuccess(data.data, data.message));
            toast.success(data.message || "Đã thêm vào danh sách yêu thích");
        } else {
            throw new Error(data.message || "Không thể thêm vào yêu thích");
        }
    } catch (error) {
        const errorMessage = handleError(error);
        yield put(favoriteAddFailure(errorMessage));
    }
}

// Remove favorite
function* removeWorker(action) {
    try {
        const { productId } = action.payload;
        const data = yield call(apiRemoveFavorite, productId);
        
        if (data.status === "OK") {
            yield put(favoriteRemoveSuccess(productId, data.message));
            toast.success(data.message || "Đã xóa khỏi danh sách yêu thích");
        } else {
            throw new Error(data.message || "Không thể xóa khỏi yêu thích");
        }
    } catch (error) {
        const errorMessage = handleError(error);
        yield put(favoriteRemoveFailure(errorMessage));
    }
}

// Watchers
export default function* favoriteSaga() {
    yield takeLatest(FAVORITE_LIST_REQUEST, listWorker);
    yield takeLatest(FAVORITE_TOGGLE_REQUEST, toggleWorker);
    yield takeLatest(FAVORITE_CHECK_REQUEST, checkWorker);
    yield takeLatest(FAVORITE_CHECK_MULTIPLE_REQUEST, checkMultipleWorker);
    yield takeLatest(FAVORITE_ADD_REQUEST, addWorker);
    yield takeLatest(FAVORITE_REMOVE_REQUEST, removeWorker);
}

