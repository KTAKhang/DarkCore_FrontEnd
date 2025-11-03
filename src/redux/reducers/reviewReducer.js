import {
    GET_PRODUCT_REVIEWS_REQUEST,
    GET_PRODUCT_REVIEWS_SUCCESS,
    GET_PRODUCT_REVIEWS_FAILURE,
    GET_REVIEW_BY_ORDER_ID_REQUEST,
    GET_REVIEW_BY_ORDER_ID_SUCCESS,
    GET_REVIEW_BY_ORDER_ID_FAILURE,
    CREATE_PRODUCT_REVIEW_REQUEST,
    CREATE_PRODUCT_REVIEW_SUCCESS,
    CREATE_PRODUCT_REVIEW_FAILURE,
    UPDATE_PRODUCT_REVIEW_REQUEST,
    UPDATE_PRODUCT_REVIEW_SUCCESS,
    UPDATE_PRODUCT_REVIEW_FAILURE,
    CLEAR_REVIEW_MESSAGES,
    GET_ALL_REVIEWS_ADMIN_REQUEST,
    GET_ALL_REVIEWS_ADMIN_SUCCESS,
    GET_ALL_REVIEWS_ADMIN_FAILURE,
    GET_REVIEW_DETAIL_REQUEST,
    GET_REVIEW_DETAIL_SUCCESS,
    GET_REVIEW_DETAIL_FAILURE,
    UPDATE_REVIEW_STATUS_REQUEST,
    UPDATE_REVIEW_STATUS_SUCCESS,
    UPDATE_REVIEW_STATUS_FAILURE,
} from "../actions/reviewActions";

