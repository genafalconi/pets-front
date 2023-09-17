import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import eventBus from '../../helpers/event-bus';
import { CREATE_USER_ORDER, GET_OPEN_OFFERS, RESET_TIMER } from '../../redux/actions';
import Spinner from 'react-bootstrap/Spinner';
import '../../styles/components/coordinate.scss'
import Offers from '../atomic/Offers';
import Swal from 'sweetalert2';
import { AdvancedImage } from '@cloudinary/react';
import { cloudinaryImg } from '../../helpers/cloudinary';
import LazyComponent from '../../helpers/lazyComponents';
import { Button } from 'react-bootstrap';
import InfoPayment from '../atomic/InfoPayment';
import DogAnimation from '../atomic/DogAnimation';

const CASH_PUBLIC_ID = 'Payments/Efectivo'
const TRANS_PUBLIC_ID = 'Payments/Transferencia'
const MP_PUBLIC_ID = 'Payments/MercadoPago'

export default function PaymentDate() {

  const { order_type } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { offers, address, locks } = useSelector((state) => state.clientReducer);
  const user = useMemo(() => localStorage.getItem('user'), []);
  const cart = JSON.parse(localStorage.getItem('cart'));

  const [isLoading, setIsLoading] = useState(true);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [selectedOfferData, setSelectedOfferData] = useState(null);
  const [validContinue, setValidContinue] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handlePaymentType = useCallback((event) => {
    const selectedType = event.target.name;
    setSelectedPaymentType((prevType) => (prevType === selectedType ? null : selectedType));
  }, []);

  const handleGoBack = useCallback(() => {
    eventBus.emit('go-back-button', true);
  }, []);

  const handleConfirm = useCallback(() => {
    const orderToCreate = {
      cart,
      user,
      offer: selectedOfferData,
      payment_type: selectedPaymentType,
      address,
      locks,
      order_type
    };

    setIsConfirmed(true);
    dispatch(CREATE_USER_ORDER(orderToCreate))
      .then((res) => {
        setIsConfirmed(false);
        if (res.payload._id) {
          Swal.fire({
            title: 'Pedido realizado con éxito!',
            text: `Número de orden: ${res.payload._id}`,
            icon: 'success',
            timer: 2500,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          navigate('/new-order');
        }
      })
      .catch((error) => {
        setIsLoading(false);
      })
      .finally((fin) => {
        dispatch(RESET_TIMER())
      })
  }, [cart, dispatch, user, selectedOfferData, selectedPaymentType, address, locks, navigate, order_type]);

  useEffect(() => {
    if (selectedPaymentType && selectedOfferData) {
      setValidContinue(true);
    } else {
      setValidContinue(false);
    }
  }, [selectedOfferData, selectedPaymentType]);

  const handleOpenOffers = useCallback(() => {
    dispatch(GET_OPEN_OFFERS()).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    handleOpenOffers();
  }, [handleOpenOffers]);

  return (
    <>
      {
        isLoading ? (
          <DogAnimation />
        ) : (
          <>
            <div className="title">
              <h1>Coordinar</h1>
            </div>
            <InfoPayment />
            <div className="coordinate-container">
              <div className="date">
                <div className="subtitle">
                  <h2>Fecha de entrega</h2>
                </div>
                <LazyComponent>
                  <Offers offers={offers} setSelectedOfferData={setSelectedOfferData} />
                </LazyComponent>
                <div className='mt-3'>
                  {
                    selectedOfferData ? ''
                      : <span className="error-labels">Selecciona una oferta</span>
                  }
                </div>
              </div>
              <div className="payment">
                <div className="subtitle">
                  <h2>Método de pago</h2>
                </div>
                <div className='payment-type d-flex align-items-center justify-content-center'>
                  <div className='d-flex flex-column'>
                    <AdvancedImage cldImg={cloudinaryImg(CASH_PUBLIC_ID)} name='CASH' className={selectedPaymentType === 'CASH' ? 'selected-payment' : ''} onClick={handlePaymentType} />
                    <span className='.fs-6'>Efectivo</span>
                  </div>
                  <div className='d-flex flex-column'>
                    <AdvancedImage cldImg={cloudinaryImg(MP_PUBLIC_ID)} name='MP' className={selectedPaymentType === 'MP' ? 'selected-payment' : ''} onClick={handlePaymentType} />
                    <span className='.fs-6'>Tarjetas</span>
                  </div>
                  <div className='d-flex flex-column'>
                    <AdvancedImage cldImg={cloudinaryImg(TRANS_PUBLIC_ID)} name='TRANSFERENCIA' className={selectedPaymentType === 'TRANSFERENCIA' ? 'selected-payment' : ''} onClick={handlePaymentType} />
                    <span className='.fs-6'>Transferencia</span>
                  </div>
                </div>
                <div className='mt-3'>
                  {
                    selectedPaymentType ? ''
                      : <span className="error-labels">Selecciona un método de pago</span>
                  }
                </div>
              </div>
            </div>
            {
              isConfirmed ?
                <Button className='call-to-action_button_disabled' disabled>
                  <Spinner as="span" animation="border" size='sm' role="status" aria-hidden="true" />
                </Button>
                :
                <div className='coordinate-buttons'>
                  <div className="secondary-button go-back">
                    <button onClick={handleGoBack}>Volver</button>
                  </div>
                  <div className='call-to-action_button clickable'>
                    <Button className={`${!validContinue ? 'call-to-action_button_disabled' : 'call-to-action_button'}`}
                      onClick={validContinue ? handleConfirm : undefined} disabled={!validContinue}>Confirmar</Button>
                  </div>
                </div>
            }
          </>
        )
      }
    </>
  );
}
