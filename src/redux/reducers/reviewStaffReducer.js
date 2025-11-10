import {
    GET_ALL_REVIEWS_STAFF_REQUEST,
    GET_ALL_REVIEWS_STAFF_SUCCESS,
    GET_ALL_REVIEWS_STAFF_FAILURE,
    GET_REVIEW_DETAIL_STAFF_REQUEST,
    GET_REVIEW_DETAIL_STAFF_SUCCESS,
    GET_REVIEW_DETAIL_STAFF_FAILURE,
    UPDATE_REVIEW_STATUS_STAFF_REQUEST,
    UPDATE_REVIEW_STATUS_STAFF_SUCCESS,
    UPDATE_REVIEW_STATUS_STAFF_FAILURE,
    CLEAR_REVIEW_STAFF_MESSAGES,
} from "../actions/reviewStaffActions";

const initialState = {
    reviews: [],
    pagination: {
        page: 1,
        limit: 5,
        total: 0,
        totalPages: 1,
    },
    loading: false,
    error: null,
    reviewDetail: {
        data: null,
        loading: false,
        error: null,
    },
    updateStatusLoading: false,
    updateStatusError: null,
    updatedStatusData: null,
};

const reviewStaffReducer = (state = initialState, action) => {
    switch (action.type) {
        // GET ALL REVIEWS
        case GET_ALL_REVIEWS_STAFF_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_ALL_REVIEWS_STAFF_SUCCESS: {
            const data = action.payload && action.payload.data ? action.payload.data : action.payload || {};
            const pagination = data.pagination || action.payload.pagination || {};
            return {
                ...state,
                loading: false,
                reviews: data.data || data.reviews || action.payload.data || [],
                pagination: {
                    page: pagination.page || state.pagination.page,
                    limit: pagination.limit || state.pagination.limit,
                    total: pagination.total || 0,
                    totalPages: pagination.totalPages || 1,
                },
                error: null,
            };
        }
        case GET_ALL_REVIEWS_STAFF_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // GET REVIEW DETAIL
        case GET_REVIEW_DETAIL_STAFF_REQUEST:
            return {
                ...state,
                reviewDetail: {
                    ...state.reviewDetail,
                    loading: true,
                    error: null,
                },
            };
        case GET_REVIEW_DETAIL_STAFF_SUCCESS: {
            const detailData = action.payload && action.payload.data ? action.payload.data : action.payload || null;
            return {
                ...state,
                reviewDetail: {
                    data: detailData,
                    loading: false,
                    error: null,
                },
            };
        }
        case GET_REVIEW_DETAIL_STAFF_FAILURE:
            return {
                ...state,
                reviewDetail: {
                    ...state.reviewDetail,
                    loading: false,
                    error: action.payload,
                },
            };

        // UPDATE REVIEW STATUS
        case UPDATE_REVIEW_STATUS_STAFF_REQUEST:
            return {
                ...state,
                updateStatusLoading: true,
                updateStatusError: null,
            };
        case UPDATE_REVIEW_STATUS_STAFF_SUCCESS:
            return {
                ...state,
                updateStatusLoading: false,
                updatedStatusData: action.payload || null,
                updateStatusError: null,
            };
        case UPDATE_REVIEW_STATUS_STAFF_FAILURE:
            return {
                ...state,
                updateStatusLoading: false,
                updateStatusError: action.payload || "Lỗi khi cập nhật trạng thái",
            };

        // CLEAR MESSAGES
        case CLEAR_REVIEW_STAFF_MESSAGES:
            return {
                ...state,
                updateStatusError: null,
                updatedStatusData: null,
            };

        default:
            return state;
    }
};

export default reviewStaffReducer;

