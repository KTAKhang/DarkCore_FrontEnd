import {
  FETCH_SALE_STAFF_DASHBOARD_REQUEST,
  FETCH_SALE_STAFF_DASHBOARD_SUCCESS,
  FETCH_SALE_STAFF_DASHBOARD_FAILURE,
} from "../actions/statisticsStaffActions";

const initialState = {
  dashboardData: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

const statisticsStaffReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SALE_STAFF_DASHBOARD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_SALE_STAFF_DASHBOARD_SUCCESS:
      return {
        ...state,
        loading: false,
        dashboardData: action.payload,
        lastUpdated: new Date().toISOString(),
        error: null,
      };
    case FETCH_SALE_STAFF_DASHBOARD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default statisticsStaffReducer;


