import {
    FAVORITE_LIST_REQUEST,
    FAVORITE_LIST_SUCCESS,
    FAVORITE_LIST_FAILURE,
    FAVORITE_TOGGLE_REQUEST,
    FAVORITE_TOGGLE_SUCCESS,
    FAVORITE_TOGGLE_FAILURE,
    FAVORITE_CHECK_REQUEST,
    FAVORITE_CHECK_SUCCESS,
    FAVORITE_CHECK_FAILURE,
    FAVORITE_CHECK_MULTIPLE_REQUEST,
    FAVORITE_CHECK_MULTIPLE_SUCCESS,
    FAVORITE_CHECK_MULTIPLE_FAILURE,
    FAVORITE_ADD_REQUEST,
    FAVORITE_ADD_SUCCESS,
    FAVORITE_ADD_FAILURE,
    FAVORITE_REMOVE_REQUEST,
    FAVORITE_REMOVE_SUCCESS,
    FAVORITE_REMOVE_FAILURE,
    FAVORITE_REMOVE_ALL_REQUEST,
    FAVORITE_REMOVE_ALL_SUCCESS,
    FAVORITE_REMOVE_ALL_FAILURE,
    FAVORITE_CLEAR_MESSAGES,
} from "../actions/favoriteActions";

const initialState = {
    // Favorites list
    items: [],
    pagination: { page: 1, limit: 8, total: 0 },
    loading: false,
    error: null,
    
    // Toggle favorite
    toggleLoading: false,
    toggleError: null,
    
    // Check favorite status
    favoriteStatus: {}, // { productId: boolean }
    checkLoading: false,
    checkError: null,
    
    // Check multiple
    favoriteProductIds: [], // Array of product IDs that are favorited
    checkMultipleLoading: false,
    checkMultipleError: null,
    
    // Add/Remove
    addLoading: false,
    removeLoading: false,
    removeAllLoading: false,
    removeAllError: null,
    
    // Messages
    message: null,
};

