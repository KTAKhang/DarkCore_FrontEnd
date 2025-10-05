import { all } from "redux-saga/effects";
import authSaga from "./authSaga";
import categorySaga from "./categorySaga";
import productSaga from "./productSaga";
import staffSaga from "./staffSaga";
import categoryHomeSaga from "./categoryHomeSaga";
import productHomeSaga from "./productHomeSaga";
import profileSaga from "./profileSaga";
import customerSaga from "./customerSaga";
import cartSaga from "./cartSaga";
import newsSaga from "./newsSaga";
export default function* rootSaga() {
  try {
    yield all([
      authSaga(),
      categorySaga(),
      productSaga(),
      staffSaga(),
      categoryHomeSaga(),
      productHomeSaga(),
      cartSaga(),
      newsSaga(),
      profileSaga(),
      customerSaga(),
    ]);
  } catch (error) {
    console.error("🔴 rootSaga ERROR:", error);
  }
}
