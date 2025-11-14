import { call, put, takeLatest } from "redux-saga/effects";
import apiClient from "../../utils/axiosConfig";
import {
  FETCH_SALE_STAFF_DASHBOARD_REQUEST,
  fetchSaleStaffDashboardSuccess,
  fetchSaleStaffDashboardFailure,
} from "../actions/statisticsStaffActions";

function* fetchSaleStaffDashboardSaga() {
  try {
    const response = yield call(apiClient.get, "/statistics-staff/sales-stats/dashboard");
    const payload = response?.data?.data || null;
    yield put(fetchSaleStaffDashboardSuccess(payload));
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Không thể tải dữ liệu thống kê nhân viên bán hàng";
    yield put(fetchSaleStaffDashboardFailure(errorMessage));
  }
}

export default function* statisticsStaffSaga() {
  yield takeLatest(FETCH_SALE_STAFF_DASHBOARD_REQUEST, fetchSaleStaffDashboardSaga);
}


