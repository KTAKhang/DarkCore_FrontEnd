// actions/repairRequestActions.js

// Customer create/update/cancel
export const REPAIR_REQUEST_CREATE_REQUEST = "REPAIR_REQUEST_CREATE_REQUEST";
export const REPAIR_REQUEST_CREATE_SUCCESS = "REPAIR_REQUEST_CREATE_SUCCESS";
export const REPAIR_REQUEST_CREATE_FAILURE = "REPAIR_REQUEST_CREATE_FAILURE";

export const REPAIR_REQUEST_UPDATE_REQUEST = "REPAIR_REQUEST_UPDATE_REQUEST";
export const REPAIR_REQUEST_UPDATE_SUCCESS = "REPAIR_REQUEST_UPDATE_SUCCESS";
export const REPAIR_REQUEST_UPDATE_FAILURE = "REPAIR_REQUEST_UPDATE_FAILURE";

export const REPAIR_REQUEST_CANCEL_REQUEST = "REPAIR_REQUEST_CANCEL_REQUEST";
export const REPAIR_REQUEST_CANCEL_SUCCESS = "REPAIR_REQUEST_CANCEL_SUCCESS";
export const REPAIR_REQUEST_CANCEL_FAILURE = "REPAIR_REQUEST_CANCEL_FAILURE";

// Admin list/assign/update status
export const REPAIR_REQUEST_LIST_ALL_REQUEST = "REPAIR_REQUEST_LIST_ALL_REQUEST";
export const REPAIR_REQUEST_LIST_ALL_SUCCESS = "REPAIR_REQUEST_LIST_ALL_SUCCESS";
export const REPAIR_REQUEST_LIST_ALL_FAILURE = "REPAIR_REQUEST_LIST_ALL_FAILURE";

export const REPAIR_REQUEST_ASSIGN_REQUEST = "REPAIR_REQUEST_ASSIGN_REQUEST";
export const REPAIR_REQUEST_ASSIGN_SUCCESS = "REPAIR_REQUEST_ASSIGN_SUCCESS";
export const REPAIR_REQUEST_ASSIGN_FAILURE = "REPAIR_REQUEST_ASSIGN_FAILURE";

export const REPAIR_REQUEST_STATUS_UPDATE_REQUEST = "REPAIR_REQUEST_STATUS_UPDATE_REQUEST";
export const REPAIR_REQUEST_STATUS_UPDATE_SUCCESS = "REPAIR_REQUEST_STATUS_UPDATE_SUCCESS";
export const REPAIR_REQUEST_STATUS_UPDATE_FAILURE = "REPAIR_REQUEST_STATUS_UPDATE_FAILURE";

// Technician list assigned
export const REPAIR_REQUEST_LIST_ASSIGNED_REQUEST = "REPAIR_REQUEST_LIST_ASSIGNED_REQUEST";
export const REPAIR_REQUEST_LIST_ASSIGNED_SUCCESS = "REPAIR_REQUEST_LIST_ASSIGNED_SUCCESS";
export const REPAIR_REQUEST_LIST_ASSIGNED_FAILURE = "REPAIR_REQUEST_LIST_ASSIGNED_FAILURE";

export const REPAIR_REQUEST_CLEAR_MESSAGES = "REPAIR_REQUEST_CLEAR_MESSAGES";

// Action creators
export const repairRequestCreateRequest = (payload) => ({ type: REPAIR_REQUEST_CREATE_REQUEST, payload });
export const repairRequestCreateSuccess = (item, message) => ({ type: REPAIR_REQUEST_CREATE_SUCCESS, payload: { item, message } });
export const repairRequestCreateFailure = (error) => ({ type: REPAIR_REQUEST_CREATE_FAILURE, payload: error });

export const repairRequestUpdateRequest = (id, payload) => ({ type: REPAIR_REQUEST_UPDATE_REQUEST, payload: { id, payload } });
export const repairRequestUpdateSuccess = (item, message) => ({ type: REPAIR_REQUEST_UPDATE_SUCCESS, payload: { item, message } });
export const repairRequestUpdateFailure = (error) => ({ type: REPAIR_REQUEST_UPDATE_FAILURE, payload: error });

export const repairRequestCancelRequest = (id) => ({ type: REPAIR_REQUEST_CANCEL_REQUEST, payload: { id } });
export const repairRequestCancelSuccess = (id, message) => ({ type: REPAIR_REQUEST_CANCEL_SUCCESS, payload: { id, message } });
export const repairRequestCancelFailure = (error) => ({ type: REPAIR_REQUEST_CANCEL_FAILURE, payload: error });

export const repairRequestListAllRequest = (searchParams = {}) => ({ type: REPAIR_REQUEST_LIST_ALL_REQUEST, payload: searchParams });
export const repairRequestListAllSuccess = (items) => ({ type: REPAIR_REQUEST_LIST_ALL_SUCCESS, payload: items });
export const repairRequestListAllFailure = (error) => ({ type: REPAIR_REQUEST_LIST_ALL_FAILURE, payload: error });

export const repairRequestAssignRequest = (id, technicianId) => ({ type: REPAIR_REQUEST_ASSIGN_REQUEST, payload: { id, technicianId } });
export const repairRequestAssignSuccess = (item, message) => ({ type: REPAIR_REQUEST_ASSIGN_SUCCESS, payload: { item, message } });
export const repairRequestAssignFailure = (error) => ({ type: REPAIR_REQUEST_ASSIGN_FAILURE, payload: error });

export const repairRequestStatusUpdateRequest = (id, status) => ({ type: REPAIR_REQUEST_STATUS_UPDATE_REQUEST, payload: { id, status } });
export const repairRequestStatusUpdateSuccess = (item, message) => ({ type: REPAIR_REQUEST_STATUS_UPDATE_SUCCESS, payload: { item, message } });
export const repairRequestStatusUpdateFailure = (error) => ({ type: REPAIR_REQUEST_STATUS_UPDATE_FAILURE, payload: error });

export const repairRequestListAssignedRequest = () => ({ type: REPAIR_REQUEST_LIST_ASSIGNED_REQUEST });
export const repairRequestListAssignedSuccess = (items) => ({ type: REPAIR_REQUEST_LIST_ASSIGNED_SUCCESS, payload: items });
export const repairRequestListAssignedFailure = (error) => ({ type: REPAIR_REQUEST_LIST_ASSIGNED_FAILURE, payload: error });

export const repairRequestClearMessages = () => ({ type: REPAIR_REQUEST_CLEAR_MESSAGES });


