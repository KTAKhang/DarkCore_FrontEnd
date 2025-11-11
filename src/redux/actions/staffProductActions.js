// src/redux/actions/staffProductActions.js
export const STAFF_PRODUCT_LIST_REQUEST = "STAFF_PRODUCT_LIST_REQUEST";
export const STAFF_PRODUCT_LIST_SUCCESS = "STAFF_PRODUCT_LIST_SUCCESS";
export const STAFF_PRODUCT_LIST_FAILURE = "STAFF_PRODUCT_LIST_FAILURE";

export const STAFF_PRODUCT_DETAIL_REQUEST = "STAFF_PRODUCT_DETAIL_REQUEST";
export const STAFF_PRODUCT_DETAIL_SUCCESS = "STAFF_PRODUCT_DETAIL_SUCCESS";
export const STAFF_PRODUCT_DETAIL_FAILURE = "STAFF_PRODUCT_DETAIL_FAILURE";

export const STAFF_PRODUCT_CREATE_REQUEST = "STAFF_PRODUCT_CREATE_REQUEST";
export const STAFF_PRODUCT_CREATE_SUCCESS = "STAFF_PRODUCT_CREATE_SUCCESS";
export const STAFF_PRODUCT_CREATE_FAILURE = "STAFF_PRODUCT_CREATE_FAILURE";

export const STAFF_PRODUCT_UPDATE_REQUEST = "STAFF_PRODUCT_UPDATE_REQUEST";
export const STAFF_PRODUCT_UPDATE_SUCCESS = "STAFF_PRODUCT_UPDATE_SUCCESS";
export const STAFF_PRODUCT_UPDATE_FAILURE = "STAFF_PRODUCT_UPDATE_FAILURE";

export const STAFF_PRODUCT_DELETE_REQUEST = "STAFF_PRODUCT_DELETE_REQUEST";
export const STAFF_PRODUCT_DELETE_SUCCESS = "STAFF_PRODUCT_DELETE_SUCCESS";
export const STAFF_PRODUCT_DELETE_FAILURE = "STAFF_PRODUCT_DELETE_FAILURE";

export const STAFF_PRODUCT_STATS_REQUEST = "STAFF_PRODUCT_STATS_REQUEST";
export const STAFF_PRODUCT_STATS_SUCCESS = "STAFF_PRODUCT_STATS_SUCCESS";
export const STAFF_PRODUCT_STATS_FAILURE = "STAFF_PRODUCT_STATS_FAILURE";

export const STAFF_PRODUCT_CLEAR_MESSAGES = "STAFF_PRODUCT_CLEAR_MESSAGES";

// Action Creators
export const staffProductListRequest = (query = {}) => ({
  type: STAFF_PRODUCT_LIST_REQUEST,
  payload: { query },
});

export const staffProductListSuccess = (items, pagination) => ({
  type: STAFF_PRODUCT_LIST_SUCCESS,
  payload: { items, pagination },
});

export const staffProductListFailure = (error) => ({
  type: STAFF_PRODUCT_LIST_FAILURE,
  payload: error,
});

export const staffProductDetailRequest = (id) => ({
  type: STAFF_PRODUCT_DETAIL_REQUEST,
  payload: { id },
});

export const staffProductDetailSuccess = (item) => ({
  type: STAFF_PRODUCT_DETAIL_SUCCESS,
  payload: item,
});

export const staffProductDetailFailure = (error) => ({
  type: STAFF_PRODUCT_DETAIL_FAILURE,
  payload: error,
});

export const staffProductCreateRequest = (payload) => ({
  type: STAFF_PRODUCT_CREATE_REQUEST,
  payload,
});

export const staffProductCreateSuccess = (item, message = "Tạo sản phẩm thành công!") => ({
  type: STAFF_PRODUCT_CREATE_SUCCESS,
  payload: { item, message },
});

export const staffProductCreateFailure = (error) => ({
  type: STAFF_PRODUCT_CREATE_FAILURE,
  payload: error,
});

export const staffProductUpdateRequest = (id, payload) => ({
  type: STAFF_PRODUCT_UPDATE_REQUEST,
  payload: { id, payload },
});

export const staffProductUpdateSuccess = (item, message = "Cập nhật sản phẩm thành công!") => ({
  type: STAFF_PRODUCT_UPDATE_SUCCESS,
  payload: { item, message },
});

export const staffProductUpdateFailure = (error) => ({
  type: STAFF_PRODUCT_UPDATE_FAILURE,
  payload: error,
});

export const staffProductDeleteRequest = (id) => ({
  type: STAFF_PRODUCT_DELETE_REQUEST,
  payload: { id },
});

export const staffProductDeleteSuccess = (id, message = "Xóa sản phẩm thành công!") => ({
  type: STAFF_PRODUCT_DELETE_SUCCESS,
  payload: { id, message },
});

export const staffProductDeleteFailure = (error) => ({
  type: STAFF_PRODUCT_DELETE_FAILURE,
  payload: error,
});

export const staffProductStatsRequest = () => ({
  type: STAFF_PRODUCT_STATS_REQUEST,
});

export const staffProductStatsSuccess = (stats) => ({
  type: STAFF_PRODUCT_STATS_SUCCESS,
  payload: stats,
});

export const staffProductStatsFailure = (error) => ({
  type: STAFF_PRODUCT_STATS_FAILURE,
  payload: error,
});

export const staffProductClearMessages = () => ({
  type: STAFF_PRODUCT_CLEAR_MESSAGES,
});