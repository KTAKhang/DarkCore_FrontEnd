// actions/favoriteActions.js

// Get favorites list
export const FAVORITE_LIST_REQUEST = "FAVORITE_LIST_REQUEST";
export const FAVORITE_LIST_SUCCESS = "FAVORITE_LIST_SUCCESS";
export const FAVORITE_LIST_FAILURE = "FAVORITE_LIST_FAILURE";

// Toggle favorite (add/remove)
export const FAVORITE_TOGGLE_REQUEST = "FAVORITE_TOGGLE_REQUEST";
export const FAVORITE_TOGGLE_SUCCESS = "FAVORITE_TOGGLE_SUCCESS";
export const FAVORITE_TOGGLE_FAILURE = "FAVORITE_TOGGLE_FAILURE";

// Check if product is favorite
export const FAVORITE_CHECK_REQUEST = "FAVORITE_CHECK_REQUEST";
export const FAVORITE_CHECK_SUCCESS = "FAVORITE_CHECK_SUCCESS";
export const FAVORITE_CHECK_FAILURE = "FAVORITE_CHECK_FAILURE";

// Check multiple products
export const FAVORITE_CHECK_MULTIPLE_REQUEST = "FAVORITE_CHECK_MULTIPLE_REQUEST";
export const FAVORITE_CHECK_MULTIPLE_SUCCESS = "FAVORITE_CHECK_MULTIPLE_SUCCESS";
export const FAVORITE_CHECK_MULTIPLE_FAILURE = "FAVORITE_CHECK_MULTIPLE_FAILURE";

// Add favorite
export const FAVORITE_ADD_REQUEST = "FAVORITE_ADD_REQUEST";
export const FAVORITE_ADD_SUCCESS = "FAVORITE_ADD_SUCCESS";
export const FAVORITE_ADD_FAILURE = "FAVORITE_ADD_FAILURE";

// Remove favorite
export const FAVORITE_REMOVE_REQUEST = "FAVORITE_REMOVE_REQUEST";
export const FAVORITE_REMOVE_SUCCESS = "FAVORITE_REMOVE_SUCCESS";
export const FAVORITE_REMOVE_FAILURE = "FAVORITE_REMOVE_FAILURE";

// Remove all favorites
export const FAVORITE_REMOVE_ALL_REQUEST = "FAVORITE_REMOVE_ALL_REQUEST";
export const FAVORITE_REMOVE_ALL_SUCCESS = "FAVORITE_REMOVE_ALL_SUCCESS";
export const FAVORITE_REMOVE_ALL_FAILURE = "FAVORITE_REMOVE_ALL_FAILURE";

// Clear messages/errors
export const FAVORITE_CLEAR_MESSAGES = "FAVORITE_CLEAR_MESSAGES";

// Action creators

// Get favorites list (with pagination and filters)
export const favoriteListRequest = (query = {}) => ({
    type: FAVORITE_LIST_REQUEST,
    payload: { query }
});

export const favoriteListSuccess = (items, pagination) => ({
    type: FAVORITE_LIST_SUCCESS,
    payload: { items, pagination }
});

export const favoriteListFailure = (error) => ({
    type: FAVORITE_LIST_FAILURE,
    payload: error
});

// Toggle favorite
export const favoriteToggleRequest = (productId) => ({
    type: FAVORITE_TOGGLE_REQUEST,
    payload: { productId }
});

export const favoriteToggleSuccess = (productId, isFavorite, message) => ({
    type: FAVORITE_TOGGLE_SUCCESS,
    payload: { productId, isFavorite, message }
});

export const favoriteToggleFailure = (error) => ({
    type: FAVORITE_TOGGLE_FAILURE,
    payload: error
});

// Check if product is favorite
export const favoriteCheckRequest = (productId) => ({
    type: FAVORITE_CHECK_REQUEST,
    payload: { productId }
});

export const favoriteCheckSuccess = (productId, isFavorite) => ({
    type: FAVORITE_CHECK_SUCCESS,
    payload: { productId, isFavorite }
});

export const favoriteCheckFailure = (error) => ({
    type: FAVORITE_CHECK_FAILURE,
    payload: error
});

// Check multiple products
export const favoriteCheckMultipleRequest = (productIds) => ({
    type: FAVORITE_CHECK_MULTIPLE_REQUEST,
    payload: { productIds }
});

export const favoriteCheckMultipleSuccess = (favoriteProductIds) => ({
    type: FAVORITE_CHECK_MULTIPLE_SUCCESS,
    payload: { favoriteProductIds }
});

export const favoriteCheckMultipleFailure = (error) => ({
    type: FAVORITE_CHECK_MULTIPLE_FAILURE,
    payload: error
});

// Add favorite
export const favoriteAddRequest = (productId) => ({
    type: FAVORITE_ADD_REQUEST,
    payload: { productId }
});

export const favoriteAddSuccess = (favorite, message) => ({
    type: FAVORITE_ADD_SUCCESS,
    payload: { favorite, message }
});

export const favoriteAddFailure = (error) => ({
    type: FAVORITE_ADD_FAILURE,
    payload: error
});

// Remove favorite
export const favoriteRemoveRequest = (productId, silent = false) => ({
    type: FAVORITE_REMOVE_REQUEST,
    payload: { productId, silent }
});

export const favoriteRemoveSuccess = (productId, message) => ({
    type: FAVORITE_REMOVE_SUCCESS,
    payload: { productId, message }
});

export const favoriteRemoveFailure = (error) => ({
    type: FAVORITE_REMOVE_FAILURE,
    payload: error
});

// Remove all favorites
export const favoriteRemoveAllRequest = () => ({
    type: FAVORITE_REMOVE_ALL_REQUEST
});

export const favoriteRemoveAllSuccess = (deletedCount, message) => ({
    type: FAVORITE_REMOVE_ALL_SUCCESS,
    payload: { deletedCount, message }
});

export const favoriteRemoveAllFailure = (error) => ({
    type: FAVORITE_REMOVE_ALL_FAILURE,
    payload: error
});

// Clear messages
export const favoriteClearMessages = () => ({
    type: FAVORITE_CLEAR_MESSAGES
});

