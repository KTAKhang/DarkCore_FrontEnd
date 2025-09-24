import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import axios from "axios";
import {
    UPDATE_PROFILE_REQUEST,
    updateProfileSuccess,
    updateProfileFailure,
    CHANGE_PASSWORD_REQUEST,
    changePasswordSuccess,
    changePasswordFailure,
    GET_PROFILE_REQUEST,
    getProfileSuccess,
    getProfileFailure,
} from "../actions/profileAction";

const API_BASE_URL = "http://localhost:3000";

// Lấy token từ localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
};

const getFormHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`,
    };
};

// ===== API CALLS =====
const apiUpdateProfile = async (formData) => {
    const response = await axios.put(
        `${API_BASE_URL}/profile/update-user`,
        formData,
        {
            headers: getFormHeaders(),
            withCredentials: true,
        }
    );
    return response.data;
};

const apiChangePassword = async (data) => {
    const response = await axios.put(
        `${API_BASE_URL}/profile/change-password`,
        data,
        {
            headers: getAuthHeaders(),
            withCredentials: true,
        }
    );
    return response.data;
};

const apiGetProfile = async () => {
    const response = await axios.get(
        `${API_BASE_URL}/profile/user-info`,
        {
            headers: getAuthHeaders(),
            withCredentials: true,
        }
    );
    return response.data;
};


// ===== SAGAS =====
function* updateProfileSaga(action) {
    try {
        const response = yield call(apiUpdateProfile, action.payload);

        if (response.status === "OK") {
            // Dispatch lên reducer
            yield put(updateProfileSuccess(response.message, response.data));

            // Cập nhật lại localStorage
            const storedUser = JSON.parse(localStorage.getItem("user")) || {};
            const updatedUser = {
                ...storedUser,
                ...response.data, // dữ liệu mới từ API
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));

            toast.success(response.message || "Cập nhật thành công!");
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        const msg =
            error.response?.data?.message || error.message || "Cập nhật thất bại";
        yield put(updateProfileFailure(msg));
        toast.error(msg);
    }
}


function* changePasswordSaga(action) {
    try {
        const response = yield call(apiChangePassword, action.payload);
        if (response.status === "OK") {
            yield put(changePasswordSuccess(response.message));
            toast.success(response.message || "Đổi mật khẩu thành công!");
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        const msg = error.response?.data?.message || error.message || "Đổi mật khẩu thất bại";
        yield put(changePasswordFailure(msg));
        toast.error(msg);
    }
}

function* getProfileSaga() {
    try {
        const response = yield call(apiGetProfile);
        if (response.status === "OK") {
            yield put(getProfileSuccess(response.data));
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        const msg = error.response?.data?.message || error.message || "Lấy thông tin thất bại";
        yield put(getProfileFailure(msg));
        toast.error(msg);
    }
}

// ===== ROOT SAGA =====
export default function* profileSaga() {
    yield takeLatest(UPDATE_PROFILE_REQUEST, updateProfileSaga);
    yield takeLatest(CHANGE_PASSWORD_REQUEST, changePasswordSaga);
    yield takeLatest(GET_PROFILE_REQUEST, getProfileSaga);
}
