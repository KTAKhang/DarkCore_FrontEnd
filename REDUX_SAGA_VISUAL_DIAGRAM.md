# 📊 SƠ ĐỒ TRỰC QUAN - REDUX SAGA FLOW

## 🎯 Luồng tổng quan (Order List Feature)

```mermaid
sequenceDiagram
    participant User
    participant Component as OrderManagement.jsx
    participant Actions as orderActions.js
    participant Store as Redux Store
    participant Saga as orderSaga.js
    participant API as Backend API
    participant Reducer as orderReducer.js

    Note over User,Reducer: 1️⃣ COMPONENT MOUNT - Khởi tạo
    User->>Component: Mở trang /order-management
    Component->>Component: useEffect() chạy
    Component->>Actions: orderListRequest({ page: 1 })

    Note over User,Reducer: 2️⃣ DISPATCH ACTION - Gửi yêu cầu
    Actions->>Store: dispatch({ type: 'ORDER_LIST_REQUEST', payload: {...} })

    Note over User,Reducer: 3️⃣ REDUCER CẬP NHẬT STATE (loadingList = true)
    Store->>Reducer: action ORDER_LIST_REQUEST
    Reducer->>Reducer: return { ...state, loadingList: true }
    Reducer->>Store: State mới
    Store->>Component: Subscribe notification
    Component->>Component: Re-render với loadingList=true
    Component->>User: Hiển thị Loading Spinner

    Note over User,Reducer: 4️⃣ SAGA XỬ LÝ - Gọi API
    Store->>Saga: Saga Middleware bắt action
    Saga->>Saga: fetchOrdersSaga(action) chạy
    Saga->>API: GET /order/orders?page=1&limit=5

    Note over User,Reducer: 5️⃣ CHỜ RESPONSE
    API-->>Saga: Response { status: "OK", data: [...], pagination: {...} }

    Note over User,Reducer: 6️⃣ SAGA DISPATCH SUCCESS
    Saga->>Actions: orderListSuccess(data, pagination)
    Actions->>Store: dispatch({ type: 'ORDER_LIST_SUCCESS', payload: {...} })

    Note over User,Reducer: 7️⃣ REDUCER CẬP NHẬT STATE (items = data)
    Store->>Reducer: action ORDER_LIST_SUCCESS
    Reducer->>Reducer: return { loadingList: false, items: data }
    Reducer->>Store: State mới

    Note over User,Reducer: 8️⃣ COMPONENT RE-RENDER - Hiển thị data
    Store->>Component: Subscribe notification
    Component->>Component: Re-render với items=[...10 orders]
    Component->>User: Hiển thị Table với 10 đơn hàng ✅
```

---

## 🔄 Vòng đời Redux Saga Flow

```mermaid
graph TB
    Start([User Action<br/>Click, Search, Filter...]) --> Dispatch[Component<br/>dispatch orderListRequest]

    Dispatch --> Store{Redux Store<br/>Nhận Action}

    Store --> Reducer1[Reducer xử lý<br/>ORDER_LIST_REQUEST<br/>loadingList = true]
    Store --> Saga1[Saga Middleware<br/>bắt action]

    Reducer1 --> Update1[Cập nhật State<br/>trong Store]
    Update1 --> Rerender1[Component re-render<br/>Hiển thị Loading]

    Saga1 --> CallAPI[fetchOrdersSaga<br/>gọi API]
    CallAPI --> Wait[Chờ response<br/>từ Backend]

    Wait --> Success{Response<br/>thành công?}

    Success -->|YES| DispatchSuccess[Saga dispatch<br/>ORDER_LIST_SUCCESS]
    Success -->|NO| DispatchFailed[Saga dispatch<br/>ORDER_LIST_FAILED]

    DispatchSuccess --> Reducer2[Reducer xử lý<br/>ORDER_LIST_SUCCESS<br/>items = data]
    DispatchFailed --> Reducer3[Reducer xử lý<br/>ORDER_LIST_FAILED<br/>error = message]

    Reducer2 --> Update2[Cập nhật State<br/>loadingList = false]
    Reducer3 --> Update3[Cập nhật State<br/>loadingList = false]

    Update2 --> Rerender2[Component re-render<br/>Hiển thị Data]
    Update3 --> Rerender3[Component re-render<br/>Hiển thị Error]

    Rerender2 --> End([User thấy<br/>Danh sách đơn hàng])
    Rerender3 --> End

    style Start fill:#e1f5ff
    style Dispatch fill:#fff9c4
    style Store fill:#f3e5f5
    style Saga1 fill:#e8f5e9
    style CallAPI fill:#e8f5e9
    style Success fill:#fff3e0
    style Reducer2 fill:#fce4ec
    style End fill:#e1f5ff
```

