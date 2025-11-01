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
import orderSaga from "./orderSaga";
import favoriteSaga from "./favoriteSaga";
import newsSaga from "./newsSaga";
import repairServiceSaga from "./repairServiceSaga";
import repairRequestSaga from "./repairRequestSaga";
import contactSaga from "./contactSaga";
import discountSaga from "./discountSaga";
import reviewSaga from "./reviewSaga";
import aboutSaga from "./aboutSaga";
import founderSaga from "./founderSaga";
import orderStaffSaga from "./orderStaffSaga";
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
      orderSaga(),
      favoriteSaga(),
      repairServiceSaga(),
      repairRequestSaga(),
      contactSaga(),
      discountSaga(),
      reviewSaga(),
      aboutSaga(),
      founderSaga(),
      orderStaffSaga(),
    ]);
  } catch (error) {
    console.error("🔴 rootSaga ERROR:", error);
  }

}
