// actions/aboutActions.js

// Get About Info (Public)
export const ABOUT_PUBLIC_INFO_REQUEST = "ABOUT_PUBLIC_INFO_REQUEST";
export const ABOUT_PUBLIC_INFO_SUCCESS = "ABOUT_PUBLIC_INFO_SUCCESS";
export const ABOUT_PUBLIC_INFO_FAILURE = "ABOUT_PUBLIC_INFO_FAILURE";

// Get About Info (Admin)
export const ABOUT_INFO_REQUEST = "ABOUT_INFO_REQUEST";
export const ABOUT_INFO_SUCCESS = "ABOUT_INFO_SUCCESS";
export const ABOUT_INFO_FAILURE = "ABOUT_INFO_FAILURE";

// Create or Update About
export const ABOUT_CREATE_OR_UPDATE_REQUEST = "ABOUT_CREATE_OR_UPDATE_REQUEST";
export const ABOUT_CREATE_OR_UPDATE_SUCCESS = "ABOUT_CREATE_OR_UPDATE_SUCCESS";
export const ABOUT_CREATE_OR_UPDATE_FAILURE = "ABOUT_CREATE_OR_UPDATE_FAILURE";

// Update About Status
export const ABOUT_UPDATE_STATUS_REQUEST = "ABOUT_UPDATE_STATUS_REQUEST";
export const ABOUT_UPDATE_STATUS_SUCCESS = "ABOUT_UPDATE_STATUS_SUCCESS";
export const ABOUT_UPDATE_STATUS_FAILURE = "ABOUT_UPDATE_STATUS_FAILURE";

// Update Stats
export const ABOUT_UPDATE_STATS_REQUEST = "ABOUT_UPDATE_STATS_REQUEST";
export const ABOUT_UPDATE_STATS_SUCCESS = "ABOUT_UPDATE_STATS_SUCCESS";
export const ABOUT_UPDATE_STATS_FAILURE = "ABOUT_UPDATE_STATS_FAILURE";

// Delete About
export const ABOUT_DELETE_REQUEST = "ABOUT_DELETE_REQUEST";
export const ABOUT_DELETE_SUCCESS = "ABOUT_DELETE_SUCCESS";
export const ABOUT_DELETE_FAILURE = "ABOUT_DELETE_FAILURE";

// Clear messages/errors
export const ABOUT_CLEAR_MESSAGES = "ABOUT_CLEAR_MESSAGES";

// Action creators
export const aboutPublicInfoRequest = () => ({ type: ABOUT_PUBLIC_INFO_REQUEST });
export const aboutPublicInfoSuccess = (data) => ({ type: ABOUT_PUBLIC_INFO_SUCCESS, payload: data });
export const aboutPublicInfoFailure = (error) => ({ type: ABOUT_PUBLIC_INFO_FAILURE, payload: error });

export const aboutInfoRequest = () => ({ type: ABOUT_INFO_REQUEST });
export const aboutInfoSuccess = (data) => ({ type: ABOUT_INFO_SUCCESS, payload: data });
export const aboutInfoFailure = (error) => ({ type: ABOUT_INFO_FAILURE, payload: error });

export const aboutCreateOrUpdateRequest = (payload) => ({ type: ABOUT_CREATE_OR_UPDATE_REQUEST, payload });
export const aboutCreateOrUpdateSuccess = (data, message) => ({ type: ABOUT_CREATE_OR_UPDATE_SUCCESS, payload: { data, message } });
export const aboutCreateOrUpdateFailure = (error) => ({ type: ABOUT_CREATE_OR_UPDATE_FAILURE, payload: error });

export const aboutUpdateStatusRequest = (payload) => ({ type: ABOUT_UPDATE_STATUS_REQUEST, payload });
export const aboutUpdateStatusSuccess = (data, message) => ({ type: ABOUT_UPDATE_STATUS_SUCCESS, payload: { data, message } });
export const aboutUpdateStatusFailure = (error) => ({ type: ABOUT_UPDATE_STATUS_FAILURE, payload: error });

export const aboutUpdateStatsRequest = (stats) => ({ type: ABOUT_UPDATE_STATS_REQUEST, payload: { stats } });
export const aboutUpdateStatsSuccess = (data, message) => ({ type: ABOUT_UPDATE_STATS_SUCCESS, payload: { data, message } });
export const aboutUpdateStatsFailure = (error) => ({ type: ABOUT_UPDATE_STATS_FAILURE, payload: error });

export const aboutDeleteRequest = () => ({ type: ABOUT_DELETE_REQUEST });
export const aboutDeleteSuccess = (data, message) => ({ type: ABOUT_DELETE_SUCCESS, payload: { data, message } });
export const aboutDeleteFailure = (error) => ({ type: ABOUT_DELETE_FAILURE, payload: error });

export const aboutClearMessages = () => ({ type: ABOUT_CLEAR_MESSAGES });

