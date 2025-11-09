import { call, put, takeEvery } from "redux-saga/effects";
import apiClient from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import {
  DISCOUNT_LIST_REQUEST,
  DISCOUNT_DETAIL_REQUEST,
  DISCOUNT_CREATE_REQUEST,
  DISCOUNT_UPDATE_REQUEST,
  DISCOUNT_DEACTIVATE_REQUEST,
  DISCOUNT_APPLY_REQUEST,
  DISCOUNT_ACTIVE_REQUEST,
  discountListSuccess,
  discountListFailed,
  discountDetailSuccess,
  discountDetailFailed,
  discountCreateSuccess,
  discountCreateFailed,
  discountUpdateSuccess,
  discountUpdateFailed,
  discountDeactivateSuccess,
  discountDeactivateFailed,
  discountApplySuccess,
  discountApplyFailed,
  discountActiveSuccess,
  discountActiveFailed,
} from "@/redux/actions/discountActions";

// API call functions
function* fetchDiscountsApi(params) {
  const response = yield call(apiClient.get, "/discount/discounts", {
    params,
  });
  return response.data;
}

function* fetchDiscountDetailApi(code) {
  const response = yield call(apiClient.get, `/discount/discounts/${code}`);
  return response.data;
}

function* createDiscountApi(payload) {
  const response = yield call(apiClient.post, "/discount/discounts", payload);
  return response.data;
}

function* updateDiscountApi(id, payload) {
  const response = yield call(apiClient.patch, `/discount/discounts/${id}`, payload);
  return response.data;
}

function* deactivateDiscountApi(id) {
  const response = yield call(apiClient.delete, `/discount/discounts/${id}`);
  return response.data;
}

function* applyDiscountApi(code, orderTotal) {
  const response = yield call(apiClient.post, "/discount/discounts/apply", {
    code,
    orderTotal
  });
  return response.data;
}

function* fetchActiveDiscountsApi() {
  const response = yield call(apiClient.get, "/discount/discounts/active");
  return response.data;
}

// Saga functions
function* fetchDiscountsSaga(action) {
  try {
    console.log("🚀 fetchDiscountsSaga called with action:", action);
    
    const response = yield call(fetchDiscountsApi, action.payload);
    console.log("✅ API response:", response);
    
    if (response.status === "OK") {
      // Handle both old format (array) and new format (object with discounts and pagination)
      if (Array.isArray(response.data)) {
        // Old format - just array of discounts
        yield put(discountListSuccess(response.data, null));
      } else if (response.data && response.data.discounts) {
        // New format - object with discounts and pagination
        yield put(discountListSuccess(response.data.discounts, response.data.pagination));
      } else {
        // Fallback
        yield put(discountListSuccess(response.data, null));
      }
    } else {
      yield put(discountListFailed(response.message || "Lỗi khi tải danh sách mã giảm giá"));
    }
  } catch (error) {
    console.log("❌ API Error:", error);
    const errorMessage = error.response?.data?.message || error.message || "Lỗi kết nối server";
    yield put(discountListFailed(errorMessage));
  }
}

function* fetchDiscountDetailSaga(action) {
  try {
    const { code } = action.payload;
    const response = yield call(fetchDiscountDetailApi, code);
    
    if (response.status === "OK") {
      yield put(discountDetailSuccess(response.data));
    } else {
      yield put(discountDetailFailed(response.message || "Lỗi khi tải chi tiết mã giảm giá"));
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Lỗi kết nối server";
    yield put(discountDetailFailed(errorMessage));
  }
}

function* createDiscountSaga(action) {
  try {
    console.log("🚀 createDiscountSaga called with action:", action);
    
    const response = yield call(createDiscountApi, action.payload);
    console.log("✅ API create discount response:", response);
    
    if (response.status === "OK") {
      yield put(discountCreateSuccess(response.data));
    } else {
      yield put(discountCreateFailed(response.message || "Lỗi khi tạo mã giảm giá"));
    }
  } catch (error) {
    console.log("❌ API Create Discount Error:", error);
    const errorMessage = error.response?.data?.message || error.message || "Lỗi kết nối server";
    yield put(discountCreateFailed(errorMessage));
  }
}

function* updateDiscountSaga(action) {
  try {
    const { id, ...payload } = action.payload;
    const response = yield call(updateDiscountApi, id, payload);
    
    if (response.status === "OK") {
      yield put(discountUpdateSuccess(response.data));
    } else {
      yield put(discountUpdateFailed(response.message || "Lỗi khi cập nhật mã giảm giá"));
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Lỗi kết nối server";
    yield put(discountUpdateFailed(errorMessage));
  }
}

function* deactivateDiscountSaga(action) {
  try {
    const { id } = action.payload;
    const response = yield call(deactivateDiscountApi, id);
    
    if (response.status === "OK") {
      yield put(discountDeactivateSuccess(response.data));
    } else {
      yield put(discountDeactivateFailed(response.message || "Lỗi khi vô hiệu hóa mã giảm giá"));
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Lỗi kết nối server";
    yield put(discountDeactivateFailed(errorMessage));
  }
}

function* applyDiscountSaga(action) {
  try {
    const { code, orderTotal } = action.payload;
    const response = yield call(applyDiscountApi, code, orderTotal);
    
    if (response.status === "OK") {
      yield put(discountApplySuccess(response.data));
    } else {
      const message = response.message || "Mã giảm giá không hợp lệ hoặc đã hết hạn";
      toast.error(message);
      yield put(discountApplyFailed(message));
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Lỗi kết nối server";
    toast.error(errorMessage);
    yield put(discountApplyFailed(errorMessage));
  }
}

function* fetchActiveDiscountsSaga() {
  try {
    console.log("🚀 fetchActiveDiscountsSaga called");
    
    const response = yield call(fetchActiveDiscountsApi);
    console.log("✅ API active discounts response:", response);
    
    if (response.status === "OK") {
      yield put(discountActiveSuccess(response.data));
    } else {
      yield put(discountActiveFailed(response.message || "Lỗi khi tải danh sách mã giảm giá"));
    }
  } catch (error) {
    console.log("❌ API Active Discounts Error:", error);
    const errorMessage = error.response?.data?.message || error.message || "Lỗi kết nối server";
    yield put(discountActiveFailed(errorMessage));
  }
}

// Root discount saga
export default function* discountSaga() {
  console.log("🚀 discountSaga root saga initialized");
  yield takeEvery(DISCOUNT_LIST_REQUEST, fetchDiscountsSaga);
  yield takeEvery(DISCOUNT_DETAIL_REQUEST, fetchDiscountDetailSaga);
  yield takeEvery(DISCOUNT_CREATE_REQUEST, createDiscountSaga);
  yield takeEvery(DISCOUNT_UPDATE_REQUEST, updateDiscountSaga);
  yield takeEvery(DISCOUNT_DEACTIVATE_REQUEST, deactivateDiscountSaga);
  yield takeEvery(DISCOUNT_APPLY_REQUEST, applyDiscountSaga);
  yield takeEvery(DISCOUNT_ACTIVE_REQUEST, fetchActiveDiscountsSaga);
}
