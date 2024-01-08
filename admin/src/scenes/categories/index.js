import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import moment from "moment";
import { getCategories } from "../../store/categorySlice";

const Category = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const { categories } = useSelector((state) => state.categories);
  const categoriesConverted = Object.keys(categories).map((key) => ({
    key,
    value: categories[key],
  }));

  const newCategories = categoriesConverted.map((ct, index) => {
    return {
      name: ct.value,
      description: "",
      createdAt: "2023-12-20",
      _id: ct.key,
    };
  });

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      renderCell: ({ row: { createdAt } }) => {
        return moment(createdAt).utc().format("YYYY-MM-DD");
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="Categories" subtitle="List of Categories " />
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
          rows={newCategories}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={10}
          pageSizeOptions={[10]}
        />
      </Box>
    </Box>
  );
};

export default Category;
