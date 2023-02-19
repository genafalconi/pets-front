import { createAsyncThunk } from '@reduxjs/toolkit'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import Swal from 'sweetalert2';
import { firebaseAuth } from '../firebase';
import { addLocalCart } from '../helpers/addLocalCart';
import { constants } from '../helpers/constants';
import { fillCart } from '../helpers/fillCart';
import { request } from '../helpers/request'
const { REACT_APP_AUTH, REACT_APP_CART, REACT_APP_PROD } = process.env;

export const LOGIN_WITH_EMAIL = createAsyncThunk(
  'LOGIN_WITH_EMAIL', async (dataLogin) => {
    try {
      const { user } = await signInWithEmailAndPassword(firebaseAuth, dataLogin.email, dataLogin.password)
      if (user) {
        const token = await user.getIdToken()
        const res = await request(constants.POST, `${REACT_APP_AUTH}/auth/login`, null, user, token)

        if (res.status === 201) {
          localStorage.setItem('token', token)
          localStorage.setItem('user', res.data.user.id)
          localStorage.setItem('cart', JSON.stringify(res.data.cart))
          return res
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
  'LOGIN_WITH_GOOGLE', async (user) => {
    try {
      const token = localStorage.getItem('token')
      const res = await request(constants.POST, `${REACT_APP_AUTH}/auth/login`, null, user, token)
      if (res.status === 201) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', res.data.user.id)
        localStorage.setItem('cart', JSON.stringify(res.data.cart))
        return res
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
        localStorage.setItem('user', JSON.stringify(res.data.id))
        Swal.fire({
          title: 'Usuario creado correctamente',
          text: `Email: ${res.data.email}`,
          icon: 'success'
        })
        return res
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
  'GET_USER_CART', async (user) => {
    try {
      const token = localStorage.getItem('token')
      const idUser = localStorage.getItem('user')

      const res = await request(constants.GET, `${REACT_APP_CART}/cart/${idUser}`, null, null, token)
      localStorage.setItem('cart', JSON.stringify(res.data))

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
      localStorage.setItem('cart', JSON.stringify(res.data))

      return res.data
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
      } else {
        newCart = addLocalCart(subprod)
        localStorage.setItem('cart', JSON.stringify(newCart))
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

export const SAVE_LOCAL_CART = createAsyncThunk(
  'SAVE_LOCAL_CART', async (cart) => {
    try {
      const token = localStorage.getItem('token')
      const idUser = localStorage.getItem('user')

      if (cart) {
        cart = JSON.parse(cart)
        const res = await request(constants.POST, `${REACT_APP_CART}/cart/create/${idUser}`, null, cart, token)
        localStorage.setItem('cart', JSON.stringify(res.data))
        return res
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
  'GET_ACTIVE_PRODUCTS', async (cart) => {
    try {
      const token = localStorage.getItem('token')
      const res = await request(constants.GET, `${REACT_APP_PROD}/products/active`, null, cart, token)
      return res.data
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