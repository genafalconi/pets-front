import '../../styles/components/product.scss'

export default function NewProd({ product }) {
  return (
    <div key={product.id} className="cart-item-added">
      <div className="cart-product-card">
        <div className="product-name">
          <h3>{product.name}</h3>
        </div>
        <div className="product-details">
          <div className="product-size">
            {product.size}kg
          </div>
          <div className="product-quantity">
            {product.quantity} un
          </div>
          <div className="product-price">
            <p>${product.highlight ? product.sale_price.toFixed(2) : product.sell_price.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}