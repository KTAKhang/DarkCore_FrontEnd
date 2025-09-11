// reducers/authReducer.js
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    SET_USER,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAILURE,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE,
    CLEAR_AUTH_MESSAGES
} from "../actions/authActions";

const initialState = {
    user: null,
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    error: null,
    loading: false,
    isAuthenticated: !!localStorage.getItem("token"),
    // Forgot password states
    forgotPasswordLoading: false,
    forgotPasswordMessage: null,
    forgotPasswordError: null,
    // Reset password states
    resetPasswordLoading: false,
    resetPasswordMessage: null,
    resetPasswordError: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                error: null,
                loading: true,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.data,
                token: action.payload.token.access_token,
                role: action.payload.data.role_name,
                error: null,
                loading: false,
                isAuthenticated: true,
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                user: null,
                token: null,
                role: null,
                error: action.payload,
                loading: false,
                isAuthenticated: false,
            };
        case LOGOUT:
            return {
                ...state,
                user: null,
                token: null,
                role: null,
                error: null,
                loading: false,
                isAuthenticated: false,
            };
        case SET_USER:
            return {
                ...state,
                user: action.payload,
            };

        // Forgot Password Cases
        case FORGOT_PASSWORD_REQUEST:
            return {
                ...state,
                forgotPasswordLoading: true,
                forgotPasswordError: null,
                forgotPasswordMessage: null,
            };
        case FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                forgotPasswordLoading: false,
                forgotPasswordMessage: action.payload.message,
                forgotPasswordError: null,
            };
        case FORGOT_PASSWORD_FAILURE:
            return {
                ...state,
                forgotPasswordLoading: false,
                forgotPasswordError: action.payload.error,
                forgotPasswordMessage: null,
            };

        // Reset Password Cases
        case RESET_PASSWORD_REQUEST:
            return {
                ...state,
                resetPasswordLoading: true,
                resetPasswordError: null,
                resetPasswordMessage: null,
            };
        case RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                resetPasswordLoading: false,
                resetPasswordMessage: action.payload.message,
                resetPasswordError: null,
            };
        case RESET_PASSWORD_FAILURE:
            return {
                ...state,
                resetPasswordLoading: false,
                resetPasswordError: action.payload.error,
                resetPasswordMessage: null,
            };

        // Clear messages
        case CLEAR_AUTH_MESSAGES:
            return {
                ...state,
                error: null,
                forgotPasswordMessage: null,
                forgotPasswordError: null,
                resetPasswordMessage: null,
                resetPasswordError: null,
            };

        default:
            return state;
    }
};

export default authReducer;