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
      yield put(discountListSuccess(response.data, response.pagination));
    } else {
      yield put(discountListFailed(response.message || "Lỗi khi tải danh sách mã giảm giá"));
    }
  } catch (error) {
    console.log("❌ API Error:", error);
    const errorMessage = error.response?.data?.message || error.message || "Lỗi kết nối server";
    yield put(discountListFailed(errorMessage));
    toast.error(errorMessage);
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
    toast.error(errorMessage);
  }
}

function* createDiscountSaga(action) {
  try {
    console.log("🚀 createDiscountSaga called with action:", action);
    
    const response = yield call(createDiscountApi, action.payload);
    console.log("✅ API create discount response:", response);
    
    if (response.status === "OK") {
      yield put(discountCreateSuccess(response.data));
      toast.success("Mã giảm giá đã được tạo thành công");
    } else {
      yield put(discountCreateFailed(response.message || "Lỗi khi tạo mã giảm giá"));
      toast.error(response.message || "Lỗi khi tạo mã giảm giá");
    }
  } catch (error) {
    console.log("❌ API Create Discount Error:", error);
    const errorMessage = error.response?.data?.message || error.message || "Lỗi kết nối server";
    yield put(discountCreateFailed(errorMessage));
    toast.error(errorMessage);
  }
}

function* updateDiscountSaga(action) {
  try {
    const { id, ...payload } = action.payload;
    const response = yield call(updateDiscountApi, id, payload);
    
    if (response.status === "OK") {
      yield put(discountUpdateSuccess(response.data));
      toast.success("Mã giảm giá đã được cập nhật thành công");
    } else {
      yield put(discountUpdateFailed(response.message || "Lỗi khi cập nhật mã giảm giá"));
      toast.error(response.message || "Lỗi khi cập nhật mã giảm giá");
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Lỗi kết nối server";
    yield put(discountUpdateFailed(errorMessage));
    toast.error(errorMessage);
  }
}

function* deactivateDiscountSaga(action) {
  try {
    const { id } = action.payload;
    const response = yield call(deactivateDiscountApi, id);
    
    if (response.status === "OK") {
      yield put(discountDeactivateSuccess(response.data));
      toast.success("Mã giảm giá đã được vô hiệu hóa");
    } else {
      yield put(discountDeactivateFailed(response.message || "Lỗi khi vô hiệu hóa mã giảm giá"));
      toast.error(response.message || "Lỗi khi vô hiệu hóa mã giảm giá");
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Lỗi kết nối server";
    yield put(discountDeactivateFailed(errorMessage));
    toast.error(errorMessage);
  }
}

function* applyDiscountSaga(action) {
  try {
    const { code, orderTotal } = action.payload;
    const response = yield call(applyDiscountApi, code, orderTotal);
    
    if (response.status === "OK") {
      yield put(discountApplySuccess(response.data));
      toast.success("Mã giảm giá đã được áp dụng thành công");
    } else {
      yield put(discountApplyFailed(response.message || "Lỗi khi áp dụng mã giảm giá"));
      toast.error(response.message || "Lỗi khi áp dụng mã giảm giá");
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Lỗi kết nối server";
    yield put(discountApplyFailed(errorMessage));
    toast.error(errorMessage);
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
      toast.error(response.message || "Lỗi khi tải danh sách mã giảm giá");
    }
  } catch (error) {
    console.log("❌ API Active Discounts Error:", error);
    const errorMessage = error.response?.data?.message || error.message || "Lỗi kết nối server";
    yield put(discountActiveFailed(errorMessage));
    toast.error(errorMessage);
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
