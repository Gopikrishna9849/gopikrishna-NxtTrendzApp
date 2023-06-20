import "./index.css";
import { BsFilterRight } from "react-icons/bs";
const ProductsHeader = (props) => {
  const { activeOptionId, sortbyOptions} = props;
  const onChangeSortby = (event) => {
    const {changeSortby} = props
    changeSortby(event.target.value)
  };
  return (
    <div className="products-header">
      <h1 className="products-list-heading">All Products</h1>
      <div className="sort-by-container">
        <BsFilterRight className="sort-by-icon"/>
        <p className="sort-by">Sort by</p>
        <select className="sort-by-select" value={activeOptionId} onChange={onChangeSortby}>
          {sortbyOptions.map((eachOption) => (
            <option value={eachOption.optionId} className="select-option" key={eachOption.optionId}>
              {eachOption.displayText}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default ProductsHeader;
