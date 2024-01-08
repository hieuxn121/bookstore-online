import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as yup from "yup";
import {
  Input,
  InputAdornment,
  IconButton,
  Avatar,
  Button,
  Grid,
  MenuItem,
  Modal,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../../utils/localStorage";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useSnackbar } from "../../contexts";
import { getBooks } from "../../store/bookSlice";
import { SNACKBAR } from "../../constants";

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  author: yup.string().required("Author is required"),
  description: yup.string().required("Description is required"),
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 4,
  p: 4,
};

const ModalUpdateBook = ({ open, handleClose }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const token = getData("token");
  const dispatch = useDispatch();
  const { openSnackbar } = useSnackbar();
  const { book } = useSelector((state) => state.books);
  const { categories } = useSelector((state) => state.categories);
  const categoriesConverted = Object.keys(categories).map((key) => ({
    key,
    value: categories[key],
  }));

  const [CategorySelected, setCategorySelected] = useState(book?.category);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const initialValues = {
    id: book.id,
    title: book.title,
    author: book.author,
    description: book.description,
    category: book.category,
    soldQuantity: book.soldQuantity,
    remainingQuantity: book.remainingQuantity,
    importingPrice: book.importingPrice,
    sellingPrice: book.sellingPrice,
  };

  const handleCategory = (event) => {
    const value = event.target.value;
    setCategorySelected(value);
  };

  const handleFormSubmit = async (values) => {
    if (selectedFile) {
      values.imgFile = selectedFile;
    }
    if (CategorySelected && CategorySelected !== "") {
      values.category = CategorySelected;
    }
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    try {
      const res = await fetch(`http://localhost:8889/api/books`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `ms2a=${token}`,
        },
      });
      const data = await res.json();
      if (data.statusCode === "00000") {
        dispatch(getBooks());
        openSnackbar(SNACKBAR.SUCCESS, "Update book successfully");
      } else {
        openSnackbar(SNACKBAR.ERROR, "Update book failed");
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, "Update book failed");
    }
    handleClose();
    setCategorySelected(null);
    setSelectedFile(null);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
        setCategorySelected(null);
        setSelectedFile(null);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Grid item xs={12} sm={8} md={5} sx={style} square>
        <Box>
          <Box
            sx={{
              my: 3,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }} />

            <Typography component="h1" variant="h5">
              Update Book
            </Typography>
          </Box>

          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
          >
            {({ values, handleBlur, handleChange, errors, touched }) => (
              <Form>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Title"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.title}
                    name="title"
                    sx={{ gridColumn: "span 2" }}
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Author"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.author}
                    name="author"
                    sx={{ gridColumn: "span 2" }}
                    error={touched.author && Boolean(errors.author)}
                    helperText={touched.author && errors.author}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description}
                    name="description"
                    rows={5}
                    multiline
                    sx={{ gridColumn: "span 4" }}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                  <div style={{ width: "100%", display: "block" }}>
                    <Input
                      type="file"
                      accept="image/*"
                      style={{ width: "300px" }}
                      onChange={handleFileChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <label htmlFor="upload-button">
                            <IconButton
                              color="primary"
                              aria-label="upload picture"
                              component="span"
                              size="large"
                            >
                              <PhotoCameraIcon />
                            </IconButton>
                          </label>
                        </InputAdornment>
                      }
                    />
                    {selectedFile && (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        style={{ marginTop: "10px" }}
                      >
                        Selected file: {selectedFile.name}
                      </Typography>
                    )}
                  </div>
                  <TextField
                    fullWidth
                    variant="filled"
                    select
                    label="Categories"
                    onChange={handleCategory}
                    value={CategorySelected}
                    name="category"
                    sx={{ gridColumn: "span 4" }}
                    SelectProps={{ multiple: false }}
                  >
                    {categoriesConverted.map((elem, index) => {
                      return (
                        <MenuItem key={index} value={elem.key}>
                          {elem.value}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    label="Sold quantity"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.soldQuantity}
                    name="soldQuantity"
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    label="Remaining quantity"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.remainingQuantity}
                    name="remainingQuantity"
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    label="Importing price"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.importingPrice}
                    name="importingPrice"
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    label="Selling price"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.sellingPrice}
                    name="sellingPrice"
                    sx={{ gridColumn: "span 2" }}
                  />
                </Box>
                <Box display="flex" justifyContent="end" mt="20px">
                  <Button type="submit" color="secondary" variant="contained">
                    update Book
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Grid>
    </Modal>
  );
};

export default ModalUpdateBook;
