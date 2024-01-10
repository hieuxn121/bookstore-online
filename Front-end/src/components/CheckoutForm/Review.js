import React from "react";
import { Typography, List, ListItem, ListItemText } from "@material-ui/core";

const Review = ({ cart }) => (
  <>
    <Typography variant="h6" gutterBottom>
      Chi tiết đơn hàng
    </Typography>
    <List disablePadding>
      {cart?.lineItems.map((product) => (
        <ListItem style={{ padding: "10px 0" }} key={product.title}>
          <ListItemText
            primary={product.title}
            secondary={`Số lượng: ${product.quantity}`}
          />
          <Typography variant="body2">
            {product.quantity * product.sellingPrice} VND
          </Typography>
        </ListItem>
      ))}
      <ListItem style={{ padding: "10px 0" }}>
        <ListItemText primary="Total" />
        <Typography variant="subtitle1" style={{ fontWeight: 700 }}>
          {cart?.subTotal} VND
        </Typography>
      </ListItem>
    </List>
  </>
);

export default Review;
