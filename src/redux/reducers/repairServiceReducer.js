import {
  REPAIR_SERVICE_LIST_REQUEST,
  REPAIR_SERVICE_LIST_SUCCESS,
  REPAIR_SERVICE_LIST_FAILURE,
  REPAIR_SERVICE_CREATE_REQUEST,
  REPAIR_SERVICE_CREATE_SUCCESS,
  REPAIR_SERVICE_CREATE_FAILURE,
  REPAIR_SERVICE_UPDATE_REQUEST,
  REPAIR_SERVICE_UPDATE_SUCCESS,
  REPAIR_SERVICE_UPDATE_FAILURE,
  REPAIR_SERVICE_DELETE_REQUEST,
  REPAIR_SERVICE_DELETE_SUCCESS,
  REPAIR_SERVICE_DELETE_FAILURE,
  REPAIR_SERVICE_CLEAR_MESSAGES,
} from "../actions/repairServiceActions";

const initialState = {
  list: { items: [], loading: false, error: null },
  create: { loading: false, error: null, message: null },
  update: { loading: false, error: null, message: null },
  remove: { loading: false, error: null, message: null },
};

export default function repairServiceReducer(state = initialState, action) {
  switch (action.type) {
    case REPAIR_SERVICE_LIST_REQUEST:
      return { ...state, list: { ...state.list, loading: true, error: null } };
    case REPAIR_SERVICE_LIST_SUCCESS:
      return { ...state, list: { items: action.payload || [], loading: false, error: null } };
    case REPAIR_SERVICE_LIST_FAILURE:
      return { ...state, list: { ...state.list, loading: false, error: action.payload } };

    case REPAIR_SERVICE_CREATE_REQUEST:
      return { ...state, create: { loading: true, error: null, message: null } };
    case REPAIR_SERVICE_CREATE_SUCCESS:
      return {
        ...state,
        create: { loading: false, error: null, message: action.payload?.message || null },
        list: { ...state.list, items: [action.payload?.item, ...state.list.items] },
      };
    case REPAIR_SERVICE_CREATE_FAILURE:
      return { ...state, create: { loading: false, error: action.payload, message: null } };

    case REPAIR_SERVICE_UPDATE_REQUEST:
      return { ...state, update: { loading: true, error: null, message: null } };
    case REPAIR_SERVICE_UPDATE_SUCCESS:
      return {
        ...state,
        update: { loading: false, error: null, message: action.payload?.message || null },
        list: {
          ...state.list,
          items: state.list.items.map((it) => (it?._id === action.payload?.item?._id ? action.payload.item : it)),
        },
      };
    case REPAIR_SERVICE_UPDATE_FAILURE:
      return { ...state, update: { loading: false, error: action.payload, message: null } };

    case REPAIR_SERVICE_DELETE_REQUEST:
      return { ...state, remove: { loading: true, error: null, message: null } };
    case REPAIR_SERVICE_DELETE_SUCCESS:
      return {
        ...state,
        remove: { loading: false, error: null, message: action.payload?.message || null },
        list: { ...state.list, items: state.list.items.filter((it) => it?._id !== action.payload?.id) },
      };
    case REPAIR_SERVICE_DELETE_FAILURE:
      return { ...state, remove: { loading: false, error: action.payload, message: null } };

    case REPAIR_SERVICE_CLEAR_MESSAGES:
      return {
        ...state,
        create: { ...state.create, error: null, message: null },
        update: { ...state.update, error: null, message: null },
        remove: { ...state.remove, error: null, message: null },
      };
    default:
      return state;
  }
}


