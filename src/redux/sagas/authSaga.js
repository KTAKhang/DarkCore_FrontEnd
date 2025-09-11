// sagas/authSaga.js
import { all, call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import {
    LOGIN_REQUEST,
    loginSuccess,
    loginFailure,
    LOGOUT,
    FORGOT_PASSWORD_REQUEST,
    forgotPasswordSuccess,
    forgotPasswordFailure,
    RESET_PASSWORD_REQUEST,
    resetPasswordSuccess,
    resetPasswordFailure
} from "../actions/authActions";
import axios from "axios";

const API_BASE_URL = 'http://localhost:3000';



// API call for Google login
const apiLogin = async (idToken) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/auth/google`,
            { idToken }, // gửi idToken thay vì email/password
            {
                headers: {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to login with Google");
    }
};

// API call for forgot password
const apiForgotPassword = async (email) => {
    const response = await axios.post(
        `${API_BASE_URL}/auth/forgot-password`,
        { email },
        {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data;
};

// API call for reset password
const apiResetPassword = async (email, otp, newPassword) => {
    const response = await axios.post(
        `${API_BASE_URL}/auth/reset-password`,
        { email, otp, newPassword },
        {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data;
};

// Login saga
function* loginSaga(action) {
    try {
        const { idToken } = action.payload;
        const data = yield call(apiLogin, idToken);

        localStorage.setItem("token", data.token.access_token);
        localStorage.setItem("role", data.data.role_name);
        localStorage.setItem("user", JSON.stringify(data.data));

        yield put(loginSuccess(data));
        toast.success(data.message || "Login successful");
    } catch (error) {
        yield put(loginFailure(error.message));
        toast.error(error.message);
    }
}

// Forgot password saga
function* forgotPasswordSaga(action) {
    try {
        const { email } = action.payload;
        const response = yield call(apiForgotPassword, email);

        if (response.status === 'OK') {
            yield put(forgotPasswordSuccess(response.message));
            toast.success(response.message || 'OTP đã được gửi qua email!');
        } else {
            throw new Error(response.message || 'Gửi OTP thất bại');
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Gửi OTP thất bại';
        yield put(forgotPasswordFailure(errorMessage));
        toast.error(errorMessage);
    }
}

// Reset password saga
function* resetPasswordSaga(action) {
    try {
        const { email, otp, newPassword } = action.payload;
        const response = yield call(apiResetPassword, email, otp, newPassword);

        if (response.status === 'OK') {
            yield put(resetPasswordSuccess(response.message));
            toast.success(response.message || 'Mật khẩu đã được đặt lại thành công!');
        } else {
            throw new Error(response.message || 'Đặt lại mật khẩu thất bại');
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Đặt lại mật khẩu thất bại';
        yield put(resetPasswordFailure(errorMessage));
        toast.error(errorMessage);
    }
}

// Logout saga
function* handleLogout() {
    try {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        toast.success("Logout successful");
    } catch (error) {
        toast.error("Logout failed");
    }
}

// Root saga
export default function* authSaga() {
    yield takeLatest(LOGIN_REQUEST, loginSaga);
    yield takeLatest(LOGOUT, handleLogout);
    yield takeLatest(FORGOT_PASSWORD_REQUEST, forgotPasswordSaga);
    yield takeLatest(RESET_PASSWORD_REQUEST, resetPasswordSaga);
}
