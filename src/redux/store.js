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
import repairServiceReducer from "./reducers/repairServiceReducer";
import repairRequestReducer from "./reducers/repairRequestReducer";

import rootSaga from "./sagas/rootSaga";
const rootReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
  product: productReducer,
  staff: staffReducer,
  categoryHome: categoryHomeReducer,
  productHome: productHomeReducer,
  profile: profileReducer,
  repairService: repairServiceReducer,
  repairRequest: repairRequestReducer,
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