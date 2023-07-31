import { useCallback, useEffect, useState } from "react"
import Dropdown from 'react-bootstrap/Dropdown'
import { FiShoppingCart } from 'react-icons/fi'
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { MdOutlineDelete } from 'react-icons/md'
import '../../styles/components/cart.scss'
import { REMOVE_FROM_CART, REMOVE_FROM_LOCAL_CART } from "../../redux/actions"
import ProductQuantity from "../atomic/ProductQuantity"
import { Col, Row } from "react-bootstrap"

export default function Cart() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [emptyCart, setEmptyCart] = useState(false)
  const [totalQuantityCart, setTotalQuantityCart] = useState(false)

  let cartStorage = JSON.parse(localStorage.getItem('cart'))
  const user = localStorage.getItem('user')

  const removeFromCart = useCallback(async (subprod) => {
    if (cartStorage) {
      await dispatch(REMOVE_FROM_LOCAL_CART(subprod)).then((res) => {
        if (res.payload?.subproducts?.length === 0) {
          setEmptyCart(true)
        }
      })
      if (user) dispatch(REMOVE_FROM_CART(subprod))
    }
  }, [cartStorage, dispatch, user])

  const handlePayCart = () => {
    navigate('/checkout/order')
  }

  const handleCartQuantity = useCallback(() => {
    if (cartStorage && Object.keys(cartStorage).length !== 0) {
      if (cartStorage?.subproducts?.length !== 0) {
        setTotalQuantityCart(cartStorage.total_products)
        setEmptyCart(false)
      } else {
        setEmptyCart(true)
        setTotalQuantityCart(0)
      }
    } else {
      setEmptyCart(true)
      setTotalQuantityCart(0)
    }
  }, [cartStorage])

  useEffect(() => {
    handleCartQuantity()
  }, [cartStorage, handleCartQuantity, totalQuantityCart]);

  return (
    <Dropdown className={`dropdown-cart${window.location.pathname === '/checkout' ? ' d-none' : ''}`}>
      <Dropdown.Toggle id="dropdown-autoclose-true" className='dropdown-custom'>
        <div className="total-cart-icon">
          <span>{totalQuantityCart}</span>
        </div>
        <FiShoppingCart className='user-nav_cart_icon' size={20} />
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-cart-items" onClick={(e) => e.stopPropagation()}>
        {
          emptyCart ?
            <Dropdown.Item className="cart-item_empty-cart" onClick={(e) => e.stopPropagation()}>
              No hay productos
            </Dropdown.Item>
            : <>
              {
                cartStorage?.subproducts?.map((elem) => (
                  <Dropdown.Item key={elem.subproduct?._id} className="cart-item" onClick={(e) => e.stopPropagation()}>
                    <div className="cart-product-card">
                      <div className="product-name">
                        <h3>{elem?.subproduct?.product?.name?.length > 0 ? elem?.subproduct?.product?.name : elem?.subproduct?.name}</h3>
                      </div>
                      <Row className="product-details">
                        <Col className="product-size">
                          {elem.subproduct?.size}kg
                        </Col>
                        <Col>
                          <ProductQuantity quantity={elem.quantity} idSubprod={elem.subproduct?._id} stock={elem.subproduct?.stock} />
                        </Col>
                        <Col className="product-price">
                          ${elem.subproduct?.sell_price}
                        </Col>
                        <Col className="product-remove">
                          <MdOutlineDelete onClick={() => removeFromCart(elem.subproduct)} />
                        </Col>
                      </Row>
                    </div>
                  </Dropdown.Item>
                ))
              }
              <Dropdown.Divider />
              <Dropdown.Item className="cart-final-item">
                <div className="cart-total-price" onClick={(e) => e.stopPropagation()}>
                  <p>Total:</p>
                  <p>${cartStorage?.total_price ? cartStorage?.total_price : 0}</p>
                </div>
                {
                  emptyCart ? ''
                    : <div className="primary-button">
                      <button onClick={handlePayCart}>Pagar</button>
                    </div>
                }
              </Dropdown.Item>
            </>
        }
      </Dropdown.Menu>
    </Dropdown>
  )
}