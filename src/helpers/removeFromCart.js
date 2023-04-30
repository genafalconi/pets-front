export const removeFromCart = (subprod, cart) => {
  const updatedProds = cart.subproducts?.filter((elem) => elem.id !== subprod.id)
  cart.subproducts = updatedProds

  if(cart.subproducts.length === 0) {
    return cart.subproducts = null
  }
  // eslint-disable-next-line
  let newTotalP = 0, newCant = 0
  // eslint-disable-next-line
  cart?.subproducts?.map((elem) => {
    let subProdTotal = elem.quantity * elem.price
    newTotalP += subProdTotal
    newCant += elem.quantity
  })

  cart.total_price = newTotalP
  cart.total_products = newCant
  return cart
}