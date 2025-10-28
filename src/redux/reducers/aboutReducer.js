import {
  ABOUT_PUBLIC_INFO_REQUEST,
  ABOUT_PUBLIC_INFO_SUCCESS,
  ABOUT_PUBLIC_INFO_FAILURE,
  ABOUT_INFO_REQUEST,
  ABOUT_INFO_SUCCESS,
  ABOUT_INFO_FAILURE,
  ABOUT_CREATE_OR_UPDATE_REQUEST,
  ABOUT_CREATE_OR_UPDATE_SUCCESS,
  ABOUT_CREATE_OR_UPDATE_FAILURE,
  ABOUT_UPDATE_STATUS_REQUEST,
  ABOUT_UPDATE_STATUS_SUCCESS,
  ABOUT_UPDATE_STATUS_FAILURE,
  ABOUT_UPDATE_STATS_REQUEST,
  ABOUT_UPDATE_STATS_SUCCESS,
  ABOUT_UPDATE_STATS_FAILURE,
  ABOUT_DELETE_REQUEST,
  ABOUT_DELETE_SUCCESS,
  ABOUT_DELETE_FAILURE,
  ABOUT_CLEAR_MESSAGES,
} from "../actions/aboutActions";

const initialState = {
  data: null,
  publicData: null,
  loading: false,
  publicLoading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  message: null,
};

const aboutReducer = (state = initialState, action) => {
  switch (action.type) {
    case ABOUT_PUBLIC_INFO_REQUEST:
      return { ...state, publicLoading: true, error: null };
    case ABOUT_PUBLIC_INFO_SUCCESS:
      return { ...state, publicLoading: false, publicData: action.payload, error: null };
    case ABOUT_PUBLIC_INFO_FAILURE:
      return { ...state, publicLoading: false, error: action.payload };

    case ABOUT_INFO_REQUEST:
      return { ...state, loading: true, error: null };
    case ABOUT_INFO_SUCCESS:
      return { ...state, loading: false, data: action.payload, error: null };
    case ABOUT_INFO_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case ABOUT_CREATE_OR_UPDATE_REQUEST:
      return { ...state, creating: true, message: null, error: null };
    case ABOUT_CREATE_OR_UPDATE_SUCCESS:
      return {
        ...state,
        creating: false,
        data: action.payload.data,
        message: action.payload.message,
        error: null,
      };
    case ABOUT_CREATE_OR_UPDATE_FAILURE:
      return { ...state, creating: false, error: action.payload };

    case ABOUT_UPDATE_STATUS_REQUEST:
      return { ...state, updating: true, message: null, error: null };
    case ABOUT_UPDATE_STATUS_SUCCESS:
      return {
        ...state,
        updating: false,
        data: action.payload.data,
        message: action.payload.message,
        error: null,
      };
    case ABOUT_UPDATE_STATUS_FAILURE:
      return { ...state, updating: false, error: action.payload };

    case ABOUT_UPDATE_STATS_REQUEST:
      return { ...state, updating: true, message: null, error: null };
    case ABOUT_UPDATE_STATS_SUCCESS:
      return {
        ...state,
        updating: false,
        data: action.payload.data,
        message: action.payload.message,
        error: null,
      };
    case ABOUT_UPDATE_STATS_FAILURE:
      return { ...state, updating: false, error: action.payload };

    case ABOUT_DELETE_REQUEST:
      return { ...state, deleting: true, message: null, error: null };
    case ABOUT_DELETE_SUCCESS:
      return {
        ...state,
        deleting: false,
        data: null,
        message: action.payload.message,
        error: null,
      };
    case ABOUT_DELETE_FAILURE:
      return { ...state, deleting: false, error: action.payload };

    case ABOUT_CLEAR_MESSAGES:
      return { ...state, message: null, error: null };

    default:
      return state;
  }
};

export default aboutReducer;

