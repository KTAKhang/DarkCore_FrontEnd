// Action Types
export const FETCH_SALE_STAFF_DASHBOARD_REQUEST = "FETCH_SALE_STAFF_DASHBOARD_REQUEST";
export const FETCH_SALE_STAFF_DASHBOARD_SUCCESS = "FETCH_SALE_STAFF_DASHBOARD_SUCCESS";
export const FETCH_SALE_STAFF_DASHBOARD_FAILURE = "FETCH_SALE_STAFF_DASHBOARD_FAILURE";

// Action Creators
export const fetchSaleStaffDashboardRequest = () => ({
  type: FETCH_SALE_STAFF_DASHBOARD_REQUEST,
});

export const fetchSaleStaffDashboardSuccess = (data) => ({
  type: FETCH_SALE_STAFF_DASHBOARD_SUCCESS,
  payload: data,
});

export const fetchSaleStaffDashboardFailure = (error) => ({
  type: FETCH_SALE_STAFF_DASHBOARD_FAILURE,
  payload: error,
});