---

## 📦 Kiến trúc Redux Store

```mermaid
graph LR
    subgraph "Redux Store (store.js)"
        RootReducer[Root Reducer<br/>combineReducers]

        subgraph "State Tree"
            OrderState[order: {...}]
            ProductState[product: {...}]
            CartState[cart: {...}]
            AuthState[auth: {...}]
        end

        SagaMiddleware[Saga Middleware]

        subgraph "Root Saga"
            OrderSaga[orderSaga]
            ProductSaga[productSaga]
            CartSaga[cartSaga]
            AuthSaga[authSaga]
        end
    end

    RootReducer --> OrderState
    RootReducer --> ProductState
    RootReducer --> CartState
    RootReducer --> AuthState

    SagaMiddleware --> OrderSaga
    SagaMiddleware --> ProductSaga
    SagaMiddleware --> CartSaga
    SagaMiddleware --> AuthSaga

    style RootReducer fill:#f3e5f5
    style SagaMiddleware fill:#e8f5e9
    style OrderState fill:#fff9c4
    style OrderSaga fill:#e1f5ff
```

---

## 🎭 Chi tiết Order State Structure

```mermaid
graph TB
    subgraph "Redux Store"
        State[state]
    end

    State --> Order[order]
    State --> Product[product]
    State --> Cart[cart]

    Order --> Items[items: Array<br/>Danh sách đơn hàng]
    Order --> CurrentOrder[currentOrder: Object<br/>Đơn hàng đang xem]
    Order --> Stats[stats: Object<br/>Thống kê đơn hàng]
    Order --> Pagination[pagination: Object<br/>Phân trang]
    Order --> Loading[loadingList: Boolean<br/>Trạng thái loading]
    Order --> Error[error: String<br/>Thông báo lỗi]

    Items --> Item1[Order 1]
    Items --> Item2[Order 2]
    Items --> Item3[...]

    Stats --> Total[total: 100]
    Stats --> Pending[pending: 20]
    Stats --> Delivered[delivered: 50]

    Pagination --> Page[page: 1]
    Pagination --> Limit[limit: 5]
    Pagination --> TotalPages[totalPages: 20]

    style Order fill:#fff9c4
    style Items fill:#e1f5ff
    style Stats fill:#f3e5f5
    style Loading fill:#e8f5e9
```

---

## 🚀 Timeline thực tế (milliseconds)

```mermaid
gantt
    title Redux Saga Order List Timeline
    dateFormat X
    axisFormat %L ms

    section Component
    Mount & Render          :0, 10
    Dispatch Action         :10, 20
    Re-render (Loading ON)  :30, 40
    Re-render (Show Data)   :330, 350

    section Redux
    Receive Action          :20, 30
    State Update (REQUEST)  :20, 30
    State Update (SUCCESS)  :320, 330

    section Saga
    Catch Action            :20, 40
    Call API                :40, 300
    Dispatch SUCCESS        :310, 320

    section Backend
    Receive Request         :50, 100
    Process Data            :100, 250
    Send Response           :250, 300
```

---

## 🔍 Chi tiết fetchOrdersSaga Flow

```mermaid
flowchart TD
    Start([Action ORDER_LIST_REQUEST<br/>được dispatch]) --> Saga[orderSaga.js<br/>takeEvery bắt action]

    Saga --> Run[Chạy function*<br/>fetchOrdersSaga action]

    Run --> Try{Try Block}

    Try --> CallAPI[yield call fetchOrdersApi<br/>action.payload]

    CallAPI --> HTTP[apiClient.get<br/>/order/orders<br/>params: page, limit, status...]

    HTTP --> Backend[(Backend<br/>API Server)]

    Backend --> Response{Response}

    Response -->|Status OK| ExtractData[Lấy data và pagination<br/>từ response]
    Response -->|Status Error| ErrorMsg[Lấy error message]

    ExtractData --> PutSuccess[yield put<br/>orderListSuccess<br/>data, pagination]

    ErrorMsg --> PutFailed1[yield put<br/>orderListFailed<br/>message]

    Try -->|Catch Error| CatchBlock[Catch Block]
    CatchBlock --> ParseError[Parse error message]
    ParseError --> PutFailed2[yield put<br/>orderListFailed<br/>errorMessage]

    PutSuccess --> ToReducer[Action gửi đến<br/>Reducer]
    PutFailed1 --> ToReducer
    PutFailed2 --> ToReducer

    ToReducer --> End([Reducer cập nhật State])

    style Start fill:#e1f5ff
    style Saga fill:#e8f5e9
    style HTTP fill:#fff9c4
    style Backend fill:#f3e5f5
    style PutSuccess fill:#c8e6c9
    style PutFailed1 fill:#ffcdd2
    style PutFailed2 fill:#ffcdd2
    style End fill:#e1f5ff
```

