import {
    PRODUCT_HOME_LIST_REQUEST,
    PRODUCT_HOME_LIST_SUCCESS,
    PRODUCT_HOME_LIST_FAILURE,
    PRODUCT_HOME_DETAIL_REQUEST,
    PRODUCT_HOME_DETAIL_SUCCESS,
    PRODUCT_HOME_DETAIL_FAILURE,
    PRODUCT_HOME_FEATURED_REQUEST,
    PRODUCT_HOME_FEATURED_SUCCESS,
    PRODUCT_HOME_FEATURED_FAILURE,
    PRODUCT_HOME_BY_CATEGORY_REQUEST,
    PRODUCT_HOME_BY_CATEGORY_SUCCESS,
    PRODUCT_HOME_BY_CATEGORY_FAILURE,
    PRODUCT_HOME_BRANDS_REQUEST,
    PRODUCT_HOME_BRANDS_SUCCESS,
    PRODUCT_HOME_BRANDS_FAILURE,
    PRODUCT_HOME_CLEAR_MESSAGES,
} from "../actions/productHomeActions";

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
    
    // Products by category state
    byCategory: {
        items: [],
        pagination: {
            page: 1,
            limit: 8,
            total: 0,
        },
        category: null,
        loading: false,
        error: null,
    },
    
    // Brands state
    brands: {
        items: [],
        loading: false,
        error: null,
    },
    
    // General messages
    message: null,
    error: null,
};

const productHomeReducer = (state = initialState, action) => {
    switch (action.type) {
        // List actions
        case PRODUCT_HOME_LIST_REQUEST:
            return {
                ...state,
                list: {
                    ...state.list,
                    loading: true,
                    error: null,
                },
                error: null,
            };

        case PRODUCT_HOME_LIST_SUCCESS:
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

        case PRODUCT_HOME_LIST_FAILURE:
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
        case PRODUCT_HOME_DETAIL_REQUEST:
            return {
                ...state,
                detail: {
                    ...state.detail,
                    loading: true,
                    error: null,
                },
                error: null,
            };

        case PRODUCT_HOME_DETAIL_SUCCESS:
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

        case PRODUCT_HOME_DETAIL_FAILURE:
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
        case PRODUCT_HOME_FEATURED_REQUEST:
            return {
                ...state,
                featured: {
                    ...state.featured,
                    loading: true,
                    error: null,
                },
                error: null,
            };

        case PRODUCT_HOME_FEATURED_SUCCESS:
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

        case PRODUCT_HOME_FEATURED_FAILURE:
            return {
                ...state,
                featured: {
                    ...state.featured,
                    loading: false,
                    error: action.payload,
                },
                error: action.payload,
            };

        // Products by category actions
        case PRODUCT_HOME_BY_CATEGORY_REQUEST:
            return {
                ...state,
                byCategory: {
                    ...state.byCategory,
                    loading: true,
                    error: null,
                },
                error: null,
            };

        case PRODUCT_HOME_BY_CATEGORY_SUCCESS:
            return {
                ...state,
                byCategory: {
                    ...state.byCategory,
                    items: action.payload.items,
                    pagination: action.payload.pagination,
                    category: action.payload.category,
                    loading: false,
                    error: null,
                },
                error: null,
            };

        case PRODUCT_HOME_BY_CATEGORY_FAILURE:
            return {
                ...state,
                byCategory: {
                    ...state.byCategory,
                    loading: false,
                    error: action.payload,
                },
                error: action.payload,
            };

        // Brands actions
        case PRODUCT_HOME_BRANDS_REQUEST:
            return {
                ...state,
                brands: {
                    ...state.brands,
                    loading: true,
                    error: null,
                },
                error: null,
            };

        case PRODUCT_HOME_BRANDS_SUCCESS:
            return {
                ...state,
                brands: {
                    ...state.brands,
                    items: action.payload,
                    loading: false,
                    error: null,
                },
                error: null,
            };

        case PRODUCT_HOME_BRANDS_FAILURE:
            return {
                ...state,
                brands: {
                    ...state.brands,
                    loading: false,
                    error: action.payload,
                },
                error: action.payload,
            };

        // Clear messages
        case PRODUCT_HOME_CLEAR_MESSAGES:
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
                byCategory: {
                    ...state.byCategory,
                    error: null,
                },
                brands: {
                    ...state.brands,
                    error: null,
                },
            };

        default:
            return state;
    }
};

export default productHomeReducer;
