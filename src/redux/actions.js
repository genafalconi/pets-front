import { createAsyncThunk } from '@reduxjs/toolkit'
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import Swal from 'sweetalert2';
import { firebaseAuth } from '../helpers/firebase';
import { addLocalCart } from '../helpers/addLocalCart';
import { req_constants, type_ord } from '../helpers/constants';
import { fillCart } from '../helpers/fillCart';
import { removeFromCart } from '../helpers/removeFromCart';
import { request } from '../helpers/request'
import updateSubprodQuantity from '../helpers/updateSubprodQuantity';
import errorHandler from '../helpers/errorHandler';
const { REACT_APP_AUTH, REACT_APP_CART, REACT_APP_PROD, REACT_APP_ORDER, REACT_APP_OFFER } = process.env;

export const LOGIN_WITH_EMAIL = createAsyncThunk(
  'LOGIN_WITH_EMAIL', async ({ userdata, cart, order_type }) => {
    try {
      const { user } = await signInWithEmailAndPassword(firebaseAuth, userdata.email, userdata.password)
      if (user) {
        const token = await user.getIdToken()
        const res = await request(req_constants.POST, `${REACT_APP_AUTH}/auth/login`, null, { user: userdata, cart }, token)

        if (res.status === 201) {
          localStorage.setItem('user', res.data.user?._id)
          localStorage.setItem('admin', res.data.user?.admin)

          if (order_type === type_ord.ORDER) {
            localStorage.setItem('cart', JSON.stringify(res.data.cart ? res.data.cart : {}))
          } else {
            localStorage.setItem('reorder_cart', JSON.stringify(res.data.cart ? res.data.cart : {}))
          }

          const isLoggedUser = localStorage.getItem('user')
          if (isLoggedUser) {
            localStorage.setItem('token', token)
            localStorage.setItem('user_auth', true)
          }

          return { ...res, token: token }
        }
      }
    } catch (error) {
      const firebaseError = error.message.replace('Firebase: Error', '').match(/\((.*)\)/).pop()
      if (firebaseError === 'auth/user-not-found') {
        Swal.fire({
          title: 'Error!',
          text: `No existe un usuario con ese email`,
          icon: 'error'
        })
        return firebaseError
      }
      if (firebaseError === 'auth/wrong-password') {
        Swal.fire({
          title: 'Error!',
          text: `Contraseña erronea`,
          icon: 'error'
        })
        return firebaseError
      }
      if (firebaseError === 'auth/invalid-email') {
        Swal.fire({
          title: 'Error!',
          text: `No existe el un usuario con ese email`,
          icon: 'error'
        })
        return firebaseError
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Hay un problema para iniciar sesion',
          icon: 'error'
        })
      }
      return firebaseError
    }
  }
)

export const LOGIN_WITH_GOOGLE = createAsyncThunk(
  'LOGIN_WITH_GOOGLE', async ({ userdata, cart, token }) => {
    try {
      const res = await request(req_constants.POST, `${REACT_APP_AUTH}/auth/register`, null, { user: userdata, cart }, token)
      if (res.status === 201) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', res?.data?.user?._id)
        localStorage.setItem('admin', res.data.user?.admin)
        localStorage.setItem('cart', JSON.stringify(res?.data?.cart))
        localStorage.setItem('user_auth', true)

        return { ...res, token }
      }
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const REGISTER_WITH_EMAIL = createAsyncThunk(
  'REGISTER_WITH_EMAIL', async ({ userdata, cart }) => {
    try {
      const { user } = await createUserWithEmailAndPassword(firebaseAuth, userdata.email, userdata.password)
      if (user) {
        const token = await user.getIdToken()
        const res = await request(req_constants.POST, `${REACT_APP_AUTH}/auth/register`, null, { user: userdata, cart }, token)

        localStorage.setItem('token', token)
        localStorage.setItem('user', res?.data?.user._id)
        localStorage.setItem('cart', JSON.stringify(res?.data?.cart))
        Swal.fire({
          title: 'Usuario creado correctamente',
          text: `Email: ${res?.data?.email}`,
          icon: 'success'
        })
        return { ...res, token: token }
      }
    } catch (error) {
      const firebaseError = error.message.replace('Firebase: Error', '').match(/\((.*)\)/).pop()
      if (firebaseError === 'auth/email-already-in-use') {
        Swal.fire({
          title: 'Error!',
          text: `Ya existe una cuenta con ese mail`,
          icon: 'error'
        })
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Hay un error con la registracion',
          icon: 'error'
        })
      }
      return firebaseError
    }
  }
)

