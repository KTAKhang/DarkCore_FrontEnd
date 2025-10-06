import {
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAILED,
  ORDER_DETAIL_REQUEST,
  ORDER_DETAIL_SUCCESS,
  ORDER_DETAIL_FAILED,
  ORDER_UPDATE_STATUS_REQUEST,
  ORDER_UPDATE_STATUS_SUCCESS,
  ORDER_UPDATE_STATUS_FAILED,
  ORDER_STATS_REQUEST,
  ORDER_STATS_SUCCESS,
  ORDER_STATS_FAILED,
  ORDER_STATUSES_REQUEST,
  ORDER_STATUSES_SUCCESS,
  ORDER_STATUSES_FAILED,
  ORDER_CLEAR_MESSAGES,
} from "../actions/orderActions";

const initialState = {
  items: [],
  currentOrder: null,
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
  loadingList: false,
  loadingDetail: false,
  loadingStats: false,
  loadingStatuses: false,
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

    case ORDER_DETAIL_SUCCESS:
      return {
        ...state,
        loadingDetail: false,
        currentOrder: action.payload,
        error: null,
      };

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

    case ORDER_STATUSES_FAILED:
      return {
        ...state,
        loadingStatuses: false,
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
