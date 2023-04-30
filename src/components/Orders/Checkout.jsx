import { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import ProductCheckout from './ProductCheckout';
import '../../styles/components/checkout.scss'
import { useDispatch, useSelector } from 'react-redux';
import { LOCK_SUBPROD_USER, GET_USER_ADDRESS, SET_USER_ADDRESS } from '../../redux/actions';
import AddressList from './AddressList';
import Timer from '../atomic/Timer';
import PaymentDate from './PaymentDate';
import eventBus from '../../helpers/event-bus';
import Address from './Address';

export default function Checkout() {
  const dispatch = useDispatch()

  const cartReducer = useSelector((state) => state.clientReducer.cart)
  const addresses = useSelector((state) => state.clientReducer.addresses)
  const userReducer = useSelector((state) => state.clientReducer.user)

  const cart = JSON.parse(localStorage.getItem('cart'))
  const user = localStorage.getItem('user')

  const [isLoading, setIsLoading] = useState(true)
  const [validContinue, setValidContinue] = useState(false)
  const [modalAddress, setModalAddress] = useState(false)
  const [showPaymentDate, setShowPaymentDate] = useState(false)
  const [showCheckout, setShowCheckout] = useState(true)
  const [settedAddress, setSettedAddress] = useState(true)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [addressUpdated, setAddressUpdated] = useState(false)
  const [lockCart, setLockCart] = useState({
    user: '',
    subproducts: []
  })

  const handleChargeAddress = () => {
    setModalAddress(!modalAddress)
  }

  const handleCoordinate = () => {
    setShowPaymentDate(!showPaymentDate)
    setShowCheckout(!showCheckout)
  }

  const getUserAddresses = async () => {
    dispatch(GET_USER_ADDRESS()).then((res) => {
      if (res.payload) {
        if (Array.isArray(addresses)) {
          let selectedAddress = addresses.find((elem) => elem._id === settedAddress)
          if (selectedAddress) {
            dispatch(SET_USER_ADDRESS(selectedAddress))
            setValidContinue(true)
          } else {
            setValidContinue(false)
          }
        }
      }
    })
  }

  const handlePayCart = () => {
    const subprods = []
    cart?.subproducts?.map((elem) => subprods.push({ subprod: elem.subproduct._id, quantity: elem.quantity }))
    if (!lockCart.user && subprods.length > 0) {
      setLockCart({
        user: user,
        subproducts: subprods
      })
    }
  }

  useEffect(() => {
    let selectedAddress
    if (Array.isArray(addresses)) {
      selectedAddress = Array.from(addresses).find((elem) => elem._id === settedAddress)
    }

    if (selectedAddress) {
      dispatch(SET_USER_ADDRESS(selectedAddress))
      setValidContinue(true)
    } else {
      setValidContinue(false)
    }
  }, [settedAddress, dispatch, addresses])

  useEffect(() => {
    handlePayCart()
    if (lockCart.subproducts.length > 0) {
      dispatch(LOCK_SUBPROD_USER(lockCart))
    }
    setTimeout(() => {
      setIsLoading(false)
    }, [2800])
    // eslint-disable-next-line
  }, [lockCart, cartReducer, userReducer])

  useEffect(() => {
    getUserAddresses()
    // eslint-disable-next-line
  }, [addressUpdated]);

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
            <Timer />
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
                    {cart?.subproducts?.map(item => {
                      return (
                        <ProductCheckout
                          key={item.subproduct._id}
                          id={item.subproduct._id}
                          product_name={item.subproduct.product.name}
                          sell_price={item.subproduct.sell_price}
                          size={item.subproduct.size}
                          quantity={item.quantity}
                        />
                      );
                    })}
                    <div className="cart-total">
                      <p>Total:</p>
                      <p>${cart?.total_price.toFixed(2)}</p>
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
                            <AddressList id={elem._id} modal={false} key={elem._id} street={elem.street}
                              number={elem.number} floor={elem.floor} flat={elem.flat} city={elem.city}
                              province={elem.province} extra={elem.extra}
                              setSettedAddress={setSettedAddress} selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />
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
                      <div>
                        {
                          selectedAddress ? '' : <p>Selecciona una direccion</p>
                        }
                      </div>
                      <div className="third-button">
                        <button onClick={handleChargeAddress}>Cargar otra</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={validContinue ? "primary-button checkout" : "disabled-button checkout"}>
                  <button disabled={!validContinue} onClick={handleCoordinate}>Continuar</button>
                </div>
              </>
            ) : (
              <PaymentDate />
            )}
          </>
        )
      }
      <Address
        show={modalAddress}
        onHideAddress={() => setModalAddress(!modalAddress)}
        updateAddress={() => setAddressUpdated(!addressUpdated)}
        fromCheckout={true}
      />
    </div >
  );
}  