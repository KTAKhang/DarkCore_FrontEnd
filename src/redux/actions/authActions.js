// actions/authActions.js
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT = "LOGOUT";
export const SET_USER = "SET_USER";

// Forgot Password Actions
export const FORGOT_PASSWORD_REQUEST = 'FORGOT_PASSWORD_REQUEST';
export const FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS';
export const FORGOT_PASSWORD_FAILURE = 'FORGOT_PASSWORD_FAILURE';

// Reset Password Actions
export const RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILURE = 'RESET_PASSWORD_FAILURE';

// Clear messages
export const CLEAR_AUTH_MESSAGES = 'CLEAR_AUTH_MESSAGES';

export const loginRequest = (credentials) => ({
    type: LOGIN_REQUEST,
    payload: credentials,
});

export const loginSuccess = (data) => ({
    type: LOGIN_SUCCESS,
    payload: data,
});

export const loginFailure = (error) => ({
    type: LOGIN_FAILURE,
    payload: error,
});

export const logout = () => ({
    type: LOGOUT,
});

// Forgot Password Action Creators
export const forgotPasswordRequest = (email) => ({
    type: FORGOT_PASSWORD_REQUEST,
    payload: { email }
});

export const forgotPasswordSuccess = (message) => ({
    type: FORGOT_PASSWORD_SUCCESS,
    payload: { message }
});

export const forgotPasswordFailure = (error) => ({
    type: FORGOT_PASSWORD_FAILURE,
    payload: { error }
});

// Reset Password Action Creators
export const resetPasswordRequest = (email, otp, newPassword) => ({
    type: RESET_PASSWORD_REQUEST,
    payload: { email, otp, newPassword }
});

export const resetPasswordSuccess = (message) => ({
    type: RESET_PASSWORD_SUCCESS,
    payload: { message }
});

export const resetPasswordFailure = (error) => ({
    type: RESET_PASSWORD_FAILURE,
    payload: { error }
});

// Clear messages
export const clearAuthMessages = () => ({
    type: CLEAR_AUTH_MESSAGES
});
