// actions/founderActions.js

// List Founders (Public)
export const FOUNDER_PUBLIC_LIST_REQUEST = "FOUNDER_PUBLIC_LIST_REQUEST";
export const FOUNDER_PUBLIC_LIST_SUCCESS = "FOUNDER_PUBLIC_LIST_SUCCESS";
export const FOUNDER_PUBLIC_LIST_FAILURE = "FOUNDER_PUBLIC_LIST_FAILURE";

// List Founders (Admin)
export const FOUNDER_LIST_REQUEST = "FOUNDER_LIST_REQUEST";
export const FOUNDER_LIST_SUCCESS = "FOUNDER_LIST_SUCCESS";
export const FOUNDER_LIST_FAILURE = "FOUNDER_LIST_FAILURE";

// Get Founder Detail (Admin)
export const FOUNDER_DETAIL_REQUEST = "FOUNDER_DETAIL_REQUEST";
export const FOUNDER_DETAIL_SUCCESS = "FOUNDER_DETAIL_SUCCESS";
export const FOUNDER_DETAIL_FAILURE = "FOUNDER_DETAIL_FAILURE";

// Create Founder
export const FOUNDER_CREATE_REQUEST = "FOUNDER_CREATE_REQUEST";
export const FOUNDER_CREATE_SUCCESS = "FOUNDER_CREATE_SUCCESS";
export const FOUNDER_CREATE_FAILURE = "FOUNDER_CREATE_FAILURE";

// Update Founder
export const FOUNDER_UPDATE_REQUEST = "FOUNDER_UPDATE_REQUEST";
export const FOUNDER_UPDATE_SUCCESS = "FOUNDER_UPDATE_SUCCESS";
export const FOUNDER_UPDATE_FAILURE = "FOUNDER_UPDATE_FAILURE";

// Delete Founder
export const FOUNDER_DELETE_REQUEST = "FOUNDER_DELETE_REQUEST";
export const FOUNDER_DELETE_SUCCESS = "FOUNDER_DELETE_SUCCESS";
export const FOUNDER_DELETE_FAILURE = "FOUNDER_DELETE_FAILURE";

// Update Sort Order
export const FOUNDER_UPDATE_SORT_ORDER_REQUEST = "FOUNDER_UPDATE_SORT_ORDER_REQUEST";
export const FOUNDER_UPDATE_SORT_ORDER_SUCCESS = "FOUNDER_UPDATE_SORT_ORDER_SUCCESS";
export const FOUNDER_UPDATE_SORT_ORDER_FAILURE = "FOUNDER_UPDATE_SORT_ORDER_FAILURE";

// Clear messages/errors
export const FOUNDER_CLEAR_MESSAGES = "FOUNDER_CLEAR_MESSAGES";

// Action creators
export const founderPublicListRequest = () => ({ type: FOUNDER_PUBLIC_LIST_REQUEST });
export const founderPublicListSuccess = (items) => ({ type: FOUNDER_PUBLIC_LIST_SUCCESS, payload: { items } });
export const founderPublicListFailure = (error) => ({ type: FOUNDER_PUBLIC_LIST_FAILURE, payload: error });

export const founderListRequest = (query = {}) => ({ type: FOUNDER_LIST_REQUEST, payload: { query } });
export const founderListSuccess = (items) => ({ type: FOUNDER_LIST_SUCCESS, payload: { items } });
export const founderListFailure = (error) => ({ type: FOUNDER_LIST_FAILURE, payload: error });

export const founderDetailRequest = (id) => ({ type: FOUNDER_DETAIL_REQUEST, payload: { id } });
export const founderDetailSuccess = (item) => ({ type: FOUNDER_DETAIL_SUCCESS, payload: item });
export const founderDetailFailure = (error) => ({ type: FOUNDER_DETAIL_FAILURE, payload: error });

export const founderCreateRequest = (payload) => ({ type: FOUNDER_CREATE_REQUEST, payload });
export const founderCreateSuccess = (item, message) => ({ type: FOUNDER_CREATE_SUCCESS, payload: { item, message } });
export const founderCreateFailure = (error) => ({ type: FOUNDER_CREATE_FAILURE, payload: error });

export const founderUpdateRequest = (id, payload) => ({ type: FOUNDER_UPDATE_REQUEST, payload: { id, payload } });
export const founderUpdateSuccess = (item, message) => ({ type: FOUNDER_UPDATE_SUCCESS, payload: { item, message } });
export const founderUpdateFailure = (error) => ({ type: FOUNDER_UPDATE_FAILURE, payload: error });

export const founderDeleteRequest = (id) => ({ type: FOUNDER_DELETE_REQUEST, payload: { id } });
export const founderDeleteSuccess = (id, message) => ({ type: FOUNDER_DELETE_SUCCESS, payload: { id, message } });
export const founderDeleteFailure = (error) => ({ type: FOUNDER_DELETE_FAILURE, payload: error });

export const founderUpdateSortOrderRequest = (id, sortOrder) => ({ type: FOUNDER_UPDATE_SORT_ORDER_REQUEST, payload: { id, sortOrder } });
export const founderUpdateSortOrderSuccess = (item, message) => ({ type: FOUNDER_UPDATE_SORT_ORDER_SUCCESS, payload: { item, message } });
export const founderUpdateSortOrderFailure = (error) => ({ type: FOUNDER_UPDATE_SORT_ORDER_FAILURE, payload: error });

export const founderClearMessages = () => ({ type: FOUNDER_CLEAR_MESSAGES });

