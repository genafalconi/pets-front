import { useCallback, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { ADD_TO_CART, ADD_TO_LOCAL_CART } from "../../redux/actions"
import '../../styles/components/product.scss'
import { cloudinaryImg } from "../../helpers/cloudinary"
import { AdvancedImage } from '@cloudinary/react';
import { Button, Spinner } from 'react-bootstrap';
import NewProd from "./NewProd"

export default function ProductCart({ data }) {

  const dispatch = useDispatch()
  const user = localStorage.getItem('user')
  const sortedSubproducts = [...data.subproducts].sort((a, b) => a.size - b.size);

  const [prodSizeSelected, setProdSizeSelected] = useState(sortedSubproducts[0]._id)
  const [quantity, setQuantity] = useState(1)
  const [newProd, setNewProd] = useState(null)
  const [showNewProd, setShowNewProd] = useState(false)
  const [sizeSelected, setSizeSelected] = useState(sortedSubproducts[0]._id)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)


  const addToCart = useCallback((data) => {
    const subprod = data?.subproducts.find((elem) => elem._id === prodSizeSelected)

    if (quantity > 0 && subprod.stock >= quantity) {
      const subProdToAdd = {
        _id: subprod?._id,
        product: data?._id,
        buy_price: subprod?.buy_price,
        sale_price: subprod.sale_price,
        sell_price: subprod?.sell_price,
        size: subprod?.size,
        stock: subprod?.stock,
        image: data?.image,
        highlight: subprod?.highlight,
        quantity: quantity,
        name: data.name
      }
      setNewProd(subProdToAdd)
      setShowNewProd(true)

      dispatch(ADD_TO_LOCAL_CART(subProdToAdd))
      if (user) {
        setIsLoading(true);
        dispatch(ADD_TO_CART(subProdToAdd))
          .then(() => {
            setIsLoading(false);
          })
          .catch((error) => {
            setIsLoading(false);
            setHasError(true);
          });
      }

      setQuantity(1)
    } else {
      setHasError(true)
    }
  }, [dispatch, prodSizeSelected, quantity, user])

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

  useEffect(() => {
    if (showNewProd) {
      const timer = setTimeout(() => {
        setNewProd(null)
        setShowNewProd(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showNewProd]);

  return (
    <>
      <div className="product-card">
        <div className="product-card_img">
          <AdvancedImage cldImg={cloudinaryImg(data?.image)} />
        </div>
        <div className="product-card_details">
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
          <div className="product-card_totals">
            <div className="product-card__quantity">
              <button onClick={changeQuantity} name='desc'>-</button>
              <p className="number">{quantity}</p>
              <button onClick={changeQuantity} name='asc'>+</button>
            </div>
            <div className="subprod__price">
              {/* <p className="not-discount">
                ${(data?.subproducts.find((subProd) => subProd._id === prodSizeSelected)?.sell_price * 1.15).toFixed(2)}
              </p> */}
              <p className="discount">
                ${data?.subproducts.find((subProd) => subProd._id === prodSizeSelected)?.sell_price.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="call-to-action_button">
            {
              isLoading ?
                <Button className={`${isLoading ? 'call-to-action_button_disabled' : 'call-to-action_button'}`} disabled>
                  <Spinner as="span" animation="border" size='sm' role="status" aria-hidden="true" />
                </Button>
                :
                <Button className='call-to-action_button' onClick={() => addToCart(data)} disabled={hasError}>Agregar</Button>
            }
          </div>
        </div>
      </div>
      {
        showNewProd && <NewProd product={newProd} />
      }
    </>
  )
}  