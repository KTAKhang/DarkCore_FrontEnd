import { call, put, takeLatest, all } from "redux-saga/effects";
import { saveAs } from 'file-saver';
import apiClient from "../../utils/axiosConfig";
import {
  FETCH_DASHBOARD_DATA_REQUEST,
  EXPORT_DASHBOARD_EXCEL_REQUEST,
  fetchDashboardDataSuccess,
  fetchDashboardDataFailure,
  exportDashboardExcelSuccess,
  exportDashboardExcelFailure
} from "../actions/statisticsActions";

// Fetch Dashboard Data
function* fetchDashboardDataSaga(action) {
  try {
    const { year } = action.payload;
    const currentDate = new Date().toISOString().split('T')[0];

    console.log('🔍 Fetching dashboard data for year:', year);

    // Fetch all data in parallel
    const [
      overviewRes,
      revenueMonthlyRes,
      revenueDailyRes,
      newCustomersRes,
      salesDailyRes,
      topProductsRes,
      pendingOrdersRes,
      repairYearlyRes
    ] = yield all([
      call(apiClient.get, '/statistics/overview'),
      call(apiClient.get, `/statistics/revenue/monthly?year=${year}`),
      call(apiClient.get, `/statistics/revenue/daily?date=${currentDate}`),
      call(apiClient.get, `/statistics/customers/new?date=${currentDate}`),
      call(apiClient.get, `/statistics/sales/daily?date=${currentDate}`),
      call(apiClient.get, '/statistics/products/top?limit=3'),
      call(apiClient.get, '/statistics/orders/pending-count'),
      call(apiClient.get, `/statistics/repair/yearly?year=${year}`)
    ]);

    console.log('✅ All API calls successful');
    console.log('📊 Raw API Responses:', {
      overview: overviewRes,
      revenueByMonth: revenueMonthlyRes,
      topProducts: topProductsRes
    });

    // Combine all data
    const dashboardData = {
      overview: overviewRes?.data?.data || {},
      revenueByMonth: revenueMonthlyRes?.data?.data || [],
      revenueByDate: revenueDailyRes?.data?.data || [],
      newCustomers: newCustomersRes?.data?.data || [],
      salesByDate: salesDailyRes?.data?.data || [],
      topProducts: topProductsRes?.data?.data || [],
      pendingOrdersCount: pendingOrdersRes?.data?.data || 0,
      repairRevenueByYear: repairYearlyRes?.data?.data || []
    };

    console.log('📊 Dashboard data:', dashboardData);

    yield put(fetchDashboardDataSuccess(dashboardData));
  } catch (error) {
    console.error("❌ Error fetching dashboard data:", error);
    console.error("❌ Error details:", error.response?.data || error.message);
    yield put(fetchDashboardDataFailure(error.message || 'Failed to fetch dashboard data'));
  }
}

// Export Dashboard Excel
function* exportDashboardExcelSaga(action) {
  try {
    const { year } = action.payload;
    const response = yield call(
      apiClient.get,
      `/statistics/export/excel?year=${year}`,
      { responseType: 'blob' }
    );
    
    // Download file using file-saver
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, `dashboard-statistics-${year}.xlsx`);
    
    yield put(exportDashboardExcelSuccess());
  } catch (error) {
    console.error("Error exporting dashboard excel:", error);
    yield put(exportDashboardExcelFailure(error.message || 'Failed to export excel'));
  }
}

// Watcher Saga
export default function* statisticsSaga() {
  yield takeLatest(FETCH_DASHBOARD_DATA_REQUEST, fetchDashboardDataSaga);
  yield takeLatest(EXPORT_DASHBOARD_EXCEL_REQUEST, exportDashboardExcelSaga);
}

