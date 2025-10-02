import { all } from "redux-saga/effects";
import authSaga from "./authSaga";
import categorySaga from "./categorySaga";
import productSaga from "./productSaga";
import staffSaga from "./staffSaga";
import categoryHomeSaga from "./categoryHomeSaga";
import productHomeSaga from "./productHomeSaga";
import cartSaga from "./cartSaga"; // Import cartSaga
export default function* rootSaga() {
  yield all([
    authSaga(),
    categorySaga(),
    productSaga(),
    staffSaga(),
    categoryHomeSaga(),
    productHomeSaga(),
    cartSaga(), // Thêm cartSaga vào đây
  ]);
}
