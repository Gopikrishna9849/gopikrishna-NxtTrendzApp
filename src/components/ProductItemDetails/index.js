import "./index.css";
import { Component } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../Header";
import Loader from "react-loader-spinner";
import { BsPlusSquare, BsDashSquare } from "react-icons/bs";
import CartContext from "../../Context/CartContext";
import SimilarProductItem from "../SimilarProductItem";
import { useParams } from "react-router-dom";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
    similarProductsData: {},
    productData: {},
  };
  getFormattedData = (data) => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  });
  getProductData = async () => {
    const { id } = this.props;
    this.setState({ apiStatus: apiStatusConstants.inProgress });
    const jwtToken = Cookies.get("jwt_token");
    const apiUrl = `https://apis.ccbp.in/products/${id}`;
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(apiUrl, options);
    if (response.ok) {
      const fetchedData = await response.json();
      const updatedData = this.getFormattedData(fetchedData);
      const updatedSimilarProductsData = fetchedData.similar_products.map(
        (eachSimilarProduct) => this.getFormattedData(eachSimilarProduct)
      );
      this.setState({
        productData: updatedData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      });
    }
    if (response.status === 404) {
      this.setState({ apiStatus: apiStatusConstants.failure });
    }
  };
  renderFailureView = () => {
    return (
      <div className="product-details-error-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          className="error-view-image"
          alt="error view"
        />
        <h1 className="product-not-found-heading">Product Not Found</h1>
        <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
      </div>
    );
  };
  renderLoadingView = () => {
    return (
      <div className="products-details-loader-container">
        <Loader type="ThreeDots" color="#0b69ff" width="50" height="50" />
      </div>
    );
  };
  onDecrementQuantity = () => {
    const { quantity } = this.state;
    if (quantity > 1) {
      this.setState((prevState) => ({ quantity: prevState.quantity - 1 }));
    }
  };
  onIncrementQuantity = () => {
    this.setState((prevState) => ({ quantity: prevState.quantity + 1 }));
  };
  renderProductDetailsView = () => {
    return (
      <CartContext.Consumer>
        {(value) => {
          const { productData, quantity, similarProductsData } = this.state;
          const {
            availability,
            brand,
            description,
            imageUrl,
            price,
            rating,
            title,
            totalReviews,
          } = productData;
          const { addCartItem } = value;
          const onClickAddToCart = () => {
            addCartItem({ ...productData, quantity });
          };
          return (
            <div className="product-details-success-view">
              <div className="product-details-container">
                <img src={imageUrl} alt="product" className="product-image" />
                <div className="product">
                  <h1 className="product-name">{title}</h1>
                  <p className="price-details">Rs {price}/-</p>
                  <div className="rating-and-reviews-count">
                    <div className="rating-container">
                      <p className="rating">{rating}</p>
                      <img
                        src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                        alt="star"
                        className="star"
                      />
                    </div>
                    <p className="reviews-count">{totalReviews} Reviews</p>
                  </div>
                  <p className="product-description">{description}</p>
                  <div className="label-value-container">
                    <p className="label">Available:</p>
                    <p className="value">{availability}</p>
                  </div>
                  <div className="label-value-container">
                    <p className="label">Brand:</p>
                    <p className="value">{brand}</p>
                  </div>
                  <hr className="horizontal-line" />
                  <div className="quantity-container">
                    <button
                      className="quantity-controller-button"
                      onClick={this.onDecrementQuantity}
                      type="button"
                    >
                      <BsDashSquare className="quantity-controller-icon" />
                    </button>
                    <p className="quantity">{quantity}</p>
                    <button
                      className="quantity-controller-button"
                      onClick={this.onIncrementQuantity}
                      type="button"
                    >
                      <BsPlusSquare className="quantity-controller-icon" />
                    </button>
                  </div>
                  <button type="button" onClick={onClickAddToCart} className="">
                    ADD TO CART
                  </button>
                </div>
              </div>
              <h1 className="similar-products-heading">Similar Products</h1>
              <ul className="similar-products-list">
                {similarProductsData.map((eachSimilarProduct) => (
                  <SimilarProductItem
                    key={eachSimilarProduct.id}
                    productDetails={eachSimilarProduct}
                  />
                ))}
              </ul>
            </div>
          );
        }}
      </CartContext.Consumer>
    );
  };
  renderProductDetails = () => {
    const { apiStatus } = this.state;
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView();
      case apiStatusConstants.failure:
        return this.renderFailureView();
      case apiStatusConstants.inProgress:
        return this.renderLoadingView();
      default:
        return null;
    }
  };
  componentDidMount() {
    this.getProductData();
  }
  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    );
  }
}
const ForUrlParameters = () => {
  const params = useParams();
  const { id } = params;
  return <ProductItemDetails id={id} />;
};

export default ForUrlParameters;
