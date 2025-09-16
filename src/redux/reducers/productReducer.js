import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAILURE,
  PRODUCT_DETAIL_REQUEST,
  PRODUCT_DETAIL_SUCCESS,
  PRODUCT_DETAIL_FAILURE,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAILURE,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAILURE,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAILURE,
  PRODUCT_STATS_REQUEST,
  PRODUCT_STATS_SUCCESS,
  PRODUCT_STATS_FAILURE,
  PRODUCT_CLEAR_MESSAGES,
} from "../actions/productActions";

const initialState = {
  items: [],
  item: null,
  stats: { total: 0, visible: 0, hidden: 0 },
  pagination: { page: 1, limit: 20, total: 0 },
  loadingList: false,
  loadingDetail: false,
  loadingStats: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  message: null,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { ...state, loadingList: true, error: null };
    case PRODUCT_LIST_SUCCESS:
      return { 
        ...state, 
        loadingList: false, 
        items: action.payload.items || [], 
        pagination: action.payload.pagination || state.pagination,
        error: null 
      };
    case PRODUCT_LIST_FAILURE:
      return { ...state, loadingList: false, error: action.payload };

    case PRODUCT_DETAIL_REQUEST:
      return { ...state, loadingDetail: true, error: null };
    case PRODUCT_DETAIL_SUCCESS:
      return { ...state, loadingDetail: false, item: action.payload, error: null };
    case PRODUCT_DETAIL_FAILURE:
      return { ...state, loadingDetail: false, error: action.payload };

    case PRODUCT_CREATE_REQUEST:
      return { ...state, creating: true, message: null, error: null };
    case PRODUCT_CREATE_SUCCESS:
      return {
        ...state,
        creating: false,
        items: [action.payload.item, ...state.items],
        message: action.payload.message || "Sản phẩm đã được tạo thành công",
      };
    case PRODUCT_CREATE_FAILURE:
      return { ...state, creating: false, error: action.payload };

    case PRODUCT_UPDATE_REQUEST:
      return { ...state, updating: true, message: null, error: null };
    case PRODUCT_UPDATE_SUCCESS:
      return {
        ...state,
        updating: false,
        items: state.items.map((p) => (p._id === action.payload.item._id ? action.payload.item : p)),
        item: action.payload.item,
        message: action.payload.message || "Sản phẩm đã được cập nhật thành công",
      };
    case PRODUCT_UPDATE_FAILURE:
      return { ...state, updating: false, error: action.payload };

    case PRODUCT_DELETE_REQUEST:
      return { ...state, deleting: true, message: null, error: null };
    case PRODUCT_DELETE_SUCCESS:
      return {
        ...state,
        deleting: false,
        items: state.items.filter((p) => p._id !== action.payload.id),
        message: action.payload.message || "Sản phẩm đã được xóa thành công",
      };
    case PRODUCT_DELETE_FAILURE:
      return { ...state, deleting: false, error: action.payload };

    case PRODUCT_STATS_REQUEST:
      return { ...state, loadingStats: true, error: null };
    case PRODUCT_STATS_SUCCESS:
      return { ...state, loadingStats: false, stats: action.payload, error: null };
    case PRODUCT_STATS_FAILURE:
      return { ...state, loadingStats: false, error: action.payload };

    case PRODUCT_CLEAR_MESSAGES:
      return { ...state, message: null, error: null };

    default:
      return state;
  }
};

export default productReducer;
