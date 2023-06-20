import { Component } from "react";
import Cookies from "js-cookie";
import ProductCard from "../ProductCard";
import "./index.css";
import Loader from "react-loader-spinner";
const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};
class PrimeDealsSection extends Component {
  state = { apiStatus: apiStatusConstants.initial, primeDeals: [] };

  renderPrimeDealsList = () => {
    const { primeDeals } = this.state;
    return (
      <div>
        <h1 className="primedeals-list-heading">Exclusive Prime Deals</h1>
        <ul className="products-list">
          {primeDeals.map((product) => (
            <ProductCard key={product.id} productData={product} />
          ))}
        </ul>
      </div>
    );
  };
  renderPrimeDealsFailureView = () => {
    return (
      <img
        src="https://assets.ccbp.in/frontend/react-js/exclusive-deals-banner-img.png"
        alt="Register Prime"
        className="register-prime-image"
      />
    );
  };
  renderLoadingView = () => {
    return (
      <div className="products-loader-container">
        <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </div>
    );
  };
  getPrimeDeals = async () => {
    this.setState({ apiStatus: apiStatusConstants.inProgress });
    const jwtToken = Cookies.get("jwt_token");
    const apiUrl = "https://apis.ccbp.in/prime-deals";
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(apiUrl, options);
    if (response.ok === true) {
      const fetchedData = await response.json();
      const updatedData = fetchedData.prime_deals.map((product) => ({
        title: product.title,
        brand: product.brand,
        imageUrl: product.image_url,
        rating: product.rating,
        id: product.id,
        price: product.price,
      }));
      this.setState({
        apiStatus: apiStatusConstants.success,
        primeDeals: updatedData,
      });
    }
    if (response.status === 401) {
      this.setState({ apiStatus: apiStatusConstants.failure });
    }
  };
  componentDidMount() {
    this.getPrimeDeals();
  }
  render() {
    const { apiStatus } = this.state;
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderPrimeDealsList();
      case apiStatusConstants.failure:
        return this.renderPrimeDealsFailureView();
      case apiStatusConstants.inProgress:
        return this.renderLoadingView();
      default:
        return null;
    }
  }
}

export default PrimeDealsSection;
