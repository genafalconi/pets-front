import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { firebaseAuth, providerGoogle } from "../../helpers/firebase";
import { LOGIN_WITH_GOOGLE, REGISTER_WITH_EMAIL, SAVE_LOCAL_CART } from "../../redux/actions";
import { signInWithPopup } from "firebase/auth";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import '../../styles/modals/modalRegister.scss';
import { AdvancedImage } from "@cloudinary/react";
import { cloudinaryImg } from "../../helpers/cloudinary";

const GOOGLE_PUBLIC_ID = 'Ppales/Google'

export default function Register({ show, onHideLogin, onHideRegister, onModalClose }) {

  const dispatch = useDispatch()
  const cartReducer = useSelector((state) => state.clientReducer.cart)

  const [isLoading, setIsLoading] = useState(false)
  const [register, setRegister] = useState({
    email: '',
    fullName: '',
    phone: '',
    password: ''
  })

  let token = localStorage.getItem('token')
  let userLocal = localStorage.getItem('user')

  const handleChange = (event) => {
    setRegister({
      ...register,
      [event.target.name]: event.target.value
    })
  }

  const registerUser = (event) => {
    event.preventDefault()
    setIsLoading(true)
    dispatch(REGISTER_WITH_EMAIL(register))
      .then((response) => {
        if (response.payload.status === 201) {
          if (Object.keys(cartReducer).length !== 0) {
            dispatch(SAVE_LOCAL_CART(cartReducer)).then((res) => {
              onHideRegister()
            })
          }
          Swal.fire({
            title: 'Usuario creado correctamente',
            text: `Mail: ${response.payload.data.email}`,
            icon: 'success'
          })
        }
        setIsLoading(false)
        handleHide()
      }).catch((error) => {
        const errorMessage = error.message;
        setIsLoading(false)
        return errorMessage
      });
  }

  const registerWithGoogle = () => {
    setIsLoading(true)
    signInWithPopup(firebaseAuth, providerGoogle)
      .then((result) => {
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        const userLocal = {
          email: user.email,
          fullName: user.displayName,
          id: user.uid,
          phoneNumber: user.phoneNumber
        }
        localStorage.setItem('user', JSON.stringify(userLocal))
        localStorage.setItem('token', user.accessToken)
        dispatch(LOGIN_WITH_GOOGLE(userLocal))
        handleHide()
      }).catch((error) => {
        const errorMessage = error.message;
        // const credential = GoogleAuthProvider.credentialFromError(error);
        return errorMessage
      });
  }

  const showLogin = () => {
    onHideRegister()
    onHideLogin()
  }

  const handleHide = () => {
    onHideRegister();
    if (onModalClose) {
      onModalClose();
    }
  };

  useEffect(() => {

  }, [token, userLocal, isLoading, cartReducer])

  return (
    <Modal
      show={show}
      onHide={handleHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" >
          Registrate
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-register-body'>
        <Form className="register-form" onSubmit={registerUser}>
          <Form.Group className="register-form_group">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" placeholder='Email' defaultValue='' onChange={handleChange} />
            <Form.Label>Nombre y Apellido</Form.Label>
            <Form.Control type="text" name="fullName" placeholder='Nombre y Apellido' defaultValue='' onChange={handleChange} />
            <Form.Label>Telefono</Form.Label>
            <Form.Control type="text" name="phone" placeholder='Telefono' defaultValue='' onChange={handleChange} />
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" name="password" defaultValue='' onChange={handleChange} />
          </Form.Group>
        </Form>
        {
          isLoading ?
            <Button className='modal-body_register'>
              <Spinner as="span" animation="border" size='sm' role="status" aria-hidden="true" />
            </Button>
            :
            <Button className='modal-body_register' onClick={registerUser}>Registrarse</Button>
        }
        <AdvancedImage cldImg={cloudinaryImg(GOOGLE_PUBLIC_ID)} className='modal-body_google' alt="signInGoogle" onClick={registerWithGoogle} />
      </Modal.Body>
      <Modal.Footer className='modal-register-footer'>
        <p>Ya tenes cuenta?</p>
        <Button className='btn outline-primary' onClick={showLogin}>Inicia Sesíon</Button>
      </Modal.Footer>
    </Modal>
  )
}