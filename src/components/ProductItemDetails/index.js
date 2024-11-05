import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarDataProducts: [],
    apiStatus: apiStatusConstants.initial,
    item: 1,
  }

  componentDidMount() {
    this.getProductData()
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarProducts = fetchedData.similar_products.map(
        eachSimilar => this.getFormattedData(eachSimilar),
      )
      this.setState({
        apiStatus: apiStatusConstants.success,
        similarDataProducts: updatedSimilarProducts,
        productData: updatedData,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="products-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-view"
      />
      <h1 className="error-heading">Product Not Found</h1>
      <Link to="/products" className="link-item">
        <button className="error-button" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  onDecreamentItem = () => {
    const {item} = this.state
    if (item > 1) {
      this.setState(prevState => ({item: prevState.item - 1}))
    }
  }

  onIncreamentItem = () => {
    const {item} = this.state
    this.setState(prevState => ({
      item: prevState.item + 1,
    }))
  }

  renderProductDetailsView = () => {
    const {productData, similarDataProducts} = this.state
    const {
      availability,
      brand,
      description,
      id,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productData
    const {item} = this.state

    return (
      <div className="product-success-view">
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="product">
            <h1 className="product-title">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="rating-review-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-image"
                />
              </div>
              <p className="reviews-count">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <div className="label-value-container">
              <p className="label">Available:</p>
              <p className="value">{availability}</p>
            </div>
            <div className="label-value-container">
              <p className="label">Brand:</p>
              <p className="value">{brand}</p>
            </div>
            <hr className="line" />
            <div className="item-container">
              <button
                className="icon"
                type="button"
                onClick={this.onDecreamentItem}
                data-testid="minus"
              >
                <BsDashSquare className="item-control" />
              </button>
              <p className="item">{item}</p>
              <button
                className="icon"
                type="button"
                onClick={this.onIncreamentItem}
                data-testid="plus"
              >
                <BsPlusSquare className="item-control" />
              </button>
            </div>
            <button className="button add-to-cart-button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-product-heading">Similar Products</h1>
        <ul className="similar-products-container">
          {similarDataProducts.map(eachProduct => (
            <SimilarProductItem
              key={eachProduct.id}
              productDetails={eachProduct}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-data">{this.renderProductDetails()}</div>
      </>
    )
  }
}
export default ProductItemDetails
