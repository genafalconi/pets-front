import { useCallback, useEffect, useMemo, useState } from 'react';
import Card from 'react-bootstrap/Card';
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
  const [isLoading, setIsLoading] = useState(false)
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

  const handleReOrder = useCallback(async (cart) => {
    setIsLoading(true)
    const { _id, ...newCart } = cart;
    await dispatch(SAVE_RE_ORDER_CART(newCart)).then((res) => {
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
      })
  }, [dispatch, user])

  return (
    <>
      <Card className='personal-card'>
        <Card.Body>
          <Card.Title>Pedidos</Card.Title>
          <Card>
            <Card.Title className='d-flex w-100 card-title m-0 p-1 justify-content-around h5'>
              <p>Fecha</p>
              <p>Total</p>
              <p>Estado</p>
            </Card.Title>
          </Card>
          {
            userOrders ? (
              <Accordion key={userOrders._id} className='accordion-orders'>
                {userOrders?.map((u_ord) => {
                  return u_ord?.orders?.map((ord) => (
                    <Accordion.Item key={ord?._id} eventKey={ord?._id}>
                      <Accordion.Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className='accordion-header d-flex w-100 card-title m-0 p-1 justify-content-around fs-6 text align-items-center'>
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
                        <Table striped bordered hover className={`table-orders ${ord?.status === ord_constants.DELIVERED ? '' : 'm-0'}`}>
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Cantidad</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody className='table-body'>
                            {ord?.cart?.subproducts?.map((sub) => (
                              <tr key={sub?.subproduct?._id}>
                                <td>{`${sub?.subproduct?.product?.name} ${sub?.subproduct?.size}kg`}</td>
                                <td>{sub?.quantity}</td>
                                <td>${sub?.subproduct?.sell_price?.toFixed(2)}</td>
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
                                <Button variant="success" onClick={() => handleReOrder(ord?.cart)}>Re-compra</Button>
                            }
                          </div>
                        }
                      </Accordion.Body>
                    </Accordion.Item>
                  ))
                })}
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
        </Card.Body >
      </Card >
    </>
  )
}