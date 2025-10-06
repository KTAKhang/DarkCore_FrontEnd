// Order Actions
export const ORDER_LIST_REQUEST = "ORDER_LIST_REQUEST";
export const ORDER_LIST_SUCCESS = "ORDER_LIST_SUCCESS";
export const ORDER_LIST_FAILED = "ORDER_LIST_FAILED";

export const ORDER_DETAIL_REQUEST = "ORDER_DETAIL_REQUEST";
export const ORDER_DETAIL_SUCCESS = "ORDER_DETAIL_SUCCESS";
export const ORDER_DETAIL_FAILED = "ORDER_DETAIL_FAILED";

export const ORDER_UPDATE_STATUS_REQUEST = "ORDER_UPDATE_STATUS_REQUEST";
export const ORDER_UPDATE_STATUS_SUCCESS = "ORDER_UPDATE_STATUS_SUCCESS";
export const ORDER_UPDATE_STATUS_FAILED = "ORDER_UPDATE_STATUS_FAILED";

export const ORDER_STATS_REQUEST = "ORDER_STATS_REQUEST";
export const ORDER_STATS_SUCCESS = "ORDER_STATS_SUCCESS";
export const ORDER_STATS_FAILED = "ORDER_STATS_FAILED";

export const ORDER_STATUSES_REQUEST = "ORDER_STATUSES_REQUEST";
export const ORDER_STATUSES_SUCCESS = "ORDER_STATUSES_SUCCESS";
export const ORDER_STATUSES_FAILED = "ORDER_STATUSES_FAILED";

export const ORDER_CLEAR_MESSAGES = "ORDER_CLEAR_MESSAGES";

// Action Creators
export const orderListRequest = (params = {}) => ({
  type: ORDER_LIST_REQUEST,
  payload: params,
});

export const orderListSuccess = (data, pagination) => ({
  type: ORDER_LIST_SUCCESS,
  payload: { data, pagination },
});

export const orderListFailed = (error) => ({
  type: ORDER_LIST_FAILED,
  payload: error,
});

export const orderDetailRequest = (id) => ({
  type: ORDER_DETAIL_REQUEST,
  payload: { id },
});

export const orderDetailSuccess = (data) => ({
  type: ORDER_DETAIL_SUCCESS,
  payload: data,
});

export const orderDetailFailed = (error) => ({
  type: ORDER_DETAIL_FAILED,
  payload: error,
});

export const orderUpdateStatusRequest = (id, payload) => ({
  type: ORDER_UPDATE_STATUS_REQUEST,
  payload: { id, ...payload },
});

export const orderUpdateStatusSuccess = (data) => ({
  type: ORDER_UPDATE_STATUS_SUCCESS,
  payload: data,
});

export const orderUpdateStatusFailed = (error) => ({
  type: ORDER_UPDATE_STATUS_FAILED,
  payload: error,
});

export const orderStatsRequest = () => {
  console.log("🚀 orderStatsRequest action dispatched");
  return {
    type: ORDER_STATS_REQUEST,
  };
};

export const orderStatsSuccess = (data) => ({
  type: ORDER_STATS_SUCCESS,
  payload: data,
});

export const orderStatsFailed = (error) => ({
  type: ORDER_STATS_FAILED,
  payload: error,
});

export const orderStatusesRequest = () => ({
  type: ORDER_STATUSES_REQUEST,
});

export const orderStatusesSuccess = (data) => ({
  type: ORDER_STATUSES_SUCCESS,
  payload: data,
});

export const orderStatusesFailed = (error) => ({
  type: ORDER_STATUSES_FAILED,
  payload: error,
});

export const orderClearMessages = () => ({
  type: ORDER_CLEAR_MESSAGES,
});
