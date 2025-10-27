# 📝 REDUX SAGA CHEAT SHEET - TRA CỨU NHANH

## 🎯 1. CÁC KHÁI NIỆM CƠ BẢN

### Redux là gì?

- **State Management Library** - Quản lý state tập trung cho toàn bộ app
- **Single Source of Truth** - Tất cả state ở 1 nơi (Redux Store)
- **Immutable State** - State không được sửa trực tiếp, phải tạo mới

### Redux Saga là gì?

- **Middleware** để xử lý **side effects** (gọi API, async operations)
- Dùng **Generator Functions** (`function*`)
- Tách biệt logic API ra khỏi Component

---

## 🔑 2. CÁC KHÁI NIỆM QUAN TRỌNG

| Khái niệm          | Giải thích                            | Ví dụ                                            |
| ------------------ | ------------------------------------- | ------------------------------------------------ |
| **Action**         | Object mô tả "điều gì xảy ra"         | `{ type: 'ORDER_LIST_REQUEST', payload: {...} }` |
| **Action Type**    | String định danh action               | `'ORDER_LIST_REQUEST'`                           |
| **Action Creator** | Function tạo action object            | `orderListRequest(query)`                        |
| **Reducer**        | Pure function xử lý state             | `(state, action) => newState`                    |
| **Saga**           | Generator function xử lý side effects | `function* fetchOrdersSaga(action) {...}`        |
| **Store**          | Nơi lưu trữ tất cả state              | `createStore(reducer, middleware)`               |
| **Middleware**     | Layer xử lý giữa action và reducer    | `sagaMiddleware`                                 |
| **Dispatch**       | Gửi action vào Redux                  | `dispatch(orderListRequest())`                   |
| **Subscribe**      | Lắng nghe thay đổi state              | `useSelector(state => state.order)`              |

---

## 📚 3. CẤU TRÚC FILE

```
src/
├── redux/
│   ├── actions/
│   │   └── orderActions.js       // Định nghĩa action types & creators
│   ├── reducers/
│   │   └── orderReducer.js       // Xử lý state
│   ├── sagas/
│   │   ├── orderSaga.js          // Xử lý API calls
│   │   └── rootSaga.js           // Kết hợp tất cả sagas
│   └── store.js                  // Setup Redux Store
├── pages/
│   └── OrderManagement/
│       └── OrderManagement.jsx   // Component UI
└── main.jsx                      // Entry point
```

---

## 🎨 4. LUỒNG HOẠT ĐỘNG (5 BƯỚC)

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Component   │ -> │   Actions    │ -> │     Saga     │ -> │   Reducer    │ -> │  Component   │
│              │    │              │    │              │    │              │    │              │
│  Dispatch    │    │  Request     │    │   Call API   │    │ Update State │    │  Re-render   │
│  action      │    │  type        │    │   Handle     │    │              │    │  with new    │
│              │    │              │    │   response   │    │              │    │  data        │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

### Chi tiết:

1. **Component**: `dispatch(orderListRequest({ page: 1 }))`
2. **Actions**: Tạo action object `{ type: 'ORDER_LIST_REQUEST', payload: {...} }`
3. **Saga**: Bắt action → Gọi API → Nhận response → Dispatch SUCCESS/FAILED
4. **Reducer**: Nhận SUCCESS/FAILED → Cập nhật state
5. **Component**: useSelector nhận state mới → Re-render

---

## 💻 5. CODE TEMPLATES

### 📄 Template: orderActions.js

```javascript
// 1️⃣ Định nghĩa ACTION TYPES (constants)
export const ORDER_LIST_REQUEST = "ORDER_LIST_REQUEST";
export const ORDER_LIST_SUCCESS = "ORDER_LIST_SUCCESS";
export const ORDER_LIST_FAILED = "ORDER_LIST_FAILED";

// 2️⃣ Tạo ACTION CREATORS (functions)
export const orderListRequest = (query = {}) => ({
  type: ORDER_LIST_REQUEST,
  payload: query,
});

export const orderListSuccess = (data, pagination) => ({
  type: ORDER_LIST_SUCCESS,
  payload: { data, pagination },
});

export const orderListFailed = (error) => ({
  type: ORDER_LIST_FAILED,
  payload: error,
});
```

