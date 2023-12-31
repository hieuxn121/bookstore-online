import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { getData } from "../../utils/localStorage";
import Header from "../../components/Header";
import React, { useEffect } from "react";
import { DeleteOutline, MoreHorizSharp } from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
import { getBookId, getBooks } from "../../store/bookSlice";
import ModalUpdateBook from "../../components/book/ModalUpdateBook";
import ModalAddBook from "../../components/book/ModalAddBook";
import { getCategories } from "../../store/categorySlice";
import { useSnackbar } from "../../contexts";
import { SNACKBAR } from "../../constants";

const Book = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const token = getData("token");
  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(
      getBooks({
        title: "",
        author: "",
        category: "",
        page: "",
        size: "",
      })
    );
  }, [dispatch]);

  const { books, book } = useSelector((state) => state.books);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openAdd, setOpenAdd] = React.useState(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleDeleteBook = async (id) => {
    try {
      const res = await fetch(`http://localhost:8889/api/books/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `ms2a=${token}`,
        },
      });
      const data = await res.json();
      if (data.statusCode === "00000") {
        dispatch(getBooks());
        openSnackbar(SNACKBAR.SUCCESS, "Delete book successfully");
      } else {
        openSnackbar(SNACKBAR.ERROR, "Delete book failed");
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, "Delete book failed");
    }
  };

  const columns = [
    {
      field: "title",
      headerName: "Title",
      flex: 0.5,
    },
    {
      field: "author",
      headerName: "Author",
      flex: 0.5,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 0.5,
    },
    {
      field: "imageBase64Src",
      headerName: "Image",
      flex: 0.3,
      renderCell: ({ row: { imageBase64Src } }) => {
        return (
          <img
            src={imageBase64Src}
            width="auto"
            height="80%"
            alt="Base64 Image"
          />
        );
      },
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0.3,
    },
    {
      field: "soldQuantity",
      headerName: "Sold Quantity",
      flex: 0.3,
    },
    {
      field: "remainingQuantity",
      headerName: "Remain Quantity",
      flex: 0.3,
    },
    {
      field: "importingPrice",
      headerName: "Imported Price",
      flex: 0.3,
    },
    {
      field: "sellingPrice",
      headerName: "Selling Price",
      flex: 0.3,
    },
    {
      field: "update",
      headerName: "Update Book",
      flex: 0.3,
      renderCell: ({ row: { id } }) => {
        return (
          <>
            <Box height="55%" m="0" display="flex" justifyContent="flex-start">
              <Typography
                style={{ cursor: "pointer" }}
                color={colors.grey[200]}
                onClick={async () => {
                  await dispatch(getBookId(id));
                  await dispatch(getCategories());
                  handleOpen();
                }}
              >
                <MoreHorizSharp />
              </Typography>
              <Typography
                onClick={() => handleDeleteBook(id)}
                color={colors.redAccent[500]}
                style={{ marginLeft: "10px" }}
              >
                <DeleteOutline />
              </Typography>
            </Box>
          </>
        );
      },
    },
  ];

  return (
    <Box mx="20px">
      <ModalAddBook
        open={openAdd}
        setOpenAdd={setOpenAdd}
        handleClose={handleCloseAdd}
      />
      {book ? <ModalUpdateBook open={open} handleClose={handleClose} /> : <></>}

      <Header title="Books" subtitle="Managing Books " />
      <Box
        m="20px 0 0 0"
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
        {" "}
        <Box display="flex" justifyContent="end">
          <Button
            onClick={async () => {
              await dispatch(getCategories());
              handleOpenAdd();
            }}
            type="submit"
            color="secondary"
            variant="contained"
          >
            Add Book
          </Button>
        </Box>
        <DataGrid
          rows={books}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          pageSize={10}
          pageSizeOptions={[10]}
        />
      </Box>
    </Box>
  );
};

export default Book;
