import { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import ProductCheckout from './ProductCheckout';
import '../../styles/components/checkout.scss'
import { useDispatch, useSelector } from 'react-redux';
import { LOCK_SUBPROD_USER, GET_USER_ADDRESS, SET_USER_ADDRESS } from '../../redux/actions';
import AddressList from './AddressList';
import Address from './Address';
import Timer from '../atomic/Timer';
import PaymentDate from './PaymentDate';
import eventBus from '../../helpers/event-bus';

export default function Checkout() {

  const dispatch = useDispatch()

  const cartReducer = useSelector((state) => state.clientReducer.cart)
  const addresses = useSelector((state) => state.clientReducer.addresses)

  const cart = JSON.parse(localStorage.getItem('cart'))
  const user = localStorage.getItem('user')

  const [isLoading, setIsLoading] = useState(false)
  const [modalAddress, setModalAddress] = useState(false)
  const [showPaymentDate, setShowPaymentDate] = useState(false)
  const [showCheckout, setShowCheckout] = useState(true)
  const [settedAddress, setSettedAddress] = useState(true)
  const [lockCart, setLockCart] = useState({
    user: '',
    subprods: []
  })

  const handleChargeAddress = () => {
    setModalAddress(!modalAddress)
  }

  const handleCoordinate = () => {
    setShowPaymentDate(!showPaymentDate)
    setShowCheckout(!showCheckout)
  }

  const getUserAddresses = async () => {
    setIsLoading(true)
    dispatch(GET_USER_ADDRESS()).then((res) => {
      if (res.payload) {
        setIsLoading(false)
      }
    })
  }

  const handlePayCart = () => {
    const subprods = []
    cart?.products?.map((elem) => subprods.push({ idSubprod: elem.id, quantity: elem.quantity }))
    if (!lockCart.user && subprods.length > 0) {
      setLockCart({
        user: user,
        subprods: subprods
      })
    }
  }

  useEffect(() => {
    const selectedAddress = addresses.find((elem) => elem.id === settedAddress)
    dispatch(SET_USER_ADDRESS(selectedAddress))
  }, [settedAddress, dispatch, addresses])

  useEffect(() => {
    handlePayCart()
    if (lockCart.subprods.length > 0) {
      dispatch(LOCK_SUBPROD_USER(lockCart))
    }
    // eslint-disable-next-line
  }, [lockCart, cartReducer, user])

  useEffect(() => {
    getUserAddresses()
    // eslint-disable-next-line
  }, [modalAddress]);

  useEffect(() => {
    const handleGoBack = (isTrue) => {
      if (isTrue) {
        setShowPaymentDate(false)
        setShowCheckout(true)
      }
    }
    eventBus.on('go-back-button', handleGoBack)
    return () => {
      eventBus.off('go-back-button', handleGoBack)
    }
  }, [])

  return (
    <div className="content-page">
      {
        isLoading ? (
          <div className="loading">
            <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
          </div>
        ) : (
          <>
            {showCheckout ? (
              <>
                <div className="title">
                  <h1>Resumen</h1>
                </div>
                <div className="checkout-container">
                  <div className="cart-items">
                    <div className="subtitle">
                      <h2>Productos</h2>
                    </div>
                    {cart?.products?.map(item => {
                      return (
                        <ProductCheckout
                          key={item.id}
                          id={item.id}
                          productName={item.productName}
                          price={item.price}
                          size={item.size}
                          quantity={item.quantity}
                        />
                      );
                    })}
                    <div className="cart-total">
                      <p>Total:</p>
                      <p>${cart?.totalPrice}</p>
                    </div>
                  </div>
                  <div className="address">
                    <div className="subtitle">
                      <h2>Direccion</h2>
                    </div>
                    <div>
                      {addresses?.length > 0 ? (
                        addresses?.map(elem => {
                          return (
                            <AddressList id={elem.id} modal={false} key={elem.id} street={elem.street} number={elem.number} floor={elem.floor} flat={elem.flat} city={elem.city} province={elem.province} extra={elem.extra} setSettedAddress={setSettedAddress} />
                          );
                        })
                      ) : (
                        <>
                          <span className="error-info">No hay direcciones cargadas</span>
                          <div className="secondary-button">
                            <button onClick={handleChargeAddress}>Cargar</button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <Timer />
                </div>
                <div className="primary-button">
                  <button onClick={handleCoordinate}>Continuar</button>
                </div>
              </>
            ) : (
              <PaymentDate />
            )}
          </>
        )
      }
      <Address show={modalAddress} onHideAddress={() => setModalAddress(!modalAddress)} />
    </div >
  );
}  