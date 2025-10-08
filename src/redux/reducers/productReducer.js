import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAILURE,
  PRODUCT_DETAIL_REQUEST,
  PRODUCT_DETAIL_SUCCESS,
  PRODUCT_DETAIL_FAILURE,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAILURE,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAILURE,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAILURE,
  PRODUCT_STATS_REQUEST,
  PRODUCT_STATS_SUCCESS,
  PRODUCT_STATS_FAILURE,
  PRODUCT_CLEAR_MESSAGES,
} from "../actions/productActions";

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

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { ...state, loadingList: true, error: null };
    case PRODUCT_LIST_SUCCESS:
      return { 
        ...state, 
        loadingList: false, 
        items: action.payload.items || [], 
        pagination: action.payload.pagination || state.pagination,
        error: null 
      };
    case PRODUCT_LIST_FAILURE:
      return { ...state, loadingList: false, error: action.payload };

    case PRODUCT_DETAIL_REQUEST:
      return { ...state, loadingDetail: true, error: null };
    case PRODUCT_DETAIL_SUCCESS:
      return { ...state, loadingDetail: false, item: action.payload, error: null };
    case PRODUCT_DETAIL_FAILURE:
      return { ...state, loadingDetail: false, error: action.payload };

    case PRODUCT_CREATE_REQUEST:
      return { ...state, creating: true, message: null, error: null };
    case PRODUCT_CREATE_SUCCESS: {
      console.log("=== PRODUCT_CREATE_SUCCESS Debug ===");
      console.log("action.payload:", action.payload);
      console.log("action.payload.item:", action.payload.item);
      console.log("action.payload.item.category:", action.payload.item.category);
      
      // Map backend product data to frontend format (same as ProductManagement.jsx)
      const mappedItem = {
        ...action.payload.item,
        // Map backend fields to frontend expected fields
        quantity: action.payload.item.stockQuantity,
        // Handle category mapping based on whether it's an object or a string ID
        category_id: (() => {
          if (typeof action.payload.item.category === 'object' && action.payload.item.category !== null) {
            return action.payload.item.category._id;
          } else if (typeof action.payload.item.category === 'string') {
            return action.payload.item.category;
          }
          return null;
        })(),
        categoryDetail: (() => {
          let detail = null;
          const currentCategoryId = (() => {
            if (typeof action.payload.item.category === 'object' && action.payload.item.category !== null) {
              return action.payload.item.category._id;
            } else if (typeof action.payload.item.category === 'string') {
              return action.payload.item.category;
            }
            return null;
          })();

          if (typeof action.payload.item.category === 'object' && action.payload.item.category !== null) {
            // Nếu category là một đối tượng đầy đủ
            detail = {
              _id: action.payload.item.category._id,
              name: action.payload.item.category.name,
              status: action.payload.item.category.status,
            };
          } else if (currentCategoryId) {
            // Nếu category chỉ là một chuỗi ID, thử tìm từ các sản phẩm hiện có trong state
            const existingCategoryProduct = state.items.find(p => p.category_id === currentCategoryId && p.categoryDetail?.name);
            if (existingCategoryProduct) {
              detail = existingCategoryProduct.categoryDetail;
            } else {
              // Nếu không tìm thấy, đặt một giá trị tạm thời
              detail = {
                _id: currentCategoryId,
                name: "Đang tải...", // Hoặc "Unknown Category"
                status: "",
              };
            }
          }
          return detail;
        })(),
        image: action.payload.item.images && action.payload.item.images.length > 0 ? action.payload.item.images[0] : "",
        // Map description fields with backend aliases fallback
        short_desc: action.payload.item.short_desc ?? action.payload.item.description ?? "",
        detail_desc: action.payload.item.detail_desc ?? action.payload.item.warrantyDetails ?? "",
      };
      
      console.log("mappedItem:", mappedItem);
      console.log("mappedItem.categoryDetail:", mappedItem.categoryDetail);
      
      return {
        ...state,
        creating: false,
        items: [mappedItem, ...state.items],
        // Removed message - using toast notification instead
      };
    }
    case PRODUCT_CREATE_FAILURE:
      return { ...state, creating: false, error: action.payload };

    case PRODUCT_UPDATE_REQUEST:
      return { ...state, updating: true, message: null, error: null };
    case PRODUCT_UPDATE_SUCCESS: {
      // Map backend product data to frontend format (same as ProductManagement.jsx)
      const mappedUpdatedItem = {
        ...action.payload.item,
        // Map backend fields to frontend expected fields
        quantity: action.payload.item.stockQuantity,
        // Handle category mapping based on whether it's an object or a string ID
        category_id: (() => {
          if (typeof action.payload.item.category === 'object' && action.payload.item.category !== null) {
            return action.payload.item.category._id;
          } else if (typeof action.payload.item.category === 'string') {
            return action.payload.item.category;
          }
          return null;
        })(),
        categoryDetail: (() => {
          let detail = null;
          const currentCategoryId = (() => {
            if (typeof action.payload.item.category === 'object' && action.payload.item.category !== null) {
              return action.payload.item.category._id;
            } else if (typeof action.payload.item.category === 'string') {
              return action.payload.item.category;
            }
            return null;
          })();

          if (typeof action.payload.item.category === 'object' && action.payload.item.category !== null) {
            // Nếu category là một đối tượng đầy đủ
            detail = {
              _id: action.payload.item.category._id,
              name: action.payload.item.category.name,
              status: action.payload.item.category.status,
            };
          } else if (currentCategoryId) {
            // Nếu category chỉ là một chuỗi ID, thử tìm từ các sản phẩm hiện có trong state
            const existingCategoryProduct = state.items.find(p => p.category_id === currentCategoryId && p.categoryDetail?.name);
            if (existingCategoryProduct) {
              detail = existingCategoryProduct.categoryDetail;
            } else {
              // Nếu không tìm thấy, đặt một giá trị tạm thời
              detail = {
                _id: currentCategoryId,
                name: "Đang tải...", // Hoặc "Unknown Category"
                status: "",
              };
            }
          }
          return detail;
        })(),
        image: action.payload.item.images && action.payload.item.images.length > 0 ? action.payload.item.images[0] : "",
        // Map description fields with backend aliases fallback
        short_desc: action.payload.item.short_desc ?? action.payload.item.description ?? "",
        detail_desc: action.payload.item.detail_desc ?? action.payload.item.warrantyDetails ?? "",
      };
      
      return {
        ...state,
        updating: false,
        items: state.items.map((p) => (p._id === mappedUpdatedItem._id ? mappedUpdatedItem : p)),
        item: mappedUpdatedItem,
        // Removed message - using toast notification instead
      };
    }
    case PRODUCT_UPDATE_FAILURE:
      return { ...state, updating: false, error: action.payload };

    case PRODUCT_DELETE_REQUEST:
      return { ...state, deleting: true, message: null, error: null };
    case PRODUCT_DELETE_SUCCESS:
      return {
        ...state,
        deleting: false,
        items: state.items.filter((p) => p._id !== action.payload.id),
        // Removed message - using toast notification instead
      };
    case PRODUCT_DELETE_FAILURE:
      return { ...state, deleting: false, error: action.payload };

    case PRODUCT_STATS_REQUEST:
      return { ...state, loadingStats: true, error: null };
    case PRODUCT_STATS_SUCCESS:
      return { ...state, loadingStats: false, stats: action.payload, error: null };
    case PRODUCT_STATS_FAILURE:
      return { ...state, loadingStats: false, error: action.payload };

    case PRODUCT_CLEAR_MESSAGES:
      return { ...state, message: null, error: null };

    default:
      return state;
  }
};

export default productReducer;