---

### 📄 Template: orderSaga.js

```javascript
import { call, put, takeEvery } from "redux-saga/effects";
import apiClient from "../../utils/axiosConfig";
import {
  ORDER_LIST_REQUEST,
  orderListSuccess,
  orderListFailed,
} from "../actions/orderActions";

// 1️⃣ API Function - Gọi backend
function* fetchOrdersApi(params) {
  const response = yield call(apiClient.get, "/order/orders", { params });
  return response.data;
}

// 2️⃣ Saga Function - Xử lý logic
function* fetchOrdersSaga(action) {
  try {
    // Gọi API
    const response = yield call(fetchOrdersApi, action.payload);

    // Xử lý response
    if (response.status === "OK") {
      yield put(orderListSuccess(response.data, response.pagination));
    } else {
      yield put(orderListFailed(response.message));
    }
  } catch (error) {
    yield put(orderListFailed(error.message));
  }
}

// 3️⃣ Root Saga - Lắng nghe actions
export default function* orderSaga() {
  yield takeEvery(ORDER_LIST_REQUEST, fetchOrdersSaga);
}
```

**Saga Effects:**

- `call(fn, ...args)`: Gọi function và chờ kết quả (blocking)
- `put(action)`: Dispatch action (giống dispatch())
- `takeEvery(pattern, saga)`: Lắng nghe mọi action khớp pattern
- `takeLatest(pattern, saga)`: Chỉ xử lý action mới nhất (cancel cũ)

---

### 📄 Template: orderReducer.js

```javascript
import {
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAILED,
} from "../actions/orderActions";

// 1️⃣ Initial State
const initialState = {
  items: [],
  pagination: { page: 1, limit: 5, total: 0 },
  loadingList: false,
  error: null,
};

// 2️⃣ Reducer Function
const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ORDER_LIST_REQUEST:
      return {
        ...state, // Spread: copy state cũ
        loadingList: true, // Cập nhật field mới
        error: null,
      };

    case ORDER_LIST_SUCCESS:
      return {
        ...state,
        loadingList: false,
        items: action.payload.data,
        pagination: action.payload.pagination,
      };

    case ORDER_LIST_FAILED:
      return {
        ...state,
        loadingList: false,
        error: action.payload,
      };

    default:
      return state; // Luôn return state
  }
};

export default orderReducer;
```

**Nguyên tắc Reducer:**

- ✅ Pure function: cùng input → cùng output
- ✅ Immutable: dùng `...state` để copy
- ✅ No side effects: không gọi API, không setTimeout
- ✅ Luôn return state

---

### 📄 Template: Component (OrderManagement.jsx)

```javascript
import { useDispatch, useSelector } from "react-redux";
import { orderListRequest } from "../../redux/actions/orderActions";

const OrderManagement = () => {
  // 1️⃣ Lấy dispatch function
  const dispatch = useDispatch();

  // 2️⃣ Lấy state từ Redux Store
  const { items, loadingList, error } = useSelector((state) => state.order);

  // 3️⃣ Dispatch action khi component mount
  useEffect(() => {
    dispatch(orderListRequest({ page: 1, limit: 5 }));
  }, [dispatch]);

  // 4️⃣ Event handlers
  const handleRefresh = () => {
    dispatch(orderListRequest({ page: 1 }));
  };

  const handleSearch = (keyword) => {
    dispatch(orderListRequest({ page: 1, keyword }));
  };

  // 5️⃣ Render UI
  return (
    <div>
      {loadingList && <Spin />}
      {error && <Alert message={error} type="error" />}
      <Table dataSource={items} />
      <Button onClick={handleRefresh}>Refresh</Button>
    </div>
  );
};
```

**React Hooks:**

- `useDispatch()`: Lấy dispatch function
- `useSelector(selector)`: Lấy state từ Store, auto re-render khi state thay đổi
- `useEffect()`: Chạy side effects (dispatch initial action)

---

### 📄 Template: store.js

