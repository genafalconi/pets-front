import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GET_USER_ORDER } from '../../redux/actions';
import Spinner from 'react-bootstrap/Spinner';
import '../../styles/components/order.scss'
import { useNavigate } from 'react-router-dom';

export default function Order() {

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const order = useSelector((state) => state.clientReducer.order)

  const orderId = localStorage.getItem('order')
  const user = localStorage.getItem('user')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!orderId) navigate('/')
    const getOrderData = async () => {
      if (orderId && user) {
        await dispatch(GET_USER_ORDER(orderId))
          .then((res) => {
            setIsLoading(false)
          })
      }
    }
    getOrderData()
  }, [orderId, dispatch, user, navigate])

  return (
    <div className='content-page'>
      {
        isLoading ? (
          <div className="loading">
            <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
          </div>
        ) : (
          <>
            <div className="title">
              <h1>Orden</h1>
            </div>
            <div className="order-container">
              <div className="order-info">
                <div className="subtitle">
                  <h2>Productos</h2>
                </div>
                <div className="product-order">
                  {
                    order.cart?.subproducts?.map((elem) => {
                      return (
                        <div className='product-order_item' key={elem.subproduct._id}>
                          <div className="product-name">
                            <p>{elem.subproduct.product.name} {elem.subproduct.size}kg</p>
                          </div>
                          <div className="product-sec-details">
                            <div className="prod-quantity">
                              <p>Cantidad: {elem.quantity}</p>
                            </div>
                            <div className="prod-price">
                              <p>Precio: ${elem.subproduct.sell_price.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                  <div className="order-total">
                    <p>Total: ${order.cart?.total_price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="order-info">
                <div className="subtitle">
                  <h2>Direccion</h2>
                </div>
                <div className="address-order">
                  <div className="address-name">
                    <p>{order.address?.street} {order.address?.number}</p>
                  </div>
                  <div className="address-details">
                    <div className="col1">
                      <p>Piso: {order.address?.floor ? order.address.floor : '-'}</p>
                      <p>Dpto: {order.address?.flat ? order.address.flat : '-'}</p>
                    </div>
                    <div className="col2">
                      <p>Ciudad: {order.address?.city}</p>
                      <p>Provincia: {order.address?.province}</p>
                    </div>
                  </div>
                  <div className="address-extra">
                    <p>{order.address?.extra}</p>
                  </div>
                </div>
              </div>
              <div className="order-info">
                <div className="subtitle">
                  <h2>Entrega</h2>
                </div>
                <div className="offer-order">
                  <div className="order-details">
                    <p>Fecha: {order.offer?.weekday.charAt(0).toUpperCase() + order.offer?.weekday.slice(1)} {new Date(order.offer?.date).toLocaleDateString()}</p>
                    <p>Horario: {order.offer?.from} a {order.offer?.to}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      }
    </div >
  );
}
