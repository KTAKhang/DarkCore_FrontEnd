import {
  NEWS_LIST_REQUEST,
  NEWS_LIST_SUCCESS,
  NEWS_LIST_FAILURE,
  NEWS_GET_REQUEST,
  NEWS_GET_SUCCESS,
  NEWS_GET_FAILURE,
  NEWS_CREATE_REQUEST,
  NEWS_CREATE_SUCCESS,
  NEWS_CREATE_FAILURE,
  NEWS_UPDATE_REQUEST,
  NEWS_UPDATE_SUCCESS,
  NEWS_UPDATE_FAILURE,
  NEWS_DELETE_REQUEST,
  NEWS_DELETE_SUCCESS,
  NEWS_DELETE_FAILURE,
  // THÊM: Import actions cho stats
  NEWS_STATS_REQUEST,
  NEWS_STATS_SUCCESS,
  NEWS_STATS_FAILURE,
} from "../actions/newsActions";

const initialState = {
  list: { data: [], total: 0, page: 1, pages: 1 },
  current: null,
  stats: { total: 0, published: 0, draft: 0, archived: 0 },
  pagination: { page: 1, limit: 5 },
  loadingList: false,
  loadingStats: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
};

const newsReducer = (state = initialState, action) => {
  switch (action.type) {
    case NEWS_LIST_REQUEST:
    case NEWS_GET_REQUEST:
      return {
        ...state,
        loadingList: true,
        error: null,
      };

    // THÊM: Case cho stats request
    case NEWS_STATS_REQUEST:
      return {
        ...state,
        loadingStats: true,
        error: null,
      };

    case NEWS_CREATE_REQUEST:
      return { ...state, creating: true, error: null };
    case NEWS_UPDATE_REQUEST:
      return { ...state, updating: true, error: null };
    case NEWS_DELETE_REQUEST:
      return { ...state, deleting: true, error: null };

    case NEWS_LIST_SUCCESS:
      return {
        ...state,
        loadingList: false,
        list: action.payload,
        pagination: {
          page: action.payload.page || 1,
          limit: action.payload.limit || 5,
          total: action.payload.total || 0,
        },
        error: null,
      };
    case NEWS_GET_SUCCESS:
      return {
        ...state,
        loadingList: false,
        current: action.payload,
        error: null,
      };
    // THÊM: Case cho stats success
    case NEWS_STATS_SUCCESS:
      return {
        ...state,
        loadingStats: false,
        stats: action.payload, // { total, published, draft, archived }
        error: null,
      };
    case NEWS_CREATE_SUCCESS:
      return {
        ...state,
        creating: false,
        current: action.payload,
        error: null,
      };
    case NEWS_UPDATE_SUCCESS:
      return {
        ...state,
        updating: false,
        current: action.payload,
        error: null,
      };
    case NEWS_DELETE_SUCCESS:
      return { ...state, deleting: false, current: null, error: null };

    case NEWS_LIST_FAILURE:
    case NEWS_GET_FAILURE:
    // THÊM: Case cho stats failure
    case NEWS_STATS_FAILURE:
    case NEWS_CREATE_FAILURE:
    case NEWS_UPDATE_FAILURE:
    case NEWS_DELETE_FAILURE:
      return {
        ...state,
        loadingList: false,
        loadingStats: false, // SỬA: Clear loadingStats nếu có error
        creating: false,
        updating: false,
        deleting: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default newsReducer;
