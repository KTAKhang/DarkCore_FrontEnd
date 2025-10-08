import {
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  CATEGORY_LIST_FAILURE,
  CATEGORY_DETAIL_REQUEST,
  CATEGORY_DETAIL_SUCCESS,
  CATEGORY_DETAIL_FAILURE,
  CATEGORY_CREATE_REQUEST,
  CATEGORY_CREATE_SUCCESS,
  CATEGORY_CREATE_FAILURE,
  CATEGORY_UPDATE_REQUEST,
  CATEGORY_UPDATE_SUCCESS,
  CATEGORY_UPDATE_FAILURE,
  CATEGORY_DELETE_REQUEST,
  CATEGORY_DELETE_SUCCESS,
  CATEGORY_DELETE_FAILURE,
  CATEGORY_STATS_REQUEST,
  CATEGORY_STATS_SUCCESS,
  CATEGORY_STATS_FAILURE,
  CATEGORY_CLEAR_MESSAGES,
} from "../actions/categoryActions";

const initialState = {
  items: [],
  item: null,
  stats: { total: 0, visible: 0, hidden: 0 },
  pagination: { page: 1, limit: 5, total: 0 },
  loadingList: false,
  loadingDetail: false,
  loadingStats: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  message: null,
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case CATEGORY_LIST_REQUEST:
      return { ...state, loadingList: true, error: null };
    case CATEGORY_LIST_SUCCESS:
      return { 
        ...state, 
        loadingList: false, 
        items: action.payload.items || [], 
        pagination: action.payload.pagination || state.pagination,
        error: null 
      };
    case CATEGORY_LIST_FAILURE:
      return { ...state, loadingList: false, error: action.payload };

    case CATEGORY_DETAIL_REQUEST:
      return { ...state, loadingDetail: true, error: null };
    case CATEGORY_DETAIL_SUCCESS:
      return { ...state, loadingDetail: false, item: action.payload, error: null };
    case CATEGORY_DETAIL_FAILURE:
      return { ...state, loadingDetail: false, error: action.payload };

    case CATEGORY_CREATE_REQUEST:
      return { ...state, creating: true, message: null, error: null };
    case CATEGORY_CREATE_SUCCESS:
      return {
        ...state,
        creating: false,
        items: [action.payload.item, ...state.items],
        // Removed message - using toast notification instead
      };
    case CATEGORY_CREATE_FAILURE:
      return { ...state, creating: false, error: action.payload };

    case CATEGORY_UPDATE_REQUEST:
      return { ...state, updating: true, message: null, error: null };
    case CATEGORY_UPDATE_SUCCESS:
      return {
        ...state,
        updating: false,
        items: state.items.map((c) => (c._id === action.payload.item._id ? action.payload.item : c)),
        item: action.payload.item,
        // Removed message - using toast notification instead
      };
    case CATEGORY_UPDATE_FAILURE:
      return { ...state, updating: false, error: action.payload };

    case CATEGORY_DELETE_REQUEST:
      return { ...state, deleting: true, message: null, error: null };
    case CATEGORY_DELETE_SUCCESS:
      return {
        ...state,
        deleting: false,
        items: state.items.filter((c) => c._id !== action.payload.id),
        // Removed message - using toast notification instead
      };
    case CATEGORY_DELETE_FAILURE:
      return { ...state, deleting: false, error: action.payload };

    case CATEGORY_STATS_REQUEST:
      return { ...state, loadingStats: true, error: null };
    case CATEGORY_STATS_SUCCESS:
      return { ...state, loadingStats: false, stats: action.payload, error: null };
    case CATEGORY_STATS_FAILURE:
      return { ...state, loadingStats: false, error: action.payload };

    case CATEGORY_CLEAR_MESSAGES:
      return { ...state, message: null, error: null };

    default:
      return state;
  }
};

export default categoryReducer;


