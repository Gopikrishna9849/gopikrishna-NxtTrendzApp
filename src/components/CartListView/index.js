import "./index.css"
import CartItem from "../CartItem"
import CartContext from "../../Context/CartContext";
const CartListView=()=>{
    return(
        <CartContext.Consumer>
            {value=>{
                const {cartList}=value
                return (
                    <ul className="cart-list">
                    {cartList.map(eachCartItem=>(
                        <CartItem key={eachCartItem.id} cartItemDetails={eachCartItem}/>
                    ))}
                    </ul>
                )
            }}

        </CartContext.Consumer>
    )
}
export default CartListView