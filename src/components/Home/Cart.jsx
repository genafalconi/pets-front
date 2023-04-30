import { useEffect, useState } from "react"
import Dropdown from 'react-bootstrap/Dropdown'
import { FaShoppingCart } from 'react-icons/fa'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { MdOutlineDelete } from 'react-icons/md'
import '../../styles/components/cart.scss'
import { REMOVE_FROM_CART, REMOVE_FROM_LOCAL_CART } from "../../redux/actions"
import ProductQuantity from "../atomic/ProductQuantity"

export default function Cart() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [emptyCart, setEmptyCart] = useState(false)
  const cartReducer = useSelector((state) => state.clientReducer.cart)
  const cartStorage = JSON.parse(localStorage.getItem('cart'))
  const user = localStorage.getItem('user')

  const removeFromCart = async (subprod) => {
    if (user && cartStorage) {
      dispatch(REMOVE_FROM_CART(subprod))
    } else {
      await dispatch(REMOVE_FROM_LOCAL_CART(subprod)).then((res) => {
        if (res.payload?.subproducts?.length === 0) {
          setEmptyCart(true)
        }
      })
    }
  }

  const handlePayCart = () => {
    navigate('/checkout')
  }

  useEffect(() => {
    if (Object.keys(cartReducer).length === 0) {
      setEmptyCart(true)
    } else {
      if (cartStorage && cartStorage.subproducts?.length === 0) {
        setEmptyCart(true)
      } else {
        setEmptyCart(false)
      }
    }
  }, [emptyCart, cartStorage, cartReducer])

  return (
    <Dropdown className={`dropdown-cart${window.location.pathname === '/checkout' ? ' d-none' : ''}`}>
      <Dropdown.Toggle id="dropdown-autoclose-true" className='dropdown-custom'>
        <div className="total-cart-icon">
          <span>{cartStorage?.total_products > 0 ? cartStorage?.total_products : 0}</span>
        </div>
        <FaShoppingCart className='user-nav_cart_icon' size={30} />
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
                        <h3>{user ? elem.subproduct?.product?.name : elem?.subproduct?.name}</h3>
                      </div>
                      <div className="product-details">
                        <div className="product-size">
                          {elem.subproduct?.size}kg
                        </div>
                        <ProductQuantity quantity={elem.quantity} idSubprod={elem.subproduct?._id} stock={elem.subproduct?.stock} />
                        <div className="product-price">
                          ${elem.subproduct?.sell_price}
                        </div>
                        <div className="product-remove">
                          <MdOutlineDelete onClick={() => removeFromCart(elem.subproduct)} />
                        </div>
                      </div>
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