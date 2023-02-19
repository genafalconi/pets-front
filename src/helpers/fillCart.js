export const fillCart = (subProduct, cart, idUser) => {
  const existSubProd = cart?.products?.findIndex((elem) => subProduct.id === elem.id)

  if (existSubProd !== -1) {
    cart.products[existSubProd].quantity += subProduct.quantity
  } else {
    cart.products.push(subProduct)
  }

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