---

## 🎯 Action Types Pattern

```mermaid
graph LR
    subgraph "Action Pattern cho mọi tính năng"
        Request[ACTION_REQUEST<br/>Component dispatch<br/>Bắt đầu quá trình]
        Success[ACTION_SUCCESS<br/>Saga dispatch<br/>API thành công]
        Failed[ACTION_FAILED<br/>Saga dispatch<br/>API thất bại]
    end

    Request --> API{API Call}
    API -->|200 OK| Success
    API -->|Error| Failed

    style Request fill:#fff9c4
    style Success fill:#c8e6c9
    style Failed fill:#ffcdd2
```

### Ví dụ cụ thể:

| Tính năng       | REQUEST                       | SUCCESS                       | FAILED                       |
| --------------- | ----------------------------- | ----------------------------- | ---------------------------- |
| Lấy danh sách   | `ORDER_LIST_REQUEST`          | `ORDER_LIST_SUCCESS`          | `ORDER_LIST_FAILED`          |
| Xem chi tiết    | `ORDER_DETAIL_REQUEST`        | `ORDER_DETAIL_SUCCESS`        | `ORDER_DETAIL_FAILED`        |
| Cập nhật status | `ORDER_UPDATE_STATUS_REQUEST` | `ORDER_UPDATE_STATUS_SUCCESS` | `ORDER_UPDATE_STATUS_FAILED` |
| Lấy thống kê    | `ORDER_STATS_REQUEST`         | `ORDER_STATS_SUCCESS`         | `ORDER_STATS_FAILED`         |

---

## 🔧 Component ↔️ Redux Communication

```mermaid
sequenceDiagram
    participant C as Component<br/>(OrderManagement)
    participant R as Redux Store

    Note over C,R: 🔵 Component → Redux (Gửi)
    C->>R: dispatch(orderListRequest())
    C->>R: dispatch(orderStatsRequest())
    C->>R: dispatch(orderUpdateStatusRequest())

    Note over C,R: 🟢 Redux → Component (Nhận)
    R-->>C: useSelector(state => state.order.items)
    R-->>C: useSelector(state => state.order.loadingList)
    R-->>C: useSelector(state => state.order.error)

    Note over C,R: 🔄 Vòng lặp tương tác
    C->>R: User click Search
    R-->>C: State thay đổi → Re-render
```

---

## 📱 Component Lifecycle với Redux

```mermaid
stateDiagram-v2
    [*] --> ComponentMount: User mở trang

    ComponentMount --> SubscribeStore: useSelector() setup
    ComponentMount --> DispatchInitial: useEffect() dispatch actions

    DispatchInitial --> LoadingState: Reducer set loadingList=true
    LoadingState --> ShowSpinner: Component render với loading

    ShowSpinner --> SagaCallAPI: Saga gọi API
    SagaCallAPI --> WaitResponse: Chờ Backend

    WaitResponse --> SuccessState: API Success
    WaitResponse --> ErrorState: API Error

    SuccessState --> UpdateStore: Reducer update items
    ErrorState --> UpdateStore: Reducer update error

    UpdateStore --> Rerender: State thay đổi
    Rerender --> ShowData: Component hiển thị data

    ShowData --> UserInteraction: User thao tác (search, filter...)
    UserInteraction --> DispatchAction: dispatch action mới
    DispatchAction --> LoadingState: Vòng lặp lại

    ShowData --> ComponentUnmount: User rời trang
    ComponentUnmount --> [*]
```

---

## 🎨 Data Flow trong Component

