import { useEffect } from "react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { UPDATE_LOCAL_SUBPRODUCT_QUANTITY, UPDATE_SUBPRODUCT_QUANTITY } from "../../redux/actions"

export default function ProductQuantity({ quantity, idSubprod, stock }) {

  const dispatch = useDispatch()

  const user = localStorage.getItem('user')

  const [newQuantity, setNewQuantity] = useState(quantity)

  const handleChangeQuantity = (event) => {
    if (event.target.name === 'asc') {
      if (newQuantity < stock) {
        setNewQuantity(prevQuantity => prevQuantity + 1)
      }
    } else {
      if (newQuantity !== 0) {
        setNewQuantity(prevQuantity => prevQuantity - 1)
      }
    }
  }

  useEffect(() => {
    const subprodUpdateQuantity = {
      idSubprod: idSubprod,
      newQuantity: newQuantity
    };
    if (quantity !== subprodUpdateQuantity.newQuantity) {
      if(user) {
        dispatch(UPDATE_SUBPRODUCT_QUANTITY(subprodUpdateQuantity));
      } else {
        dispatch(UPDATE_LOCAL_SUBPRODUCT_QUANTITY(subprodUpdateQuantity))
      }
    }
  }, [newQuantity, idSubprod, dispatch, quantity, user])

  return (
    <div className="product-quantity">
      <button className="button-quantity" onClick={handleChangeQuantity} name="desc">-</button>
      <p>{newQuantity}</p>
      <button className="button-quantity" onClick={handleChangeQuantity} name="asc">+</button>
    </div>
  )
}