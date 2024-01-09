import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  CardActionArea,
} from "@material-ui/core";
import { AddShoppingCart } from "@material-ui/icons";
import { Link } from "react-router-dom";
import useStyles from "./styles";
import { getData } from "../../../utils/localStorage";
import { useHistory } from "react-router-dom";
const Product = ({ product, onAddToCart, categories }) => {
  const classes = useStyles();
  const history = useHistory();
  const token = getData("token");
  const handleAddToCart = () => {
    if (token) {
      onAddToCart(product.id, 1);
    } else {
      history.push("/login");
    }
  };

  return (
    <Card className={classes.root}>
      <Link to={`product-view/${product.id}`}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={product?.imageBase64Src}
            title={product?.title}
          />
        </CardActionArea>
      </Link>
      <CardContent>
        <div className={classes.cardContent}>
          <Typography variant="h6">{product?.title}</Typography>
        </div>
        <div className={classes.cardContent}>
          <Typography variant="h7" style={{ fontWeight: 600 }}>
            {categories?.find((ct) => ct.key === product?.category)?.value}
          </Typography>
        </div>
        <div className={classes.cardContent} style={{ fontWeight: 500 }}>
          <Typography variant="h8">
            {product?.remainingQuantity} sách còn lại
          </Typography>
        </div>
        <div className={classes.cardContent}>
          <Typography variant="h6" color="secondary">
            <b>{product?.sellingPrice} VND</b>
          </Typography>
        </div>
      </CardContent>
      <CardActions disableSpacing className={classes.cardActions}>
        <Button
          disabled={product?.remainingQuantity === 0 ? true : false}
          variant="contained"
          className={classes.button}
          endIcon={<AddShoppingCart />}
          onClick={handleAddToCart}
        >
          <b>Thêm vào giỏ hàng</b>
        </Button>
      </CardActions>
    </Card>
  );
};

export default Product;