```mermaid
graph TB
    subgraph "OrderManagement Component"
        Render[Render Function]

        subgraph "React Hooks"
            UseSelector[useSelector<br/>Lấy state từ Redux]
            UseDispatch[useDispatch<br/>Lấy dispatch function]
            UseEffect[useEffect<br/>Side effects]
            UseState[useState<br/>Local state]
            UseCallback[useCallback<br/>Memoize functions]
        end

        subgraph "UI Elements"
            Table[Table<br/>Hiển thị orders]
            Filters[Input/Select<br/>Search & Filter]
            Stats[Statistics Cards<br/>Thống kê]
            Modals[Modals<br/>View/Edit]
        end

        subgraph "Event Handlers"
            HandleRefresh[handleRefresh]
            HandleSearch[handleSearch]
            HandleFilter[handleFilter]
            HandlePageChange[handlePageChange]
        end
    end

    UseSelector -->|items, loading, error| Render
    UseDispatch -->|dispatch| HandleRefresh
    UseEffect -->|dispatch initial| UseDispatch

    Render --> Table
    Render --> Filters
    Render --> Stats
    Render --> Modals

    Filters -->|onChange| HandleSearch
    Stats -->|onClick| HandleFilter
    Table -->|onPageChange| HandlePageChange

    HandleRefresh -->|dispatch action| Redux[(Redux Store)]
    HandleSearch -->|dispatch action| Redux
    HandleFilter -->|dispatch action| Redux
    HandlePageChange -->|dispatch action| Redux

    Redux -->|state changed| UseSelector

    style UseSelector fill:#e1f5ff
    style UseDispatch fill:#e8f5e9
    style Redux fill:#fff9c4
    style Table fill:#f3e5f5
```

---

## 🎓 So sánh Redux vs Redux Saga

### ❌ Không dùng Redux Saga (Redux thuần):

```mermaid
sequenceDiagram
    participant Component
    participant Redux
    participant API

    Note over Component,API: ⚠️ Component phải tự gọi API
    Component->>API: fetch('/api/orders')
    API-->>Component: response
    Component->>Redux: dispatch(setOrders(data))

    Note over Component,API: ❌ Vấn đề: Logic API lẫn trong Component
```

### ✅ Dùng Redux Saga (Tách biệt):

```mermaid
sequenceDiagram
    participant Component
    participant Redux
    participant Saga
    participant API

    Note over Component,API: ✅ Component chỉ dispatch action
    Component->>Redux: dispatch(orderListRequest())
    Redux->>Saga: Saga bắt action
    Saga->>API: API call
    API-->>Saga: response
    Saga->>Redux: dispatch(orderListSuccess(data))
    Redux-->>Component: state updated

    Note over Component,API: ✅ Logic API tách riêng, dễ test và maintain
```

---

## 📊 State Flow với nhiều actions

```mermaid
graph TB
    Initial[Initial State<br/>items: []<br/>loadingList: false<br/>error: null]

    Initial -->|dispatch REQUEST| Loading[State khi loading<br/>items: []<br/>loadingList: true<br/>error: null]

    Loading -->|dispatch SUCCESS| Success[State khi thành công<br/>items: [10 orders]<br/>loadingList: false<br/>error: null]

    Loading -->|dispatch FAILED| Failed[State khi lỗi<br/>items: []<br/>loadingList: false<br/>error: 'Error message']

    Success -->|User search| Loading
    Failed -->|User retry| Loading
    Success -->|User refresh| Loading

    style Initial fill:#e3f2fd
    style Loading fill:#fff9c4
    style Success fill:#c8e6c9
    style Failed fill:#ffcdd2
```

---

## 🎯 Tổng kết Flow hoàn chỉnh

```mermaid
graph TD
    Start([1. App Start<br/>main.jsx]) --> Setup[2. Setup Redux<br/>store.js]

    Setup --> CreateStore[3. Create Store<br/>+ Combine Reducers<br/>+ Saga Middleware]

    CreateStore --> RunSaga[4. Run rootSaga<br/>Lắng nghe tất cả actions]

    RunSaga --> ProvideStore[5. Provider wrap App<br/>Mọi component truy cập Store]

    ProvideStore --> RenderApp[6. Render App<br/>React Router]

    RenderApp --> ComponentMount[7. OrderManagement mount<br/>useEffect chạy]

    ComponentMount --> DispatchAction[8. dispatch<br/>orderListRequest]

    DispatchAction --> ReduxFlow{9. Redux Flow}

    ReduxFlow --> Reducer[Reducer: loadingList=true]
    ReduxFlow --> Saga[Saga: Call API]

    Saga --> API[10. Backend API]
    API --> Response[11. Response]

    Response --> DispatchSuccess[12. dispatch SUCCESS]
    DispatchSuccess --> ReducerUpdate[13. Reducer: items=data]
    ReducerUpdate --> ComponentRerender[14. Component re-render]
    ComponentRerender --> ShowUI[15. User thấy data ✅]

    ShowUI --> UserAction[16. User thao tác]
    UserAction --> DispatchAction

    style Start fill:#e1f5ff
    style CreateStore fill:#f3e5f5
    style DispatchAction fill:#fff9c4
    style Saga fill:#e8f5e9
    style ReducerUpdate fill:#fce4ec
    style ShowUI fill:#c8e6c9
```

---

🎉 **Hy vọng những sơ đồ này giúp bạn hình dung rõ hơn về luồng Redux Saga!**
