// Action Types
export const FETCH_DASHBOARD_DATA_REQUEST = "FETCH_DASHBOARD_DATA_REQUEST";
export const FETCH_DASHBOARD_DATA_SUCCESS = "FETCH_DASHBOARD_DATA_SUCCESS";
export const FETCH_DASHBOARD_DATA_FAILURE = "FETCH_DASHBOARD_DATA_FAILURE";

export const EXPORT_DASHBOARD_EXCEL_REQUEST = "EXPORT_DASHBOARD_EXCEL_REQUEST";
export const EXPORT_DASHBOARD_EXCEL_SUCCESS = "EXPORT_DASHBOARD_EXCEL_SUCCESS";
export const EXPORT_DASHBOARD_EXCEL_FAILURE = "EXPORT_DASHBOARD_EXCEL_FAILURE";

// Action Creators
export const fetchDashboardDataRequest = (year, customerDate = null) => ({
  type: FETCH_DASHBOARD_DATA_REQUEST,
  payload: { year, customerDate }
});

export const fetchDashboardDataSuccess = (data) => ({
  type: FETCH_DASHBOARD_DATA_SUCCESS,
  payload: data
});

export const fetchDashboardDataFailure = (error) => ({
  type: FETCH_DASHBOARD_DATA_FAILURE,
  payload: error
});

export const exportDashboardExcelRequest = (year) => ({
  type: EXPORT_DASHBOARD_EXCEL_REQUEST,
  payload: { year }
});

export const exportDashboardExcelSuccess = () => ({
  type: EXPORT_DASHBOARD_EXCEL_SUCCESS
});

export const exportDashboardExcelFailure = (error) => ({
  type: EXPORT_DASHBOARD_EXCEL_FAILURE,
  payload: error
});

