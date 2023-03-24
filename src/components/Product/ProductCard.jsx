import { useCallback, useState } from "react"
import { useDispatch } from "react-redux"
import { ADD_TO_CART, ADD_TO_LOCAL_CART } from "../../redux/actions"
import '../../styles/components/product.scss'

export default function ProductCart({ data }) {

  const dispatch = useDispatch()
  const user = localStorage.getItem('user')

  const [prodSizeSelected, setProdSizeSelected] = useState(data?.subProd[0]?.idSubprod)
  const [quantity, setQuantity] = useState(0)
  const [newProd, setNewProd] = useState()

  const addToCart = useCallback((data) => {
    if (quantity > 0) {
      const selectedSubProd = data?.subProd.find((subProd) => subProd.idSubprod === prodSizeSelected);
      const subProdToAdd = {
        id: selectedSubProd?.idSubprod,
        idProduct: data?.id,
        productName: data?.name,
        price: selectedSubProd?.price,
        size: selectedSubProd?.size,
        quantity: quantity,
        isActive: selectedSubProd?.isActive,
        stock: selectedSubProd?.stock
      }
      setNewProd(subProdToAdd)
      setTimeout(() => {
        setNewProd()
      }, 2000)
      if (user) {
        dispatch(ADD_TO_CART(subProdToAdd))
      } else {
        dispatch(ADD_TO_LOCAL_CART(subProdToAdd))
      }
      setQuantity(0)
    }
  }, [dispatch, user, quantity, prodSizeSelected])

  const changeQuantity = (event) => {
    if (event.target.name === 'asc') {
      if (quantity < data?.subProd[0]?.stock)
        setQuantity(quantity + 1)
    } else {
      if (quantity !== 0)
        setQuantity(quantity - 1)
    }
  }

  const handlePriceSize = (id) => {
    setProdSizeSelected(id)
  }

  return (
    <>
      <div className="product-card">
        <div className="product-card_name">
          <h3>{data?.name}</h3>
        </div>
        <div className="product-card_img">
          {/* <img src={} alt={ } /> */}
        </div>
        <div className="product-card_subprod">
          <div className="subprod__button">
            {
              data.subProd.map((elem) => {
                return <button key={elem.idSubprod} onClick={() => handlePriceSize(elem.idSubprod)}>{elem.size}kg</button>
              })
            }
          </div>
        </div>
        <div className="product-card__quantity">
          <button onClick={changeQuantity} name='desc'>-</button>
          <p className="number">{quantity}</p>
          <button onClick={changeQuantity} name='asc'>+</button>
        </div>
        <div className="subprod__price">
          {
            <p>
              ${data?.subProd.find((subProd) => subProd.idSubprod === prodSizeSelected)?.price}
            </p>
          }
        </div>
        <div className="product-card_add">
          <button onClick={() => addToCart(data)}>Agregar</button>
        </div>
      </div>
      <>
        {
          newProd ?
            <div key={newProd.id} className="cart-item-added">
              <div className="cart-product-card">
                <div className="product-name">
                  <h3>{newProd.productName}</h3>
                </div>
                <div className="product-details">
                  <div className="product-size">
                    {newProd.size}kg
                  </div>
                  <div className="product-quantity">
                    <p>{newProd.quantity}</p>
                  </div>
                  <div className="product-price">
                    ${newProd.price}
                  </div>
                </div>
              </div>
            </div>
            : ''
        }
      </>
    </>
  )
}
