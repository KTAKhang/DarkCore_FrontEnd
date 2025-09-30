import {
    GET_ALL_CUSTOMERS_REQUEST,
    GET_ALL_CUSTOMERS_SUCCESS,
    GET_ALL_CUSTOMERS_FAILURE,
    GET_CUSTOMER_BY_ID_REQUEST,
    GET_CUSTOMER_BY_ID_SUCCESS,
    GET_CUSTOMER_BY_ID_FAILURE,
    UPDATE_CUSTOMER_STATUS_REQUEST,
    UPDATE_CUSTOMER_STATUS_SUCCESS,
    UPDATE_CUSTOMER_STATUS_FAILURE,
} from "../actions/customerAction";

const initialState = {
    customers: [],
    stats: {}, // thêm cái này
    selectedCustomer: null,
    loading: false,
    error: null,

    updateStatusLoading: false,
    updateStatusSuccess: false,
    updateStatusMessage: null,
};

const customerReducer = (state = initialState, action) => {
    switch (action.type) {
        // ===== GET ALL =====
        case GET_ALL_CUSTOMERS_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_ALL_CUSTOMERS_SUCCESS:
            return { ...state, loading: false, customers: action.payload };
        case GET_ALL_CUSTOMERS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // ===== GET BY ID =====
        case GET_CUSTOMER_BY_ID_REQUEST:
            return { ...state, loading: true, error: null, selectedCustomer: null };
        case GET_CUSTOMER_BY_ID_SUCCESS:
            return { ...state, loading: false, selectedCustomer: action.payload };
        case GET_CUSTOMER_BY_ID_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // ===== UPDATE STATUS =====
        case UPDATE_CUSTOMER_STATUS_REQUEST:
            return { ...state, updateStatusLoading: true, updateStatusSuccess: false, updateStatusMessage: null };
        case UPDATE_CUSTOMER_STATUS_SUCCESS:
            return {
                ...state,
                updateStatusLoading: false,
                updateStatusSuccess: true,
                updateStatusMessage: action.payload.message,
                // cập nhật ngay trong danh sách
                customers: state.customers.map((c) =>
                    c._id === action.payload.data._id ? action.payload.data : c
                ),
            };
        case UPDATE_CUSTOMER_STATUS_FAILURE:
            return { ...state, updateStatusLoading: false, error: action.payload, updateStatusSuccess: false };

        default:
            return state;
    }
};

export default customerReducer;
