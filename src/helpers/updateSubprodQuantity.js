export default function updateSubprodQuantity(subprodNewQuantity, cart) {
  // eslint-disable-next-line
  cart?.products.map((elem) => {
    if (elem.id === subprodNewQuantity.idSubprod) {
      elem.quantity = subprodNewQuantity.newQuantity
    }
  })

  let newTotalP = 0, newCant = 0
  // eslint-disable-next-line
  cart.products.map((elem) => {
    let subProdTotal = elem.quantity * elem.price
    newTotalP += subProdTotal
    newCant += elem.quantity
  })
  cart.totalPrice = newTotalP
  cart.totalProducts = newCant
  cart.updated_at = new Date().toISOString()
  
  return cart
}