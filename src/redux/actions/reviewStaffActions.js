// Staff Review Actions
export const GET_ALL_REVIEWS_STAFF_REQUEST = "GET_ALL_REVIEWS_STAFF_REQUEST";
export const GET_ALL_REVIEWS_STAFF_SUCCESS = "GET_ALL_REVIEWS_STAFF_SUCCESS";
export const GET_ALL_REVIEWS_STAFF_FAILURE = "GET_ALL_REVIEWS_STAFF_FAILURE";

export const GET_REVIEW_DETAIL_STAFF_REQUEST = "GET_REVIEW_DETAIL_STAFF_REQUEST";
export const GET_REVIEW_DETAIL_STAFF_SUCCESS = "GET_REVIEW_DETAIL_STAFF_SUCCESS";
export const GET_REVIEW_DETAIL_STAFF_FAILURE = "GET_REVIEW_DETAIL_STAFF_FAILURE";

export const UPDATE_REVIEW_STATUS_STAFF_REQUEST = "UPDATE_REVIEW_STATUS_STAFF_REQUEST";
export const UPDATE_REVIEW_STATUS_STAFF_SUCCESS = "UPDATE_REVIEW_STATUS_STAFF_SUCCESS";
export const UPDATE_REVIEW_STATUS_STAFF_FAILURE = "UPDATE_REVIEW_STATUS_STAFF_FAILURE";

export const CLEAR_REVIEW_STAFF_MESSAGES = "CLEAR_REVIEW_STAFF_MESSAGES";

// Action creators
export const getAllReviewsForStaffRequest = (params = {}) => ({
    type: GET_ALL_REVIEWS_STAFF_REQUEST,
    payload: params, // { page, limit, product_id, user_id, status, rating, search, sort }
});

export const getAllReviewsForStaffSuccess = (data) => ({
    type: GET_ALL_REVIEWS_STAFF_SUCCESS,
    payload: data,
});

export const getAllReviewsForStaffFailure = (error) => ({
    type: GET_ALL_REVIEWS_STAFF_FAILURE,
    payload: error,
});

export const getReviewDetailStaffRequest = (reviewId) => ({
    type: GET_REVIEW_DETAIL_STAFF_REQUEST,
    payload: reviewId,
});

export const getReviewDetailStaffSuccess = (data) => ({
    type: GET_REVIEW_DETAIL_STAFF_SUCCESS,
    payload: data,
});

export const getReviewDetailStaffFailure = (error) => ({
    type: GET_REVIEW_DETAIL_STAFF_FAILURE,
    payload: error,
});

export const updateReviewStatusStaffRequest = (reviewId, status) => ({
    type: UPDATE_REVIEW_STATUS_STAFF_REQUEST,
    payload: { reviewId, status },
});

export const updateReviewStatusStaffSuccess = (data) => ({
    type: UPDATE_REVIEW_STATUS_STAFF_SUCCESS,
    payload: data,
});

export const updateReviewStatusStaffFailure = (error) => ({
    type: UPDATE_REVIEW_STATUS_STAFF_FAILURE,
    payload: error,
});

export const clearReviewStaffMessages = () => ({
    type: CLEAR_REVIEW_STAFF_MESSAGES,
});

