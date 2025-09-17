// actions/categoryHomeActions.js

// List categories for home page
export const CATEGORY_HOME_LIST_REQUEST = "CATEGORY_HOME_LIST_REQUEST";
export const CATEGORY_HOME_LIST_SUCCESS = "CATEGORY_HOME_LIST_SUCCESS";
export const CATEGORY_HOME_LIST_FAILURE = "CATEGORY_HOME_LIST_FAILURE";

// Get category detail for home page
export const CATEGORY_HOME_DETAIL_REQUEST = "CATEGORY_HOME_DETAIL_REQUEST";
export const CATEGORY_HOME_DETAIL_SUCCESS = "CATEGORY_HOME_DETAIL_SUCCESS";
export const CATEGORY_HOME_DETAIL_FAILURE = "CATEGORY_HOME_DETAIL_FAILURE";

// Get featured categories
export const CATEGORY_HOME_FEATURED_REQUEST = "CATEGORY_HOME_FEATURED_REQUEST";
export const CATEGORY_HOME_FEATURED_SUCCESS = "CATEGORY_HOME_FEATURED_SUCCESS";
export const CATEGORY_HOME_FEATURED_FAILURE = "CATEGORY_HOME_FEATURED_FAILURE";

// Clear messages/errors
export const CATEGORY_HOME_CLEAR_MESSAGES = "CATEGORY_HOME_CLEAR_MESSAGES";

// Action creators
export const categoryHomeListRequest = (query = {}) => ({
    type: CATEGORY_HOME_LIST_REQUEST,
    payload: { query }
});

export const categoryHomeListSuccess = (items, pagination) => ({
    type: CATEGORY_HOME_LIST_SUCCESS,
    payload: { items, pagination }
});

export const categoryHomeListFailure = (error) => ({
    type: CATEGORY_HOME_LIST_FAILURE,
    payload: error
});

export const categoryHomeDetailRequest = (id) => ({
    type: CATEGORY_HOME_DETAIL_REQUEST,
    payload: { id }
});

export const categoryHomeDetailSuccess = (item) => ({
    type: CATEGORY_HOME_DETAIL_SUCCESS,
    payload: item
});

export const categoryHomeDetailFailure = (error) => ({
    type: CATEGORY_HOME_DETAIL_FAILURE,
    payload: error
});

export const categoryHomeFeaturedRequest = (limit = 6) => ({
    type: CATEGORY_HOME_FEATURED_REQUEST,
    payload: { limit }
});

export const categoryHomeFeaturedSuccess = (items) => ({
    type: CATEGORY_HOME_FEATURED_SUCCESS,
    payload: items
});

export const categoryHomeFeaturedFailure = (error) => ({
    type: CATEGORY_HOME_FEATURED_FAILURE,
    payload: error
});

export const categoryHomeClearMessages = () => ({
    type: CATEGORY_HOME_CLEAR_MESSAGES
});