// ==================== ORDER STAFF (Admin) ====================

// 🔹 LIST
export const STAFF_ORDER_LIST_REQUEST = "STAFF_ORDER_LIST_REQUEST";
export const STAFF_ORDER_LIST_SUCCESS = "STAFF_ORDER_LIST_SUCCESS";
export const STAFF_ORDER_LIST_FAILED = "STAFF_ORDER_LIST_FAILED";

// 🔹 DETAIL
export const STAFF_ORDER_DETAIL_REQUEST = "STAFF_ORDER_DETAIL_REQUEST";
export const STAFF_ORDER_DETAIL_SUCCESS = "STAFF_ORDER_DETAIL_SUCCESS";
export const STAFF_ORDER_DETAIL_FAILED = "STAFF_ORDER_DETAIL_FAILED";

// 🔹 UPDATE STATUS
export const STAFF_ORDER_UPDATE_STATUS_REQUEST = "STAFF_ORDER_UPDATE_STATUS_REQUEST";
export const STAFF_ORDER_UPDATE_STATUS_SUCCESS = "STAFF_ORDER_UPDATE_STATUS_SUCCESS";
export const STAFF_ORDER_UPDATE_STATUS_FAILED = "STAFF_ORDER_UPDATE_STATUS_FAILED";

// 🔹 STATUSES (GET ALL STATUS)
export const STAFF_ORDER_STATUSES_REQUEST = "STAFF_ORDER_STATUSES_REQUEST";
export const STAFF_ORDER_STATUSES_SUCCESS = "STAFF_ORDER_STATUSES_SUCCESS";
export const STAFF_ORDER_STATUSES_FAILED = "STAFF_ORDER_STATUSES_FAILED";

// 🔹 STATS (THỐNG KÊ ĐƠN HÀNG)
export const STAFF_ORDER_STATS_REQUEST = "STAFF_ORDER_STATS_REQUEST";
export const STAFF_ORDER_STATS_SUCCESS = "STAFF_ORDER_STATS_SUCCESS";
export const STAFF_ORDER_STATS_FAILED = "STAFF_ORDER_STATS_FAILED";

// 🔹 CLEAR MESSAGES
export const STAFF_ORDER_CLEAR_MESSAGES = "STAFF_ORDER_CLEAR_MESSAGES";


// ==================== ACTION CREATORS ====================

// 🔹 Danh sách đơn hàng
export const staffOrderListRequest = (query = {}) => ({
    type: STAFF_ORDER_LIST_REQUEST,
    payload: query,
});

export const staffOrderListSuccess = (data, pagination) => ({
    type: STAFF_ORDER_LIST_SUCCESS,
    payload: { data, pagination },
});

export const staffOrderListFailed = (error) => ({
    type: STAFF_ORDER_LIST_FAILED,
    payload: error,
});

// 🔹 Chi tiết đơn hàng
export const staffOrderDetailRequest = (id) => ({
    type: STAFF_ORDER_DETAIL_REQUEST,
    payload: id,
});

export const staffOrderDetailSuccess = (data) => ({
    type: STAFF_ORDER_DETAIL_SUCCESS,
    payload: data,
});

export const staffOrderDetailFailed = (error) => ({
    type: STAFF_ORDER_DETAIL_FAILED,
    payload: error,
});

// 🔹 Cập nhật trạng thái
export const staffOrderUpdateStatusRequest = (id, payload) => ({
    type: STAFF_ORDER_UPDATE_STATUS_REQUEST,
    payload: { id, payload },
});

export const staffOrderUpdateStatusSuccess = (data) => ({
    type: STAFF_ORDER_UPDATE_STATUS_SUCCESS,
    payload: data,
});

export const staffOrderUpdateStatusFailed = (error) => ({
    type: STAFF_ORDER_UPDATE_STATUS_FAILED,
    payload: error,
});

// 🔹 Danh sách trạng thái
export const staffOrderStatusesRequest = () => ({
    type: STAFF_ORDER_STATUSES_REQUEST,
});

export const staffOrderStatusesSuccess = (data) => ({
    type: STAFF_ORDER_STATUSES_SUCCESS,
    payload: data,
});

export const staffOrderStatusesFailed = (error) => ({
    type: STAFF_ORDER_STATUSES_FAILED,
    payload: error,
});

// 🔹 Lấy thống kê đơn hàng
export const staffOrderStatsRequest = () => ({
    type: STAFF_ORDER_STATS_REQUEST,
});

export const staffOrderStatsSuccess = (data) => ({
    type: STAFF_ORDER_STATS_SUCCESS,
    payload: data,
});

export const staffOrderStatsFailed = (error) => ({
    type: STAFF_ORDER_STATS_FAILED,
    payload: error,
});

// 🔹 Clear message
export const staffOrderClearMessages = () => ({
    type: STAFF_ORDER_CLEAR_MESSAGES,
});