const initialState = {
    productReviews: {
        reviews: [],
        total: 0,
        totalAllReviews: 0,
        page: 1,
        limit: 2,
        hasMore: false,
        averageRating: 0,
        ratingCounts: [],
        loading: false,
        error: null,
    },
    adminReviews: {
        reviews: [],
        total: {
            currentPage: 1,
            totalReview: 0,
            totalPage: 1,
            totalActive: 0,
            totalInActive: 0,
        },
        page: 1,
        limit: 5,
        loading: false,
        error: null,
    },
    reviewDetail: {
        data: null,
        loading: false,
        error: null,
    },
    orderReviews: {
        reviews: [],
        loading: false,
        error: null,
    },
    createReviewLoading: false,
    createReviewError: null,
    createReviewSuccess: false,
    updateReviewLoading: false,
    updateReviewError: null,
    updateReviewSuccess: false,

    // ✅ Thêm: trạng thái cập nhật status review
    updateStatusLoading: false,
    updateStatusError: null,
    updatedStatusData: null,
};

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        // PRODUCT reviews
        case GET_PRODUCT_REVIEWS_REQUEST:
            return {
                ...state,
                productReviews: {
                    ...state.productReviews,
                    loading: true,
                    error: null,
                },
            };
        case GET_PRODUCT_REVIEWS_SUCCESS: {
            const page = Number(action.payload.page) || 1;
            const incomingReviews = action.payload.reviews || [];
            const mergedReviews = page > 1
                ? [...state.productReviews.reviews, ...incomingReviews]
                : incomingReviews;

            return {
                ...state,
                productReviews: {
                    ...state.productReviews,
                    loading: false,
                    reviews: mergedReviews,
                    total: action.payload.total || 0,
                    totalAllReviews: action.payload.totalAllReviews || 0,
                    page,
                    limit: action.payload.limit || state.productReviews.limit,
                    hasMore: !!action.payload.hasMore,
                    averageRating: action.payload.averageRating || 0,
                    ratingCounts: action.payload.ratingCounts || [],
                },
            };
        }
        case GET_PRODUCT_REVIEWS_FAILURE:
            return {
                ...state,
                productReviews: {
                    ...state.productReviews,
                    loading: false,
                    error: action.payload,
                },
            };

        // ADMIN reviews
        case GET_ALL_REVIEWS_ADMIN_REQUEST:
            return {
                ...state,
                adminReviews: {
                    ...state.adminReviews,
                    loading: true,
                    error: null,
                },
            };
        case GET_ALL_REVIEWS_ADMIN_SUCCESS: {
            const data = action.payload && action.payload.data ? action.payload.data : action.payload || {};
            const total = data.total || {};
            return {
                ...state,
                adminReviews: {
                    ...state.adminReviews,
                    loading: false,
                    reviews: data.reviews || [],
                    total: {
                        currentPage: total.currentPage || state.adminReviews.total.currentPage,
                        totalReview: total.totalReview || 0,
                        totalPage: total.totalPage || 1,
                        totalActive: total.totalActive || 0,
                        totalInActive: total.totalInActive || 0,
                    },
                    page: total.currentPage || state.adminReviews.page,
                    limit: state.adminReviews.limit,
                    error: null,
                },
            };
        }
        case GET_ALL_REVIEWS_ADMIN_FAILURE:
            return {
                ...state,
                adminReviews: {
                    ...state.adminReviews,
                    loading: false,
                    error: action.payload,
                },
            };

        // ORDER reviews
        case GET_REVIEW_BY_ORDER_ID_REQUEST:
            return {
                ...state,
                orderReviews: { ...state.orderReviews, loading: true, error: null },
            };
        case GET_REVIEW_BY_ORDER_ID_SUCCESS:
            return {
                ...state,
                orderReviews: { ...state.orderReviews, loading: false, reviews: action.payload || [] },
            };
        case GET_REVIEW_BY_ORDER_ID_FAILURE:
            return {
                ...state,
                orderReviews: { ...state.orderReviews, loading: false, error: action.payload },
            };

        // REVIEW DETAIL
        case GET_REVIEW_DETAIL_REQUEST:
            return {
                ...state,
                reviewDetail: { ...state.reviewDetail, loading: true, error: null },
            };
        case GET_REVIEW_DETAIL_SUCCESS: {
            const detailData = action.payload && action.payload.data ? action.payload.data : action.payload || null;
            return {
                ...state,
                reviewDetail: { data: detailData, loading: false, error: null },
            };
        }
        case GET_REVIEW_DETAIL_FAILURE:
            return {
                ...state,
                reviewDetail: { ...state.reviewDetail, loading: false, error: action.payload },
            };

        // CREATE review
        case CREATE_PRODUCT_REVIEW_REQUEST:
            return { ...state, createReviewLoading: true, createReviewError: null, createReviewSuccess: false };
        case CREATE_PRODUCT_REVIEW_SUCCESS:
            return { ...state, createReviewLoading: false, createReviewSuccess: true };
        case CREATE_PRODUCT_REVIEW_FAILURE:
            return { ...state, createReviewLoading: false, createReviewError: action.payload, createReviewSuccess: false };

        // UPDATE review
        case UPDATE_PRODUCT_REVIEW_REQUEST:
            return { ...state, updateReviewLoading: true, updateReviewError: null, updateReviewSuccess: false };
        case UPDATE_PRODUCT_REVIEW_SUCCESS:
            return { ...state, updateReviewLoading: false, updateReviewSuccess: true };
        case UPDATE_PRODUCT_REVIEW_FAILURE:
            return { ...state, updateReviewLoading: false, updateReviewError: action.payload, updateReviewSuccess: false };

        // ✅ UPDATE review status (mới thêm)
        case UPDATE_REVIEW_STATUS_REQUEST:
            return { ...state, updateStatusLoading: true, updateStatusError: null };
        case UPDATE_REVIEW_STATUS_SUCCESS:
            return {
                ...state,
                updateStatusLoading: false,
                updatedStatusData: action.payload || null,
                updateStatusError: null,
            };
        case UPDATE_REVIEW_STATUS_FAILURE:
            return {
                ...state,
                updateStatusLoading: false,
                updateStatusError: action.payload || "Lỗi khi cập nhật trạng thái",
            };

        // CLEAR messages
        case CLEAR_REVIEW_MESSAGES:
            return {
                ...state,
                createReviewError: null,
                createReviewSuccess: false,
                updateReviewError: null,
                updateReviewSuccess: false,
                updateStatusError: null,
                updatedStatusData: null,
            };

        default:
            return state;
    }
};

export default reviewReducer;
