import React from "react";
import { Typography } from "@material-ui/core";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import Box from "@mui/material/Box";
import * as yup from "yup";

const validationSchema = yup.object({
  fullName: yup.string().required("Tên người dùng không được để trống"),
  email: yup
    .string()
    .email("Email sai định dạng")
    .required("Email không được để trống"),
  address: yup.string().required("Địa chỉ không được để trống"),
  phone: yup
    .string()
    .required("Số điện thoại không được để trống")
    .matches(/^\d{10,12}$/, "Số điện thoại không hợp lệ"),
});
const AddressForm = ({ nextStep, initialValues, setInitialValues }) => {
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("values: ", values);
      setInitialValues(values);
      nextStep();
    },
  });

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Địa chỉ giao hàng
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            id="fullName"
            name="fullName"
            label="Tên đầy đủ"
            variant="outlined"
            fullWidth
            margin="normal"
            {...formik.getFieldProps("fullName")}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
          />
          <TextField
            id="email"
            name="email"
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            {...formik.getFieldProps("email")}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            id="address"
            name="address"
            label="Địa chỉ"
            variant="outlined"
            fullWidth
            margin="normal"
            {...formik.getFieldProps("address")}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
          />
          <TextField
            id="phone"
            name="phone"
            label="Số điện thoại"
            variant="outlined"
            fullWidth
            margin="normal"
            {...formik.getFieldProps("phone")}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button component={Link} variant="outlined" to="/cart">
              Quay lại giỏ hàng
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Tiếp theo
            </Button>
          </div>
        </form>
      </Box>
      <br />
    </>
  );
};

export default AddressForm;
