import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { firebaseAuth, providerGoogle } from "../../firebase";
import { LOGIN_WITH_GOOGLE, REGISTER_WITH_EMAIL } from "../../redux/actions";
import googleImage from '../../google.png';
import { signInWithPopup } from "firebase/auth";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import '../../styles/modals/modalRegister.scss';

export default function Register({ show, onHideLogin, onHideRegister }) {

  const dispatch = useDispatch()
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
          Swal.fire({
            title: 'Usuario creado correctamente',
            text: `Mail: ${response.payload.data.email}`,
            icon: 'success'
          })
          onHideRegister()
        }
        setIsLoading(false)
      }).catch((error) => {
        const errorMessage = error.message;
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
        onHideRegister()
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

  useEffect(() => {

  }, [token, userLocal, isLoading])

  return (
    <Modal
      show={show}
      onHide={onHideRegister}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className='modal-register'
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
            <Form.Control type="email" name="email" placeholder='Email' onChange={handleChange} />
            <Form.Label>Nombre y Apellido</Form.Label>
            <Form.Control type="text" name="fullName" placeholder='Nombre y Apellido' onChange={handleChange} />
            <Form.Label>Telefono</Form.Label>
            <Form.Control type="text" name="phone" placeholder='Telefono' onChange={handleChange} />
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" name="password" onChange={handleChange} />
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
        <img className='modal-body_google' src={googleImage} alt="signInGoogle" onClick={registerWithGoogle} />
      </Modal.Body>
      <Modal.Footer className='modal-register-footer'>
        <p>Ya tenes cuenta?</p>
        <Button onClick={showLogin}>Inicia Sesíon</Button>
      </Modal.Footer>
    </Modal>
  )
}