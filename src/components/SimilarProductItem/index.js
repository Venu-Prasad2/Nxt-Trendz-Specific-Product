import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {title, brand, imageUrl, rating, price} = productDetails

  return (
    <li className="similar-product-item">
      <div className="similar-product-align">
        <img src={imageUrl} alt="similar product" className="similar-img" />
        <div className="text1-align">
          <p className="similar-product-title">{title}</p>
          <p className="similar-product-brand">by {brand}</p>
          <div className="price-rating-container">
            <p className="price">Rs {price}</p>
            <div className="rating-container">
              <p className="rating">{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="star-image"
              />
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
