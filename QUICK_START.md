# ⚡ REDUX SAGA QUICK START

> Tóm tắt siêu ngắn gọn - Đọc trong 5 phút để hiểu cơ bản về Redux Saga

---

## 🎯 REDUX SAGA LÀ GÌ?

**Redux Saga** = Middleware để xử lý **API calls** và **async operations** trong React/Redux app.

**Tại sao cần?**

- ✅ Tách logic API ra khỏi Component
- ✅ Component chỉ lo UI, Saga lo API
- ✅ Dễ test, dễ maintain

---

## 🔄 LUỒNG HOẠT ĐỘNG (5 BƯỚC)

```
1. COMPONENT          2. ACTIONS         3. SAGA           4. REDUCER        5. COMPONENT
   dispatch     →     Request      →     Call API    →    Update State  →   Re-render
   action             type               Handle            with data         show data
                                        response
```

### Chi tiết:

**Bước 1: Component dispatch action**

```javascript
dispatch(orderListRequest({ page: 1 }));
```

**Bước 2: Action creator tạo action object**

```javascript
{
  type: "ORDER_LIST_REQUEST",
  payload: { page: 1 }
}
```

**Bước 3: Saga bắt action → gọi API**

```javascript
function* fetchOrdersSaga(action) {
  const response = yield call(api.get, "/orders", action.payload);
  yield put(orderListSuccess(response.data)); // Dispatch SUCCESS
}
```

**Bước 4: Reducer nhận SUCCESS → cập nhật state**

```javascript
case ORDER_LIST_SUCCESS:
  return { ...state, items: action.payload.data };
```

**Bước 5: Component nhận state mới → re-render**

```javascript
const { items } = useSelector((state) => state.order);
// items thay đổi → Component tự động re-render
```

---

## 📦 CẤU TRÚC FILE

```
src/redux/
├── actions/orderActions.js      ← Định nghĩa action types & creators
├── sagas/orderSaga.js           ← Xử lý API calls
├── reducers/orderReducer.js     ← Quản lý state
└── store.js                     ← Setup Redux Store
```

---

## 💻 CODE MẪU

### 1. Actions (orderActions.js)

```javascript
// Action Types
export const ORDER_LIST_REQUEST = "ORDER_LIST_REQUEST";
export const ORDER_LIST_SUCCESS = "ORDER_LIST_SUCCESS";
export const ORDER_LIST_FAILED = "ORDER_LIST_FAILED";

// Action Creators
export const orderListRequest = (query) => ({
  type: ORDER_LIST_REQUEST,
  payload: query,
});
```

### 2. Saga (orderSaga.js)

```javascript
function* fetchOrdersSaga(action) {
  try {
    const response = yield call(api.get, "/orders", { params: action.payload });
    yield put(orderListSuccess(response.data));
  } catch (error) {
    yield put(orderListFailed(error.message));
  }
}

export default function* orderSaga() {
  yield takeEvery(ORDER_LIST_REQUEST, fetchOrdersSaga);
}
```

### 3. Reducer (orderReducer.js)

```javascript
const initialState = { items: [], loading: false };

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ORDER_LIST_REQUEST:
      return { ...state, loading: true };
    case ORDER_LIST_SUCCESS:
      return { ...state, loading: false, items: action.payload.data };
    case ORDER_LIST_FAILED:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
```

### 4. Component (OrderManagement.jsx)

```javascript
const OrderManagement = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(orderListRequest({ page: 1 }));
  }, []);

  return (
    <Spin spinning={loading}>
      <Table dataSource={items} />
    </Spin>
  );
};
```

---

## 🔑 KEYWORDS QUAN TRỌNG

| Keyword          | Giải thích                   | Ví dụ                               |
| ---------------- | ---------------------------- | ----------------------------------- |
| `dispatch()`     | Gửi action vào Redux         | `dispatch(orderListRequest())`      |
| `useSelector()`  | Lấy state từ Redux           | `useSelector(s => s.order.items)`   |
| `yield`          | Pause function, chờ kết quả  | `yield call(api)`                   |
| `call(fn, args)` | Gọi function (API)           | `yield call(api.get, '/orders')`    |
| `put(action)`    | Dispatch action (trong Saga) | `yield put(orderListSuccess(data))` |
| `takeEvery()`    | Lắng nghe mọi action         | `yield takeEvery(REQUEST, saga)`    |

---

## 🎨 PATTERN: 3 ACTIONS

Mọi tính năng đều có 3 actions:

```
REQUEST  →  Component dispatch khi bắt đầu
   ↓
SUCCESS  →  Saga dispatch khi API thành công
   ↓
FAILED   →  Saga dispatch khi API lỗi
```

**Ví dụ:**

- `ORDER_LIST_REQUEST` → Bật loading
- `ORDER_LIST_SUCCESS` → Lưu data, tắt loading
- `ORDER_LIST_FAILED` → Lưu error, tắt loading

---

## 🔄 VÒNG LẶP 2 CHIỀU

```
Component ──dispatch(action)──▶ Redux
    ▲                             │
    │                             │
    └──state changed, re-render──┘
```

**Ví dụ cụ thể:**

```javascript
// Component → Redux
dispatch(orderListRequest({ page: 1 }));

// Redux → Component
const { items } = useSelector((state) => state.order);
// items thay đổi → Component tự động re-render
```

---

## ⏱️ TIMELINE THỰC TẾ

```
T=0ms:   User mở trang
T=10ms:  Component mount, dispatch(orderListRequest())
T=20ms:  Reducer: loading=true → Component re-render (show spinner)
T=30ms:  Saga: call API
T=300ms: API response
T=310ms: Saga: dispatch(orderListSuccess(data))
T=320ms: Reducer: items=data, loading=false
T=330ms: Component re-render (show table with data) ✅
```

---

## 🎓 BƯỚC TIẾP THEO

Đã hiểu cơ bản? Hãy đọc tài liệu chi tiết:

1. **[README_REDUX_SAGA_GUIDE.md](./README_REDUX_SAGA_GUIDE.md)** - Lộ trình học đầy đủ
2. **[EXAMPLE_WALKTHROUGH.md](./EXAMPLE_WALKTHROUGH.md)** - Ví dụ từng dòng code
3. **[REDUX_SAGA_CHEATSHEET.md](./REDUX_SAGA_CHEATSHEET.md)** - Tra cứu nhanh

---

## 🛠️ CÔNG CỤ DEBUG

### Console.log

```javascript
console.log("🟢 Component:", action);
console.log("🔵 Saga:", response);
console.log("🟣 Reducer:", state);
```

### Redux DevTools

- Chrome Extension: "Redux DevTools"
- Xem timeline actions
- Xem state trước/sau
- Time-travel debugging

---

## 🎯 TÓM TẮT

**Redux Saga hoạt động như sau:**

1. Component **dispatch action REQUEST**
2. Reducer **bật loading**
3. Saga **bắt action**, **gọi API**
4. API **trả về data**
5. Saga **dispatch action SUCCESS** với data
6. Reducer **lưu data**, **tắt loading**
7. Component **nhận state mới**, **re-render**
8. User **thấy data** ✅

**Vòng lặp:** Component → Saga → API → Reducer → Component

---

🚀 **Bắt đầu học ngay với README_REDUX_SAGA_GUIDE.md!**
