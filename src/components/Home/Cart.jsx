import { useEffect, useState } from "react"
import Dropdown from 'react-bootstrap/Dropdown'
import { FaShoppingCart } from 'react-icons/fa'
import { useSelector } from "react-redux"

export default function Cart() {

  const [emptyCart, setEmptyCart] = useState(false)
  const cartReducer = useSelector((state) => state.clientReducer.cart)
  const cartStorage = JSON.parse(localStorage.getItem('cart'))

  useEffect(() => {
    if (!cartStorage) {
      setEmptyCart(true)
    } else {
      if (cartStorage && Object.keys(cartStorage).length === 0) {
        setEmptyCart(true)
      } else {
        setEmptyCart(false)
      }
    }
  }, [emptyCart, cartStorage, cartReducer])

  return (
    <Dropdown className="d-inline mx-2">
      <Dropdown.Toggle id="dropdown-autoclose-true" className='dropdown-custom'>
        <FaShoppingCart className='user-nav_cart_icon' size={30} />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {
          emptyCart ?
            <Dropdown.Item>No hay productos</Dropdown.Item>
            : cartStorage?.products?.map((elem) => {
              return <Dropdown.Item key={elem.idProduct}>{elem.productName} {elem.size}kg x{elem.quantity} ${elem.price}  ${elem.quantity * elem.price}</Dropdown.Item>
            })
        }
      </Dropdown.Menu>
    </Dropdown>
  )
}