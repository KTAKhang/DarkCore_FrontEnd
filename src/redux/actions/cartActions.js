// Action types
export const CART_GET_REQUEST = "CART_GET_REQUEST";
export const CART_GET_SUCCESS = "CART_GET_SUCCESS";
export const CART_GET_FAILURE = "CART_GET_FAILURE";

export const CART_ADD_REQUEST = "CART_ADD_REQUEST";
export const CART_ADD_SUCCESS = "CART_ADD_SUCCESS";
export const CART_ADD_FAILURE = "CART_ADD_FAILURE";

export const CART_UPDATE_REQUEST = "CART_UPDATE_REQUEST";
export const CART_UPDATE_SUCCESS = "CART_UPDATE_SUCCESS";
export const CART_UPDATE_FAILURE = "CART_UPDATE_FAILURE";

export const CART_REMOVE_REQUEST = "CART_REMOVE_REQUEST";
export const CART_REMOVE_SUCCESS = "CART_REMOVE_SUCCESS";
export const CART_REMOVE_FAILURE = "CART_REMOVE_FAILURE";

export const CART_CLEAR_REQUEST = "CART_CLEAR_REQUEST";
export const CART_CLEAR_SUCCESS = "CART_CLEAR_SUCCESS";
export const CART_CLEAR_FAILURE = "CART_CLEAR_FAILURE";
export const CART_CLEAR_MESSAGE = "CART_CLEAR_MESSAGE";

// Action creators
export const cartGetRequest = () => ({
  type: CART_GET_REQUEST,
});

export const cartGetSuccess = (cart) => ({
  type: CART_GET_SUCCESS,
  payload: {
    items: cart.items || [],
    total: cart.total || 0,
    sum: cart.sum || 0, // Sử dụng virtual field sum từ backend
  },
});

export const cartGetFailure = (error) => ({
  type: CART_GET_FAILURE,
  payload: error,
});

export const cartAddRequest = (productId, quantity) => ({
  type: CART_ADD_REQUEST,
  payload: { productId, quantity },
});

export const cartAddSuccess = (cart) => ({
  type: CART_ADD_SUCCESS,
  payload: {
    items: cart.items || [],
    total: cart.total || 0,
    sum: cart.sum || 0,
  },
});

export const cartAddFailure = (error) => ({
  type: CART_ADD_FAILURE,
  payload: error,
});

export const cartUpdateRequest = (productId, quantity) => ({
  type: CART_UPDATE_REQUEST,
  payload: { productId, quantity },
});

export const cartUpdateSuccess = (cart) => ({
  type: CART_UPDATE_SUCCESS,
  payload: {
    items: cart.items || [],
    total: cart.total || 0,
    sum: cart.sum || 0,
  },
});

export const cartUpdateFailure = (error) => ({
  type: CART_UPDATE_FAILURE,
  payload: error,
});

export const cartRemoveRequest = (productId) => ({
  type: CART_REMOVE_REQUEST,
  payload: { productId },
});

export const cartRemoveSuccess = (cart) => ({
  type: CART_REMOVE_SUCCESS,
  payload: {
    items: cart.items || [],
    total: cart.total || 0,
    sum: cart.sum || 0,
  },
});

export const cartRemoveFailure = (error) => ({
  type: CART_REMOVE_FAILURE,
  payload: error,
});

export const cartClearRequest = () => ({
  type: CART_CLEAR_REQUEST,
});

export const cartClearSuccess = (cart) => ({
  type: CART_CLEAR_SUCCESS,
  payload: {
    items: cart.items || [],
    total: cart.total || 0,
    sum: cart.sum || 0,
  },
});

export const cartClearFailure = (error) => ({
  type: CART_CLEAR_FAILURE,
  payload: error,
});

export const cartClearMessage = () => ({
  type: CART_CLEAR_MESSAGE,
});