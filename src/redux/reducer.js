import { createReducer } from "@reduxjs/toolkit"
import { ADD_TO_CART, ADD_TO_LOCAL_CART, CREATE_USER_ADDRESS, CREATE_USER_ORDER, GET_ACTIVE_PRODUCTS, GET_FILTER_PRODUCTS, GET_OPEN_OFFERS, GET_USER_ADDRESS, GET_USER_CART, GET_USER_ORDER, LOCK_SUBPROD_USER, LOGIN_WITH_EMAIL, LOGIN_WITH_GOOGLE, LOGOUT, REGISTER_WITH_EMAIL, REMOVE_FROM_CART, REMOVE_FROM_LOCAL_CART, SAVE_LOCAL_CART, SET_USER_ADDRESS, UPDATE_LOCAL_SUBPRODUCT_QUANTITY, UPDATE_SUBPRODUCT_QUANTITY, VERIFY_TOKEN } from "./actions"

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
    user_auth: localStorage.getItem('token') ? true : false,
    users: [],
    cart: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {},
    cartTotalQuantity: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')).totalProducts : 0,
    address: {},
    addresses: [],
    offers: [],
    locks: [],
    order: {},
    orders: []
}

export const clientReducer = createReducer(initialState, (builder) => {
    builder.addCase(LOGIN_WITH_EMAIL.fulfilled, (state, action) => {
        state.user = action.payload.data?.user?._id
        state.cart = action.payload.data?.cart
        state.token = action.payload.token
        state.user_auth = true
    })
    builder.addCase(LOGIN_WITH_GOOGLE.fulfilled, (state, action) => {
        state.user = action.payload.data?.user?._id
        state.cart = action.payload.data?.cart
        state.token = action.payload.token
        state.user_auth = true
    })
    builder.addCase(REGISTER_WITH_EMAIL.fulfilled, (state, action) => {
        state.user = action.payload.data._id
        state.token = action.payload.token
        state.user_auth = true
    })
    builder.addCase(LOGOUT.fulfilled, (state, action) => {
        state.user = ''
        state.token = ''
        state.cart = {}
    })
    builder.addCase(VERIFY_TOKEN.fulfilled, (state, action) => {
        state.user_auth = action.payload
    })
    builder.addCase(GET_USER_CART.fulfilled, (state, action) => {
        state.cart = action.payload.data
    })
    builder.addCase(ADD_TO_CART.fulfilled, (state, action) => {
        state.cart = action.payload
        state.cartTotalQuantity = action.payload.total_products
    })
    builder.addCase(ADD_TO_LOCAL_CART.fulfilled, (state, action) => {
        state.cart = action.payload
        state.cartTotalQuantity = action.payload.total_products
    })
    builder.addCase(SAVE_LOCAL_CART.fulfilled, (state, action) => {
        state.cart = action.payload
        state.cartTotalQuantity = action.payload.total_products
    })
    builder.addCase(REMOVE_FROM_CART.fulfilled, (state, action) => {
        state.cart = action.payload
        state.cartTotalQuantity = action.payload.total_products
    })
    builder.addCase(UPDATE_SUBPRODUCT_QUANTITY.fulfilled, (state, action) => {
        state.cart = action.payload
        state.cartTotalQuantity = action.payload.total_products
    })
    builder.addCase(UPDATE_LOCAL_SUBPRODUCT_QUANTITY.fulfilled, (state, action) => {
        state.cart = action.payload
        state.cartTotalQuantity = action.payload.total_products
    })
    builder.addCase(REMOVE_FROM_LOCAL_CART.fulfilled, (state, action) => {
        state.cart = action.payload
        state.cartTotalQuantity = action.payload.total_products
    })
    builder.addCase(GET_ACTIVE_PRODUCTS.fulfilled, (state, action) => {
        state.products = action.payload
    })
    builder.addCase(GET_FILTER_PRODUCTS.fulfilled, (state, action) => {
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
        state.address = action.payload[state.addresses.length - 1]
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
