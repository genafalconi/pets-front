import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { firebaseAuth, providerGoogle } from "../../helpers/firebase";
import { LOGIN_WITH_GOOGLE, REGISTER_WITH_EMAIL } from "../../redux/actions";
import { signInWithPopup } from "firebase/auth";
import { Form, Button, Spinner, Modal, Col } from 'react-bootstrap';
import Swal from "sweetalert2";
import '../../styles/modals/modalRegister.scss';
import { AdvancedImage } from "@cloudinary/react";
import { cloudinaryImg } from "../../helpers/cloudinary";
import { Formik } from 'formik';
import * as yup from 'yup';
import { type_ord } from "../../helpers/constants";

const GOOGLE_PUBLIC_ID = 'Ppales/Google'

export default function Register({ show, onHideLogin, onHideRegister, onModalClose }) {

  const dispatch = useDispatch()
  const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : null;

  const [isLoading, setIsLoading] = useState(false)

  const validationSchema = yup.object().shape({
    email: yup.string().email('Correo electrónico inválido').required('Correo electrónico requerido'),
    full_name: yup.string().required('Nombre y Apellido requeridos'),
    phone: yup.string().required('Teléfono requerido'),
    password: yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .max(20, 'La contraseña debe tener menos de 20 caracteres')
      .required('Contraseña requerida'),
  });

  let token = localStorage.getItem('token')
  let userLocal = localStorage.getItem('user')

  const registerUser = (values) => {
    setIsLoading(true)

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

    dispatch(REGISTER_WITH_EMAIL({ userdata: values, cart: modifiedCart, order_type: type_ord.ORDER }))
      .then((response) => {
        if (response.payload.status === 201) {
          onHideRegister()
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
          full_name: user.displayName,
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

  }, [token, userLocal, isLoading, cart])

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
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            email: '',
            full_name: '',
            phone: '',
            password: '',
          }}
          onSubmit={(values, { setSubmitting }) => {
            registerUser(values);
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
            <Form noValidate onSubmit={handleSubmit} className='modal-body_registerform'>
              <Form.Group as={Col} controlId="validationFormikEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
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
              <Form.Group as={Col} controlId="validationFormikFullName">
                <Form.Label>Nombre y Apellido</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre y Apellido"
                  name="full_name"
                  value={values.full_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.full_name && !!errors.full_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.full_name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="validationFormikPhone">
                <Form.Label>Telefono</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Telefono"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.phone && !!errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="validationFormikPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Contraseña"
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
                  <Button className='modal-body_register' disabled>
                    <Spinner as="span" animation="border" size='sm' role="status" aria-hidden="true" />
                  </Button>
                  :
                  <Button className='modal-body_register' type="submit" disabled={!isValid}>Registrarse</Button>
              }
            </Form>
          )}
        </Formik>
        <AdvancedImage cldImg={cloudinaryImg(GOOGLE_PUBLIC_ID)} className='modal-body_google' alt="signInGoogle" onClick={registerWithGoogle} />
      </Modal.Body>
      <Modal.Footer className='modal-register-footer'>
        <p>Ya tenes cuenta?</p>
        <Button className='btn outline-primary' onClick={showLogin}>Inicia Sesíon</Button>
      </Modal.Footer>
    </Modal>
  )
}