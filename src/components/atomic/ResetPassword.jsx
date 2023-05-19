import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { RESET_PASSWORD } from '../../redux/actions';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import '../../styles/components/account.scss'


export default function ResetPassword({ show, onHideReset }) {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState('');

  const resetPassword = useCallback(() => {
    setIsLoading(true);
    dispatch(RESET_PASSWORD(email)).then(() => {
      setIsLoading(false);
      setIsSent(true)
      setTimeout(() => {
        onHideReset();
      }, [2500])
    });
  }, [dispatch, email, onHideReset]);

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <Modal show={show} onHide={onHideReset} centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Resetar Contraseña</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="email-container-input">
          <p>Ingrese su email</p>
          <input type="text" value={email} onChange={handleChange} />
          {
            isSent && <span>El email fue enviado! Revisa tu correo spam</span>
          }
        </div>
        <div className="email-reset-button">
          {
            isLoading ?
              <Button className='modal-body_reset'>
                < Spinner as="span" animation="border" size='sm' role="status" aria-hidden="true" />
              </Button>
              :
              <Button className='modal-body_reset' onClick={resetPassword}>Enviar</Button>
          }
        </div>
      </Modal.Body>
    </Modal >
  );
}
