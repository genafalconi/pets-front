import { createAsyncThunk } from '@reduxjs/toolkit'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import Swal from 'sweetalert2';
import { firebaseAuth } from '../helpers/firebase';
import { addLocalCart } from '../helpers/addLocalCart';
import { constants } from '../helpers/constants';
import { fillCart } from '../helpers/fillCart';
import { removeFromCart } from '../helpers/removeFromCart';
import { request } from '../helpers/request'
import updateSubprodQuantity from '../helpers/updateSubprodQuantity';
const { REACT_APP_AUTH, REACT_APP_CART, REACT_APP_PROD, REACT_APP_ORDER, REACT_APP_OFFER } = process.env;

export const LOGIN_WITH_EMAIL = createAsyncThunk(
  'LOGIN_WITH_EMAIL', async (dataLogin) => {
    try {
      const { user } = await signInWithEmailAndPassword(firebaseAuth, dataLogin.email, dataLogin.password)
      if (user) {
        const token = await user.getIdToken()
        const res = await request(constants.POST, `${REACT_APP_AUTH}/auth/login`, null, user, token)

        if (res.status === 201) {
          localStorage.setItem('user', res.data.user._id)
          localStorage.setItem('cart', JSON.stringify(res.data.cart ? res.data.cart : {}))
          const isLoggedUser = localStorage.getItem('user')
          if (isLoggedUser) {
            localStorage.setItem('token', token)
          }

          return { ...res, token: token }
        }
      }
    } catch (error) {
      console.log(error)
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
  'LOGIN_WITH_GOOGLE', async (user) => {
    try {
      const token = localStorage.getItem('token')
      const res = await request(constants.POST, `${REACT_APP_AUTH}/auth/login`, null, user, token)

      if (res.status === 201) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', res?.data?.user?._id)
        localStorage.setItem('cart', JSON.stringify(res?.data?.cart))

        return { ...res, token: token }
      }
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

export const REGISTER_WITH_EMAIL = createAsyncThunk(
  'REGISTER_WITH_EMAIL', async (register) => {
    try {
      const { user } = await createUserWithEmailAndPassword(firebaseAuth, register.email, register.password)
      if (user) {
        const token = await user.getIdToken()
        const res = await request(constants.POST, `${REACT_APP_AUTH}/auth/register`, null, register, token)

        localStorage.setItem('token', token)
        localStorage.setItem('user', res?.data?._id)
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
      const token = localStorage.getItem('token')
      const res = await request(constants.GET, `${REACT_APP_AUTH}/auth/verify-token`, null, null, token)

      return res?.data
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

export const LOGOUT = createAsyncThunk(
  'LOGOUT', async () => {
    try {
      await firebaseAuth.signOut()
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('cart')

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
      const token = localStorage.getItem('token')
      const idUser = localStorage.getItem('user')

      const res = await request(constants.GET, `${REACT_APP_CART}/cart/${idUser}`, null, null, token)
      localStorage.setItem('cart', JSON.stringify(res?.data))

      return res
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

export const ADD_TO_CART = createAsyncThunk(
  'ADD_TO_CART', async (subprod) => {
    try {
      const token = localStorage.getItem('token')
      const idUser = localStorage.getItem('user')

      const res = await request(constants.POST, `${REACT_APP_CART}/cart/add/${idUser}`, null, subprod, token)
      localStorage.setItem('cart', JSON.stringify(res?.data))

      return res?.data
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

export const REMOVE_FROM_CART = createAsyncThunk(
  'REMOVE_FROM_CART', async (subprod) => {
    try {
      const token = localStorage.getItem('token')
      const idUser = localStorage.getItem('user')

      const res = await request(constants.DELETE, `${REACT_APP_CART}/cart/remove/${idUser}`, null, subprod, token)
      localStorage.setItem('cart', JSON.stringify(res?.data))

      return res?.data
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

export const ADD_TO_LOCAL_CART = createAsyncThunk(
  'ADD_TO_LOCAL_CART', async (subprod) => {
    try {
      let cart = localStorage.getItem('cart')
      let newCart, updatedCart

      if (cart) {
        cart = JSON.parse(cart)
        updatedCart = fillCart(subprod, cart)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
        return updatedCart
      } else {
        newCart = addLocalCart(subprod)
        localStorage.setItem('cart', JSON.stringify(newCart))
        return newCart
      }
    } catch (error) {
      console.log(error)
      Swal.fire({
        title: 'Error!',
        text: `${error}`,
        icon: 'error'
      })
      return error
    }
  }
)

export const SAVE_LOCAL_CART = createAsyncThunk(
  'SAVE_LOCAL_CART', async (cart) => {
    try {
      const token = localStorage.getItem('token')
      const idUser = localStorage.getItem('user')
      if (cart) {
        const res = await request(constants.POST, `${REACT_APP_CART}/cart/create/${idUser}`, null, cart, token)
        localStorage.setItem('cart', JSON.stringify(res?.data))
        return res?.data
      }
      return true
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: `${error}`,
        icon: 'error'
      })
      return error
    }
  }
)

export const GET_ACTIVE_PRODUCTS = createAsyncThunk(
  'GET_ACTIVE_PRODUCTS', async (query) => {
    try {
      const token = localStorage.getItem('token')
      let param = 'active'
      if (query && query !== undefined) {
        param = `active?animal=${query}`
      }
      const res = await request(constants.GET, `${REACT_APP_PROD}/products/${param}`, null, null, token)
      return res?.data
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: `${error}`,
        icon: 'error'
      })
      return error
    }
  }
)

export const GET_FILTER_PRODUCTS = createAsyncThunk(
  'GET_FILTER_PRODUCTS', async (filterData) => {
    try {
      const token = localStorage.getItem('token')
      const res = await request(constants.POST, `${REACT_APP_PROD}/products/filter`, null, filterData, token)
      return res?.data
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: `${error}`,
        icon: 'error'
      })
      return error
    }
  }
)

export const CREATE_USER_ADDRESS = createAsyncThunk(
  'CREATE_USER_ADDRESS', async (address) => {
    try {
      const token = localStorage.getItem('token')
      const idUser = localStorage.getItem('user')
      const res = await request(constants.POST, `${REACT_APP_AUTH}/user/address/${idUser}`, null, address, token)

      return res?.data
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: `${error}`,
        icon: 'error'
      })
      return error
    }
  }
)

export const GET_USER_ADDRESS = createAsyncThunk(
  'GET_USER_ADDRESS', async () => {
    try {
      const token = localStorage.getItem('token')
      const idUser = localStorage.getItem('user')
      const res = await request(constants.GET, `${REACT_APP_AUTH}/user/address/${idUser}`, null, null, token)
      return res?.data
    } catch (error) {
      return error
    }
  }
)

export const SET_USER_ADDRESS = createAsyncThunk(
  'SET_USER_ADDRESS', (id) => {
    return id
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
      Swal.fire({
        title: 'Error!',
        text: `${error}`,
        icon: 'error'
      })
      return error
    }
  }
)

export const UPDATE_SUBPRODUCT_QUANTITY = createAsyncThunk(
  'UPDATE_SUBPRODUCT_QUANTITY', async (subprodNewQuantity) => {
    try {
      const token = localStorage.getItem('token')
      const idUser = localStorage.getItem('user')
      const res = await request(constants.PUT, `${REACT_APP_CART}/cart/update/quantity/${idUser}`, null, subprodNewQuantity, token)
      localStorage.setItem('cart', JSON.stringify(res?.data))

      return res?.data
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: `${error}`,
        icon: 'error'
      })
      return error
    }
  }
)

export const LOCK_SUBPROD_USER = createAsyncThunk(
  'LOCK_SUBPROD_USER', async (lockCart) => {
    try {
      const token = localStorage.getItem('token')
      const res = await request(constants.POST, `${REACT_APP_PROD}/subproducts/lock`, null, lockCart, token)

      return res?.data
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: `${error}`,
        icon: 'error'
      })
      return error
    }
  }
)

export const REMOVE_LOCK_SUBPROD_USER = createAsyncThunk(
  'REMOVE_LOCK_SUBPROD_USER', async () => {
    try {
      const token = localStorage.getItem('token')
      const idUser = localStorage.getItem('user')
      const res = await request(constants.DELETE, `${REACT_APP_PROD}/subproducts/lock/${idUser}`, null, null, token)

      return res?.data
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: `${error}`,
        icon: 'error'
      })
      return error
    }
  }
)

export const GET_OPEN_OFFERS = createAsyncThunk(
  'GET_OPEN_OFFERS', async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await request(constants.GET, `${REACT_APP_OFFER}/offers/open`, null, null, token)

      return res?.data
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: `${error}`,
        icon: 'error'
      })
      return error
    }
  }
)

export const CREATE_USER_ORDER = createAsyncThunk(
  'CREATE_USER_ORDER', async (orderData) => {
    try {
      const token = localStorage.getItem('token')
      const res = await request(constants.POST, `${REACT_APP_ORDER}/orders/new`, null, orderData, token)

      if (res.status === 201) {
        localStorage.removeItem('cart')
        localStorage.setItem('order', res.data._id)
      }
      return res?.data
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: `${error}`,
        icon: 'error'
      })
      return error
    }
  }
)

export const GET_USER_ORDER = createAsyncThunk(
  'GET_USER_ORDER', async (orderId) => {
    try {
      const token = localStorage.getItem('token')
      const res = await request(constants.GET, `${REACT_APP_ORDER}/orders/order/${orderId}`, null, null, token)

      return res?.data
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: `${error}`,
        icon: 'error'
      })
      return error
    }
  }
)