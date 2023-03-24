export const removeFromCart = (subprod, cart) => {
  const updatedProds = cart.products.filter((elem) => elem.id !== subprod.id)
  cart.products = updatedProds

  if(cart.products.length === 0) {
    return cart = null
  }
  // eslint-disable-next-line
  let newTotalP = 0, newCant = 0
  // eslint-disable-next-line
  cart?.products?.map((elem) => {
    let subProdTotal = elem.quantity * elem.price
    newTotalP += subProdTotal
    newCant += elem.quantity
  })

  cart.totalPrice = newTotalP
  cart.totalProducts = newCant
  cart.updated_at = new Date().toISOString()

  return cart
}