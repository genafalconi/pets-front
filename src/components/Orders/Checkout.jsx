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
import InfoCheckout from '../atomic/InfoCheckout';

export default function Checkout() {

  const dispatch = useDispatch();
  const { cart, user, addresses } = useSelector((state) => state.clientReducer);

  const [isLoading, setIsLoading] = useState(true);
  const [cartReady, setCartReady] = useState(false);
  const [addressReady, setAddressReady] = useState(false);
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

  const handleChargeAddress = () => {
    setModalAddress(!modalAddress);
  };

  const handleCoordinate = useCallback(() => {
    setShowPaymentDate(!showPaymentDate);
    setShowCheckout(!showCheckout);
  }, [showPaymentDate, showCheckout]);

  const getUserAddresses = useCallback(async () => {
    dispatch(GET_USER_ADDRESS()).then((res) => {
      if (res.payload) {
        setAddressReady(true);
      }
    });
  }, [dispatch]);

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
  }, [settedAddress, dispatch, addresses, addressUpdated]);

  useEffect(() => {
    handlePayCart();
  }, [handlePayCart]);

  useEffect(() => {
    if (lockCart.subproducts.length > 0) {
      dispatch(LOCK_SUBPROD_USER(lockCart));
    }
  }, [dispatch, lockCart]);

  useEffect(() => {
    if (Object.keys(cart).length > 0) {
      setCartReady(true)
    }
  }, [cart]);

  useEffect(() => {
    if (cartReady && addressReady) {
      setIsLoading(false)
    }
  }, [cartReady, addressReady]);


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
                <InfoCheckout />
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
                            product_name={item.subproduct.product.name ? item.subproduct.product.name : item.subproduct.name}
                            sell_price={item.subproduct.sell_price}
                            size={item.subproduct.size}
                            quantity={item.quantity}
                            image={item.subproduct.product.image ? item.subproduct.product.image : item.subproduct.image}
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
                      {
                        addresses?.length > 0 &&
                        <div className="third-button">
                          {
                            selectedAddress ? '' : <span className="error-labels">Selecciona una direccion</span>
                          }
                          <button onClick={handleChargeAddress}>Cargar otra</button>
                        </div>
                      }
                    </div>
                  </div>
                </div>
                <div className={validContinue ? "call-to-action_button checkout" : "disabled-button checkout"}>
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
      {modalAddress && (
        <LazyComponent>
          <Address
            show={modalAddress}
            onHideAddress={() => setModalAddress(!modalAddress)}
            updateAddress={() => setAddressUpdated(!addressUpdated)}
            fromCheckout={true}
          />
        </LazyComponent>
      )}
    </div >
  );
}  