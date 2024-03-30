import {
    ADD_TO_CART,
    UPDATE_CART,
    REMOVE_FROM_CART,
    CLEAR_CART
} from '../constants';

const cartItems = (state = [], action) => {
    switch (action.type) {
        case ADD_TO_CART:
            return [...state, action.payload]
        case UPDATE_CART:
            return state.map(cartItem => {
                if (cartItem.id === action.payload.id) {
                    return action.payload;
                }
                return cartItem;
            });
        case REMOVE_FROM_CART:
            return state.filter(cartItem => cartItem !== action.payload)
        case CLEAR_CART:
            return state = []
    }

    return state;
}

export default cartItems;