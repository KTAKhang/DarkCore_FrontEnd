// ======================
// 🧩 Action Types
// ======================
export const CONTACT_LIST_REQUEST = "CONTACT_LIST_REQUEST";
export const CONTACT_LIST_SUCCESS = "CONTACT_LIST_SUCCESS";
export const CONTACT_LIST_FAILURE = "CONTACT_LIST_FAILURE";

export const CONTACT_GET_REQUEST = "CONTACT_GET_REQUEST";
export const CONTACT_GET_SUCCESS = "CONTACT_GET_SUCCESS";
export const CONTACT_GET_FAILURE = "CONTACT_GET_FAILURE";

export const CONTACT_CREATE_REQUEST = "CONTACT_CREATE_REQUEST";
export const CONTACT_CREATE_SUCCESS = "CONTACT_CREATE_SUCCESS";
export const CONTACT_CREATE_FAILURE = "CONTACT_CREATE_FAILURE";

export const CONTACT_REPLY_REQUEST = "CONTACT_REPLY_REQUEST";
export const CONTACT_REPLY_SUCCESS = "CONTACT_REPLY_SUCCESS";
export const CONTACT_REPLY_FAILURE = "CONTACT_REPLY_FAILURE";

export const CONTACT_UPDATE_REQUEST = "CONTACT_UPDATE_REQUEST";
export const CONTACT_UPDATE_SUCCESS = "CONTACT_UPDATE_SUCCESS";
export const CONTACT_UPDATE_FAILURE = "CONTACT_UPDATE_FAILURE";

export const CONTACT_STATS_REQUEST = "CONTACT_STATS_REQUEST";
export const CONTACT_STATS_SUCCESS = "CONTACT_STATS_SUCCESS";
export const CONTACT_STATS_FAILURE = "CONTACT_STATS_FAILURE";

export const CONTACT_DELETE_REQUEST = "CONTACT_DELETE_REQUEST";
export const CONTACT_DELETE_SUCCESS = "CONTACT_DELETE_SUCCESS";
export const CONTACT_DELETE_FAILURE = "CONTACT_DELETE_FAILURE";

// ======================
// 🧠 Action Creators
// ======================

// 🔹 List / Search / Filter
export const contactListRequest = (params = {}) => ({
  type: CONTACT_LIST_REQUEST,
  payload: params,
});
export const contactListSuccess = (data) => ({
  type: CONTACT_LIST_SUCCESS,
  payload: data,
});
export const contactListFailure = (error) => ({
  type: CONTACT_LIST_FAILURE,
  payload: error,
});

// 🔹 Get detail
export const contactGetRequest = (id) => ({
  type: CONTACT_GET_REQUEST,
  payload: id,
});
export const contactGetSuccess = (data) => ({
  type: CONTACT_GET_SUCCESS,
  payload: data,
});
export const contactGetFailure = (error) => ({
  type: CONTACT_GET_FAILURE,
  payload: error,
});

// 🔹 Create new contact
export const contactCreateRequest = (data) => ({
  type: CONTACT_CREATE_REQUEST,
  payload: data,
});
export const contactCreateSuccess = (data) => ({
  type: CONTACT_CREATE_SUCCESS,
  payload: data,
});
export const contactCreateFailure = (error) => ({
  type: CONTACT_CREATE_FAILURE,
  payload: error,
});

// 🔹 Reply to contact
export const contactReplyRequest = (contactId, data) => ({
  type: CONTACT_REPLY_REQUEST,
  payload: { contactId, data },
});
export const contactReplySuccess = (data) => ({
  type: CONTACT_REPLY_SUCCESS,
  payload: data,
});
export const contactReplyFailure = (error) => ({
  type: CONTACT_REPLY_FAILURE,
  payload: error,
});

// 🔹 Update (status, priority, reason, etc.)
export const contactUpdateRequest = (contactId, data) => ({
  type: CONTACT_UPDATE_REQUEST,
  payload: { contactId, data },
});
export const contactUpdateSuccess = (data) => ({
  type: CONTACT_UPDATE_SUCCESS,
  payload: data,
});
export const contactUpdateFailure = (error) => ({
  type: CONTACT_UPDATE_FAILURE,
  payload: error,
});

// 🔹 Get stats
export const contactStatsRequest = () => ({
  type: CONTACT_STATS_REQUEST,
});
export const contactStatsSuccess = (data) => ({
  type: CONTACT_STATS_SUCCESS,
  payload: data,
});
export const contactStatsFailure = (error) => ({
  type: CONTACT_STATS_FAILURE,
  payload: error,
});

// 🔹 Delete (soft delete)
export const contactDeleteRequest = (contactId) => ({
  type: CONTACT_DELETE_REQUEST,
  payload: contactId,
});
export const contactDeleteSuccess = (data) => ({
  type: CONTACT_DELETE_SUCCESS,
  payload: data,
});
export const contactDeleteFailure = (error) => ({
  type: CONTACT_DELETE_FAILURE,
  payload: error,
});
