import { createAsyncThunk } from '@reduxjs/toolkit'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import Swal from 'sweetalert2';
import { firebaseAuth } from '../firebase';
import { constants } from '../helpers/constants';
import { request } from '../helpers/request'
const { REACT_APP_AUTH } = process.env;

export const LOGIN_WITH_EMAIL = createAsyncThunk(
    'LOGIN_WITH_EMAIL', async (dataLogin, onHide) => {
        try {
            const { user } = await signInWithEmailAndPassword(firebaseAuth, dataLogin.email, dataLogin.password)
            if (user) {
                const token = await user.getIdToken()
                const res = await request(constants.POST, `${REACT_APP_AUTH}/auth/login`, null, user, token)
                if (res.status === 201) {
                    localStorage.setItem('token', token)
                    localStorage.setItem('user', JSON.stringify(res.data.email))
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

export const REGISTER_WITH_EMAIL = createAsyncThunk(
    'REGISTER_WITH_EMAIL', async (register) => {
        try {
            const { user } = await createUserWithEmailAndPassword(firebaseAuth, register.email, register.password)
            if (user) {
                const token = await user.getIdToken()
                const res = await request(constants.POST, `${REACT_APP_AUTH}/auth/register`, null, register, token)
                localStorage.setItem('token', token)
                localStorage.setItem('user', JSON.stringify(res.data.email))
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
            localStorage.removeItem('token')
            localStorage.removeItem('user')
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