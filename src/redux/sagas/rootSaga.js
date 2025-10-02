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
console.log("🔴 rootSaga: cartSaga import result:", typeof cartSaga);
console.log("🔴 rootSaga: typeof cartSaga:", typeof cartSaga);
console.log("🔴 rootSaga: cartSaga function?:", typeof cartSaga === "function");
export default function* rootSaga() {
  console.log("🔴 rootSaga: Starting...");

  try {
    yield all([
      authSaga(),
      categorySaga(),
      productSaga(),
      staffSaga(),
      categoryHomeSaga(),
      productHomeSaga(),
      cartSaga(), // ⚠️ NẾU CÓ LỖI Ở ĐÂY, SẼ DỪNG LẠI
    ]);
    console.log("🔴 rootSaga: All sagas completed");
  } catch (error) {
    console.error("🔴 rootSaga ERROR:", error);
  }
}
