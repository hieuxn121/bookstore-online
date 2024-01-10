import React from "react";
import {
  Typography,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
} from "@material-ui/core";

import useStyles from "./styles";

const CartItem = ({ item, onUpdateCartQty, onRemoveFromCart }) => {
  const classes = useStyles();
  const handleUpdateCartQty = (lineItemId, newQuantity, action, cartItemId) =>
    onUpdateCartQty(lineItemId, newQuantity, action, cartItemId);
  const handleRemoveFromCart = (lineItemId, cartItemId) =>
    onRemoveFromCart(lineItemId, cartItemId);

  return (
    <Card className="cart-item">
      <CardMedia
        image={item.imageBase64Src}
        alt={item.title}
        className={classes.media}
      />
      <CardContent className={classes.cardContent}>
        <Typography variant="h6">{item.title}</Typography>
        <Typography variant="h6" color="secondary">
          {item.sellingPrice * item.quantity} VND
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <div className={classes.buttons}>
          <Button
            type="button"
            size="small"
            onClick={() =>
              handleUpdateCartQty(
                item.id || item.bookId,
                item.quantity - 1,
                "DECREASE",
                item.cartItemId
              )
            }
          >
            -
          </Button>
          <Typography>&nbsp;{item.quantity}&nbsp;</Typography>
          <Button
            type="button"
            size="small"
            onClick={() =>
              handleUpdateCartQty(
                item.id || item.bookId,
                item.quantity + 1,
                "INCREASE",
                item.cartItemId
              )
            }
          >
            +
          </Button>
        </div>
        <Button
          className={classes.button}
          variant="contained"
          type="button"
          color="secondary"
          onClick={() =>
            handleRemoveFromCart(item.id || item.bookId, item.cartItemId)
          }
        >
          Xóa
        </Button>
      </CardActions>
    </Card>
  );
};

export default CartItem;
