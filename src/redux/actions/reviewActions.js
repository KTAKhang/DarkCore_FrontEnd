export const GET_PRODUCT_REVIEWS_REQUEST = "GET_PRODUCT_REVIEWS_REQUEST";
export const GET_PRODUCT_REVIEWS_SUCCESS = "GET_PRODUCT_REVIEWS_SUCCESS";
export const GET_PRODUCT_REVIEWS_FAILURE = "GET_PRODUCT_REVIEWS_FAILURE";

export const GET_REVIEW_BY_ORDER_ID_REQUEST = "GET_REVIEW_BY_ORDER_ID_REQUEST";
export const GET_REVIEW_BY_ORDER_ID_SUCCESS = "GET_REVIEW_BY_ORDER_ID_SUCCESS";
export const GET_REVIEW_BY_ORDER_ID_FAILURE = "GET_REVIEW_BY_ORDER_ID_FAILURE";

export const CREATE_PRODUCT_REVIEW_REQUEST = "CREATE_PRODUCT_REVIEW_REQUEST";
export const CREATE_PRODUCT_REVIEW_SUCCESS = "CREATE_PRODUCT_REVIEW_SUCCESS";
export const CREATE_PRODUCT_REVIEW_FAILURE = "CREATE_PRODUCT_REVIEW_FAILURE";

export const UPDATE_PRODUCT_REVIEW_REQUEST = "UPDATE_PRODUCT_REVIEW_REQUEST";
export const UPDATE_PRODUCT_REVIEW_SUCCESS = "UPDATE_PRODUCT_REVIEW_SUCCESS";
export const UPDATE_PRODUCT_REVIEW_FAILURE = "UPDATE_PRODUCT_REVIEW_FAILURE";

export const CLEAR_REVIEW_MESSAGES = "CLEAR_REVIEW_MESSAGES";

// Admin: get all reviews for admin
export const GET_ALL_REVIEWS_ADMIN_REQUEST = "GET_ALL_REVIEWS_ADMIN_REQUEST";
export const GET_ALL_REVIEWS_ADMIN_SUCCESS = "GET_ALL_REVIEWS_ADMIN_SUCCESS";
export const GET_ALL_REVIEWS_ADMIN_FAILURE = "GET_ALL_REVIEWS_ADMIN_FAILURE";

// ---- Thêm: Review detail (admin / client) ----
export const GET_REVIEW_DETAIL_REQUEST = "GET_REVIEW_DETAIL_REQUEST";
export const GET_REVIEW_DETAIL_SUCCESS = "GET_REVIEW_DETAIL_SUCCESS";
export const GET_REVIEW_DETAIL_FAILURE = "GET_REVIEW_DETAIL_FAILURE";

export const UPDATE_REVIEW_STATUS_REQUEST = "UPDATE_REVIEW_STATUS_REQUEST";
export const UPDATE_REVIEW_STATUS_SUCCESS = "UPDATE_REVIEW_STATUS_SUCCESS";
export const UPDATE_REVIEW_STATUS_FAILURE = "UPDATE_REVIEW_STATUS_FAILURE";

export const updateReviewStatusRequest = (reviewId, status) => ({
    type: UPDATE_REVIEW_STATUS_REQUEST,
    payload: { reviewId, status },
});
export const updateReviewStatusSuccess = (data) => ({
    type: UPDATE_REVIEW_STATUS_SUCCESS,
    payload: data,
});
export const updateReviewStatusFailure = (error) => ({
    type: UPDATE_REVIEW_STATUS_FAILURE,
    payload: error,
});
// Action creators
export const getProductReviewsRequest = (productId, params = {}) => ({
    type: GET_PRODUCT_REVIEWS_REQUEST,
    payload: { productId, params },
});
export const getProductReviewsSuccess = (data) => ({
    type: GET_PRODUCT_REVIEWS_SUCCESS,
    payload: data,
});
export const getProductReviewsFailure = (error) => ({
    type: GET_PRODUCT_REVIEWS_FAILURE,
    payload: error,
});

export const getReviewByOrderIdRequest = (orderId) => ({
    type: GET_REVIEW_BY_ORDER_ID_REQUEST,
    payload: orderId,
});
export const getReviewByOrderIdSuccess = (data) => ({
    type: GET_REVIEW_BY_ORDER_ID_SUCCESS,
    payload: data,
});
export const getReviewByOrderIdFailure = (error) => ({
    type: GET_REVIEW_BY_ORDER_ID_FAILURE,
    payload: error,
});

export const createProductReviewRequest = (data) => ({
    type: CREATE_PRODUCT_REVIEW_REQUEST,
    payload: data,
});
export const createProductReviewSuccess = (review) => ({
    type: CREATE_PRODUCT_REVIEW_SUCCESS,
    payload: review,
});
export const createProductReviewFailure = (error) => ({
    type: CREATE_PRODUCT_REVIEW_FAILURE,
    payload: error,
});

export const updateProductReviewRequest = (review_id, updateData, user_id) => ({
    type: UPDATE_PRODUCT_REVIEW_REQUEST,
    payload: { review_id, updateData, user_id },
});
export const updateProductReviewSuccess = (review) => ({
    type: UPDATE_PRODUCT_REVIEW_SUCCESS,
    payload: review,
});
export const updateProductReviewFailure = (error) => ({
    type: UPDATE_PRODUCT_REVIEW_FAILURE,
    payload: error,
});

export const clearReviewMessages = () => ({ type: CLEAR_REVIEW_MESSAGES });

// Admin action creators
export const getAllReviewsForAdminRequest = (params = {}) => ({
    type: GET_ALL_REVIEWS_ADMIN_REQUEST,
    payload: params, // { page, limit, search, rating, status, sortBy }
});
export const getAllReviewsForAdminSuccess = (data) => ({
    type: GET_ALL_REVIEWS_ADMIN_SUCCESS,
    payload: data,
});
export const getAllReviewsForAdminFailure = (error) => ({
    type: GET_ALL_REVIEWS_ADMIN_FAILURE,
    payload: error,
});

// ---- Thêm: action creators cho review detail ----
export const getReviewDetailRequest = (reviewId) => ({
    type: GET_REVIEW_DETAIL_REQUEST,
    payload: reviewId,
});
export const getReviewDetailSuccess = (data) => ({
    type: GET_REVIEW_DETAIL_SUCCESS,
    payload: data,
});
export const getReviewDetailFailure = (error) => ({
    type: GET_REVIEW_DETAIL_FAILURE,
    payload: error,
});