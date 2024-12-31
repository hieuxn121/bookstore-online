import React, { useEffect, useState } from "react";
import { Container, Button, Typography, Box } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import useStyles from "./styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useSnackbar } from "../../contexts";
import { SNACKBAR } from "../../constants";
import { getData } from "../../utils/localStorage";
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const classes = useStyles();
  const { openSnackbar } = useSnackbar();
  const [orders, setOrders] = useState([]);
  const token = getData("token");
  const columns = [
    { field: "fullName", headerName: "Tên khách hàng", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.5 },
    { field: "phone", headerName: "Số điện thoại", flex: 0.3 },
    { field: "address", headerName: "Địa chỉ", flex: 0.5 },
    { field: "totalValue", headerName: "Tổng tiền", flex: 0.3 },
    {
      field: "orderStatus",
      headerName: "Trạng thái đơn",
      flex: 0.3,
    },
    { field: "createdAt", headerName: "Thời gian tạo", flex: 0.3 },
    { field: "modifiedAt", headerName: "Thời gian cập nhật", flex: 0.3 },
    {
      field: "update",
      headerName: "Xem chi tiết đơn",
      flex: 0.5,
      renderCell: ({ row: { orderId } }) => {
        return (
          <Box height="55%" m="0" display="flex" justifyContent="flex-start">
            <Link to={`orders-history/${orderId}`}>
              <ExitToAppIcon />
            </Link>
          </Box>
        );
      },
    },
  ];

  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://14.225.207.183:8888/api/orders/current-user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `ms2a=${token}`,
        },
      });
      const data = await res.json();
      if (data.statusCode === "00000") {
        setOrders(data?.data);
      } else {
        openSnackbar(SNACKBAR.ERROR, "Đăng nhập lại để tiếp tục");
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, "Đăng nhập lại để tiếp tục");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Container style={{ marginBottom: "177px", maxWidth: "100%" }}>
      <div className={classes.toolbar} />
      <Typography className={classes.title} variant="h5" gutterBottom>
        <b>Lịch sử đơn hàng</b>
      </Typography>
      <hr />
      <Box m="40px 0 0 0" height="72vh">
        <DataGrid
          autoWidth
          rows={orders}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.orderId}
          pageSize={10}
          pageSizeOptions={[10]}
        />
      </Box>
    </Container>
  );
};

export default OrderHistory;
