// ===== ACTION TYPES =====
export const GET_ALL_CUSTOMERS_REQUEST = "GET_ALL_CUSTOMERS_REQUEST";
export const GET_ALL_CUSTOMERS_SUCCESS = "GET_ALL_CUSTOMERS_SUCCESS";
export const GET_ALL_CUSTOMERS_FAILURE = "GET_ALL_CUSTOMERS_FAILURE";

export const GET_CUSTOMER_BY_ID_REQUEST = "GET_CUSTOMER_BY_ID_REQUEST";
export const GET_CUSTOMER_BY_ID_SUCCESS = "GET_CUSTOMER_BY_ID_SUCCESS";
export const GET_CUSTOMER_BY_ID_FAILURE = "GET_CUSTOMER_BY_ID_FAILURE";

export const UPDATE_CUSTOMER_STATUS_REQUEST = "UPDATE_CUSTOMER_STATUS_REQUEST";
export const UPDATE_CUSTOMER_STATUS_SUCCESS = "UPDATE_CUSTOMER_STATUS_SUCCESS";
export const UPDATE_CUSTOMER_STATUS_FAILURE = "UPDATE_CUSTOMER_STATUS_FAILURE";

// ===== ACTION CREATORS =====
export const getAllCustomersRequest = (params) => ({
    type: GET_ALL_CUSTOMERS_REQUEST,
    payload: params, // { page, limit, search, status, isGoogleAccount, sort }
});

export const getAllCustomersSuccess = (data) => ({
    type: GET_ALL_CUSTOMERS_SUCCESS,
    payload: data,
});

export const getAllCustomersFailure = (error) => ({
    type: GET_ALL_CUSTOMERS_FAILURE,
    payload: error,
});

export const getCustomerByIdRequest = (id) => ({
    type: GET_CUSTOMER_BY_ID_REQUEST,
    payload: id,
});

export const getCustomerByIdSuccess = (data) => ({
    type: GET_CUSTOMER_BY_ID_SUCCESS,
    payload: data,
});

export const getCustomerByIdFailure = (error) => ({
    type: GET_CUSTOMER_BY_ID_FAILURE,
    payload: error,
});

export const updateCustomerStatusRequest = (id, status) => ({
    type: UPDATE_CUSTOMER_STATUS_REQUEST,
    payload: { id, status },
});

export const updateCustomerStatusSuccess = (message, data) => ({
    type: UPDATE_CUSTOMER_STATUS_SUCCESS,
    payload: { message, data },
});

export const updateCustomerStatusFailure = (error) => ({
    type: UPDATE_CUSTOMER_STATUS_FAILURE,
    payload: error,
});