```javascript
import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import orderReducer from "./reducers/orderReducer";
import rootSaga from "./sagas/rootSaga";

// 1️⃣ Combine tất cả reducers
const rootReducer = combineReducers({
  order: orderReducer,
  // product: productReducer,
  // cart: cartReducer,
});

// 2️⃣ Tạo Saga Middleware
const sagaMiddleware = createSagaMiddleware();

// 3️⃣ Tạo Store
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

// 4️⃣ Chạy Root Saga
sagaMiddleware.run(rootSaga);

export default store;
```

---

### 📄 Template: rootSaga.js

```javascript
import { all } from "redux-saga/effects";
import orderSaga from "./orderSaga";
import productSaga from "./productSaga";

export default function* rootSaga() {
  yield all([
    orderSaga(), // Chạy song song
    productSaga(),
    // ...
  ]);
}
```

---

### 📄 Template: main.jsx

```javascript
import { Provider } from "react-redux";
import store from "./redux/store";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

---

## 🎯 6. PATTERN: 3 ACTIONS CHO MỖI TÍNH NĂNG

Mọi tính năng gọi API đều có 3 actions:

| Action      | Khi nào        | Ai dispatch | Làm gì                          |
| ----------- | -------------- | ----------- | ------------------------------- |
| **REQUEST** | User thao tác  | Component   | Bắt đầu quá trình, bật loading  |
| **SUCCESS** | API thành công | Saga        | Lưu data vào state, tắt loading |
| **FAILED**  | API lỗi        | Saga        | Lưu error message, tắt loading  |

**Ví dụ:**

```javascript
// Component
dispatch(orderListRequest({ page: 1 }));

// Saga
if (response.ok) {
  yield put(orderListSuccess(data));     // Thành công
} else {
  yield put(orderListFailed(error));     // Thất bại
}

// Reducer
switch (action.type) {
  case ORDER_LIST_REQUEST:  return { ...state, loading: true };
  case ORDER_LIST_SUCCESS:  return { ...state, loading: false, items: data };
  case ORDER_LIST_FAILED:   return { ...state, loading: false, error: msg };
}
```

---

## 🔧 7. SAGA EFFECTS CHEAT SHEET

| Effect                      | Mô tả                      | Ví dụ                                      |
| --------------------------- | -------------------------- | ------------------------------------------ |
| `call(fn, ...args)`         | Gọi function (blocking)    | `yield call(api.get, '/orders')`           |
| `put(action)`               | Dispatch action            | `yield put(orderListSuccess(data))`        |
| `takeEvery(pattern, saga)`  | Lắng nghe mọi action       | `yield takeEvery(REQUEST, fetchSaga)`      |
| `takeLatest(pattern, saga)` | Chỉ xử lý action mới nhất  | `yield takeLatest(SEARCH, searchSaga)`     |
| `select(selector)`          | Lấy state từ Store         | `const state = yield select(s => s.order)` |
| `delay(ms)`                 | Delay (setTimeout)         | `yield delay(1000)`                        |
| `all([...sagas])`           | Chạy nhiều sagas song song | `yield all([saga1(), saga2()])`            |

---

## 🎨 8. REACT HOOKS CHEAT SHEET

| Hook            | Mục đích                    | Ví dụ                                           |
| --------------- | --------------------------- | ----------------------------------------------- |
| `useSelector()` | Lấy state từ Redux          | `const items = useSelector(s => s.order.items)` |
| `useDispatch()` | Lấy dispatch function       | `const dispatch = useDispatch()`                |
| `useState()`    | Local state của component   | `const [filter, setFilter] = useState('')`      |
| `useEffect()`   | Side effects (mount/update) | `useEffect(() => { dispatch(...) }, [])`        |
| `useCallback()` | Memoize function            | `const fetch = useCallback(() => {...}, [])`    |
| `useMemo()`     | Memoize value               | `const total = useMemo(() => calc(), [data])`   |

---

## 🐛 9. DEBUG & TROUBLESHOOTING

### Cài Redux DevTools (Chrome Extension)

```
Chrome Web Store → Search "Redux DevTools" → Install
```

### Xem actions flow

1. Mở DevTools → Tab "Redux"
2. Xem timeline của các actions
3. Xem state trước/sau mỗi action
4. Time-travel debugging (quay lại action trước)

### Console.log debug

```javascript
// Saga
function* fetchOrdersSaga(action) {
  console.log("🚀 Saga bắt action:", action);
  const response = yield call(api, action.payload);
  console.log("✅ Response:", response);
  yield put(orderListSuccess(response.data));
  console.log("✅ Dispatched SUCCESS");
}

