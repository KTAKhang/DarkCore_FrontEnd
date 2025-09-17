import {
    CATEGORY_HOME_LIST_REQUEST,
    CATEGORY_HOME_LIST_SUCCESS,
    CATEGORY_HOME_LIST_FAILURE,
    CATEGORY_HOME_DETAIL_REQUEST,
    CATEGORY_HOME_DETAIL_SUCCESS,
    CATEGORY_HOME_DETAIL_FAILURE,
    CATEGORY_HOME_FEATURED_REQUEST,
    CATEGORY_HOME_FEATURED_SUCCESS,
    CATEGORY_HOME_FEATURED_FAILURE,
    CATEGORY_HOME_CLEAR_MESSAGES,
} from "../actions/categoryHomeActions";

const initialState = {
    // List state
    list: {
        items: [],
        pagination: {
            page: 1,
            limit: 8,
            total: 0,
        },
        loading: false,
        error: null,
    },

    // Detail state
    detail: {
        item: null,
        loading: false,
        error: null,
    },

    // Featured state
    featured: {
        items: [],
        loading: false,
        error: null,
    },

    // General messages
    message: null,
    error: null,
};

const categoryHomeReducer = (state = initialState, action) => {
    switch (action.type) {
        // List actions
        case CATEGORY_HOME_LIST_REQUEST:
            return {
                ...state,
                list: {
                    ...state.list,
                    loading: true,
                    error: null,
                },
                error: null,
            };

        case CATEGORY_HOME_LIST_SUCCESS:
            return {
                ...state,
                list: {
                    ...state.list,
                    items: action.payload.items,
                    pagination: action.payload.pagination,
                    loading: false,
                    error: null,
                },
                error: null,
            };

        case CATEGORY_HOME_LIST_FAILURE:
            return {
                ...state,
                list: {
                    ...state.list,
                    loading: false,
                    error: action.payload,
                },
                error: action.payload,
            };

        // Detail actions
        case CATEGORY_HOME_DETAIL_REQUEST:
            return {
                ...state,
                detail: {
                    ...state.detail,
                    loading: true,
                    error: null,
                },
                error: null,
            };

        case CATEGORY_HOME_DETAIL_SUCCESS:
            return {
                ...state,
                detail: {
                    ...state.detail,
                    item: action.payload,
                    loading: false,
                    error: null,
                },
                error: null,
            };

        case CATEGORY_HOME_DETAIL_FAILURE:
            return {
                ...state,
                detail: {
                    ...state.detail,
                    loading: false,
                    error: action.payload,
                },
                error: action.payload,
            };

        // Featured actions
        case CATEGORY_HOME_FEATURED_REQUEST:
            return {
                ...state,
                featured: {
                    ...state.featured,
                    loading: true,
                    error: null,
                },
                error: null,
            };

        case CATEGORY_HOME_FEATURED_SUCCESS:
            return {
                ...state,
                featured: {
                    ...state.featured,
                    items: action.payload,
                    loading: false,
                    error: null,
                },
                error: null,
            };

        case CATEGORY_HOME_FEATURED_FAILURE:
            return {
                ...state,
                featured: {
                    ...state.featured,
                    loading: false,
                    error: action.payload,
                },
                error: action.payload,
            };

        // Clear messages
        case CATEGORY_HOME_CLEAR_MESSAGES:
            return {
                ...state,
                message: null,
                error: null,
                list: {
                    ...state.list,
                    error: null,
                },
                detail: {
                    ...state.detail,
                    error: null,
                },
                featured: {
                    ...state.featured,
                    error: null,
                },
            };

        default:
            return state;
    }
};

export default categoryHomeReducer;