export const VERIFY_TOKEN = createAsyncThunk(
  'VERIFY_TOKEN', async () => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_AUTH}/auth/verify-token`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const RESET_TIMER = createAsyncThunk(
  'RESET_TIMER', async () => {
    return true
  }
)

export const LOGOUT = createAsyncThunk(
  'LOGOUT', async () => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('cart')
      localStorage.removeItem('admin')
      localStorage.removeItem('reorder_cart')
      localStorage.removeItem('order')
      localStorage.removeItem('user_auth')
      localStorage.removeItem('timer_duration')
      await firebaseAuth.signOut()

    } catch (error) {
      const firebaseError = error.message.replace('Firebase: Error', '').match(/\((.*)\)/).pop()
      Swal.fire({
        title: 'Error!',
        text: `${firebaseError}`,
        icon: 'error'
      })
      return firebaseError
    }
  }
)

export const GET_USER_CART = createAsyncThunk(
  'GET_USER_CART', async () => {
    try {
      const idUser = localStorage.getItem('user')
      const res = await request(req_constants.GET, `${REACT_APP_CART}/cart/${idUser}`, null, null)
      localStorage.setItem('cart', JSON.stringify(res?.data))

      return res
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const ADD_TO_CART = createAsyncThunk(
  'ADD_TO_CART', async (subprod) => {
    try {
      const idUser = localStorage.getItem('user')
      const res = await request(req_constants.POST, `${REACT_APP_CART}/cart/add/${idUser}`, null, subprod)
      if (res.data) {
        localStorage.setItem('cart', JSON.stringify(res.data))
      }
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const REMOVE_FROM_CART = createAsyncThunk(
  'REMOVE_FROM_CART', async (subprod) => {
    try {
      const idUser = localStorage.getItem('user')
      const res = await request(req_constants.DELETE, `${REACT_APP_CART}/cart/remove/${idUser}`, null, subprod)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const REMOVE_FROM_LOCAL_CART = createAsyncThunk(
  'REMOVE_FROM_LOCAL_CART', async (subprod) => {
    try {
      let cart = localStorage.getItem('cart')
      let updatedCart
      if (cart) {
        cart = JSON.parse(cart)
        updatedCart = removeFromCart(subprod, cart)
        if (!updatedCart) localStorage.removeItem('cart')
        else localStorage.setItem('cart', JSON.stringify(updatedCart))
      }
      return updatedCart
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const ADD_TO_LOCAL_CART = createAsyncThunk(
  'ADD_TO_LOCAL_CART', async (subprod) => {
    try {
      let cart = localStorage.getItem('cart')
      let reorderCart = localStorage.getItem('reorder-cart')
      let user = localStorage.getItem('user')
      let newCart, updatedCart, isReorder

      if (reorderCart && Object.keys(reorderCart).length !== 0) {
        cart = JSON.parse(reorderCart);
        isReorder = true
      } else if (cart && Object.keys(cart).length !== 0) {
        cart = JSON.parse(cart);
        isReorder = false
      }

      if (cart && Object.keys(cart).length !== 0) {
        updatedCart = fillCart(subprod, cart)
        localStorage.setItem(isReorder ? 'reorder-cart' : 'cart', JSON.stringify(updatedCart))
        return updatedCart
      } else {
        newCart = addLocalCart(subprod, user)
        localStorage.setItem(isReorder ? 'reorder-cart' : 'cart', JSON.stringify(newCart))
        return newCart
      }

    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const SAVE_RE_ORDER_CART = createAsyncThunk(
  'SAVE_RE_ORDER_CART', async (cart) => {
    try {
      const idUser = localStorage.getItem('user')
      if (idUser) {
        cart.user = idUser
      }
      cart.active = true
      localStorage.setItem('cart', JSON.stringify(cart))
      return cart
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_PRODUCTS = createAsyncThunk(
  'GET_PRODUCTS', async ({ filterData, input, page }) => {
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
      });
      
      if (input?.length > 0) queryParams.set('input', input);
      if (filterData.age.length > 0) queryParams.set('age', filterData.age.join(','));
      if (filterData.animal.length > 0) queryParams.set('animal', filterData.animal.join(','));
      if (filterData.size.length > 0) queryParams.set('size', filterData.size.join(','));
      if (filterData.price) queryParams.set('price', filterData.price);

      const res = await request(req_constants.GET, `${REACT_APP_PROD}/products?${queryParams.toString()}`, null, filterData)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const CREATE_USER_ADDRESS = createAsyncThunk(
  'CREATE_USER_ADDRESS', async (address) => {
    try {
      const idUser = localStorage.getItem('user')
      const res = await request(req_constants.POST, `${REACT_APP_AUTH}/user/address/${idUser}`, null, address)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_USER_ADDRESS = createAsyncThunk(
  'GET_USER_ADDRESS', async () => {
    try {
      const idUser = localStorage.getItem('user')
      const res = await request(req_constants.GET, `${REACT_APP_AUTH}/user/address/${idUser}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const UPDATE_USER_ADDRESS = createAsyncThunk(
  'UPDATE_USER_ADDRESS', async (addressData) => {
    try {
      const idUser = localStorage.getItem('user')
      const res = await request(req_constants.PUT, `${REACT_APP_AUTH}/user/address/${idUser}`, null, addressData)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const SET_USER_ADDRESS = createAsyncThunk(
  'SET_USER_ADDRESS', (id) => {
    return id
  }
)

export const DELETE_USER_ADDRESS = createAsyncThunk(
  'DELETE_USER_ADDRESS', async (idAddress) => {
    try {
      const res = await request(req_constants.DELETE, `${REACT_APP_AUTH}/user/address`, null, { _id: idAddress }, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const UPDATE_LOCAL_SUBPRODUCT_QUANTITY = createAsyncThunk(
  'UPDATE_LOCAL_SUBPRODUCT_QUANTITY', async (subprodNewQuantity) => {
    try {
      let cart = localStorage.getItem('cart')
      if (cart) {
        cart = JSON.parse(cart)
        const updatedCart = updateSubprodQuantity(subprodNewQuantity, cart)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
        return cart
      }
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const UPDATE_SUBPRODUCT_QUANTITY = createAsyncThunk(
  'UPDATE_SUBPRODUCT_QUANTITY', async (subprodNewQuantity) => {
    try {
      const idUser = localStorage.getItem('user')
      const res = await request(req_constants.PUT, `${REACT_APP_CART}/cart/update/quantity/${idUser}`, null, subprodNewQuantity)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const LOCK_SUBPROD_USER = createAsyncThunk(
  'LOCK_SUBPROD_USER', async (lockCart) => {
    try {
      const res = await request(req_constants.POST, `${REACT_APP_PROD}/subproducts/lock`, null, lockCart)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const REMOVE_LOCK_SUBPROD_USER = createAsyncThunk(
  'REMOVE_LOCK_SUBPROD_USER', async () => {
    try {
      const idUser = localStorage.getItem('user')
      const res = await request(req_constants.DELETE, `${REACT_APP_PROD}/subproducts/lock/${idUser}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_OPEN_OFFERS = createAsyncThunk(
  'GET_OPEN_OFFERS', async () => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_OFFER}/offers/open`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const CREATE_USER_ORDER = createAsyncThunk(
  'CREATE_USER_ORDER', async (orderData) => {
    try {
      const res = await request(req_constants.POST, `${REACT_APP_ORDER}/orders/new`, null, orderData)
      if (res.status === 201) {
        localStorage.removeItem('cart')
        localStorage.removeItem('reorder_cart')
        localStorage.setItem('order', res.data._id)
      }
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_USER_ORDER = createAsyncThunk(
  'GET_USER_ORDER', async (orderId) => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_ORDER}/orders/order/${orderId}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_ACCOUNT_INFO = createAsyncThunk(
  'GET_ACCOUNT_INFO', async () => {
    try {
      const user = localStorage.getItem('user')
      const res = await request(req_constants.GET, `${REACT_APP_AUTH}/user/info/${user}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_ACCOUNT_ORDERS = createAsyncThunk(
  'GET_ACCOUNT_ORDERS', async () => {
    try {
      const user = localStorage.getItem('user')
      const res = await request(req_constants.GET, `${REACT_APP_AUTH}/user/orders/${user}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const RESET_PASSWORD = createAsyncThunk(
  'RESET_PASSWORD', async (email) => {
    try {
      await sendPasswordResetEmail(firebaseAuth, email)
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_HIGHLIGHT_SUBPRODS = createAsyncThunk(
  'GET_HIGHLIGHT_SUBPRODS', async () => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_PROD}/subproducts/highlight`, null, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_LANDING_IMAGES = createAsyncThunk(
  'GET_LANDING_IMAGES', async (type) => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_PROD}/products/landing-images?type=${type}`, null, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const SET_INPUT_SEARCH = createAsyncThunk(
  'SET_INPUT_SEARCH', (input_value) => {
    return input_value
  }
)