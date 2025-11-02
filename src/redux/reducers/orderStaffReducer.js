import {
    STAFF_ORDER_LIST_REQUEST,
    STAFF_ORDER_LIST_SUCCESS,
    STAFF_ORDER_LIST_FAILED,
    STAFF_ORDER_DETAIL_REQUEST,
    STAFF_ORDER_DETAIL_SUCCESS,
    STAFF_ORDER_DETAIL_FAILED,
    STAFF_ORDER_UPDATE_STATUS_REQUEST,
    STAFF_ORDER_UPDATE_STATUS_SUCCESS,
    STAFF_ORDER_UPDATE_STATUS_FAILED,
    STAFF_ORDER_STATUSES_REQUEST,
    STAFF_ORDER_STATUSES_SUCCESS,
    STAFF_ORDER_STATUSES_FAILED,
    STAFF_ORDER_CLEAR_MESSAGES,
    STAFF_ORDER_STATS_REQUEST,
    STAFF_ORDER_STATS_SUCCESS,
    STAFF_ORDER_STATS_FAILED,
} from "../actions/orderStaffAction";

const initialState = {
    items: [],
    currentOrder: null,
    statuses: [],
    pagination: {
        page: 1,
        limit: 5,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
    },
    // Thêm stats, loadingStats
    stats: {},
    loadingStats: false,
    loadingList: false,
    loadingDetail: false,
    updating: false,
    loadingStatuses: false,
    error: null,
    success: null,
};

const orderStaffReducer = (state = initialState, action) => {
    switch (action.type) {
        // Danh sách đơn hàng
        case STAFF_ORDER_LIST_REQUEST:
            return { ...state, loadingList: true, error: null };

        case STAFF_ORDER_LIST_SUCCESS:
            return {
                ...state,
                loadingList: false,
                items: action.payload.data,
                pagination: action.payload.pagination,
                error: null,
            };

        case STAFF_ORDER_LIST_FAILED:
            return { ...state, loadingList: false, error: action.payload };

        // Chi tiết đơn hàng
        case STAFF_ORDER_DETAIL_REQUEST:
            return { ...state, loadingDetail: true, error: null };

        case STAFF_ORDER_DETAIL_SUCCESS:
            return { ...state, loadingDetail: false, currentOrder: action.payload };

        case STAFF_ORDER_DETAIL_FAILED:
            return { ...state, loadingDetail: false, error: action.payload };

        // Cập nhật trạng thái đơn hàng
        case STAFF_ORDER_UPDATE_STATUS_REQUEST:
            return { ...state, updating: true, error: null };

        case STAFF_ORDER_UPDATE_STATUS_SUCCESS: {
            const updatedOrder = action.payload;
            const updatedItems = state.items.map((item) =>
                item._id === updatedOrder._id ? updatedOrder : item
            );

            return {
                ...state,
                updating: false,
                items: updatedItems,
                currentOrder:
                    state.currentOrder?._id === updatedOrder._id
                        ? updatedOrder
                        : state.currentOrder,
                success: "Cập nhật trạng thái đơn hàng thành công",
            };
        }

        case STAFF_ORDER_UPDATE_STATUS_FAILED:
            return { ...state, updating: false, error: action.payload };

        // Lấy danh sách trạng thái
        case STAFF_ORDER_STATUSES_REQUEST:
            return { ...state, loadingStatuses: true, error: null };

        case STAFF_ORDER_STATUSES_SUCCESS:
            return { ...state, loadingStatuses: false, statuses: action.payload };

        case STAFF_ORDER_STATUSES_FAILED:
            return { ...state, loadingStatuses: false, error: action.payload };

        // Thống kê đơn hàng
        case STAFF_ORDER_STATS_REQUEST:
            return { ...state, loadingStats: true, error: null };
        case STAFF_ORDER_STATS_SUCCESS:
            console.log("STAFF_ORDER_STATS_SUCCESS", action.payload)
            return { ...state, loadingStats: false, stats: action.payload };
        case STAFF_ORDER_STATS_FAILED:
            return { ...state, loadingStats: false, error: action.payload };

        // Xóa message
        case STAFF_ORDER_CLEAR_MESSAGES:
            return { ...state, error: null, success: null };

        default:
            return state;
    }
};

export default orderStaffReducer;