// Reducer
const orderReducer = (state, action) => {
  console.log("🔵 Reducer nhận action:", action.type, action.payload);
  // ...
  console.log("🔵 State mới:", newState);
  return newState;
};

// Component
const { items } = useSelector((state) => {
  console.log("🟢 Component nhận state:", state.order);
  return state.order;
});
```

### Lỗi thường gặp

| Lỗi                       | Nguyên nhân              | Giải pháp                     |
| ------------------------- | ------------------------ | ----------------------------- |
| State không update        | Sửa trực tiếp state      | Dùng `...state` để copy       |
| Action không được bắt     | Không có `takeEvery`     | Thêm watcher saga             |
| API không được gọi        | Saga lỗi hoặc không chạy | Check console, Redux DevTools |
| Component không re-render | useSelector sai          | Check selector function       |
| Infinite loop             | useEffect dependency sai | Thêm dependency array `[]`    |

---

## 📊 10. FLOW DIAGRAM TỔNG QUAN

```
main.jsx
  └─► Provider wrap App với store
       │
       ├─► store.js: createStore + sagaMiddleware
       │    ├─► rootReducer: combineReducers({ order: orderReducer })
       │    └─► rootSaga: all([orderSaga(), ...])
       │
       └─► App render → OrderManagement component

OrderManagement mount
  └─► useEffect(() => { dispatch(orderListRequest()) })
       │
       ▼
Redux Flow:
  ┌─────────────────────────────────────────────────┐
  │ 1. dispatch(orderListRequest({ page: 1 }))     │ Component
  └──────────────────┬──────────────────────────────┘
                     │
                     ▼
  ┌─────────────────────────────────────────────────┐
  │ 2. Action: { type: REQUEST, payload: {...} }   │ Actions
  └──────────────────┬──────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
  ┌──────────────┐        ┌──────────────┐
  │ 3a. Reducer  │        │ 3b. Saga     │
  │ loading=true │        │ Call API     │
  └──────┬───────┘        └──────┬───────┘
         │                       │
         │                       ▼
         │                ┌──────────────┐
         │                │ 4. Backend   │
         │                └──────┬───────┘
         │                       │
         │                       ▼
         │                ┌──────────────────────┐
         │                │ 5. Dispatch SUCCESS  │
         │                └──────┬───────────────┘
         │                       │
         └───────────┬───────────┘
                     ▼
  ┌─────────────────────────────────────────────────┐
  │ 6. Reducer: items=data, loading=false          │
  └──────────────────┬──────────────────────────────┘
                     │
                     ▼
  ┌─────────────────────────────────────────────────┐
  │ 7. Component re-render với data mới            │
  └─────────────────────────────────────────────────┘
