import {
  REPAIR_REQUEST_CREATE_REQUEST,
  REPAIR_REQUEST_CREATE_SUCCESS,
  REPAIR_REQUEST_CREATE_FAILURE,
  REPAIR_REQUEST_UPDATE_REQUEST,
  REPAIR_REQUEST_UPDATE_SUCCESS,
  REPAIR_REQUEST_UPDATE_FAILURE,
  REPAIR_REQUEST_CANCEL_REQUEST,
  REPAIR_REQUEST_CANCEL_SUCCESS,
  REPAIR_REQUEST_CANCEL_FAILURE,
  REPAIR_REQUEST_LIST_ALL_REQUEST,
  REPAIR_REQUEST_LIST_ALL_SUCCESS,
  REPAIR_REQUEST_LIST_ALL_FAILURE,
  REPAIR_REQUEST_ASSIGN_REQUEST,
  REPAIR_REQUEST_ASSIGN_SUCCESS,
  REPAIR_REQUEST_ASSIGN_FAILURE,
  REPAIR_REQUEST_STATUS_UPDATE_REQUEST,
  REPAIR_REQUEST_STATUS_UPDATE_SUCCESS,
  REPAIR_REQUEST_STATUS_UPDATE_FAILURE,
  REPAIR_REQUEST_LIST_ASSIGNED_REQUEST,
  REPAIR_REQUEST_LIST_ASSIGNED_SUCCESS,
  REPAIR_REQUEST_LIST_ASSIGNED_FAILURE,
  REPAIR_REQUEST_CLEAR_MESSAGES,
} from "../actions/repairRequestActions";

const initialState = {
  create: { item: null, loading: false, error: null, message: null },
  update: { item: null, loading: false, error: null, message: null },
  cancel: { loading: false, error: null, message: null },
  listAll: { items: [], loading: false, error: null, pagination: null },
  listAssigned: { items: [], loading: false, error: null, pagination: null },
  assign: { loading: false, error: null, message: null },
  statusUpdate: { loading: false, error: null, message: null },
};

export default function repairRequestReducer(state = initialState, action) {
  switch (action.type) {
    case REPAIR_REQUEST_CREATE_REQUEST:
      return { ...state, create: { item: null, loading: true, error: null, message: null } };
    case REPAIR_REQUEST_CREATE_SUCCESS:
      return { ...state, create: { item: action.payload?.item, loading: false, error: null, message: action.payload?.message || null } };
    case REPAIR_REQUEST_CREATE_FAILURE:
      return { ...state, create: { item: null, loading: false, error: action.payload, message: null } };

    case REPAIR_REQUEST_UPDATE_REQUEST:
      return { ...state, update: { item: null, loading: true, error: null, message: null } };
    case REPAIR_REQUEST_UPDATE_SUCCESS:
      return { ...state, update: { item: action.payload?.item, loading: false, error: null, message: action.payload?.message || null } };
    case REPAIR_REQUEST_UPDATE_FAILURE:
      return { ...state, update: { item: null, loading: false, error: action.payload, message: null } };

    case REPAIR_REQUEST_CANCEL_REQUEST:
      return { ...state, cancel: { loading: true, error: null, message: null } };
    case REPAIR_REQUEST_CANCEL_SUCCESS:
      return { ...state, cancel: { loading: false, error: null, message: action.payload?.message || null } };
    case REPAIR_REQUEST_CANCEL_FAILURE:
      return { ...state, cancel: { loading: false, error: action.payload, message: null } };

    case REPAIR_REQUEST_LIST_ALL_REQUEST:
      return { ...state, listAll: { ...state.listAll, loading: true, error: null } };
    case REPAIR_REQUEST_LIST_ALL_SUCCESS:
      return { ...state, listAll: { items: action.payload.data || [], loading: false, error: null, pagination: action.payload.pagination || null } };
    case REPAIR_REQUEST_LIST_ALL_FAILURE:
      return { ...state, listAll: { ...state.listAll, loading: false, error: action.payload } };

    case REPAIR_REQUEST_LIST_ASSIGNED_REQUEST:
      return { ...state, listAssigned: { ...state.listAssigned, loading: true, error: null } };
    case REPAIR_REQUEST_LIST_ASSIGNED_SUCCESS:
      return { ...state, listAssigned: { items: action.payload.data || [], loading: false, error: null, pagination: action.payload.pagination || null } };
    case REPAIR_REQUEST_LIST_ASSIGNED_FAILURE:
      return { ...state, listAssigned: { ...state.listAssigned, loading: false, error: action.payload } };

    case REPAIR_REQUEST_ASSIGN_REQUEST:
      return { ...state, assign: { loading: true, error: null, message: null } };
    case REPAIR_REQUEST_ASSIGN_SUCCESS:
      return { ...state, assign: { loading: false, error: null, message: action.payload?.message || null } };
    case REPAIR_REQUEST_ASSIGN_FAILURE:
      return { ...state, assign: { loading: false, error: action.payload, message: null } };

    case REPAIR_REQUEST_STATUS_UPDATE_REQUEST:
      return { ...state, statusUpdate: { loading: true, error: null, message: null } };
    case REPAIR_REQUEST_STATUS_UPDATE_SUCCESS:
      return { ...state, statusUpdate: { loading: false, error: null, message: action.payload?.message || null } };
    case REPAIR_REQUEST_STATUS_UPDATE_FAILURE:
      return { ...state, statusUpdate: { loading: false, error: action.payload, message: null } };

    case REPAIR_REQUEST_CLEAR_MESSAGES:
      return {
        ...state,
        create: { ...state.create, error: null, message: null },
        update: { ...state.update, error: null, message: null },
        cancel: { ...state.cancel, error: null, message: null },
        assign: { ...state.assign, error: null, message: null },
        statusUpdate: { ...state.statusUpdate, error: null, message: null },
      };

    default:
      return state;
  }
}


