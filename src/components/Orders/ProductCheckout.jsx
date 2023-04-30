import '../../styles/components/checkout.scss'

export default function ProductCheckout({ id, product_name, size, sell_price, quantity }) {
  return (
    <div className="container-checkout" key={id}>
      <div className="item-details">
        <div className="item-name">
          <h5>{product_name}</h5>
        </div>
        <div className="item-sec-details">
          <p>Tamaño: {size}kg</p>
          <div className="price">
            ${sell_price.toFixed(2)}
          </div>
          <p>Cantidad: {quantity}</p>
        </div>
      </div>
      <div className="item-total">
        <p>${(sell_price * quantity).toFixed(2)}</p>
      </div>
    </div>
  )
}