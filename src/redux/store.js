// store/index.js
import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import authReducer from "./reducers/authReducer";
import categoryReducer from "./reducers/categoryReducer";
import productReducer from "./reducers/productReducer";
import staffReducer from "./reducers/staffReducer";
import categoryHomeReducer from "./reducers/categoryHomeReducer";
import productHomeReducer from "./reducers/productHomeReducer";
import profileReducer from "./reducers/profileReducer";

import customerReducer from "./reducers/customerReducer";
import cartReducer from "./reducers/cartReducer";
import orderReducer from "./reducers/orderReducer";
import favoriteReducer from "./reducers/favoriteReducer";
import newsReducer from "./reducers/newsReducer";
import repairServiceReducer from "./reducers/repairServiceReducer";
import repairRequestReducer from "./reducers/repairRequestReducer";
import reviewReducer from "./reducers/reviewReducer";

import rootSaga from "./sagas/rootSaga";
const rootReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
  product: productReducer,
  staff: staffReducer,
  categoryHome: categoryHomeReducer,
  productHome: productHomeReducer,
  profile: profileReducer,
  customer: customerReducer,
  cart: cartReducer,
  order: orderReducer,
  favorite: favoriteReducer,
  news: newsReducer,
  repairService: repairServiceReducer,
  repairRequest: repairRequestReducer,
  review: reviewReducer,
});

const sagaMiddleware = createSagaMiddleware();

// Enable Redux DevTools in development if available
const composeEnhancers =
  (import.meta.env.DEV &&
    typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  ((f) => f);

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

export default store;