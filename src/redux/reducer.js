import { createReducer, createSlice } from "@reduxjs/toolkit"
import { LOGIN_WITH_EMAIL, LOGIN_WITH_GOOGLE } from "./actions"

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
    cart: [],
    cartTotalQuantity: 0
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState
})

export const clientReducer = createReducer(initialState, (builder) => {
    builder.addCase(LOGIN_WITH_EMAIL.fulfilled, (state, action) => {
        state.user = action.payload
    })
    builder.addCase(LOGIN_WITH_GOOGLE.fulfilled, (state, action) => {
        state.user = action.payload
    })
})
