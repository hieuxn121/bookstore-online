import React, { useState } from "react";
import { Grid, InputAdornment, Input } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import Product from "./Product/Product.js";
import useStyles from "./styles.js";
import Carousel from "react-bootstrap/Carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import logo1 from "../../assets/4.jpeg";
import "../ProductView/style.css";
import { bookApi } from "../../apis/index.js";
import { HTTP_STATUS } from "../../constants/index.js";
import BookFilter from "../ProductView/BookFilter.js";

const Products = ({ products, setProducts, onAddToCart, categories }) => {
  const classes = useStyles();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main className={classes.mainPage}>
      <div className={classes.toolbar} />
      <Carousel fade infiniteLoop useKeyboardArrows autoPlay>
        <Carousel.Item>
          <img className="d-block w-100" src={logo1} alt="slide" />
          <Carousel.Caption>
            <div className={classes.searchs}>
              <Input
                className={classes.searchb}
                type="text"
                placeholder="Bạn đang tìm cuốn sách nào?"
                onChange={async (event) => {
                  setSearchTerm(event.target.value);
                  const { status, data } = await bookApi.listbooks(
                    event.target.value,
                    selectedCategory,
                    "",
                    ""
                  );
                  if (status === HTTP_STATUS.OK) {
                    setProducts(data?.data?.content);
                  }
                }}
                // onKeyDown={handleKeyPress}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {searchTerm === "" && (
        <>
          <h3 className={classes.contentHeader}>Danh sách book</h3>
          <Grid
            className={classes.contentFeatured}
            container
            justifyContent="start"
            spacing={1}
          ></Grid>
          <Grid
            className={classes.contentFeatured}
            container
            justifyContent="center"
            spacing={1}
          >
            {products &&
              products?.length !== 0 &&
              products?.map((product) => (
                <>
                  {product?.categories?.length > 0 ? (
                    <Grid
                      className={classes.contentFeatured}
                      item
                      xs={6}
                      sm={5}
                      md={3}
                      lg={2}
                      id="pro"
                    >
                      <Product
                        categories={categories}
                        product={product}
                        onAddToCart={onAddToCart}
                      />
                    </Grid>
                  ) : (
                    ""
                  )}
                </>
              ))}
          </Grid>
        </>
      )}
      <Grid item xs={3} style={{ margin: "20px" }}>
        <BookFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          setProducts={setProducts}
          searchTerm={searchTerm}
        />
      </Grid>
      <Grid className={classes.content} container justifyContent="center">
        {products &&
          products?.length !== 0 &&
          products?.map((product) => {
            if (product) {
              return (
                <Grid
                  className={classes.content}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  id="pro"
                >
                  <Product
                    categories={categories}
                    product={product}
                    onAddToCart={onAddToCart}
                  />
                </Grid>
              );
            } else {
              return "";
            }
          })}
      </Grid>
    </main>
  );
};

export default Products;
