import {
  FOUNDER_PUBLIC_LIST_REQUEST,
  FOUNDER_PUBLIC_LIST_SUCCESS,
  FOUNDER_PUBLIC_LIST_FAILURE,
  FOUNDER_LIST_REQUEST,
  FOUNDER_LIST_SUCCESS,
  FOUNDER_LIST_FAILURE,
  FOUNDER_DETAIL_REQUEST,
  FOUNDER_DETAIL_SUCCESS,
  FOUNDER_DETAIL_FAILURE,
  FOUNDER_CREATE_REQUEST,
  FOUNDER_CREATE_SUCCESS,
  FOUNDER_CREATE_FAILURE,
  FOUNDER_UPDATE_REQUEST,
  FOUNDER_UPDATE_SUCCESS,
  FOUNDER_UPDATE_FAILURE,
  FOUNDER_DELETE_REQUEST,
  FOUNDER_DELETE_SUCCESS,
  FOUNDER_DELETE_FAILURE,
  FOUNDER_UPDATE_SORT_ORDER_REQUEST,
  FOUNDER_UPDATE_SORT_ORDER_SUCCESS,
  FOUNDER_UPDATE_SORT_ORDER_FAILURE,
  FOUNDER_CLEAR_MESSAGES,
} from "../actions/founderActions";

const initialState = {
  items: [],
  publicItems: [],
  item: null,
  loadingList: false,
  publicLoadingList: false,
  loadingDetail: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  message: null,
};

const founderReducer = (state = initialState, action) => {
  switch (action.type) {
    case FOUNDER_PUBLIC_LIST_REQUEST:
      return { ...state, publicLoadingList: true, error: null };
    case FOUNDER_PUBLIC_LIST_SUCCESS:
      return { ...state, publicLoadingList: false, publicItems: action.payload.items || action.payload || [], error: null };
    case FOUNDER_PUBLIC_LIST_FAILURE:
      return { ...state, publicLoadingList: false, error: action.payload };

    case FOUNDER_LIST_REQUEST:
      return { ...state, loadingList: true, error: null };
    case FOUNDER_LIST_SUCCESS:
      return { ...state, loadingList: false, items: action.payload.items || [], error: null };
    case FOUNDER_LIST_FAILURE:
      return { ...state, loadingList: false, error: action.payload };

    case FOUNDER_DETAIL_REQUEST:
      return { ...state, loadingDetail: true, error: null };
    case FOUNDER_DETAIL_SUCCESS:
      return { ...state, loadingDetail: false, item: action.payload, error: null };
    case FOUNDER_DETAIL_FAILURE:
      return { ...state, loadingDetail: false, error: action.payload };

    case FOUNDER_CREATE_REQUEST:
      return { ...state, creating: true, message: null, error: null };
    case FOUNDER_CREATE_SUCCESS:
      return {
        ...state,
        creating: false,
        items: [action.payload.item, ...state.items],
        message: action.payload.message,
        error: null,
      };
    case FOUNDER_CREATE_FAILURE:
      return { ...state, creating: false, error: action.payload };

    case FOUNDER_UPDATE_REQUEST:
      return { ...state, updating: true, message: null, error: null };
    case FOUNDER_UPDATE_SUCCESS:
      return {
        ...state,
        updating: false,
        items: state.items.map((f) => (f._id === action.payload.item._id ? action.payload.item : f)),
        item: action.payload.item,
        message: action.payload.message,
        error: null,
      };
    case FOUNDER_UPDATE_FAILURE:
      return { ...state, updating: false, error: action.payload };

    case FOUNDER_DELETE_REQUEST:
      return { ...state, deleting: true, message: null, error: null };
    case FOUNDER_DELETE_SUCCESS:
      return {
        ...state,
        deleting: false,
        items: state.items.filter((f) => f._id !== action.payload.id),
        message: action.payload.message,
        error: null,
      };
    case FOUNDER_DELETE_FAILURE:
      return { ...state, deleting: false, error: action.payload };

    case FOUNDER_UPDATE_SORT_ORDER_REQUEST:
      return { ...state, updating: true, message: null, error: null };
    case FOUNDER_UPDATE_SORT_ORDER_SUCCESS:
      return {
        ...state,
        updating: false,
        items: state.items.map((f) => (f._id === action.payload.item._id ? action.payload.item : f)),
        message: action.payload.message,
        error: null,
      };
    case FOUNDER_UPDATE_SORT_ORDER_FAILURE:
      return { ...state, updating: false, error: action.payload };

    case FOUNDER_CLEAR_MESSAGES:
      return { ...state, message: null, error: null };

    default:
      return state;
  }
};

export default founderReducer;

