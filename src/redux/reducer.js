import { createReducer, createSlice } from "@reduxjs/toolkit"
import { ADD_TO_CART, ADD_TO_LOCAL_CART, GET_ACTIVE_PRODUCTS, GET_USER_CART, LOGIN_WITH_EMAIL, LOGIN_WITH_GOOGLE, LOGOUT, REGISTER_WITH_EMAIL } from "./actions"

const initialState = {
    token: localStorage.getItem('token'),
    products: [],
    productsFilt: [],
    product: {},
    categories: [],
    breeds: [],
    subproduct: {},
    subproducts: [],
    user: localStorage.getItem('user') ? localStorage.getItem('user') : '',
    users: [],
    cart: {},
    cartTotalQuantity: 0
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState
})

export const clientReducer = createReducer(initialState, (builder) => {
    builder.addCase(LOGIN_WITH_EMAIL.fulfilled, (state, action) => {
        state.user = action.payload.data
    })
    builder.addCase(LOGIN_WITH_GOOGLE.fulfilled, (state, action) => {
        state.user = action.payload.data
    })
    builder.addCase(REGISTER_WITH_EMAIL.fulfilled, (state, action) => {
        state.user = action.payload.data
    })
    builder.addCase(LOGOUT.fulfilled, (state, action) => {
        state.user = ''
    })
    builder.addCase(GET_USER_CART.fulfilled, (state, action) => {
        state.cart = action.payload.data
    })
    builder.addCase(ADD_TO_CART.fulfilled, (state, action) => {
        state.cart = action.payload
    })
    builder.addCase(ADD_TO_LOCAL_CART.fulfilled, (state, action) => {
        state.cart = action.payload
    })
    builder.addCase(GET_ACTIVE_PRODUCTS.fulfilled, (state, action) => {
        state.products = action.payload
    })
})
