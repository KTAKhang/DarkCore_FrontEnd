// actions/productActions.js

// List
export const PRODUCT_LIST_REQUEST = "PRODUCT_LIST_REQUEST";
export const PRODUCT_LIST_SUCCESS = "PRODUCT_LIST_SUCCESS";
export const PRODUCT_LIST_FAILURE = "PRODUCT_LIST_FAILURE";

// Detail
export const PRODUCT_DETAIL_REQUEST = "PRODUCT_DETAIL_REQUEST";
export const PRODUCT_DETAIL_SUCCESS = "PRODUCT_DETAIL_SUCCESS";
export const PRODUCT_DETAIL_FAILURE = "PRODUCT_DETAIL_FAILURE";

// Create
export const PRODUCT_CREATE_REQUEST = "PRODUCT_CREATE_REQUEST";
export const PRODUCT_CREATE_SUCCESS = "PRODUCT_CREATE_SUCCESS";
export const PRODUCT_CREATE_FAILURE = "PRODUCT_CREATE_FAILURE";

// Update
export const PRODUCT_UPDATE_REQUEST = "PRODUCT_UPDATE_REQUEST";
export const PRODUCT_UPDATE_SUCCESS = "PRODUCT_UPDATE_SUCCESS";
export const PRODUCT_UPDATE_FAILURE = "PRODUCT_UPDATE_FAILURE";

// Delete
export const PRODUCT_DELETE_REQUEST = "PRODUCT_DELETE_REQUEST";
export const PRODUCT_DELETE_SUCCESS = "PRODUCT_DELETE_SUCCESS";
export const PRODUCT_DELETE_FAILURE = "PRODUCT_DELETE_FAILURE";

// Stats
export const PRODUCT_STATS_REQUEST = "PRODUCT_STATS_REQUEST";
export const PRODUCT_STATS_SUCCESS = "PRODUCT_STATS_SUCCESS";
export const PRODUCT_STATS_FAILURE = "PRODUCT_STATS_FAILURE";

// Clear messages/errors
export const PRODUCT_CLEAR_MESSAGES = "PRODUCT_CLEAR_MESSAGES";

// Action creators
export const productListRequest = (query = {}) => ({ type: PRODUCT_LIST_REQUEST, payload: { query } });
export const productListSuccess = (items, pagination) => ({ type: PRODUCT_LIST_SUCCESS, payload: { items, pagination } });
export const productListFailure = (error) => ({ type: PRODUCT_LIST_FAILURE, payload: error });

export const productDetailRequest = (id) => ({ type: PRODUCT_DETAIL_REQUEST, payload: { id } });
export const productDetailSuccess = (item) => ({ type: PRODUCT_DETAIL_SUCCESS, payload: item });
export const productDetailFailure = (error) => ({ type: PRODUCT_DETAIL_FAILURE, payload: error });

export const productCreateRequest = (payload) => ({ type: PRODUCT_CREATE_REQUEST, payload });
export const productCreateSuccess = (item, message) => ({ type: PRODUCT_CREATE_SUCCESS, payload: { item, message } });
export const productCreateFailure = (error) => ({ type: PRODUCT_CREATE_FAILURE, payload: error });

export const productUpdateRequest = (id, payload) => ({ type: PRODUCT_UPDATE_REQUEST, payload: { id, payload } });
export const productUpdateSuccess = (item, message) => ({ type: PRODUCT_UPDATE_SUCCESS, payload: { item, message } });
export const productUpdateFailure = (error) => ({ type: PRODUCT_UPDATE_FAILURE, payload: error });

export const productDeleteRequest = (id) => ({ type: PRODUCT_DELETE_REQUEST, payload: { id } });
export const productDeleteSuccess = (id, message) => ({ type: PRODUCT_DELETE_SUCCESS, payload: { id, message } });
export const productDeleteFailure = (error) => ({ type: PRODUCT_DELETE_FAILURE, payload: error });

export const productStatsRequest = () => ({ type: PRODUCT_STATS_REQUEST });
export const productStatsSuccess = (stats) => ({ type: PRODUCT_STATS_SUCCESS, payload: stats });
export const productStatsFailure = (error) => ({ type: PRODUCT_STATS_FAILURE, payload: error });

export const productClearMessages = () => ({ type: PRODUCT_CLEAR_MESSAGES });
