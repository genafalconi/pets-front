import { useCallback, useEffect, useMemo, useState } from 'react';
import Placeholder from 'react-bootstrap/Placeholder';
import Badge from 'react-bootstrap/Badge';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import { useDispatch } from 'react-redux';
import { GET_ACCOUNT_ORDERS, SAVE_RE_ORDER_CART } from '../../redux/actions';
import '../../styles/components/account.scss'
import { ord_constants } from '../../helpers/constants';
import { useNavigate } from 'react-router-dom';

export default function UserOrders() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [userOrders, setUserOrders] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const user = useMemo(() => localStorage.getItem('user'), []);

  const handleBadge = (status) => {
    const badge = {
      variant: 'primary',
      text: 'CONFIRMADO'
    }
    switch (status) {
      case ord_constants.CONFIRMED:
        badge.variant = 'primary'
        badge.text = 'CONFIRMADO'
        return badge
      case ord_constants.DELIVERED:
        badge.variant = 'success'
        badge.text = 'ENTREGADO'
        return badge
      case ord_constants.PROGRESS:
        badge.variant = 'warning'
        badge.text = 'EN PROCESO'
        return badge
      case ord_constants.CANCELLED:
        badge.variant = 'danger'
        badge.text = 'CANCELADO'
        return badge
      default:
        return badge
    }
  }

  //   {
  //     "subproducts": [
  //         {
  //             "subproduct": {
  //                 "_id": "642796b645c4f4313461456a",
  //                 "product": {
  //                     "_id": "64278fec45c4f43134614452",
  //                     "name": "Eukanuba Puppy Medium Breed",
  //                     "image": "Productos/Eukanuba/ar-l-eukanuba-packshot-puppy-medium-breed-removebg-preview_mid8de"
  //                 },
  //                 "size": 15,
  //                 "sell_price": 25734
  //             },
  //             "quantity": 1,
  //             "profit": 5674
  //         },
  //         {
  //             "subproduct": {
  //                 "_id": "650b1aefcb08e1823be7634a",
  //                 "product": {
  //                     "_id": "650b1acbcb08e1823be76347",
  //                     "name": "Dog Chow Puppy Medium and Large",
  //                     "image": "Productos/DogChow/dog-chow-adultos-med-gnd-front.png-removebg-preview_tdfftw"
  //                 },
  //                 "size": 21,
  //                 "sell_price": 24000
  //             },
  //             "quantity": 1,
  //             "profit": 2343
  //         }
  //     ],
  //     "total_products": 2,
  //     "total_price": 46447,
  //     "user": "652326d840d3dd31a337c76e",
  //     "active": true
  // }

  const handleReOrder = useCallback((cartId) => {
    setIsLoading(true)
    dispatch(SAVE_RE_ORDER_CART(cartId)).then((res) => {
      navigate('/checkout/re-order')
    })
    setIsLoading(false)
  }, [dispatch, navigate])

  useEffect(() => {
    dispatch(GET_ACCOUNT_ORDERS(user))
      .then((res) => {
        if (res.payload) {
          setUserOrders(res.payload)
        }
        setIsLoading(false)
      })
  }, [dispatch, user])

  return (
    <div className="content-page">
      <div className="title">
        <h1>Pedidos</h1>
      </div>
      <div className="orders-container">
        <div className='orders-table-headers'>
          <p>Fecha</p>
          <p>Total</p>
          <p>Estado</p>
        </div>
        {
          !isLoading ? (
            <Accordion key={userOrders._id} className='accordion-orders'>
              {
                userOrders?.orders?.length !== 0 ?
                  userOrders?.orders?.map((ord) => {
                    return (
                      <Accordion.Item key={ord?._id} eventKey={ord?._id}>
                        <Accordion.Header>
                          <div className='accordion-header-custom'>
                            <div className="info-accordion">
                              <h5>{new Date(ord.createdAt)?.toLocaleDateString()}</h5>
                            </div>
                            <div className="info-accordion">
                              <h5>${ord?.cart?.total_price?.toFixed(2)}</h5>
                            </div>
                            <div className="info-accordion">
                              <h5>
                                <Badge bg={handleBadge(ord?.status)?.variant} className="ms-2">
                                  {handleBadge(ord?.status)?.text}
                                </Badge>
                              </h5>
                            </div>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <Table striped bordered variant="dark" hover className={`table-orders ${ord?.status === ord_constants.DELIVERED ? '' : 'm-0'}`}>
                            <thead>
                              <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody className='table-body'>
                              {ord?.products?.map((sub) => (
                                <tr key={sub?._id}>
                                  <td>{`${sub?.subproduct?.product?.name} ${sub?.subproduct?.size}kg`}</td>
                                  <td>{sub?.quantity}</td>
                                  <td>${
                                    sub?.highlight ?
                                      sub?.sale_price?.toFixed(2)
                                      : sub?.sell_price?.toFixed(2)
                                  }</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                          {
                            ord?.status === ord_constants.DELIVERED &&
                            <div className='d-flex align-items-center justify-content-end mt-3'>
                              {
                                isLoading ?
                                  <Button variant='success'>
                                    <Spinner as="span" animation="border" size='sm' role="status" aria-hidden="true" />
                                  </Button>
                                  :
                                  <Button variant="success" onClick={() => handleReOrder(ord?.cart._id)}>Re-compra</Button>
                              }
                            </div>
                          }
                        </Accordion.Body>
                      </Accordion.Item>
                    )
                  })
                  : <h2>No hay pedidos</h2>
              }
            </Accordion>
          ) : (
            <Placeholder as={Accordion} animation="glow" className='accordion-orders'>
              <Placeholder as={Accordion.Header} animation='glow' >
                <Placeholder xs={11} />
              </Placeholder>
              <Placeholder as={Accordion.Header} animation='glow' >
                <Placeholder xs={11} />
              </Placeholder>
            </Placeholder>
          )
        }
      </div>
    </div>
  )
}