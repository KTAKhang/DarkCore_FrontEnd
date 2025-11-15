// ==================== ORDER LIST (Admin) ====================
export const ORDER_LIST_REQUEST = 'ORDER_LIST_REQUEST';
export const ORDER_LIST_SUCCESS = 'ORDER_LIST_SUCCESS';
export const ORDER_LIST_FAILED = 'ORDER_LIST_FAILED';

export const orderListRequest = (query = {}) => ({
  type: ORDER_LIST_REQUEST,
  payload: query
});

export const orderListSuccess = (data, pagination) => ({
  type: ORDER_LIST_SUCCESS,
  payload: { data, pagination }
});

export const orderListFailed = (error) => ({
  type: ORDER_LIST_FAILED,
  payload: error
});

// ==================== ORDER STATS ====================
export const ORDER_STATS_REQUEST = 'ORDER_STATS_REQUEST';
export const ORDER_STATS_SUCCESS = 'ORDER_STATS_SUCCESS';
export const ORDER_STATS_FAILED = 'ORDER_STATS_FAILED';

export const orderStatsRequest = () => ({
  type: ORDER_STATS_REQUEST
});

export const orderStatsSuccess = (data) => ({
  type: ORDER_STATS_SUCCESS,
  payload: data
});

export const orderStatsFailed = (error) => ({
  type: ORDER_STATS_FAILED,
  payload: error
});

// ==================== ORDER HISTORY (Customer) ====================
export const ORDER_HISTORY_REQUEST = 'ORDER_HISTORY_REQUEST';
export const ORDER_HISTORY_SUCCESS = 'ORDER_HISTORY_SUCCESS';
export const ORDER_HISTORY_FAILURE = 'ORDER_HISTORY_FAILURE';

export const orderHistoryRequest = (userId, query = {}) => ({
  type: ORDER_HISTORY_REQUEST,
  payload: { userId, query }
});

export const orderHistorySuccess = (data, pagination) => ({
  type: ORDER_HISTORY_SUCCESS,
  payload: { data, pagination }
});

export const orderHistoryFailure = (error) => ({
  type: ORDER_HISTORY_FAILURE,
  payload: error
});

// ==================== ORDER DETAIL ====================
export const ORDER_DETAIL_REQUEST = 'ORDER_DETAIL_REQUEST';
export const ORDER_DETAIL_SUCCESS = 'ORDER_DETAIL_SUCCESS';
export const ORDER_DETAIL_FAILURE = 'ORDER_DETAIL_FAILURE';
export const ORDER_DETAIL_FAILED = 'ORDER_DETAIL_FAILED'; // Alias for compatibility

export const orderDetailRequest = (orderId) => ({
  type: ORDER_DETAIL_REQUEST,
  payload: { id: orderId }
});

export const orderDetailSuccess = (data) => ({
  type: ORDER_DETAIL_SUCCESS,
  payload: data
});

export const orderDetailFailure = (error) => ({
  type: ORDER_DETAIL_FAILURE,
  payload: error
});

export const orderDetailFailed = (error) => ({
  type: ORDER_DETAIL_FAILED,
  payload: error
});

// ==================== UPDATE ORDER STATUS ====================
export const ORDER_UPDATE_STATUS_REQUEST = 'ORDER_UPDATE_STATUS_REQUEST';
export const ORDER_UPDATE_STATUS_SUCCESS = 'ORDER_UPDATE_STATUS_SUCCESS';
export const ORDER_UPDATE_STATUS_FAILURE = 'ORDER_UPDATE_STATUS_FAILURE';
export const ORDER_UPDATE_STATUS_FAILED = 'ORDER_UPDATE_STATUS_FAILED'; // Alias

export const orderUpdateStatusRequest = (orderId, payload) => ({
  type: ORDER_UPDATE_STATUS_REQUEST,
  payload: { id: orderId, ...payload }
});

export const orderUpdateStatusSuccess = (data) => ({
  type: ORDER_UPDATE_STATUS_SUCCESS,
  payload: data
});

export const orderUpdateStatusFailure = (error) => ({
  type: ORDER_UPDATE_STATUS_FAILURE,
  payload: error
});

export const orderUpdateStatusFailed = (error) => ({
  type: ORDER_UPDATE_STATUS_FAILED,
  payload: error
});

// ==================== GET ORDER STATUSES ====================
export const ORDER_STATUSES_REQUEST = 'ORDER_STATUSES_REQUEST';
export const ORDER_STATUSES_SUCCESS = 'ORDER_STATUSES_SUCCESS';
export const ORDER_STATUSES_FAILURE = 'ORDER_STATUSES_FAILURE';
export const ORDER_STATUSES_FAILED = 'ORDER_STATUSES_FAILED'; // Alias

export const orderStatusesRequest = () => ({
  type: ORDER_STATUSES_REQUEST
});

export const orderStatusesSuccess = (data) => ({
  type: ORDER_STATUSES_SUCCESS,
  payload: data
});

export const orderStatusesFailure = (error) => ({
  type: ORDER_STATUSES_FAILURE,
  payload: error
});

export const orderStatusesFailed = (error) => ({
  type: ORDER_STATUSES_FAILED,
  payload: error
});

// ==================== CLEAR MESSAGES ====================
export const ORDER_CLEAR_MESSAGES = 'ORDER_CLEAR_MESSAGES';

export const orderClearMessages = () => ({
  type: ORDER_CLEAR_MESSAGES
});

// ==================== CREATE ORDER ====================
export const ORDER_CREATE_REQUEST = 'ORDER_CREATE_REQUEST';
export const ORDER_CREATE_SUCCESS = 'ORDER_CREATE_SUCCESS';
export const ORDER_CREATE_FAILURE = 'ORDER_CREATE_FAILURE';
export const ORDER_CREATE_FAILED = 'ORDER_CREATE_FAILED'; // Alias

export const orderCreateRequest = (payload) => ({
  type: ORDER_CREATE_REQUEST,
  payload
});

export const orderCreateSuccess = (data) => ({
  type: ORDER_CREATE_SUCCESS,
  payload: data
});

export const orderCreateFailure = (error) => ({
  type: ORDER_CREATE_FAILURE,
  payload: error
});

export const orderCreateFailed = (error) => ({
  type: ORDER_CREATE_FAILED,
  payload: error
});

// ==================== CANCEL ORDER (Customer) ====================
export const ORDER_CANCEL_REQUEST = 'ORDER_CANCEL_REQUEST';
export const ORDER_CANCEL_SUCCESS = 'ORDER_CANCEL_SUCCESS';
export const ORDER_CANCEL_FAILURE = 'ORDER_CANCEL_FAILURE';

export const orderCancelRequest = (orderId, cancelledReason = '') => ({
  type: ORDER_CANCEL_REQUEST,
  payload: { orderId, cancelledReason }
});

export const orderCancelSuccess = (data) => ({
  type: ORDER_CANCEL_SUCCESS,
  payload: data
});

export const orderCancelFailure = (error) => ({
  type: ORDER_CANCEL_FAILURE,
  payload: error
});
