import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import React, { useEffect, useState } from "react";
import { getData } from "../../../utils/localStorage";
import { useSnackbar } from "../../../contexts";
import { SNACKBAR } from "../../../constants";
import { useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const OrderDetail = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { id } = useParams();
  const { openSnackbar } = useSnackbar();
  const token = getData("token");
  const colors = tokens(theme.palette.mode);
  const [orderDetail, setOrderDetail] = useState({});
  const [author, setAuthor] = useState({});
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
        console.log("data?.data: ", data?.data);
        setOrderDetail(data?.data?.orderDetailDtos);
        setAuthor({
          name: data?.data?.fullName,
          email: data?.data?.email,
        });
      } else {
        openSnackbar(SNACKBAR.ERROR, "Get order detail failed");
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, "Get order detail failed");
    }
  };
  console.log("order detail : ", orderDetail);
  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    { field: "title", headerName: "Title", flex: 0.5 },
    { field: "author", headerName: "Author", flex: 0.5 },
    { field: "category", headerName: "Category", flex: 0.3 },
    { field: "importingPrice", headerName: "Importing price", flex: 0.5 },
    { field: "sellingPrice", headerName: "Selling price", flex: 0.3 },
    { field: "quantity", headerName: "Quantity", flex: 0.3 },
  ];

  return (
    <Box m="20px">
      <Button onClick={() => navigate(-1)}>
        <Typography color={colors.greenAccent[500]}>
          <ArrowBackIcon />
        </Typography>
        <Typography color={colors.greenAccent[500]}>Go back</Typography>
      </Button>
      <Header
        title="Order Detail"
        subtitle={`${author.name} - ${author.email}`}
      />
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
          rows={orderDetail}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.title}
          pageSize={10}
          pageSizeOptions={[10]}
        />
      </Box>
    </Box>
  );
};

export default OrderDetail;
