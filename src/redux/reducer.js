import { createReducer } from "@reduxjs/toolkit"
import { ADD_TO_CART, ADD_TO_LOCAL_CART, CREATE_USER_ADDRESS, CREATE_USER_ORDER, DELETE_USER_ADDRESS, GET_ACCOUNT_INFO, GET_ACCOUNT_ORDERS, GET_ACTIVE_PRODUCTS, GET_FILTER_PRODUCTS, GET_HIGHLIGHT_SUBPRODS, GET_LANDING_IMAGES, GET_OPEN_OFFERS, GET_USER_ADDRESS, GET_USER_CART, GET_USER_ORDER, LOCK_SUBPROD_USER, LOGIN_WITH_EMAIL, LOGIN_WITH_GOOGLE, LOGOUT, REGISTER_WITH_EMAIL, REMOVE_FROM_CART, REMOVE_FROM_LOCAL_CART, RESET_TIMER, SAVE_RE_ORDER_CART, SEARCH_PRODUCTS, SET_USER_ADDRESS, UPDATE_LOCAL_SUBPRODUCT_QUANTITY, UPDATE_SUBPRODUCT_QUANTITY, UPDATE_USER_ADDRESS, VERIFY_TOKEN } from "./actions"

const initialState = {
    token: localStorage.getItem('token'),
    products: [],
    products_filtered: [],
    highlights: [],
    carousel: [],
    product: {},
    categories: [],
    breeds: [],
    subproduct: {},
    subproducts: [],
    user: localStorage.getItem('user') ? localStorage.getItem('user') : '',
    user_auth: localStorage.getItem('token') ? true : false,
    user_admin: false,
    cart: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {},
    address: {},
    addresses: [],
    offers: [],
    locks: [],
    order: {},
    orders: [],
    current_page: 1,
    total_pages: 0,
    total_products: 0,
    reset_timer: false
}

export const clientReducer = createReducer(initialState, (builder) => {
    builder.addCase(LOGIN_WITH_EMAIL.fulfilled, (state, action) => {
        state.user = action.payload.data.user?._id
        state.cart = action.payload.data.cart
        state.token = action.payload.token
        state.user_auth = true
        state.user_admin = action.payload.data.user.admin
    })
    builder.addCase(LOGIN_WITH_GOOGLE.fulfilled, (state, action) => {
        state.user = action.payload.data.user._id
        state.cart = action.payload.data.cart
        state.token = action.payload.token
        state.user_auth = true
        state.user_admin = action.payload.data.user.admin
    })
    builder.addCase(REGISTER_WITH_EMAIL.fulfilled, (state, action) => {
        state.user = action.payload.data.user._id
        state.cart = action.payload.data.cart
        state.token = action.payload.token
        state.user_auth = true
        state.user_admin = action.payload.data.user.admin
    })
    builder.addCase(LOGOUT.fulfilled, (state, action) => {
        state.user = ''
        state.token = ''
        state.cart = {}
        state.user_auth = false
        state.user_admin = false
    })
    builder.addCase(VERIFY_TOKEN.fulfilled, (state, action) => {
        state.user_auth = action.payload
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
        state.products = action.payload.subproducts
        state.current_page = action.payload.page
        state.total_pages = action.payload.total_pages
        state.total_products = action.payload.total_products
    })
    builder.addCase(GET_FILTER_PRODUCTS.fulfilled, (state, action) => {
        state.products = action.payload
    })
    builder.addCase(GET_USER_ADDRESS.fulfilled, (state, action) => {
        state.addresses = action.payload
    })
    builder.addCase(UPDATE_USER_ADDRESS.fulfilled, (state, action) => {
        state.addresses = action.payload
    })
    builder.addCase(SET_USER_ADDRESS.fulfilled, (state, action) => {
        state.address = action.payload
    })
    builder.addCase(CREATE_USER_ADDRESS.fulfilled, (state, action) => {
        state.addresses.push(action.payload)
        state.address = action.payload[state.addresses.length - 1]
    })
    builder.addCase(DELETE_USER_ADDRESS.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter((elem) => elem._id !== action.payload._id)
    })
    builder.addCase(GET_OPEN_OFFERS.fulfilled, (state, action) => {
        state.offers = action.payload
    })
    builder.addCase(LOCK_SUBPROD_USER.fulfilled, (state, action) => {
        state.locks = action.payload
    })
    builder.addCase(CREATE_USER_ORDER.fulfilled, (state, action) => {
        state.cart = {}
    })
    builder.addCase(GET_USER_ORDER.fulfilled, (state, action) => {
        state.order = action.payload
    })
    builder.addCase(GET_ACCOUNT_INFO.fulfilled, (state, action) => {
        state.user_info = action.payload
    })
    builder.addCase(GET_ACCOUNT_ORDERS.fulfilled, (state, action) => {
        state.orders = action.payload
    })
    builder.addCase(SAVE_RE_ORDER_CART.fulfilled, (state, action) => {
        state.cart = action.payload
    })
    builder.addCase(SEARCH_PRODUCTS.fulfilled, (state, action) => {
        state.products = action.payload.subproducts
        state.current_page = action.payload.page
        state.total_pages = action.payload.total_pages
        state.total_products = action.payload.total_products
    })
    builder.addCase(GET_HIGHLIGHT_SUBPRODS.fulfilled, (state, action) => {
        state.highlights = action.payload
    })
    builder.addCase(GET_LANDING_IMAGES.fulfilled, (state, action) => {
        state.carousel = action.payload
    })
    builder.addCase(RESET_TIMER.fulfilled, (state, action) => {
        state.reset_timer = action.payload
    })
})
