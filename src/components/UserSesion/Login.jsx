import { signInWithPopup } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { firebaseAuth, providerGoogle } from '../../firebase';
import googleImage from '../../google.png';
import { LOGIN_WITH_EMAIL, LOGIN_WITH_GOOGLE, SAVE_LOCAL_CART } from '../../redux/actions';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Logo from '../../logo.png'
import '../../styles/modals/modalLogin.scss';

export default function Login({ show, onHideLogin, onHideRegister, onModalClose }) {

  const dispatch = useDispatch()

  const token = localStorage.getItem('token')
  const userLocal = localStorage.getItem('user')
  const cartLocal = localStorage.getItem('cart')

  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState({
    email: '',
    password: ''
  })

  const loginGoogle = () => {
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
        setIsLoading(true)
        dispatch(LOGIN_WITH_GOOGLE(userLocal))
          .then((response) => {
            if (response.payload.status === 201) {
              dispatch(SAVE_LOCAL_CART(cartLocal)).then((res) => {
                localStorage.setItem('token', user.accessToken)
                onHideLogin()
              })
            }
            setIsLoading(false)
          })
      }).catch((error) => {
        const errorMessage = error.message;
        // const credential = GoogleAuthProvider.credentialFromError(error);
        return errorMessage
      });
  }

  const handleChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value
    })
  }

  const handleHide = () => {
    onHideLogin();
    if (onModalClose) {
      onModalClose();
    }
  };

  const loginWithEmail = (event) => {
    event.preventDefault()
    setIsLoading(true)
    dispatch(LOGIN_WITH_EMAIL(user))
      .then((response) => {
        if (response.payload.status === 201) {
          dispatch(SAVE_LOCAL_CART(cartLocal)).then((res) => {
            onHideLogin()
          })
        }
        setIsLoading(false)
      })
    setUser({
      email: '',
      password: ''
    })
  }

  const showRegister = () => {
    onHideLogin()
    onHideRegister()
  }

  useEffect(() => {

  }, [token, userLocal, dispatch])

  return (
    <Modal
      show={show}
      onHide={handleHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" >
          Log In
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-login-body'>
        <img className='modal-body_logo' src={Logo} alt="logo-pets" />
        <form className='modal-body_form'>
          <input type="text" placeholder='email' name='email' defaultValue='' onChange={handleChange} />
          <input type="password" placeholder='password' defaultValue='' name='password' onChange={handleChange} />
        </form>
        {
          isLoading ?
            <Button className='modal-body_login'>
              <Spinner as="span" animation="border" size='sm' role="status" aria-hidden="true" />
            </Button>
            :
            <Button className='modal-body_login' onClick={loginWithEmail}>Iniciar Sesíon</Button>
        }
        <img className='modal-body_google' src={googleImage} alt="signInGoogle" onClick={loginGoogle} />
      </Modal.Body>
      <Modal.Footer className='modal-login-footer'>
        <p>Todavía no tenes cuenta?</p>
        <Button onClick={showRegister}>Registrate</Button>
      </Modal.Footer>
    </Modal>
  )
}