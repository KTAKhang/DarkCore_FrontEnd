import {
  CART_GET_REQUEST,
  CART_GET_SUCCESS,
  CART_GET_FAILURE,
  CART_ADD_REQUEST,
  CART_ADD_SUCCESS,
  CART_ADD_FAILURE,
  CART_UPDATE_REQUEST,
  CART_UPDATE_SUCCESS,
  CART_UPDATE_FAILURE,
  CART_REMOVE_REQUEST,
  CART_REMOVE_SUCCESS,
  CART_REMOVE_FAILURE,
  CART_CLEAR_REQUEST,
  CART_CLEAR_SUCCESS,
  CART_CLEAR_FAILURE,
  CART_CLEAR_MESSAGE,
} from '../actions/cartActions';

const initialState = {
  cart: { items: [], total: 0, sum: 0 }, // Khớp với Cart model
  loading: false,
  error: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case CART_GET_REQUEST:
    case CART_ADD_REQUEST:
    case CART_UPDATE_REQUEST:
    case CART_REMOVE_REQUEST:
    case CART_CLEAR_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CART_GET_SUCCESS:
    case CART_ADD_SUCCESS:
    case CART_UPDATE_SUCCESS:
    case CART_REMOVE_SUCCESS:
      return {
        ...state,
        loading: false,
        cart: {
          items: action.payload.items || [],
          total: action.payload.total || 0,
          sum: action.payload.sum || 0,
        },
        error: null,
      };

    case CART_CLEAR_SUCCESS:
      return {
        ...state,
        loading: false,
        cart: { items: [], total: 0, sum: 0 }, // Reset cart
        error: null,
      };

    case CART_GET_FAILURE:
    case CART_ADD_FAILURE:
    case CART_UPDATE_FAILURE:
    case CART_REMOVE_FAILURE:
    case CART_CLEAR_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload, // Lưu error message từ BE
      };

    case CART_CLEAR_MESSAGE:
      return {
        ...state,
        error: null, // Xóa error sau khi hiển thị
      };

    default:
      return state;
  }
};

export default cartReducer;