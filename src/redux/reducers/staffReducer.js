import {
  STAFF_LIST_REQUEST,
  STAFF_LIST_SUCCESS,
  STAFF_LIST_FAILURE,
  STAFF_CREATE_REQUEST,
  STAFF_CREATE_SUCCESS,
  STAFF_CREATE_FAILURE,
  STAFF_UPDATE_REQUEST,
  STAFF_UPDATE_SUCCESS,
  STAFF_UPDATE_FAILURE,
  STAFF_DETAIL_REQUEST,
  STAFF_DETAIL_SUCCESS,
  STAFF_DETAIL_FAILURE,
} from "../actions/staffActions";

const initialState = {
  list: [],
  pagination: { page: 1, limit: 10, total: 0 },
  detail: null,
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
};

export default function staffReducer(state = initialState, action) {
  switch (action.type) {
    case STAFF_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case STAFF_LIST_SUCCESS: {
      const payload = action.payload || {};
      const list = Array.isArray(payload) ? payload : (payload.data || []);
      const pagination = Array.isArray(payload) ? { page: 1, limit: list.length, total: list.length } : (payload.pagination || { page: 1, limit: list.length, total: list.length });
      return { ...state, loading: false, list, pagination };
    }
    case STAFF_LIST_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case STAFF_CREATE_REQUEST:
      return { ...state, createLoading: true, createError: null };
    case STAFF_CREATE_SUCCESS:
      return { ...state, createLoading: false };
    case STAFF_CREATE_FAILURE:
      return { ...state, createLoading: false, createError: action.payload };

    case STAFF_UPDATE_REQUEST:
      return { ...state, updateLoading: true, updateError: null };
    case STAFF_UPDATE_SUCCESS:
      return { ...state, updateLoading: false };
    case STAFF_UPDATE_FAILURE:
      return { ...state, updateLoading: false, updateError: action.payload };

    case STAFF_DETAIL_REQUEST:
      return { ...state, detail: null, loading: true, error: null };
    case STAFF_DETAIL_SUCCESS:
      return { ...state, detail: action.payload, loading: false };
    case STAFF_DETAIL_FAILURE:
      return { ...state, detail: null, loading: false, error: action.payload };

    default:
      return state;
  }
}