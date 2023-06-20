import AllProductsDetails from "../AllProductSection";
import Header from "../Header";
import PrimeDealsSection from "../PrimeDealsSection";
import "./index.css";

const Products = () => {
  return (
    <>
      <Header />
      <div className="product-sections">
        <PrimeDealsSection />
        <AllProductsDetails />
      </div>
    </>
  );
};
export default Products;
