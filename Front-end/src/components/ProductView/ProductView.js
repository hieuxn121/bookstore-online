import React from "react";
import { Container, Grid, Button, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { commerce } from "../../lib/commerce";
import { useState, useEffect } from "react";
import "./style.css";
import { bookApi } from "../../apis";
import { HTTP_STATUS, SNACKBAR } from "../../constants";

const createMarkup = (text) => {
  return { __html: text };
};

const ProductView = () => {
  const [product, setProduct] = useState({});
  const fetchProduct = async (id) => {
    const { status, data } = await bookApi.getBook(id);
    if (status === HTTP_STATUS.OK) {
      setProduct(data?.data);
    } else {
      openSnackbar(SNACKBAR.ERROR, "Get list books failed");
    }
  };

  useEffect(() => {
    const id = window.location.pathname.split("/");
    fetchProduct(id[2]);
  }, []);

  return (
    <Container className="product-view">
      <Grid container>
        <Grid item xs={12} md={6} className="image-wrapper">
          <img src={product.imageBase64Src} alt={product.title} />
        </Grid>
        <Grid item xs={12} md={5} className="text">
          <Typography variant="h2">
            <b>{product.title}</b>
          </Typography>
          <Typography variant="h5">
            <b>{product.author}</b>
          </Typography>
          <Typography
            variant="p"
            dangerouslySetInnerHTML={createMarkup(product.description)}
          />
          <Typography variant="h3" color="secondary" style={{ color: "red" }}>
            Price: <b> {product.sellingPrice} </b>
          </Typography>
          <br />
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Button
                size="large"
                className="custom-button"
                component={Link}
                to="/"
              >
                Continue Shopping
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductView;
