import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
} from "@material-ui/core";
import { bookApi } from "../../apis";
import { HTTP_STATUS } from "../../constants";

const BookFilter = ({
  categories,
  setProducts,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
}) => {
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleFilterClick = async () => {
    const { status, data } = await bookApi.listbooks(
      searchTerm,
      selectedCategory,
      "",
      ""
    );
    if (status === HTTP_STATUS.OK) {
      setProducts(data?.data?.content);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel id="category-label">Danh mục</InputLabel>
          <Select
            labelId="category-label"
            id="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <MenuItem value="">
              <em>Chọn danh mục</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.key} value={category.key}>
                {category.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6} style={{ marginTop: "10px" }}>
        <Button variant="contained" color="primary" onClick={handleFilterClick}>
          Lọc
        </Button>
      </Grid>
    </Grid>
  );
};

export default BookFilter;
