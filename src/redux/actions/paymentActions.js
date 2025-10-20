import axios from "axios";
import { toast } from "react-toastify";

// Action types
export const CREATE_PAYMENT_REQUEST = "CREATE_PAYMENT_REQUEST";
export const CREATE_PAYMENT_SUCCESS = "CREATE_PAYMENT_SUCCESS";
export const CREATE_PAYMENT_FAILURE = "CREATE_PAYMENT_FAILURE";

export const PAYMENT_RESULT_REQUEST = "PAYMENT_RESULT_REQUEST";
export const PAYMENT_RESULT_SUCCESS = "PAYMENT_RESULT_SUCCESS";
export const PAYMENT_RESULT_FAILURE = "PAYMENT_RESULT_FAILURE";

// --- Create Payment ---
export const createPaymentRequest = (orderId, amount) => ({
  type: CREATE_PAYMENT_REQUEST,
  payload: { orderId, amount },
});

export const createPaymentSuccess = (data) => ({
  type: CREATE_PAYMENT_SUCCESS,
  payload: data, // { paymentUrl, orderId, amount }
});

export const createPaymentFailure = (error) => ({
  type: CREATE_PAYMENT_FAILURE,
  payload: error,
});

// --- Payment Result (callback from VNPAY) ---
export const paymentResultRequest = (txnRef, responseCode) => ({
  type: PAYMENT_RESULT_REQUEST,
  payload: { txnRef, responseCode },
});

export const paymentResultSuccess = (data) => ({
  type: PAYMENT_RESULT_SUCCESS,
  payload: data, // { status, orderId }
});

export const paymentResultFailure = (error) => ({
  type: PAYMENT_RESULT_FAILURE,
  payload: error,
});
