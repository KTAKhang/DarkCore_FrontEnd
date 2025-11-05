import {
  FETCH_DASHBOARD_DATA_REQUEST,
  FETCH_DASHBOARD_DATA_SUCCESS,
  FETCH_DASHBOARD_DATA_FAILURE,
  EXPORT_DASHBOARD_EXCEL_REQUEST,
  EXPORT_DASHBOARD_EXCEL_SUCCESS,
  EXPORT_DASHBOARD_EXCEL_FAILURE
} from "../actions/statisticsActions";

const initialState = {
  dashboardData: null,
  loading: false,
  error: null,
  exporting: false,
  exportError: null
};

const statisticsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DASHBOARD_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_DASHBOARD_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        dashboardData: action.payload,
        error: null
      };

    case FETCH_DASHBOARD_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case EXPORT_DASHBOARD_EXCEL_REQUEST:
      return {
        ...state,
        exporting: true,
        exportError: null
      };

    case EXPORT_DASHBOARD_EXCEL_SUCCESS:
      return {
        ...state,
        exporting: false,
        exportError: null
      };

    case EXPORT_DASHBOARD_EXCEL_FAILURE:
      return {
        ...state,
        exporting: false,
        exportError: action.payload
      };

    default:
      return state;
  }
};

export default statisticsReducer;

