export default function updateSubprodQuantity(subprodNewQuantity, cart) {
  // eslint-disable-next-line
  cart?.subproducts.map((elem) => {
    if (elem.subproduct._id === subprodNewQuantity.idSubprod) {
      elem.quantity = subprodNewQuantity.newQuantity
    }
  })

  let newTotalP = 0, newCant = 0
  // eslint-disable-next-line
  cart?.subproducts.map((elem) => {
    let subProdTotal = elem.quantity * elem.subproduct.sell_price
    newTotalP += subProdTotal
    newCant += elem.quantity
  })
  cart.total_price = newTotalP
  cart.total_products = newCant
  if (cart?.total_products === 0) {
    if (cart) {
      cart.subproducts = []
    }
  }

  return cart
}