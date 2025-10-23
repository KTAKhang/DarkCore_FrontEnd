import {
  CONTACT_LIST_REQUEST,
  CONTACT_LIST_SUCCESS,
  CONTACT_LIST_FAILURE,

  CONTACT_GET_REQUEST,
  CONTACT_GET_SUCCESS,
  CONTACT_GET_FAILURE,

  CONTACT_CREATE_REQUEST,
  CONTACT_CREATE_SUCCESS,
  CONTACT_CREATE_FAILURE,

  CONTACT_REPLY_REQUEST,
  CONTACT_REPLY_SUCCESS,
  CONTACT_REPLY_FAILURE,

  CONTACT_UPDATE_REQUEST,
  CONTACT_UPDATE_SUCCESS,
  CONTACT_UPDATE_FAILURE,

  CONTACT_DELETE_REQUEST,
  CONTACT_DELETE_SUCCESS,
  CONTACT_DELETE_FAILURE,

  CONTACT_STATS_REQUEST,
  CONTACT_STATS_SUCCESS,
  CONTACT_STATS_FAILURE,
} from "../actions/contactActions";

const initialState = {
  list: { data: [], total: 0, page: 1, pages: 1 },
  current: null,
  replies: [],
  stats: { total: 0, pending: 0, resolved: 0, closed: 0 },
  pagination: { page: 1, limit: 5, total: 0 },
  loadingList: false,
  loadingStats: false,
  creating: false,
  replying: false,
  updating: false,
  deleting: false,
  error: null,
};

const contactReducer = (state = initialState, action) => {
  switch (action.type) {
    // ===================== LIST + DETAIL =====================
    case CONTACT_LIST_REQUEST:
    case CONTACT_GET_REQUEST:
      return { ...state, loadingList: true, error: null };

    case CONTACT_LIST_SUCCESS:
      return {
        ...state,
        loadingList: false,
        list: action.payload.data,
        pagination: {
          page: action.payload.data.page || 1, // ✅ Sửa: action.payload.data.page
          limit: state.pagination.limit, // ✅ Giữ nguyên limit từ state
          total: action.payload.data.total || 0, // ✅ Sửa: action.payload.data.total
        },
        error: null,
      };

    case CONTACT_GET_SUCCESS:
      return {
        ...state,
        loadingList: false,
        current: action.payload.contact,
        replies: action.payload.replies || [],
        error: null,
      };

    case CONTACT_LIST_FAILURE:
    case CONTACT_GET_FAILURE:
      return { ...state, loadingList: false, error: action.payload };

    // ===================== CREATE CONTACT =====================
    case CONTACT_CREATE_REQUEST:
      return { ...state, creating: true, error: null };

    case CONTACT_CREATE_SUCCESS:
      return { ...state, creating: false, current: action.payload, error: null };

    case CONTACT_CREATE_FAILURE:
      return { ...state, creating: false, error: action.payload };

    // ===================== CREATE REPLY =====================
    case CONTACT_REPLY_REQUEST:
      return { ...state, replying: true, error: null };

    case CONTACT_REPLY_SUCCESS:
      return {
        ...state,
        replying: false,
        replies: [...state.replies, action.payload],
        error: null,
      };

    case CONTACT_REPLY_FAILURE:
      return { ...state, replying: false, error: action.payload };

    // ===================== UPDATE =====================
    case CONTACT_UPDATE_REQUEST:
      return { ...state, updating: true, error: null };

    case CONTACT_UPDATE_SUCCESS:
      return {
        ...state,
        updating: false,
        list: {
          ...state.list,
          data: state.list.data.map((item) =>
            item._id === action.payload._id ? action.payload : item
          ),
        },
        current:
          state.current && state.current._id === action.payload._id
            ? action.payload
            : state.current,
        error: null,
      };

    case CONTACT_UPDATE_FAILURE:
      return { ...state, updating: false, error: action.payload };

    // ===================== DELETE CONTACT =====================
    case CONTACT_DELETE_REQUEST:
      return { ...state, deleting: true, error: null };

    case CONTACT_DELETE_SUCCESS:
      return {
        ...state,
        deleting: false,
        list: {
          ...state.list,
          data: state.list.data.filter(
            (contact) => contact._id !== action.payload._id
          ),
        },
        current: null,
        error: null,
      };

    case CONTACT_DELETE_FAILURE:
      return { ...state, deleting: false, error: action.payload };

    // ===================== STATS =====================
    case CONTACT_STATS_REQUEST:
      return { ...state, loadingStats: true, error: null };

    case CONTACT_STATS_SUCCESS:
      return { ...state, loadingStats: false, stats: action.payload, error: null };

    case CONTACT_STATS_FAILURE:
      return { ...state, loadingStats: false, error: action.payload };

    // ===================== DEFAULT =====================
    default:
      return state;
  }
};

export default contactReducer;