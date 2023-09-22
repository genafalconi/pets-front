import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { UPDATE_LOCAL_SUBPRODUCT_QUANTITY, UPDATE_SUBPRODUCT_QUANTITY } from "../../redux/actions"
import { useCallback } from "react"

export default function ProductQuantity({ quantity, idSubprod, stock }) {

  const dispatch = useDispatch()

  const user = localStorage.getItem('user')

  const [newQuantity, setNewQuantity] = useState(quantity)

  const handleChangeQuantity = (event) => {
    if (event.target.name === 'asc') {
      if (newQuantity < stock) {
        const updatedQuantity = newQuantity + 1;
        setNewQuantity(updatedQuantity);
        updateQuantity(updatedQuantity);
      }
    } else {
      if (newQuantity !== 1) {
        const updatedQuantity = newQuantity - 1;
        setNewQuantity(updatedQuantity);
        updateQuantity(updatedQuantity);
      }
    }
  }

  const updateQuantity = useCallback((updatedQuantity) => {
    const subprodUpdateQuantity = {
      idSubprod: idSubprod,
      newQuantity: updatedQuantity
    };
    dispatch(UPDATE_LOCAL_SUBPRODUCT_QUANTITY(subprodUpdateQuantity))
    if (user) dispatch(UPDATE_SUBPRODUCT_QUANTITY(subprodUpdateQuantity));

  }, [dispatch, idSubprod, user])

  useEffect(() => {
    setNewQuantity(quantity);
  }, [quantity]);

  useEffect(() => {
  }, [newQuantity, dispatch])

  return (
    <div className="product-quantity">
      <button className="button-quantity" onClick={handleChangeQuantity} name="desc">-</button>
      <p>{newQuantity}</p>
      <button className="button-quantity" onClick={handleChangeQuantity} name="asc">+</button>
    </div>
  )
}