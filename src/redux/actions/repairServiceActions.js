// actions/repairServiceActions.js

// List services
export const REPAIR_SERVICE_LIST_REQUEST = "REPAIR_SERVICE_LIST_REQUEST";
export const REPAIR_SERVICE_LIST_SUCCESS = "REPAIR_SERVICE_LIST_SUCCESS";
export const REPAIR_SERVICE_LIST_FAILURE = "REPAIR_SERVICE_LIST_FAILURE";

// Create service
export const REPAIR_SERVICE_CREATE_REQUEST = "REPAIR_SERVICE_CREATE_REQUEST";
export const REPAIR_SERVICE_CREATE_SUCCESS = "REPAIR_SERVICE_CREATE_SUCCESS";
export const REPAIR_SERVICE_CREATE_FAILURE = "REPAIR_SERVICE_CREATE_FAILURE";

// Update service
export const REPAIR_SERVICE_UPDATE_REQUEST = "REPAIR_SERVICE_UPDATE_REQUEST";
export const REPAIR_SERVICE_UPDATE_SUCCESS = "REPAIR_SERVICE_UPDATE_SUCCESS";
export const REPAIR_SERVICE_UPDATE_FAILURE = "REPAIR_SERVICE_UPDATE_FAILURE";

// Delete service
export const REPAIR_SERVICE_DELETE_REQUEST = "REPAIR_SERVICE_DELETE_REQUEST";
export const REPAIR_SERVICE_DELETE_SUCCESS = "REPAIR_SERVICE_DELETE_SUCCESS";
export const REPAIR_SERVICE_DELETE_FAILURE = "REPAIR_SERVICE_DELETE_FAILURE";

// Clear
export const REPAIR_SERVICE_CLEAR_MESSAGES = "REPAIR_SERVICE_CLEAR_MESSAGES";

// Action creators
export const repairServiceListRequest = (query = {}) => ({ type: REPAIR_SERVICE_LIST_REQUEST, payload: query });
export const repairServiceListSuccess = (data, pagination) => ({ type: REPAIR_SERVICE_LIST_SUCCESS, payload: { data, pagination } });
export const repairServiceListFailure = (error) => ({ type: REPAIR_SERVICE_LIST_FAILURE, payload: error });

export const repairServiceCreateRequest = (payload) => ({ type: REPAIR_SERVICE_CREATE_REQUEST, payload });
export const repairServiceCreateSuccess = (item, message) => ({ type: REPAIR_SERVICE_CREATE_SUCCESS, payload: { item, message } });
export const repairServiceCreateFailure = (error) => ({ type: REPAIR_SERVICE_CREATE_FAILURE, payload: error });

export const repairServiceUpdateRequest = (id, payload) => ({ type: REPAIR_SERVICE_UPDATE_REQUEST, payload: { id, payload } });
export const repairServiceUpdateSuccess = (item, message) => ({ type: REPAIR_SERVICE_UPDATE_SUCCESS, payload: { item, message } });
export const repairServiceUpdateFailure = (error) => ({ type: REPAIR_SERVICE_UPDATE_FAILURE, payload: error });

export const repairServiceDeleteRequest = (id) => ({ type: REPAIR_SERVICE_DELETE_REQUEST, payload: { id } });
export const repairServiceDeleteSuccess = (id, message) => ({ type: REPAIR_SERVICE_DELETE_SUCCESS, payload: { id, message } });
export const repairServiceDeleteFailure = (error) => ({ type: REPAIR_SERVICE_DELETE_FAILURE, payload: error });

export const repairServiceClearMessages = () => ({ type: REPAIR_SERVICE_CLEAR_MESSAGES });


