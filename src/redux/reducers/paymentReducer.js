import {
  CREATE_PAYMENT_REQUEST,
  CREATE_PAYMENT_SUCCESS,
  CREATE_PAYMENT_FAILURE,
  PAYMENT_RESULT_REQUEST,
  PAYMENT_RESULT_SUCCESS,
  PAYMENT_RESULT_FAILURE,
} from "../actions/paymentActions";

const initialState = {
  loading: false,
  error: null,
  paymentUrl: null,
  orderId: null,
  amount: null,
  status: null, // "success" | "failed"
};

const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_PAYMENT_REQUEST:
    case PAYMENT_RESULT_REQUEST:
      return { ...state, loading: true, error: null };

    case CREATE_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        paymentUrl: action.payload.paymentUrl,
        orderId: action.payload.orderId,
        amount: action.payload.amount,
      };

    case CREATE_PAYMENT_FAILURE:
    case PAYMENT_RESULT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case PAYMENT_RESULT_SUCCESS:
      return {
        ...state,
        loading: false,
        status: action.payload.status,
        orderId: action.payload.orderId,
      };

    default:
      return state;
  }
};

export default paymentReducer;
