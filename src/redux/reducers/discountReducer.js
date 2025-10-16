import {
  DISCOUNT_LIST_REQUEST,
  DISCOUNT_LIST_SUCCESS,
  DISCOUNT_LIST_FAILED,
  DISCOUNT_DETAIL_REQUEST,
  DISCOUNT_DETAIL_SUCCESS,
  DISCOUNT_DETAIL_FAILED,
  DISCOUNT_CREATE_REQUEST,
  DISCOUNT_CREATE_SUCCESS,
  DISCOUNT_CREATE_FAILED,
  DISCOUNT_UPDATE_REQUEST,
  DISCOUNT_UPDATE_SUCCESS,
  DISCOUNT_UPDATE_FAILED,
  DISCOUNT_DEACTIVATE_REQUEST,
  DISCOUNT_DEACTIVATE_SUCCESS,
  DISCOUNT_DEACTIVATE_FAILED,
  DISCOUNT_APPLY_REQUEST,
  DISCOUNT_APPLY_SUCCESS,
  DISCOUNT_APPLY_FAILED,
  DISCOUNT_ACTIVE_REQUEST,
  DISCOUNT_ACTIVE_SUCCESS,
  DISCOUNT_ACTIVE_FAILED,
  DISCOUNT_CLEAR_MESSAGES,
  DISCOUNT_SET_APPLIED,
  DISCOUNT_CLEAR_APPLIED,
} from "@/redux/actions/discountActions";

const initialState = {
  items: [],
  activeItems: [],
  currentDiscount: null,
  appliedDiscount: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loadingList: false,
  loadingDetail: false,
  loadingActive: false,
  creating: false,
  updating: false,
  deactivating: false,
  applying: false,
  error: null,
  success: null,
};

const discountReducer = (state = initialState, action) => {
  switch (action.type) {
    // Discount List
    case DISCOUNT_LIST_REQUEST:
      return {
        ...state,
        loadingList: true,
        error: null,
      };

    case DISCOUNT_LIST_SUCCESS:
      return {
        ...state,
        loadingList: false,
        items: action.payload.data || [],
        pagination: action.payload.pagination || state.pagination,
        error: null,
      };

    case DISCOUNT_LIST_FAILED:
      return {
        ...state,
        loadingList: false,
        error: action.payload,
      };

    // Discount Detail
    case DISCOUNT_DETAIL_REQUEST:
      return {
        ...state,
        loadingDetail: true,
        error: null,
      };

    case DISCOUNT_DETAIL_SUCCESS:
      return {
        ...state,
        loadingDetail: false,
        currentDiscount: action.payload,
        error: null,
      };

    case DISCOUNT_DETAIL_FAILED:
      return {
        ...state,
        loadingDetail: false,
        error: action.payload,
      };

    // Create Discount
    case DISCOUNT_CREATE_REQUEST:
      return {
        ...state,
        creating: true,
        error: null,
      };

    case DISCOUNT_CREATE_SUCCESS:
      return {
        ...state,
        creating: false,
        items: [action.payload, ...state.items],
        success: "Mã giảm giá đã được tạo thành công",
        error: null,
      };

    case DISCOUNT_CREATE_FAILED:
      return {
        ...state,
        creating: false,
        error: action.payload,
      };

    // Update Discount
    case DISCOUNT_UPDATE_REQUEST:
      return {
        ...state,
        updating: true,
        error: null,
      };

    case DISCOUNT_UPDATE_SUCCESS: {
      const updatedDiscount = action.payload;
      const updatedItems = state.items.map(item =>
        item._id === updatedDiscount._id ? updatedDiscount : item
      );
      
      return {
        ...state,
        updating: false,
        items: updatedItems,
        currentDiscount: state.currentDiscount?._id === updatedDiscount._id ? updatedDiscount : state.currentDiscount,
        success: "Mã giảm giá đã được cập nhật thành công",
        error: null,
      };
    }

    case DISCOUNT_UPDATE_FAILED:
      return {
        ...state,
        updating: false,
        error: action.payload,
      };

    // Deactivate Discount
    case DISCOUNT_DEACTIVATE_REQUEST:
      return {
        ...state,
        deactivating: true,
        error: null,
      };

    case DISCOUNT_DEACTIVATE_SUCCESS: {
      const deactivatedDiscount = action.payload;
      const updatedItems = state.items.map(item =>
        item._id === deactivatedDiscount._id ? deactivatedDiscount : item
      );
      
      return {
        ...state,
        deactivating: false,
        items: updatedItems,
        currentDiscount: state.currentDiscount?._id === deactivatedDiscount._id ? deactivatedDiscount : state.currentDiscount,
        success: "Mã giảm giá đã được vô hiệu hóa",
        error: null,
      };
    }

    case DISCOUNT_DEACTIVATE_FAILED:
      return {
        ...state,
        deactivating: false,
        error: action.payload,
      };

    // Apply Discount
    case DISCOUNT_APPLY_REQUEST:
      return {
        ...state,
        applying: true,
        error: null,
      };

    case DISCOUNT_APPLY_SUCCESS:
      return {
        ...state,
        applying: false,
        appliedDiscount: action.payload,
        success: "Mã giảm giá đã được áp dụng thành công",
        error: null,
      };

    case DISCOUNT_APPLY_FAILED:
      return {
        ...state,
        applying: false,
        error: action.payload,
      };

    // Active Discounts
    case DISCOUNT_ACTIVE_REQUEST:
      return {
        ...state,
        loadingActive: true,
        error: null,
      };

    case DISCOUNT_ACTIVE_SUCCESS:
      return {
        ...state,
        loadingActive: false,
        activeItems: action.payload || [],
        error: null,
      };

    case DISCOUNT_ACTIVE_FAILED:
      return {
        ...state,
        loadingActive: false,
        error: action.payload,
      };

    // Set Applied Discount
    case DISCOUNT_SET_APPLIED:
      return {
        ...state,
        appliedDiscount: action.payload,
      };

    // Clear Applied Discount
    case DISCOUNT_CLEAR_APPLIED:
      return {
        ...state,
        appliedDiscount: null,
      };

    // Clear Messages
    case DISCOUNT_CLEAR_MESSAGES:
      return {
        ...state,
        error: null,
        success: null,
      };

    default:
      return state;
  }
};

export default discountReducer;
