// actions/categoryActions.js

// List
export const CATEGORY_LIST_REQUEST = "CATEGORY_LIST_REQUEST";
export const CATEGORY_LIST_SUCCESS = "CATEGORY_LIST_SUCCESS";
export const CATEGORY_LIST_FAILURE = "CATEGORY_LIST_FAILURE";

// Detail
export const CATEGORY_DETAIL_REQUEST = "CATEGORY_DETAIL_REQUEST";
export const CATEGORY_DETAIL_SUCCESS = "CATEGORY_DETAIL_SUCCESS";
export const CATEGORY_DETAIL_FAILURE = "CATEGORY_DETAIL_FAILURE";

// Create
export const CATEGORY_CREATE_REQUEST = "CATEGORY_CREATE_REQUEST";
export const CATEGORY_CREATE_SUCCESS = "CATEGORY_CREATE_SUCCESS";
export const CATEGORY_CREATE_FAILURE = "CATEGORY_CREATE_FAILURE";

// Update
export const CATEGORY_UPDATE_REQUEST = "CATEGORY_UPDATE_REQUEST";
export const CATEGORY_UPDATE_SUCCESS = "CATEGORY_UPDATE_SUCCESS";
export const CATEGORY_UPDATE_FAILURE = "CATEGORY_UPDATE_FAILURE";

// Delete
export const CATEGORY_DELETE_REQUEST = "CATEGORY_DELETE_REQUEST";
export const CATEGORY_DELETE_SUCCESS = "CATEGORY_DELETE_SUCCESS";
export const CATEGORY_DELETE_FAILURE = "CATEGORY_DELETE_FAILURE";

// Stats
export const CATEGORY_STATS_REQUEST = "CATEGORY_STATS_REQUEST";
export const CATEGORY_STATS_SUCCESS = "CATEGORY_STATS_SUCCESS";
export const CATEGORY_STATS_FAILURE = "CATEGORY_STATS_FAILURE";

// Clear messages/errors
export const CATEGORY_CLEAR_MESSAGES = "CATEGORY_CLEAR_MESSAGES";

// Action creators
export const categoryListRequest = (query = {}) => ({ type: CATEGORY_LIST_REQUEST, payload: { query } });
export const categoryListSuccess = (items, pagination) => ({ type: CATEGORY_LIST_SUCCESS, payload: { items, pagination } });
export const categoryListFailure = (error) => ({ type: CATEGORY_LIST_FAILURE, payload: error });

export const categoryDetailRequest = (id) => ({ type: CATEGORY_DETAIL_REQUEST, payload: { id } });
export const categoryDetailSuccess = (item) => ({ type: CATEGORY_DETAIL_SUCCESS, payload: item });
export const categoryDetailFailure = (error) => ({ type: CATEGORY_DETAIL_FAILURE, payload: error });

export const categoryCreateRequest = (payload) => ({ type: CATEGORY_CREATE_REQUEST, payload });
export const categoryCreateSuccess = (item, message) => ({ type: CATEGORY_CREATE_SUCCESS, payload: { item, message } });
export const categoryCreateFailure = (error) => ({ type: CATEGORY_CREATE_FAILURE, payload: error });

export const categoryUpdateRequest = (id, payload) => ({ type: CATEGORY_UPDATE_REQUEST, payload: { id, payload } });
export const categoryUpdateSuccess = (item, message) => ({ type: CATEGORY_UPDATE_SUCCESS, payload: { item, message } });
export const categoryUpdateFailure = (error) => ({ type: CATEGORY_UPDATE_FAILURE, payload: error });

export const categoryDeleteRequest = (id) => ({ type: CATEGORY_DELETE_REQUEST, payload: { id } });
export const categoryDeleteSuccess = (id, message) => ({ type: CATEGORY_DELETE_SUCCESS, payload: { id, message } });
export const categoryDeleteFailure = (error) => ({ type: CATEGORY_DELETE_FAILURE, payload: error });

export const categoryStatsRequest = () => ({ type: CATEGORY_STATS_REQUEST });
export const categoryStatsSuccess = (stats) => ({ type: CATEGORY_STATS_SUCCESS, payload: stats });
export const categoryStatsFailure = (error) => ({ type: CATEGORY_STATS_FAILURE, payload: error });

export const categoryClearMessages = () => ({ type: CATEGORY_CLEAR_MESSAGES });


