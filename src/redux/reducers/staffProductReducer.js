// src/redux/reducers/staffProductReducer.js
import {
  STAFF_PRODUCT_LIST_REQUEST,
  STAFF_PRODUCT_LIST_SUCCESS,
  STAFF_PRODUCT_LIST_FAILURE,
  STAFF_PRODUCT_DETAIL_REQUEST,
  STAFF_PRODUCT_DETAIL_SUCCESS,
  STAFF_PRODUCT_DETAIL_FAILURE,
  STAFF_PRODUCT_CREATE_REQUEST,
  STAFF_PRODUCT_CREATE_SUCCESS,
  STAFF_PRODUCT_CREATE_FAILURE,
  STAFF_PRODUCT_UPDATE_REQUEST,
  STAFF_PRODUCT_UPDATE_SUCCESS,
  STAFF_PRODUCT_UPDATE_FAILURE,
  STAFF_PRODUCT_DELETE_REQUEST,
  STAFF_PRODUCT_DELETE_SUCCESS,
  STAFF_PRODUCT_DELETE_FAILURE,
  STAFF_PRODUCT_STATS_REQUEST,
  STAFF_PRODUCT_STATS_SUCCESS,
  STAFF_PRODUCT_STATS_FAILURE,
  STAFF_PRODUCT_CLEAR_MESSAGES,
} from "../actions/staffProductActions";

const initialState = {
  items: [],
  item: null,
  stats: { total: 0, visible: 0, hidden: 0 },
  pagination: { page: 1, limit: 20, total: 0 },
  loadingList: false,
  loadingDetail: false,
  loadingStats: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  message: null,
};

const staffProductReducer = (state = initialState, action) => {
  switch (action.type) {
    // LIST
    case STAFF_PRODUCT_LIST_REQUEST:
      return { ...state, loadingList: true, error: null };
    case STAFF_PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        loadingList: false,
        items: action.payload.items || [],
        pagination: action.payload.pagination || state.pagination,
        error: null,
      };
    case STAFF_PRODUCT_LIST_FAILURE:
      return { ...state, loadingList: false, error: action.payload };

    // DETAIL
    case STAFF_PRODUCT_DETAIL_REQUEST:
      return { ...state, loadingDetail: true, error: null };
    case STAFF_PRODUCT_DETAIL_SUCCESS:
      return { ...state, loadingDetail: false, item: action.payload, error: null };
    case STAFF_PRODUCT_DETAIL_FAILURE:
      return { ...state, loadingDetail: false, error: action.payload };

    // CREATE
    case STAFF_PRODUCT_CREATE_REQUEST:
      return { ...state, creating: true, message: null, error: null };
    case STAFF_PRODUCT_CREATE_SUCCESS: {
      const raw = action.payload.item;
      const mappedItem = {
        ...raw,
        quantity: raw.stockQuantity,
        category_id: typeof raw.category === "object" ? raw.category._id : raw.category,
        categoryDetail:
          typeof raw.category === "object"
            ? {
                _id: raw.category._id,
                name: raw.category.name,
                status: raw.category.status,
              }
            : null,
        image: raw.images?.[0] || "",
        short_desc: raw.short_desc ?? "",
        detail_desc: raw.detail_desc ?? "",
      };
      return {
        ...state,
        creating: false,
        items: [mappedItem, ...state.items],
        item: mappedItem,
        message: action.payload.message || "Tạo sản phẩm thành công!",
      };
    }
    case STAFF_PRODUCT_CREATE_FAILURE:
      return { ...state, creating: false, error: action.payload };

    // UPDATE
    case STAFF_PRODUCT_UPDATE_REQUEST:
      return { ...state, updating: true, message: null, error: null };
    case STAFF_PRODUCT_UPDATE_SUCCESS: {
      const raw = action.payload.item;
      const mappedUpdatedItem = {
        ...raw,
        quantity: raw.stockQuantity,
        category_id: typeof raw.category === "object" ? raw.category._id : raw.category,
        categoryDetail:
          typeof raw.category === "object"
            ? {
                _id: raw.category._id,
                name: raw.category.name,
                status: raw.category.status,
              }
            : null,
        image: raw.images?.[0] || "",
        short_desc: raw.short_desc ?? "",
        detail_desc: raw.detail_desc ?? "",
      };
      return {
        ...state,
        updating: false,
        items: state.items.map((p) =>
          p._id === mappedUpdatedItem._id ? mappedUpdatedItem : p
        ),
        item: mappedUpdatedItem,
        message: action.payload.message || "Cập nhật sản phẩm thành công!",
      };
    }
    case STAFF_PRODUCT_UPDATE_FAILURE:
      return { ...state, updating: false, error: action.payload };

    // DELETE
    case STAFF_PRODUCT_DELETE_REQUEST:
      return { ...state, deleting: true, message: null, error: null };
    case STAFF_PRODUCT_DELETE_SUCCESS:
      return {
        ...state,
        deleting: false,
        items: state.items.filter((p) => p._id !== action.payload.id),
        message: action.payload.message || "Xóa sản phẩm thành công!",
      };
    case STAFF_PRODUCT_DELETE_FAILURE:
      return { ...state, deleting: false, error: action.payload };

    // STATS
    case STAFF_PRODUCT_STATS_REQUEST:
      return { ...state, loadingStats: true, error: null };
    case STAFF_PRODUCT_STATS_SUCCESS:
      return { ...state, loadingStats: false, stats: action.payload, error: null };
    case STAFF_PRODUCT_STATS_FAILURE:
      return { ...state, loadingStats: false, error: action.payload };

    // CLEAR MESSAGES
    case STAFF_PRODUCT_CLEAR_MESSAGES:
      return { ...state, message: null, error: null };

    default:
      return state;
  }
};

export default staffProductReducer;