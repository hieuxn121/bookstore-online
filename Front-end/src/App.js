import React, { useState, useEffect } from "react";
import { CssBaseline } from "@material-ui/core";
import { commerce } from "./lib/commerce";
import Products from "./components/Products/Products";
import Navbar from "./components/Navbar/Navbar";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/CheckoutForm/Checkout/Checkout";
import ProductView from "./components/ProductView/ProductView";
import Footer from "./components/Footer/Footer";
import Login from "./components/Login/SignInSide";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";
import OtpInputWithValidation from "./components/OTP/OTPSide";
import OrderHistory from "./components/OrderHistory";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Snackbar, Alert } from "@mui/material";
import { AuthProvider, SnackbarProvider } from "./contexts";
import { getData } from "./utils/localStorage";
import { bookApi } from "./apis";
import { HTTP_STATUS, SNACKBAR } from "./constants";
import "./global.css";
import OrderHistoryDetail from "./components/OrderHistory/OrderHistoryDetail";

const MuiAlert = React.forwardRef(function MuiAlert(props, ref) {
  return <Alert elevation={3} ref={ref} variant="filled" {...props} />;
});

const App = () => {
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = React.useState("info");
  const [msg, setMsg] = React.useState("");
  const openSnackbar = (severity, msg) => {
    setSeverity(severity);
    setMsg(msg);
    setOpen(true);
  };
  const handleClose = (e, r) => {
    if (r === "clickaway") return;
    setOpen(false);
  };

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({
    id: null,
    lineItems: [],
    cartItemId: null,
    totalItems: 0,
    totalUniqueItems: 0,
    subTotal: 0,
  });

  const [order, setOrder] = useState({});
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const token = getData("token");
  const user = getData("user");
  const fetchProducts = async () => {
    try {
      const { status, data } = await bookApi.listbooks("", "", "", "");
      if (status === HTTP_STATUS.OK) {
        setProducts(data?.data?.content);
      } else {
        openSnackbar(SNACKBAR.ERROR, "Lấy danh sách sách thất bại");
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, "Lấy danh sách sách thất bại");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:8889/api/books/categories");
      const data = await res.json();
      if (data?.statusCode === "00000") {
        const categories = data?.data;
        const categoriesConverted = Object.entries(categories).map(
          ([key, value]) => {
            return { key, value };
          }
        );
        setCategories(categoriesConverted);
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, "Lấy danh mục sách thất bại");
    }
  };

  const handleAddToCart = async (productId, quantity) => {
    const item = products?.find((p) => p.id === productId);
    const cart2 = { ...cart };
    const isBookInCart = cart2.lineItems.find(
      (item) => (item.id || item.bookId) === productId
    );
    if (isBookInCart) {
      cart2.subTotal = 0;
      cart2.lineItems.forEach((l) => {
        if ((l.id || l.bookId) === productId) {
          l.quantity++;
        }
        cart2.subTotal = cart2.subTotal + l.sellingPrice * l.quantity;
      });
    } else {
      item.quantity = quantity;
      cart2.lineItems.push(item);
      cart2.subTotal = cart2.subTotal + item.sellingPrice;
      cart2.totalUniqueItems++;
    }
    cart2.totalItems++;
    setCart(cart2);

    const payload = {
      bookId: productId,
      userId: user.id,
    };

    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });

    if (quantity !== 0) {
      try {
        await fetch(`http://localhost:8889/api/shopping-cart-items`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
            Cookie: `ms2a=${token}`,
          },
        });
        openSnackbar(SNACKBAR.SUCCESS, "Thêm sách vào giỏ hàng thành công");
      } catch (error) {
        openSnackbar(SNACKBAR.ERROR, "Thêm sách vào giỏ hàng thất bại");
      }
    } else {
      try {
        await fetch(`http://localhost:8889/api/shopping-cart-items`, {
          method: "DELETE",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
            Cookie: `ms2a=${token}`,
          },
        });
        openSnackbar(SNACKBAR.SUCCESS, "Xóa sách khỏi giỏ hàng thành công");
      } catch (error) {
        openSnackbar(SNACKBAR.ERROR, "Xóa sách khỏi giỏ hàng thất bại");
      }
    }
  };

  const handleUpdateCartQty = async (
    lineItemId,
    quantity,
    action,
    cartItemId
  ) => {
    const cart2 = { ...cart };
    if (quantity === 0) {
      const index = cart2.lineItems.findIndex(
        (lt) => (lt.id || lt.bookId) === lineItemId
      );
      cart2.lineItems.splice(index, 1);
    }
    cart2.subTotal = 0;
    cart2.lineItems.forEach((l) => {
      if ((l.id || l.bookId) === lineItemId) {
        l.quantity = quantity;
      }
      cart2.subTotal = cart2.subTotal + l.sellingPrice * l.quantity;
    });
    if (action === "INCREASE") {
      cart2.totalItems++;
    } else {
      cart2.totalItems--;
    }

    setCart(cart2);

    const payload = {
      cartItemId,
      quantity: quantity,
    };

    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });

    if (quantity !== 0) {
      try {
        await fetch(`http://localhost:8889/api/shopping-cart-items`, {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
            Cookie: `ms2a=${token}`,
          },
        });
        openSnackbar(SNACKBAR.SUCCESS, "Cập nhật giỏ hàng thành công");
      } catch (error) {
        openSnackbar(SNACKBAR.ERROR, "Cập nhật giỏ hàng thất bại");
      }
    } else {
      try {
        await fetch(`http://localhost:8889/api/shopping-cart-items`, {
          method: "DELETE",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
            Cookie: `ms2a=${token}`,
          },
        });
        openSnackbar(SNACKBAR.SUCCESS, "Xóa sách khỏi giỏ hàng thành công");
      } catch (error) {
        openSnackbar(SNACKBAR.ERROR, "Xóa sách khỏi giỏ hàng thất bại");
      }
    }
  };

  const handleRemoveFromCart = async (lineItemId, cartItemId) => {
    const cart2 = { ...cart };
    const index = cart2.lineItems.findIndex(
      (lt) => (lt.id || lt.bookId) === lineItemId
    );
    const itemRemoved = cart2.lineItems.splice(index, 1);
    cart2.totalItems = cart.totalItems - itemRemoved[0].quantity;
    cart2.totalUniqueItems = cart.totalUniqueItems - 1;
    cart2.subTotal =
      cart.subTotal - itemRemoved[0].quantity * itemRemoved[0].sellingPrice;
    setCart(cart2);

    const payload = {
      cartItemId,
    };

    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });

    try {
      await fetch(`http://localhost:8889/api/shopping-cart-items`, {
        method: "DELETE",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `ms2a=${token}`,
        },
      });
      openSnackbar(SNACKBAR.SUCCESS, "Xóa sách khỏi đăng hàng thành công");
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, "Xóa sách khỏi đăng hàng thất bại");
    }
  };

  const handleEmptyCart = async () => {
    try {
      await fetch(`http://localhost:8889/api/shopping-cart-items/clear`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `ms2a=${token}`,
        },
      });
      openSnackbar(SNACKBAR.SUCCESS, "Xóa giỏ hàng thành công");
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, "Xóa giỏ hàng thất bại");
    }
    setCart({
      id: null,
      lineItems: [],
      totalItems: 0,
      totalUniqueItems: 0,
      subTotal: 0,
    });
  };

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();

    setCart(newCart);
  };

  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    try {
      const incomingOrder = await commerce.checkout.capture(
        checkoutTokenId,
        newOrder
      );

      setOrder(incomingOrder);

      refreshCart();
    } catch (error) {
      setErrorMessage(error.data.error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <div>
      <AuthProvider>
        <SnackbarProvider>
          <Router>
            <div style={{ display: "flex" }}>
              <CssBaseline />
              <Navbar
                totalItems={cart.totalItems}
                handleDrawerToggle={handleDrawerToggle}
              />
              <Switch>
                <Route exact path="/">
                  <Products
                    products={products}
                    setProducts={setProducts}
                    onAddToCart={handleAddToCart}
                    handleUpdateCartQty
                    categories={categories}
                  />
                </Route>
                <Route exact path="/cart">
                  {token ? (
                    <Cart
                      products={products}
                      cart={cart}
                      setCart={setCart}
                      onUpdateCartQty={handleUpdateCartQty}
                      onRemoveFromCart={handleRemoveFromCart}
                      onEmptyCart={handleEmptyCart}
                    />
                  ) : (
                    () => {
                      window.location.href = "/";
                    }
                  )}
                </Route>
                <Route path="/checkout" exact>
                  <Checkout
                    cart={cart}
                    order={order}
                    onCaptureCheckout={handleCaptureCheckout}
                    error={errorMessage}
                  />
                </Route>
                <Route path="/product-view/:id" exact>
                  <ProductView />
                </Route>
                <Route path="/login" exact>
                  {!token ? (
                    <Login />
                  ) : (
                    () => {
                      window.location.href = "/";
                    }
                  )}
                </Route>
                <Route path="/register" exact>
                  {!token ? (
                    <Register />
                  ) : (
                    () => {
                      window.location.href = "/";
                    }
                  )}
                </Route>
                <Route path="/user-profile" exact>
                  {token ? (
                    <UserProfile />
                  ) : (
                    () => {
                      window.location.href = "/";
                    }
                  )}
                </Route>
                <Route path="/orders-history" exact>
                  {token ? (
                    <OrderHistory />
                  ) : (
                    () => {
                      window.location.href = "/";
                    }
                  )}
                </Route>
                <Route path="/orders-history/:id" exact>
                  {token ? (
                    <OrderHistoryDetail />
                  ) : (
                    () => {
                      window.location.href = "/";
                    }
                  )}
                </Route>
                <Route path="/send-otp" exact>
                  <OtpInputWithValidation />
                </Route>
              </Switch>
            </div>
          </Router>
        </SnackbarProvider>
      </AuthProvider>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <MuiAlert
          onClose={handleClose}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {msg}
        </MuiAlert>
      </Snackbar>
      <Footer />
    </div>
  );
};

export default App;