const favoriteReducer = (state = initialState, action) => {
    switch (action.type) {
        // List actions
        case FAVORITE_LIST_REQUEST:
            return { 
                ...state, 
                loading: true, 
                error: null 
            };
        
        case FAVORITE_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                items: action.payload.items || [],
                pagination: action.payload.pagination || state.pagination,
                error: null,
            };
        
        case FAVORITE_LIST_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Toggle favorite actions
        case FAVORITE_TOGGLE_REQUEST:
            return {
                ...state,
                toggleLoading: true,
                toggleError: null,
            };
        
        case FAVORITE_TOGGLE_SUCCESS: {
            const { productId, isFavorite, message } = action.payload;
            
            // Update favoriteStatus
            const newFavoriteStatus = {
                ...state.favoriteStatus,
                [productId]: isFavorite,
            };
            
            // Update favoriteProductIds array
            let newFavoriteProductIds = [...state.favoriteProductIds];
            if (isFavorite) {
                // Add to array if not already present
                if (!newFavoriteProductIds.includes(productId)) {
                    newFavoriteProductIds.push(productId);
                }
            } else {
                // Remove from array
                newFavoriteProductIds = newFavoriteProductIds.filter(id => id !== productId);
            }
            
            // Update items list - remove if unfavorited
            let newItems = state.items;
            if (!isFavorite) {
                newItems = state.items.filter(item => item._id !== productId);
            }
            
            return {
                ...state,
                toggleLoading: false,
                toggleError: null,
                favoriteStatus: newFavoriteStatus,
                favoriteProductIds: newFavoriteProductIds,
                items: newItems,
                message: message,
            };
        }
        
        case FAVORITE_TOGGLE_FAILURE:
            return {
                ...state,
                toggleLoading: false,
                toggleError: action.payload,
            };

        // Check favorite actions
        case FAVORITE_CHECK_REQUEST:
            return {
                ...state,
                checkLoading: true,
                checkError: null,
            };
        
        case FAVORITE_CHECK_SUCCESS: {
            const { productId, isFavorite } = action.payload;
            
            // Update favoriteProductIds array
            let newFavoriteProductIds = [...state.favoriteProductIds];
            if (isFavorite && !newFavoriteProductIds.includes(productId)) {
                newFavoriteProductIds.push(productId);
            } else if (!isFavorite) {
                newFavoriteProductIds = newFavoriteProductIds.filter(id => id !== productId);
            }
            
            return {
                ...state,
                checkLoading: false,
                checkError: null,
                favoriteStatus: {
                    ...state.favoriteStatus,
                    [productId]: isFavorite,
                },
                favoriteProductIds: newFavoriteProductIds,
            };
        }
        
        case FAVORITE_CHECK_FAILURE:
            return {
                ...state,
                checkLoading: false,
                checkError: action.payload,
            };

        // Check multiple favorites actions
        case FAVORITE_CHECK_MULTIPLE_REQUEST:
            return {
                ...state,
                checkMultipleLoading: true,
                checkMultipleError: null,
            };
        
        case FAVORITE_CHECK_MULTIPLE_SUCCESS: {
            const { favoriteProductIds } = action.payload;
            
            // Update favoriteStatus for all products
            const newFavoriteStatus = { ...state.favoriteStatus };
            favoriteProductIds.forEach(productId => {
                newFavoriteStatus[productId] = true;
            });
            
            return {
                ...state,
                checkMultipleLoading: false,
                checkMultipleError: null,
                favoriteProductIds: favoriteProductIds,
                favoriteStatus: newFavoriteStatus,
            };
        }
        
        case FAVORITE_CHECK_MULTIPLE_FAILURE:
            return {
                ...state,
                checkMultipleLoading: false,
                checkMultipleError: action.payload,
            };

        // Add favorite actions
        case FAVORITE_ADD_REQUEST:
            return {
                ...state,
                addLoading: true,
                error: null,
            };
        
        case FAVORITE_ADD_SUCCESS: {
            const { favorite, message } = action.payload;
            return {
                ...state,
                addLoading: false,
                error: null,
                message: message,
                favoriteStatus: {
                    ...state.favoriteStatus,
                    [favorite.product_id]: true,
                },
            };
        }
        
        case FAVORITE_ADD_FAILURE:
            return {
                ...state,
                addLoading: false,
                error: action.payload,
            };

        // Remove favorite actions
        case FAVORITE_REMOVE_REQUEST:
            return {
                ...state,
                removeLoading: true,
                error: null,
            };
        
        case FAVORITE_REMOVE_SUCCESS: {
            const { productId, message } = action.payload;
            
            // Remove from items list
            const newItems = state.items.filter(item => item._id !== productId);
            
            // Update favoriteStatus
            const newFavoriteStatus = { ...state.favoriteStatus };
            delete newFavoriteStatus[productId];
            
            return {
                ...state,
                removeLoading: false,
                error: null,
                items: newItems,
                message: message,
                favoriteStatus: newFavoriteStatus,
            };
        }
        
        case FAVORITE_REMOVE_FAILURE:
            return {
                ...state,
                removeLoading: false,
                error: action.payload,
            };

        // Remove all favorites actions
        case FAVORITE_REMOVE_ALL_REQUEST:
            return {
                ...state,
                removeAllLoading: true,
                removeAllError: null,
            };
        
        case FAVORITE_REMOVE_ALL_SUCCESS: {
            const { message } = action.payload;
            
            // Clear all items and reset pagination
            return {
                ...state,
                removeAllLoading: false,
                removeAllError: null,
                items: [],
                pagination: {
                    ...state.pagination,
                    total: 0,
                    page: 1,
                },
                favoriteStatus: {},
                favoriteProductIds: [],
                message: message,
            };
        }
        
        case FAVORITE_REMOVE_ALL_FAILURE:
            return {
                ...state,
                removeAllLoading: false,
                removeAllError: action.payload,
            };

        // Clear messages
        case FAVORITE_CLEAR_MESSAGES:
            return {
                ...state,
                message: null,
                error: null,
                toggleError: null,
                checkError: null,
                checkMultipleError: null,
                removeAllError: null,
            };

        default:
            return state;
    }
};

export default favoriteReducer;

