import React, { useEffect } from "react";
import { Container, Typography, Button, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import CartItem from "./CartItem/CartItem";
import useStyles from "./styles";
import { getData } from "../../utils/localStorage";
import { cartApi } from "../../apis";
import { useSnackbar } from "../../contexts";
import { HTTP_STATUS, SNACKBAR } from "../../constants";
import { useHistory } from "react-router-dom";

const Cart = ({
  cart,
  onUpdateCartQty,
  onRemoveFromCart,
  onEmptyCart,
  setCart,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const { openSnackbar } = useSnackbar();
  const handleEmptyCart = () => onEmptyCart();
  const token = getData("token");
  const renderEmptyCart = () => (
    <Typography variant="subtitle1">
      Bạn không có sách nào trong giỏ hàng,
      <Link className={classes.link} to="/">
        {" "}
        bắt đầu thêm
      </Link>
      !
    </Typography>
  );

  if (!cart.lineItems) return "Loading";

  const handleSaveCart = () => {};

  const handleCheckout = async () => {
    try {
      const { status, data } = await cartApi.checkCart();
      if (status === HTTP_STATUS.OK) {
        if (data.statusCode === "00000") {
          history.push("/checkout");
        } else {
          openSnackbar(SNACKBAR.ERROR, data.message);
        }
      } else {
        openSnackbar(SNACKBAR.ERROR, "Kiểm tra điều kiện thanh toán lỗi");
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, "Kiểm tra điều kiện thanh toán lỗi");
    }
  };

  const renderCart = () => (
    <>
      <Grid container spacing={4}>
        {cart.lineItems.map((lineItem) => (
          <Grid item xs={12} sm={4} key={lineItem.id}>
            <CartItem
              item={lineItem}
              onUpdateCartQty={onUpdateCartQty}
              onRemoveFromCart={onRemoveFromCart}
            />
          </Grid>
        ))}
      </Grid>
      <div className={classes.cardDetails}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            spacing: "20px",
          }}
        >
          <Typography variant="h5">
            Tổng tiền: <b>{cart.subTotal} VND</b>
          </Typography>
          {/* <Button
            style={{ marginLeft: "70px" }}
            className={classes.emptyButton}
            size="large"
            type="button"
            variant="contained"
            color="secondary"
            onClick={handleSaveCart}
          >
            Save cart
          </Button> */}
        </div>
        <div>
          <Button
            className={classes.emptyButton}
            size="large"
            type="button"
            variant="contained"
            color="secondary"
            onClick={handleEmptyCart}
          >
            Xóa giỏ hàng
          </Button>
          <Button
            className={classes.checkoutButton}
            onClick={handleCheckout}
            size="large"
            type="button"
            variant="contained"
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </>
  );

  const fetchCart = async () => {
    try {
      const res = await fetch("http://14.225.207.183:8888/api/shopping-cart-items", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `ms2a=${token}`,
        },
      });
      const data = await res.json();
      if (data?.statusCode === "00000") {
        const cartItems = data?.data;
        let totalItems = 0;
        let subTotal = 0;
        cartItems.forEach((ct) => {
          totalItems = totalItems + ct.quantity;
          subTotal = subTotal + ct.quantity * ct.sellingPrice;
        });
        const cart = {
          id: null,
          lineItems: cartItems,
          totalItems,
          totalUniqueItems: cartItems?.length,
          subTotal,
        };
        setCart(cart);
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, "Đăng nhập lại để tiếp tục");

    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <Container style={{ marginBottom: "177px", minHeight: '409px' }}>
      <div className={classes.toolbar} />
      <Typography className={classes.title} variant="h5" gutterBottom>
        <b>Giỏ hàng của bạn</b>
      </Typography>
      <hr />
      {!cart.lineItems.length ? renderEmptyCart() : renderCart()}
    </Container>
  );
};

export default Cart;
