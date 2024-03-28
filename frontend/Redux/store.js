import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';

import cartItems from './Reducers/cartItems';
const reducers = combineReducers({
    cartItems: cartItems

})

const store = createStore(
    reducers,
    applyMiddleware(thunk)
)

store.subscribe(() => {
    // Log cart items whenever store state changes
    console.log('Cart Items:', store.getState().cartItems);
});

export default store;