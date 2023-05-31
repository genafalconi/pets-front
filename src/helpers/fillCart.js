export const fillCart = (subProduct, cart) => {
  const existSubProd = cart?.subproducts?.findIndex((elem) => subProduct._id === elem.subproduct._id)
  
  if (existSubProd !== -1) {
    cart.subproducts[existSubProd].quantity += subProduct.quantity
  } else {
    cart.subproducts.push({ subproduct: subProduct, quantity: subProduct.quantity })
  }

  let newTotalP = 0, newCant = 0
  // eslint-disable-next-line
  cart?.subproducts?.map((elem) => {
    let subProdTotal = elem.quantity * elem.subproduct?.sell_price
    newTotalP += subProdTotal
    newCant += elem.quantity
  })

  cart.total_price = newTotalP
  cart.total_products = newCant

  return cart
}