import { signInWithPopup } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { firebaseAuth, providerGoogle } from '../../helpers/firebase';
import { LOGIN_WITH_EMAIL, LOGIN_WITH_GOOGLE } from '../../redux/actions';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import '../../styles/modals/modalLogin.scss';
import { AdvancedImage } from '@cloudinary/react';
import { cloudinaryImg } from '../../helpers/cloudinary';
import { Form, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { type_ord } from '../../helpers/constants';

const GOOGLE_PUBLIC_ID = 'Ppales/Google';
const LOGO_PUBLIC_ID = 'Ppales/Logo';

export default function Login({ show, onHideLogin, onHideRegister, onModalClose }) {
  const dispatch = useDispatch();

  const token = localStorage.getItem('token');
  const userLocal = localStorage.getItem('user');
  const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : null;

  const [isLoading, setIsLoading] = useState(false);
  const [validLoginButton, setValidLoginButton] = useState(true);
  const [validGoogleButton, setValidGoogleButton] = useState(true);
  const schema = yup.object().shape({
    email: yup.string().email('Email inválido').required('Email requerido'),
    password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Contraseña requerida'),
  });

  const loginGoogle = () => {
    if (validGoogleButton) {
      setValidGoogleButton(false);
      setIsLoading(true);
      signInWithPopup(firebaseAuth, providerGoogle)
        .then((result) => {
          const user = result.user;
          const userLocal = {
            email: user.email,
            fullName: user.displayName,
            id: user.uid,
            phoneNumber: user.phoneNumber
          };

          let modifiedCart = cart
          if (cart && Object.keys(cart).length > 0) {
            const modifiedSubproducts = cart.subproducts.map(({ subproduct }) => {
              const { name, quantity, ...rest } = subproduct;
              return { subproduct: rest, quantity };
            });

            modifiedCart = {
              ...cart,
              subproducts: modifiedSubproducts
            };
          }
          dispatch(LOGIN_WITH_GOOGLE(
            { userdata: userLocal, cart: modifiedCart, token: result.user.accessToken }
          ))
            .then((response) => {
              if (response.payload.status === 201) {
                localStorage.setItem('token', user.accessToken);
                onHideLogin();
              }
              setValidGoogleButton(true);
            })
        })
        .catch((error) => {
          const errorMessage = error.message;
          return errorMessage;
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleHide = () => {
    onHideLogin();
    if (onModalClose) {
      onModalClose();
    }
  };

  const loginWithEmail = (values) => {
    setIsLoading(true);
    setValidLoginButton(false);
    let modifiedCart = cart
    if (cart && Object.keys(cart).length > 0) {
      const modifiedSubproducts = cart.subproducts.map(({ subproduct }) => {
        const { name, quantity, ...rest } = subproduct;
        return { subproduct: rest, quantity };
      });

      modifiedCart = {
        ...cart,
        subproducts: modifiedSubproducts
      };
    }
    dispatch(LOGIN_WITH_EMAIL({ userdata: values, cart: modifiedCart, order_type: type_ord.ORDER }))
      .then((response) => {
        if (response.payload.status === 201) {
          onHideLogin();
        }
        setValidLoginButton(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const showRegister = () => {
    onHideLogin()
    onHideRegister()
  }

  useEffect(() => {

  }, [token, userLocal, dispatch]);

  return (
    <Modal
      show={show}
      onHide={handleHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Log In
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-login-body'>
        <AdvancedImage cldImg={cloudinaryImg(LOGO_PUBLIC_ID)} className='modal-body_logo' alt="logo-pets" />
        <Formik
          validationSchema={schema}
          initialValues={{
            email: '',
            password: '',
          }}
          onSubmit={(values, { setSubmitting }) => {
            loginWithEmail(values);
            setSubmitting(false);
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
          }) => (
            <Form noValidate onSubmit={handleSubmit} className='modal-body_form'>
              <Form.Group as={Col} controlId="validationFormikEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.email && !!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="validationFormikPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.password && !!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
              {
                isLoading ?
                  <Button className='modal-body_login' disabled>
                    <Spinner as="span" animation="border" size='sm' role="status" aria-hidden="true" />
                  </Button>
                  :
                  <Button className='modal-body_login' type="submit" disabled={!isValid && !validLoginButton}>Iniciar Sesíon</Button>
              }
            </Form>
          )}
        </Formik>
        <AdvancedImage cldImg={cloudinaryImg(GOOGLE_PUBLIC_ID)} className='modal-body_google' alt="signInGoogle" onClick={loginGoogle} />
      </Modal.Body>
      <Modal.Footer className='modal-login-footer'>
        <p>Todavía no tenes cuenta?</p>
        <Button className='outline-primary' onClick={showRegister}>Registrate</Button>
      </Modal.Footer>
    </Modal>
  );
}