```

---

## 🎓 11. BEST PRACTICES

### ✅ DO (Nên làm)

- ✅ Dùng constants cho action types
- ✅ Mỗi tính năng có 3 actions: REQUEST, SUCCESS, FAILED
- ✅ Tách logic API ra Saga
- ✅ Reducer phải là pure function
- ✅ Dùng `...state` để copy state
- ✅ Dùng Redux DevTools để debug
- ✅ Console.log ở mọi bước để hiểu luồng

### ❌ DON'T (Không nên)

- ❌ Gọi API trực tiếp trong Component
- ❌ Sửa trực tiếp state: `state.items.push(item)`
- ❌ Gọi API trong Reducer
- ❌ Quên return state trong reducer
- ❌ useEffect không có dependency array → infinite loop
- ❌ Dispatch action trong reducer

---

## 📝 12. CHECKLIST KHI TẠO TÍNH NĂNG MỚI

- [ ] 1. Tạo action types trong `orderActions.js`
     ```javascript
     export const ORDER_DELETE_REQUEST = "ORDER_DELETE_REQUEST";
     export const ORDER_DELETE_SUCCESS = "ORDER_DELETE_SUCCESS";
     export const ORDER_DELETE_FAILED = "ORDER_DELETE_FAILED";
     ```

- [ ] 2. Tạo action creators
     ```javascript
     export const orderDeleteRequest = (id) => ({
       type: ORDER_DELETE_REQUEST,
       payload: { id },
     });
     ```

- [ ] 3. Thêm saga function trong `orderSaga.js`
     ```javascript
     function* deleteOrderSaga(action) {
       try {
         yield call(api.delete, `/orders/${action.payload.id}`);
         yield put(orderDeleteSuccess(action.payload.id));
       } catch (error) {
         yield put(orderDeleteFailed(error.message));
       }
     }
     ```

- [ ] 4. Thêm watcher trong root saga
     ```javascript
     yield takeEvery(ORDER_DELETE_REQUEST, deleteOrderSaga);
     ```

- [ ] 5. Thêm cases trong reducer
     ```javascript
     case ORDER_DELETE_REQUEST: return { ...state, deleting: true };
     case ORDER_DELETE_SUCCESS: return {
       ...state,
       deleting: false,
       items: state.items.filter(item => item.id !== action.payload)
     };
     case ORDER_DELETE_FAILED: return { ...state, deleting: false, error: action.payload };
     ```

- [ ] 6. Thêm state mới vào initialState
     ```javascript
     const initialState = {
       // ...existing
       deleting: false,
     };
     ```

- [ ] 7. Sử dụng trong Component
     ```javascript
     const handleDelete = (id) => {
       dispatch(orderDeleteRequest(id));
     };
     ```

- [ ] 8. Test với Redux DevTools
- [ ] 9. Kiểm tra console.log
- [ ] 10. Kiểm tra UI re-render đúng

---

## 🚀 13. TIPS & TRICKS

### Tip 1: Debounce Search với Saga

```javascript
import { debounce } from 'redux-saga/effects';

function* searchSaga(action) {
  yield delay(500);  // Chờ 500ms
  // ... call API
}

// Thay takeEvery bằng debounce
yield debounce(500, SEARCH_REQUEST, searchSaga);
```

### Tip 2: Cancel request cũ khi có request mới

```javascript
// Dùng takeLatest thay vì takeEvery
yield takeLatest(ORDER_LIST_REQUEST, fetchOrdersSaga);
```

### Tip 3: Lấy state trong Saga

```javascript
function* someSaga() {
  const currentState = yield select((state) => state.order);
  console.log("Current items:", currentState.items);
}
```

### Tip 4: Chạy nhiều API song song

```javascript
function* fetchAllData() {
  const [orders, stats, statuses] = yield all([
    call(api.getOrders),
    call(api.getStats),
    call(api.getStatuses),
  ]);
  // Cả 3 API chạy đồng thời
}
```

### Tip 5: Retry khi API lỗi

```javascript
function* fetchWithRetry() {
  for (let i = 0; i < 3; i++) {
    try {
      const data = yield call(api.get, "/orders");
      return data;
    } catch (error) {
      if (i < 2) {
        yield delay(1000); // Chờ 1s rồi retry
      } else {
        throw error;
      }
    }
  }
}
```

---

## 📖 14. TÀI LIỆU THAM KHẢO

- **Redux**: https://redux.js.org/
- **Redux Saga**: https://redux-saga.js.org/
- **React Redux**: https://react-redux.js.org/
- **Generator Functions**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*

---

## 🎯 15. QUICK REFERENCE

### Khi nào dùng gì?

| Tình huống                       | Dùng gì                                   |
| -------------------------------- | ----------------------------------------- |
| Cần gọi API                      | Redux Saga                                |
| Cần lưu data toàn app            | Redux Store                               |
| Cần lưu data local (1 component) | useState                                  |
| Cần memoize function             | useCallback                               |
| Cần memoize value                | useMemo                                   |
| Side effects (mount, update)     | useEffect                                 |
| Lấy state từ Redux               | useSelector                               |
| Dispatch action                  | useDispatch                               |
| Xử lý form input                 | useState + onChange                       |
| Debounce search                  | Saga debounce hoặc useEffect + setTimeout |

---

🎉 **HẾT! Chúc bạn code vui vẻ!** 🚀
