export const removeFromCart = (subprod, cart) => {
  const updatedProds = cart?.subproducts?.filter((elem) => elem.subproduct._id !== subprod._id)
  cart.subproducts = updatedProds

  if (cart.subproducts.length === 0) {
    return cart.subproducts = null
  }

  let newTotalP = 0, newCant = 0
  cart?.subproducts?.forEach((elem) => {
    let subProdTotal = elem.quantity * (elem.subproduct.highlight ? elem.subproduct.sale_price : elem.subproduct.sell_price)
    newTotalP += subProdTotal
    newCant += elem.quantity
  })

  cart.total_price = newTotalP
  cart.total_products = newCant
  return cart
}