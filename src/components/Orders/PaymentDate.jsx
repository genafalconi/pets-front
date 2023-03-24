import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import eventBus from '../../helpers/event-bus';
import { CREATE_USER_ORDER, GET_OPEN_OFFERS } from '../../redux/actions';
import Spinner from 'react-bootstrap/Spinner';
import '../../styles/components/coordinate.scss'
import Cash from '../../cash.png'
import Mp from '../../mp.png'
import Trans from '../../transfe.png'
import Offers from '../atomic/Offers';
import Swal from 'sweetalert2';

export default function PaymentDate() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const offers = useSelector((state) => state.clientReducer.offers)
  const cart = useSelector((state) => state.clientReducer.cart)
  const address = useSelector((state) => state.clientReducer.address)

  const user = localStorage.getItem('user')

  const [isLoading, setIsLoading] = useState(true)
  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  const [selectedOfferData, setSelectedOfferData] = useState('');

  const handlePaymentType = (event) => {
    const selectedType = event.target.name;
    setSelectedPaymentType(selectedType);
  };

  const handleGoBack = () => {
    eventBus.emit('go-back-button', true)
  }

  const handleConfirm = async () => {
    const orderToCreate = {
      cart: cart,
      user: user,
      offer: selectedOfferData,
      payment: selectedPaymentType,
      address: address
    }
    dispatch(CREATE_USER_ORDER(orderToCreate))
      .then((res) => {
        if(res.payload.id) {
          Swal.fire({
            title: 'Pedido realizado con exito!',
            text: `Numero de orden: ${res.payload.id}`,
            icon: 'success'
          }).then(() => {
            navigate('/orders')
          })
        }
      })

  };

  useEffect(() => {
  }, [selectedOfferData])

  useEffect(() => {
    const handleOpenOffers = async () => {
      if (offers.length === 0) {
        await dispatch(GET_OPEN_OFFERS())
          .then((res) => {
            setIsLoading(false)
          })
      }
    }
    handleOpenOffers()
  }, [offers, dispatch])

  return (
    <>
      {
        isLoading ? (
          <div className="loading">
            <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
          </div>
        ) : (
          <>
            <div className="title">
              <h1>Coordinar</h1>
            </div>
            <div className="coordinate-container">
              <div className="date">
                <div className="subtitle">
                  <h2>Fecha de entrega</h2>
                </div>
                <Offers offers={offers} setSelectedOfferData={setSelectedOfferData} />
              </div>
              <div className="payment">
                <div className="subtitle">
                  <h2>Tipo de pago</h2>
                </div>
                <div className='payment-type'>
                  <img src={Cash} alt="cash" name='cash' className={selectedPaymentType === 'cash' ? 'selected-payment' : ''} onClick={handlePaymentType} />
                  <img src={Mp} alt="mp" name='mp' className={selectedPaymentType === 'mp' ? 'selected-payment' : ''} onClick={handlePaymentType} />
                  <img src={Trans} alt="transferencia" name='transferencia' className={selectedPaymentType === 'transferencia' ? 'selected-payment' : ''} onClick={handlePaymentType} />
                </div>
              </div>
            </div>
            <div className='coordinate-buttons'>
              <div className="secondary-button">
                <button onClick={handleGoBack}>Volver</button>
              </div>
              <div className="primary-button">
                <button onClick={handleConfirm} disabled={!selectedPaymentType || !selectedOfferData}>Confirmar</button>
              </div>
            </div>
          </>
        )
      }
    </>
  );
}
