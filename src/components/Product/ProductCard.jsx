import { useState } from "react"
import { useDispatch } from "react-redux"
import { ADD_TO_CART, ADD_TO_LOCAL_CART } from "../../redux/actions"
import image from '../../FR_129240_master.jpg'
import '../../styles/components/product.scss'

export default function ProductCart({ data }) {

  const dispatch = useDispatch()
  const user = localStorage.getItem('user')

  const [prodSizeSelected, setProdSizeSelected] = useState(data?.subproducts[0]?._id)
  const [quantity, setQuantity] = useState(0)
  const [newProd, setNewProd] = useState(null)
  const [sizeSelected, setSizeSelected] = useState(data?.subproducts[0]?._id)

  const sortedSubproducts = [...data.subproducts].sort((a, b) => a.size - b.size);

  const addToCart = (data) => {
    const subprod = data?.subproducts.find((elem) => elem._id === prodSizeSelected)

    if (quantity > 0) {
      const subProdToAdd = {
        _id: subprod?._id,
        product: data?._id,
        buy_price: subprod?.buy_price,
        sell_price: subprod?.sell_price,
        size: subprod?.size,
        category: subprod?.category,
        animal: subprod?.animal,
        brand: subprod?.brand,
        animal_size: subprod?.animal_size,
        animal_age: subprod?.animal_age,
        active: subprod?.active,
        stock: subprod?.stock,
        quantity: quantity,
        name: data.name
      }
      setNewProd(subProdToAdd)
      setTimeout(() => {
        setNewProd()
      }, 3000)
      if (user) {
        dispatch(ADD_TO_CART(subProdToAdd))
      } else {
        dispatch(ADD_TO_LOCAL_CART(subProdToAdd))
      }
      setQuantity(0)
    }
  }

  const changeQuantity = (event) => {
    if (event.target.name === 'asc') {
      const subprod = data?.subproducts.find((elem) => elem._id === prodSizeSelected)
      if (quantity < subprod.stock) setQuantity(quantity + 1)
    } else if (quantity !== 0) setQuantity(quantity - 1)

  }

  const handlePriceSize = (id) => {
    setProdSizeSelected(id)
    setSizeSelected(id)
  }

  return (
    <>
      <div className="product-card">
        <div className="product-card_img">
          <img src={image} alt={data?.name} />
        </div>
        <div className="product-card_name">
          <h3>{data?.name}</h3>
        </div>
        <div className="product-card_subprod">
          <div className="subprod__button">
            {
              sortedSubproducts.map((elem) => {
                return <button
                  key={elem._id}
                  onClick={() => handlePriceSize(elem._id)}
                  className={elem._id === sizeSelected ? 'selected' : 'not-selected'}>
                  {elem?.size}kg
                </button>
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
          <p className="not-discount">
            ${(data?.subproducts.find((subProd) => subProd._id === prodSizeSelected)?.sell_price * 1.15).toFixed(2)}
          </p>
          <p className="discount">
            ${data?.subproducts.find((subProd) => subProd._id === prodSizeSelected)?.sell_price.toFixed(2)}
          </p>
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
                  <h3>{newProd.name}</h3>
                </div>
                <div className="product-details">
                  <div className="product-size">
                    {newProd.size}kg
                  </div>
                  <div className="product-quantity">
                    {newProd.quantity} un
                  </div>
                  <div className="product-price">
                    <p>${newProd.sell_price}</p>
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