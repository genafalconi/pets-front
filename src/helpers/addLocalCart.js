export const addLocalCart = (subProduct) => {

  cart.products.push(subProduct)
  let newTotalP = 0, newCant = 0
  // eslint-disable-next-line
  cart.products.map((elem) => {
    let subProdTotal = elem.quantity * elem.price
    newTotalP += subProdTotal
    newCant += elem.quantity
  })

  cart.totalPrice = newTotalP
  cart.totalProducts = newCant
  cart.created_at = new Date().toISOString()
  
  return cart
}

const cart = {
  products: [],
  totalProducts: 0,
  totalPrice: 0,
  user: '',
  created_at: '',
  updated_at: ''
}