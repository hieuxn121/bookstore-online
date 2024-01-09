import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import React, { useEffect, useState } from "react";
import { getData } from "../../utils/localStorage";
import { useSnackbar } from "../../contexts";
import { SNACKBAR } from "../../constants";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  formControl: {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  },
}));

const oderStatusList = [
  {
    key: "REJECTED",
    value: "Hủy đơn",
  },
  { key: "COMPLETED", value: "Hoàn thành" },
  { key: "PENDING", value: "Đang chờ" },
];

const Orders = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { openSnackbar } = useSnackbar();
  const token = getData("token");
  const colors = tokens(theme.palette.mode);
  const [orders, setOrders] = useState([]);
  const [updateStatus, setUpdateStatus] = useState(false);
  const navigate = useNavigate();
  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://localhost:8889/api/orders/all-user`, {
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
        openSnackbar(SNACKBAR.ERROR, "Lấy danh sách orders thât bại");
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, "Lấy danh sách orders thât bại");
    }
  };

  const handleChange = async (event, orderId) => {
    event.preventDefault();
    const payload = {
      status: event.target.value,
    };

    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });

    try {
      const res = await fetch(`http://localhost:8889/api/orders/${orderId}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `ms2a=${token}`,
        },
      });
      const data = await res.json();
      if (data.statusCode === "00000") {
        setUpdateStatus(true);
      } else {
        setUpdateStatus(false);
        openSnackbar(SNACKBAR.ERROR, "Cập nhật đơn hàng thất bại");
      }
    } catch (error) {
      setUpdateStatus(false);
      openSnackbar(SNACKBAR.ERROR, "Cập nhật đơn hàng thất bại");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [updateStatus]);

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
      renderCell: ({ row: { orderStatus, orderId } }) => {
        return (
          <FormControl sx={{ minWidth: 120 }} className={classes.formControl}>
            <Select
              value={orderStatus}
              onChange={(event) => handleChange(event, orderId)}
              displayEmpty
              inputProps={{
                "aria-label": "Without label",
              }}
              style={{ border: "none" }}
            >
              {oderStatusList?.map((ot) => {
                return <MenuItem value={ot.key}>{ot.value}</MenuItem>;
              })}
            </Select>
          </FormControl>
        );
      },
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
            <Button
              onClick={() => {
                navigate(`/orders/${orderId}`);
              }}
            >
              <ExitToAppIcon />
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="Đơn hàng" subtitle="Danh sách đơn hàng" />
      <Box
        m="40px 0 0 0"
        height="72vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
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
    </Box>
  );
};

export default Orders;
