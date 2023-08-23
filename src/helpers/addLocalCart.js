export const addLocalCart = (subProduct, user) => {

  cart?.subproducts?.push({ subproduct: subProduct, quantity: subProduct.quantity })
  let newTotalP = 0, newCant = 0
  // eslint-disable-next-line
  cart?.subproducts?.map((elem) => {
    let subProdTotal = elem.quantity * elem.subproduct.sell_price
    newTotalP += subProdTotal
    newCant += elem.quantity
  })

  cart.active = true
  cart.total_price = newTotalP
  cart.total_products = newCant
  cart.user = user

  return cart
}

const cart = {
  subproducts: [],
  total_products: 0,
  total_price: 0,
  user: '',
  active: false
}