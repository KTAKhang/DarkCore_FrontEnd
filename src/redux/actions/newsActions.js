// ======================
// Action Types
// ======================
export const NEWS_LIST_REQUEST = "NEWS_LIST_REQUEST";
export const NEWS_LIST_SUCCESS = "NEWS_LIST_SUCCESS";
export const NEWS_LIST_FAILURE = "NEWS_LIST_FAILURE";

export const NEWS_GET_REQUEST = "NEWS_GET_REQUEST";
export const NEWS_GET_SUCCESS = "NEWS_GET_SUCCESS";
export const NEWS_GET_FAILURE = "NEWS_GET_FAILURE";

export const NEWS_CREATE_REQUEST = "NEWS_CREATE_REQUEST";
export const NEWS_CREATE_SUCCESS = "NEWS_CREATE_SUCCESS";
export const NEWS_CREATE_FAILURE = "NEWS_CREATE_FAILURE";

export const NEWS_UPDATE_REQUEST = "NEWS_UPDATE_REQUEST";
export const NEWS_UPDATE_SUCCESS = "NEWS_UPDATE_SUCCESS";
export const NEWS_UPDATE_FAILURE = "NEWS_UPDATE_FAILURE";

export const NEWS_DELETE_REQUEST = "NEWS_DELETE_REQUEST";
export const NEWS_DELETE_SUCCESS = "NEWS_DELETE_SUCCESS";
export const NEWS_DELETE_FAILURE = "NEWS_DELETE_FAILURE";

// THÊM: Action Types cho stats
export const NEWS_STATS_REQUEST = "NEWS_STATS_REQUEST";
export const NEWS_STATS_SUCCESS = "NEWS_STATS_SUCCESS";
export const NEWS_STATS_FAILURE = "NEWS_STATS_FAILURE";

// ======================
// Action Creators
// ======================
export const newsListRequest = (params) => ({
  type: NEWS_LIST_REQUEST,
  payload: params,
});
export const newsListSuccess = (data) => ({
  type: NEWS_LIST_SUCCESS,
  payload: data,
});
export const newsListFailure = (error) => ({
  type: NEWS_LIST_FAILURE,
  payload: error,
});

export const newsGetRequest = (id) => ({
  type: NEWS_GET_REQUEST,
  payload: id,
});
export const newsGetSuccess = (news) => ({
  type: NEWS_GET_SUCCESS,
  payload: news,
});
export const newsGetFailure = (error) => ({
  type: NEWS_GET_FAILURE,
  payload: error,
});

export const newsCreateRequest = (data) => ({
  type: NEWS_CREATE_REQUEST,
  payload: data,
});
export const newsCreateSuccess = (news) => ({
  type: NEWS_CREATE_SUCCESS,
  payload: news,
});
export const newsCreateFailure = (error) => ({
  type: NEWS_CREATE_FAILURE,
  payload: error,
});

export const newsUpdateRequest = (id, data) => ({
  type: NEWS_UPDATE_REQUEST,
  payload: { id, data },
});
export const newsUpdateSuccess = (news) => ({
  type: NEWS_UPDATE_SUCCESS,
  payload: news,
});
export const newsUpdateFailure = (error) => ({
  type: NEWS_UPDATE_FAILURE,
  payload: error,
});

export const newsDeleteRequest = (id) => ({
  type: NEWS_DELETE_REQUEST,
  payload: id,
});
export const newsDeleteSuccess = (news) => ({
  type: NEWS_DELETE_SUCCESS,
  payload: news,
});
export const newsDeleteFailure = (error) => ({
  type: NEWS_DELETE_FAILURE,
  payload: error,
});

// THÊM: Action Creator cho stats
export const newsStatsRequest = (params = {}) => ({
  type: NEWS_STATS_REQUEST,
  payload: params, // Empty params để fetch tổng stats (không filter)
});
export const newsStatsSuccess = (stats) => ({
  type: NEWS_STATS_SUCCESS,
  payload: stats,
});
export const newsStatsFailure = (error) => ({
  type: NEWS_STATS_FAILURE,
  payload: error,
});
