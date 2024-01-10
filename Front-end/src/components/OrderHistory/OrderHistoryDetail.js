import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  Button,
  ListItem,
  ListItemText,
  CssBaseline,
  Paper,
} from "@material-ui/core";
import { useSnackbar } from "../../contexts";
import { SNACKBAR } from "../../constants";
import { getData } from "../../utils/localStorage";
import { useParams } from "react-router-dom";
import useStyles from "./styles";
import { useHistory } from "react-router-dom";
const OrderHistoryDetail = () => {
  const classes = useStyles();
  const { openSnackbar } = useSnackbar();
  const { id } = useParams();
  const token = getData("token");
  const history = useHistory();
  const [orderDetail, setOrderDetail] = useState({});
  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://localhost:8889/api/orders/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `ms2a=${token}`,
        },
      });
      const data = await res.json();
      if (data.statusCode === "00000") {
        setOrderDetail(data?.data);
      } else {
        openSnackbar(
          SNACKBAR.ERROR,
          "Lấy danh sách chi tiết đơn hàng thất bại"
        );
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, "Lấy danh sách chi tiết đơn hàng thất bại");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [id]);

  return (
    <>
      <CssBaseline />
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">
            Chi tiết đơn hàng
          </Typography>
          <Typography variant="h6" gutterBottom>
            Danh sách sản phẩm
          </Typography>
          <List disablePadding>
            {orderDetail?.orderDetailDtos?.map((product) => (
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
                {orderDetail?.totalValue} VND
              </Typography>
            </ListItem>
          </List>
          <br /> <br />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              style={{ backgroundColor: "#1C2331", color: "#FFFF" }}
              onClick={() => {
                history.goBack();
              }}
            >
              Quay lại
            </Button>
          </div>
        </Paper>
      </main>
    </>
  );
};

export default OrderHistoryDetail;
