// actions/productHomeActions.js

// List products for home page
export const PRODUCT_HOME_LIST_REQUEST = "PRODUCT_HOME_LIST_REQUEST";
export const PRODUCT_HOME_LIST_SUCCESS = "PRODUCT_HOME_LIST_SUCCESS";
export const PRODUCT_HOME_LIST_FAILURE = "PRODUCT_HOME_LIST_FAILURE";

// Get product detail for home page
export const PRODUCT_HOME_DETAIL_REQUEST = "PRODUCT_HOME_DETAIL_REQUEST";
export const PRODUCT_HOME_DETAIL_SUCCESS = "PRODUCT_HOME_DETAIL_SUCCESS";
export const PRODUCT_HOME_DETAIL_FAILURE = "PRODUCT_HOME_DETAIL_FAILURE";

// Get featured products
export const PRODUCT_HOME_FEATURED_REQUEST = "PRODUCT_HOME_FEATURED_REQUEST";
export const PRODUCT_HOME_FEATURED_SUCCESS = "PRODUCT_HOME_FEATURED_SUCCESS";
export const PRODUCT_HOME_FEATURED_FAILURE = "PRODUCT_HOME_FEATURED_FAILURE";

// Get products by category
export const PRODUCT_HOME_BY_CATEGORY_REQUEST = "PRODUCT_HOME_BY_CATEGORY_REQUEST";
export const PRODUCT_HOME_BY_CATEGORY_SUCCESS = "PRODUCT_HOME_BY_CATEGORY_SUCCESS";
export const PRODUCT_HOME_BY_CATEGORY_FAILURE = "PRODUCT_HOME_BY_CATEGORY_FAILURE";

// Get brands list
export const PRODUCT_HOME_BRANDS_REQUEST = "PRODUCT_HOME_BRANDS_REQUEST";
export const PRODUCT_HOME_BRANDS_SUCCESS = "PRODUCT_HOME_BRANDS_SUCCESS";
export const PRODUCT_HOME_BRANDS_FAILURE = "PRODUCT_HOME_BRANDS_FAILURE";

// Clear messages/errors
export const PRODUCT_HOME_CLEAR_MESSAGES = "PRODUCT_HOME_CLEAR_MESSAGES";

// Action creators
export const productHomeListRequest = (query = {}) => ({
    type: PRODUCT_HOME_LIST_REQUEST,
    payload: { query }
});

export const productHomeListSuccess = (items, pagination) => ({
    type: PRODUCT_HOME_LIST_SUCCESS,
    payload: { items, pagination }
});

export const productHomeListFailure = (error) => ({
    type: PRODUCT_HOME_LIST_FAILURE,
    payload: error
});

export const productHomeDetailRequest = (id) => ({
    type: PRODUCT_HOME_DETAIL_REQUEST,
    payload: { id }
});

export const productHomeDetailSuccess = (item) => ({
    type: PRODUCT_HOME_DETAIL_SUCCESS,
    payload: item
});

export const productHomeDetailFailure = (error) => ({
    type: PRODUCT_HOME_DETAIL_FAILURE,
    payload: error
});

export const productHomeFeaturedRequest = (limit = 8) => ({
    type: PRODUCT_HOME_FEATURED_REQUEST,
    payload: { limit }
});

export const productHomeFeaturedSuccess = (items) => ({
    type: PRODUCT_HOME_FEATURED_SUCCESS,
    payload: items
});

export const productHomeFeaturedFailure = (error) => ({
    type: PRODUCT_HOME_FEATURED_FAILURE,
    payload: error
});

export const productHomeByCategoryRequest = (categoryId, query = {}) => ({
    type: PRODUCT_HOME_BY_CATEGORY_REQUEST,
    payload: { categoryId, query }
});

export const productHomeByCategorySuccess = (items, pagination, category) => ({
    type: PRODUCT_HOME_BY_CATEGORY_SUCCESS,
    payload: { items, pagination, category }
});

export const productHomeByCategoryFailure = (error) => ({
    type: PRODUCT_HOME_BY_CATEGORY_FAILURE,
    payload: error
});

export const productHomeBrandsRequest = () => ({
    type: PRODUCT_HOME_BRANDS_REQUEST
});

export const productHomeBrandsSuccess = (brands) => ({
    type: PRODUCT_HOME_BRANDS_SUCCESS,
    payload: brands
});

export const productHomeBrandsFailure = (error) => ({
    type: PRODUCT_HOME_BRANDS_FAILURE,
    payload: error
});

export const productHomeClearMessages = () => ({
    type: PRODUCT_HOME_CLEAR_MESSAGES
});