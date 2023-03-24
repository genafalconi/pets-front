import { createReducer } from "@reduxjs/toolkit"
import { ADD_TO_CART, ADD_TO_LOCAL_CART, CREATE_USER_ADDRESS, CREATE_USER_ORDER, GET_ACTIVE_PRODUCTS, GET_OPEN_OFFERS, GET_USER_ADDRESS, GET_USER_CART, GET_USER_ORDER, LOCK_SUBPROD_USER, LOGIN_WITH_EMAIL, LOGIN_WITH_GOOGLE, LOGOUT, REGISTER_WITH_EMAIL, REMOVE_FROM_CART, REMOVE_FROM_LOCAL_CART, SET_USER_ADDRESS, UPDATE_LOCAL_SUBPRODUCT_QUANTITY, UPDATE_SUBPRODUCT_QUANTITY } from "./actions"

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
    cart: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {},
    cartTotalQuantity: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')).totalProducts : {},
    address: {},
    addresses: [],
    offers: [],
    locks: [],
    order: {},
    orders: []
}

export const clientReducer = createReducer(initialState, (builder) => {
    builder.addCase(LOGIN_WITH_EMAIL.fulfilled, (state, action) => {
        state.user = action.payload.data?.user?.id
        state.cart = action.payload.data?.cart
        state.token = action.payload.token
    })
    builder.addCase(LOGIN_WITH_GOOGLE.fulfilled, (state, action) => {
        state.user = action.payload.data?.user?.id
        state.cart = action.payload.data?.cart
        state.token = action.payload.token
    })
    builder.addCase(REGISTER_WITH_EMAIL.fulfilled, (state, action) => {
        state.user = action.payload.data.id
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
    builder.addCase(REMOVE_FROM_CART.fulfilled, (state, action) => {
        state.cart = action.payload
    })
    builder.addCase(UPDATE_SUBPRODUCT_QUANTITY.fulfilled, (state, action) => {
        state.cart = action.payload
    })
    builder.addCase(UPDATE_LOCAL_SUBPRODUCT_QUANTITY.fulfilled, (state, action) => {
        state.cart = action.payload
    })
    builder.addCase(REMOVE_FROM_LOCAL_CART.fulfilled, (state, action) => {
        state.cart = action.payload
    })
    builder.addCase(GET_ACTIVE_PRODUCTS.fulfilled, (state, action) => {
        state.products = action.payload
    })
    builder.addCase(GET_USER_ADDRESS.fulfilled, (state, action) => {
        state.addresses = action.payload
    })
    builder.addCase(SET_USER_ADDRESS.fulfilled, (state, action) => {
        state.address = action.payload
    })
    builder.addCase(CREATE_USER_ADDRESS.fulfilled, (state, action) => {
        state.addresses = action.payload
    })
    builder.addCase(GET_OPEN_OFFERS.fulfilled, (state, action) => {
        state.offers = action.payload
    })
    builder.addCase(LOCK_SUBPROD_USER.fulfilled, (state, action) => {
        state.locks = action.payload
    })
    builder.addCase(CREATE_USER_ORDER.fulfilled, (state, action) => {
        state.cart = {}
        state.cartTotalQuantity = 0
    })
    builder.addCase(GET_USER_ORDER.fulfilled, (state, action) => {
        state.order = action.payload
    })
})
