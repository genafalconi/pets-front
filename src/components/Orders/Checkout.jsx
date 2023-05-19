import { useCallback, useEffect, useState } from 'react';
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
import LazyComponent from '../../helpers/lazyComponents';
import { useParams } from 'react-router-dom';
import { type_ord } from '../../helpers/constants';

export default function Checkout() {

  const { order_type } = useParams()
  const dispatch = useDispatch();
  const { cart: cartReducer, user: userReducer, addresses, reorder_cart } = useSelector((state) => state.clientReducer);

  let cart;
  if (order_type === type_ord.REORDER) {
    cart = JSON.parse(localStorage.getItem('reorder_cart'));
  } else {
    cart = JSON.parse(localStorage.getItem('cart'));
  }
  const user = localStorage.getItem('user');

  const [isLoading, setIsLoading] = useState(true);
  const [validContinue, setValidContinue] = useState(false);
  const [modalAddress, setModalAddress] = useState(false);
  const [showPaymentDate, setShowPaymentDate] = useState(false);
  const [showCheckout, setShowCheckout] = useState(true);
  const [settedAddress, setSettedAddress] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressUpdated, setAddressUpdated] = useState(false);
  const [lockCart, setLockCart] = useState({
    user: '',
    subproducts: []
  });

  const handleChargeAddress = useCallback(() => {
    setModalAddress(!modalAddress);
  }, [modalAddress]);

  const handleCoordinate = useCallback(() => {
    setShowPaymentDate(!showPaymentDate);
    setShowCheckout(!showCheckout);
  }, [showPaymentDate, showCheckout]);

  const getUserAddresses = useCallback(async () => {
    setIsLoading(true);
    dispatch(GET_USER_ADDRESS()).then((res) => {
      if (res.payload) {
        if (Array.isArray(addresses)) {
          let selectedAddress = addresses.find((elem) => elem._id === settedAddress);
          if (selectedAddress) {
            dispatch(SET_USER_ADDRESS(selectedAddress));
            setValidContinue(true);
          } else {
            setValidContinue(false);
          }
        }
      }
      setIsLoading(false);
    });
  }, [dispatch, addresses, settedAddress]);

  const handlePayCart = useCallback(() => {
    const subprods = [];
    cart?.subproducts?.forEach((elem) => subprods.push({ subprod: elem.subproduct._id, quantity: elem.quantity }));
    if (!lockCart.user && subprods.length > 0) {
      setLockCart({
        user: user,
        subproducts: subprods
      });
    }
  }, [cart, lockCart.user, user]);

  const handleGoBack = useCallback((isTrue) => {
    if (isTrue) {
      setShowPaymentDate(false);
      setShowCheckout(true);
    }
  }, []);

  useEffect(() => {
    let selectedAddress;
    if (Array.isArray(addresses)) {
      selectedAddress = Array.from(addresses).find((elem) => elem._id === settedAddress);
    }

    if (selectedAddress) {
      dispatch(SET_USER_ADDRESS(selectedAddress));
      setValidContinue(true);
    } else {
      setValidContinue(false);
    }
  }, [settedAddress, dispatch, addresses]);

  useEffect(() => {
    handlePayCart();
  }, [handlePayCart]);

  useEffect(() => {
    if (lockCart.subproducts.length > 0) {
      dispatch(LOCK_SUBPROD_USER(lockCart));
    }
  }, [lockCart, cartReducer, userReducer, dispatch, order_type, reorder_cart]);

  useEffect(() => {
    if (reorder_cart && cart) {
      setIsLoading(false);
    }
  }, [reorder_cart, cart]);

  useEffect(() => {
    getUserAddresses();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    eventBus.on('go-back-button', handleGoBack);
    return () => {
      eventBus.off('go-back-button', handleGoBack);
    };
  }, [handleGoBack]);

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
                        <LazyComponent key={item.subproduct._id}>
                          <ProductCheckout
                            id={item.subproduct._id}
                            product_name={item.subproduct.product.name}
                            sell_price={item.subproduct.sell_price}
                            size={item.subproduct.size}
                            quantity={item.quantity}
                          />
                        </LazyComponent>
                      );
                    })}
                    <div className="cart-total">
                      <p>Total:</p>
                      <p>${cart?.total_price?.toFixed(2)}</p>
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
                            <LazyComponent key={elem._id}>
                              <AddressList id={elem._id} modal={false} street={elem.street}
                                number={elem.number} floor={elem.floor} flat={elem.flat} city={elem.city}
                                province={elem.province} extra={elem.extra}
                                setSettedAddress={setSettedAddress} selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />
                            </LazyComponent>
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
              <LazyComponent>
                <PaymentDate />
              </LazyComponent>
            )}
          </>
        )
      }
      <LazyComponent>
        <Address
          show={modalAddress}
          onHideAddress={() => setModalAddress(!modalAddress)}
          updateAddress={() => setAddressUpdated(!addressUpdated)}
          fromCheckout={true}
        />
      </LazyComponent>
    </div >
  );
}  