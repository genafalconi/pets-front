import '../../styles/components/checkout.scss'

export default function ProductCheckout({ id, productName, size, price, quantity }) {
  return (
    <div className="container-checkout" key={id}>
      <div className="item-details">
        <div className="item-name">
          <h5>{productName} {size}kg</h5>
        </div>
        <div className="item-sec-details">
          <div className="price">
            ${price.toFixed(2)}
          </div>
          <p>Cantidad: {quantity}</p>
        </div>
      </div>
      <div className="item-total">
        <p>${(price * quantity).toFixed(2)}</p>
      </div>
    </div>
  )
}