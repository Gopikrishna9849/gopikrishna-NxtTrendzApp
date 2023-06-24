import "./App.css";
import {Route, Routes, Navigate, HashRouter } from "react-router-dom";
import Home from "./components/Home/index";
import Products from "./components/Products/index";
import LoginForm from "./components/LoginForm/index";
import NotFound from "./components/NotFound/index";
import Cart from "./components/Cart/index";
import ProtectedRoute from "./components/ProtectedRoute";
import CartContext from "./Context/CartContext";
import ProductItemDetails from "./components/ProductItemDetails";
import { Component } from "react";
class App extends Component {
  state = { cartList: [] };
  removeAllCartItems = () => {
    this.setState({ cartList: [] });
  };

  incrementCartItemQuantity = (id) => {
    this.setState((prevState) => ({
      cartList: prevState.cartList.map((eachCartItem) => {
        if (id === eachCartItem.id) {
          const updatedQuantity = eachCartItem.quantity + 1;
          return { ...eachCartItem, quantity: updatedQuantity };
        }
        return eachCartItem;
      }),
    }));
  };

  decrementCartItemQuantity = (id) => {
    const { cartList } = this.state;
    const productObject = cartList.find(
      (eachCartItem) => eachCartItem.id === id
    );
    if (productObject.quantity > 1) {
      this.setState((prevState) => ({
        cartList: prevState.cartList.map((eachCartItem) => {
          if (id === eachCartItem.id) {
            const updatedQuantity = eachCartItem.quantity - 1;
            return { ...eachCartItem, quantity: updatedQuantity };
          }
          return eachCartItem;
        }),
      }));
    } else {
      this.removeCartItem(id);
    }
  };

  removeCartItem = (id) => {
    const { cartList } = this.state;
    const updatedCartList = cartList.filter(
      (eachCartItem) => eachCartItem.id !== id
    );

    this.setState({ cartList: updatedCartList });
  };

  addCartItem = (product) => {
    const { cartList } = this.state;
    const productObject = cartList.find(
      (eachCartItem) => eachCartItem.id === product.id
    );

    if (productObject) {
      this.setState((prevState) => ({
        cartList: prevState.cartList.map((eachCartItem) => {
          if (productObject.id === eachCartItem.id) {
            const updatedQuantity = eachCartItem.quantity + product.quantity;

            return { ...eachCartItem, quantity: updatedQuantity };
          }

          return eachCartItem;
        }),
      }));
    } else {
      const updatedCartList = [...cartList, product];

      this.setState({ cartList: updatedCartList });
    }
  };
  render() {
    const { cartList } = this.state;
    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
          removeAllCartItems: this.removeAllCartItems,
        }}
      >
        <HashRouter>
          <Routes>
            <Route exact path="/login" element={<LoginForm />} />
            <Route element={<ProtectedRoute />}>
              <Route exact path="/" element={<Home />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route exact path="/products" element={<Products />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route exact path="/cart" element={<Cart />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route
                exact
                path="/products/:id"
                element={<ProductItemDetails />}
              />
            </Route>
            <Route path="/notfound" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/notfound" />} />
          </Routes>
        </HashRouter>
      </CartContext.Provider>
    );
  }
}

export default App;
