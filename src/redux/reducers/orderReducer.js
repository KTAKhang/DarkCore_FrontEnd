import {
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAILED,
  ORDER_DETAIL_REQUEST,
  ORDER_DETAIL_SUCCESS,
  ORDER_DETAIL_FAILURE,
  ORDER_DETAIL_FAILED,
  ORDER_UPDATE_STATUS_REQUEST,
  ORDER_UPDATE_STATUS_SUCCESS,
  ORDER_UPDATE_STATUS_FAILURE,
  ORDER_UPDATE_STATUS_FAILED,
  ORDER_STATS_REQUEST,
  ORDER_STATS_SUCCESS,
  ORDER_STATS_FAILED,
  ORDER_STATUSES_REQUEST,
  ORDER_STATUSES_SUCCESS,
  ORDER_STATUSES_FAILURE,
  ORDER_STATUSES_FAILED,
  ORDER_HISTORY_REQUEST,
  ORDER_HISTORY_SUCCESS,
  ORDER_HISTORY_FAILURE,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAILURE,
  ORDER_CREATE_FAILED,
  ORDER_CANCEL_REQUEST,
  ORDER_CANCEL_SUCCESS,
  ORDER_CANCEL_FAILURE,
  ORDER_CLEAR_MESSAGES,
} from "../actions/orderActions";

const initialState = {
  items: [],
  currentOrder: null,
  history: [], // 🆕 Lịch sử đơn hàng của customer
  stats: {
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    returned: 0,
  },
  statuses: [],
  pagination: {
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  historyPagination: { // 🆕 Pagination cho history
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loadingList: false,
  loadingDetail: false,
  loadingStats: false,
  loadingStatuses: false,
  loadingHistory: false, // 🆕
  creating: false, // 🆕
  updating: false,
  error: null,
  success: null,
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    // Order List
    case ORDER_LIST_REQUEST:
      return {
        ...state,
        loadingList: true,
        error: null,
      };

    case ORDER_LIST_SUCCESS:
      return {
        ...state,
        loadingList: false,
        items: action.payload.data || [],
        pagination: action.payload.pagination || state.pagination,
        error: null,
      };

    case ORDER_LIST_FAILED:
      return {
        ...state,
        loadingList: false,
        error: action.payload,
      };

    // Order Detail
    case ORDER_DETAIL_REQUEST:
      return {
        ...state,
        loadingDetail: true,
        error: null,
      };

    case ORDER_DETAIL_SUCCESS: {
      // Map customer information from userId if needed
      const orderDetail = action.payload;
      const mappedOrder = {
        ...orderDetail,
        // Ensure customer object exists for consistent access
        customer: orderDetail.customer || {
          _id: orderDetail.userId?._id,
          name: orderDetail.userId?.user_name,
          email: orderDetail.userId?.email,
          phone: orderDetail.userId?.phone
        },
        // Map receiver info if not already present
        receiverName: orderDetail.receiverName || orderDetail.userId?.user_name,
        receiverPhone: orderDetail.receiverPhone,
        receiverAddress: orderDetail.receiverAddress,
        // Map customerEmail/Name/Phone for compatibility
        customerName: orderDetail.customerName || orderDetail.userId?.user_name || "N/A",
        customerEmail: orderDetail.customerEmail || orderDetail.userId?.email || "N/A",
        customerPhone: orderDetail.customerPhone || orderDetail.userId?.phone || "N/A",
      };
      
      return {
        ...state,
        loadingDetail: false,
        currentOrder: mappedOrder,
        error: null,
      };
    }

    case ORDER_DETAIL_FAILURE:
    case ORDER_DETAIL_FAILED:
      return {
        ...state,
        loadingDetail: false,
        error: action.payload,
      };

    // Update Order Status
    case ORDER_UPDATE_STATUS_REQUEST:
      return {
        ...state,
        updating: true,
        error: null,
      };

    case ORDER_UPDATE_STATUS_SUCCESS: {
      const updatedOrder = action.payload;
      const updatedItems = state.items.map(item =>
        item._id === updatedOrder._id ? updatedOrder : item
      );
      
      return {
        ...state,
        updating: false,
        items: updatedItems,
        currentOrder: state.currentOrder?._id === updatedOrder._id ? updatedOrder : state.currentOrder,
        success: "Trạng thái đơn hàng đã được cập nhật thành công",
        error: null,
      };
    }

    case ORDER_UPDATE_STATUS_FAILURE:
    case ORDER_UPDATE_STATUS_FAILED:
      return {
        ...state,
        updating: false,
        error: action.payload,
      };

    // Order Stats
    case ORDER_STATS_REQUEST:
      return {
        ...state,
        loadingStats: true,
        error: null,
      };

    case ORDER_STATS_SUCCESS:
      return {
        ...state,
        loadingStats: false,
        stats: action.payload,
        error: null,
      };

    case ORDER_STATS_FAILED:
      return {
        ...state,
        loadingStats: false,
        error: action.payload,
      };

    // Order Statuses
    case ORDER_STATUSES_REQUEST:
      return {
        ...state,
        loadingStatuses: true,
        error: null,
      };

    case ORDER_STATUSES_SUCCESS:
      return {
        ...state,
        loadingStatuses: false,
        statuses: action.payload,
        error: null,
      };

    case ORDER_STATUSES_FAILURE:
    case ORDER_STATUSES_FAILED:
      return {
        ...state,
        loadingStatuses: false,
        error: action.payload,
      };

    // Order History
    case ORDER_HISTORY_REQUEST:
      return {
        ...state,
        loadingHistory: true,
        error: null,
      };

    case ORDER_HISTORY_SUCCESS:
      return {
        ...state,
        loadingHistory: false,
        history: action.payload.data || [],
        historyPagination: action.payload.pagination || state.historyPagination,
        error: null,
      };

    case ORDER_HISTORY_FAILURE:
      return {
        ...state,
        loadingHistory: false,
        error: action.payload,
      };

    // Create Order
    case ORDER_CREATE_REQUEST:
      return {
        ...state,
        creating: true,
        error: null,
      };

    case ORDER_CREATE_SUCCESS:
      return {
        ...state,
        creating: false,
        currentOrder: action.payload,
        success: "Đơn hàng đã được tạo thành công",
        error: null,
      };

    case ORDER_CREATE_FAILURE:
    case ORDER_CREATE_FAILED:
      return {
        ...state,
        creating: false,
        error: action.payload,
      };

    // Cancel Order
    case ORDER_CANCEL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ORDER_CANCEL_SUCCESS:
      return {
        ...state,
        loading: false,
        currentOrder: action.payload,
        // Update order in history if exists
        history: state.history.map(order =>
          order._id === action.payload._id ? action.payload : order
        ),
        success: "Đơn hàng đã được hủy thành công",
        error: null,
      };

    case ORDER_CANCEL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Clear Messages
    case ORDER_CLEAR_MESSAGES:
      return {
        ...state,
        error: null,
        success: null,
      };

    default:
      return state;
  }
};

export default orderReducer;
