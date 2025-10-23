// ==================== DISCOUNT LIST (Admin) ====================
export const DISCOUNT_LIST_REQUEST = 'DISCOUNT_LIST_REQUEST';
export const DISCOUNT_LIST_SUCCESS = 'DISCOUNT_LIST_SUCCESS';
export const DISCOUNT_LIST_FAILED = 'DISCOUNT_LIST_FAILED';

export const discountListRequest = (query = {}) => ({
  type: DISCOUNT_LIST_REQUEST,
  payload: query
});

export const discountListSuccess = (data, pagination) => ({
  type: DISCOUNT_LIST_SUCCESS,
  payload: { data, pagination }
});

export const discountListFailed = (error) => ({
  type: DISCOUNT_LIST_FAILED,
  payload: error
});

// ==================== DISCOUNT DETAIL ====================
export const DISCOUNT_DETAIL_REQUEST = 'DISCOUNT_DETAIL_REQUEST';
export const DISCOUNT_DETAIL_SUCCESS = 'DISCOUNT_DETAIL_SUCCESS';
export const DISCOUNT_DETAIL_FAILED = 'DISCOUNT_DETAIL_FAILED';

export const discountDetailRequest = (code) => ({
  type: DISCOUNT_DETAIL_REQUEST,
  payload: { code }
});

export const discountDetailSuccess = (data) => ({
  type: DISCOUNT_DETAIL_SUCCESS,
  payload: data
});

export const discountDetailFailed = (error) => ({
  type: DISCOUNT_DETAIL_FAILED,
  payload: error
});

// ==================== CREATE DISCOUNT ====================
export const DISCOUNT_CREATE_REQUEST = 'DISCOUNT_CREATE_REQUEST';
export const DISCOUNT_CREATE_SUCCESS = 'DISCOUNT_CREATE_SUCCESS';
export const DISCOUNT_CREATE_FAILED = 'DISCOUNT_CREATE_FAILED';

export const discountCreateRequest = (payload) => ({
  type: DISCOUNT_CREATE_REQUEST,
  payload
});

export const discountCreateSuccess = (data) => ({
  type: DISCOUNT_CREATE_SUCCESS,
  payload: data
});

export const discountCreateFailed = (error) => ({
  type: DISCOUNT_CREATE_FAILED,
  payload: error
});

// ==================== UPDATE DISCOUNT ====================
export const DISCOUNT_UPDATE_REQUEST = 'DISCOUNT_UPDATE_REQUEST';
export const DISCOUNT_UPDATE_SUCCESS = 'DISCOUNT_UPDATE_SUCCESS';
export const DISCOUNT_UPDATE_FAILED = 'DISCOUNT_UPDATE_FAILED';

export const discountUpdateRequest = (id, payload) => ({
  type: DISCOUNT_UPDATE_REQUEST,
  payload: { id, ...payload }
});

export const discountUpdateSuccess = (data) => ({
  type: DISCOUNT_UPDATE_SUCCESS,
  payload: data
});

export const discountUpdateFailed = (error) => ({
  type: DISCOUNT_UPDATE_FAILED,
  payload: error
});

// ==================== DEACTIVATE DISCOUNT ====================
export const DISCOUNT_DEACTIVATE_REQUEST = 'DISCOUNT_DEACTIVATE_REQUEST';
export const DISCOUNT_DEACTIVATE_SUCCESS = 'DISCOUNT_DEACTIVATE_SUCCESS';
export const DISCOUNT_DEACTIVATE_FAILED = 'DISCOUNT_DEACTIVATE_FAILED';

export const discountDeactivateRequest = (id) => ({
  type: DISCOUNT_DEACTIVATE_REQUEST,
  payload: { id }
});

export const discountDeactivateSuccess = (data) => ({
  type: DISCOUNT_DEACTIVATE_SUCCESS,
  payload: data
});

export const discountDeactivateFailed = (error) => ({
  type: DISCOUNT_DEACTIVATE_FAILED,
  payload: error
});

// ==================== APPLY DISCOUNT ====================
export const DISCOUNT_APPLY_REQUEST = 'DISCOUNT_APPLY_REQUEST';
export const DISCOUNT_APPLY_SUCCESS = 'DISCOUNT_APPLY_SUCCESS';
export const DISCOUNT_APPLY_FAILED = 'DISCOUNT_APPLY_FAILED';

export const discountApplyRequest = (code, orderTotal) => ({
  type: DISCOUNT_APPLY_REQUEST,
  payload: { code, orderTotal }
});

export const discountApplySuccess = (data) => ({
  type: DISCOUNT_APPLY_SUCCESS,
  payload: data
});

export const discountApplyFailed = (error) => ({
  type: DISCOUNT_APPLY_FAILED,
  payload: error
});

// ==================== GET ACTIVE DISCOUNTS ====================
export const DISCOUNT_ACTIVE_REQUEST = 'DISCOUNT_ACTIVE_REQUEST';
export const DISCOUNT_ACTIVE_SUCCESS = 'DISCOUNT_ACTIVE_SUCCESS';
export const DISCOUNT_ACTIVE_FAILED = 'DISCOUNT_ACTIVE_FAILED';

export const discountActiveRequest = () => ({
  type: DISCOUNT_ACTIVE_REQUEST
});

export const discountActiveSuccess = (data) => ({
  type: DISCOUNT_ACTIVE_SUCCESS,
  payload: data
});

export const discountActiveFailed = (error) => ({
  type: DISCOUNT_ACTIVE_FAILED,
  payload: error
});

// ==================== CLEAR MESSAGES ====================
export const DISCOUNT_CLEAR_MESSAGES = 'DISCOUNT_CLEAR_MESSAGES';

export const discountClearMessages = () => ({
  type: DISCOUNT_CLEAR_MESSAGES
});

// ==================== SET APPLIED DISCOUNT ====================
export const DISCOUNT_SET_APPLIED = 'DISCOUNT_SET_APPLIED';

export const discountSetApplied = (discountData) => ({
  type: DISCOUNT_SET_APPLIED,
  payload: discountData
});

// ==================== CLEAR APPLIED DISCOUNT ====================
export const DISCOUNT_CLEAR_APPLIED = 'DISCOUNT_CLEAR_APPLIED';

export const discountClearApplied = () => ({
  type: DISCOUNT_CLEAR_APPLIED
});