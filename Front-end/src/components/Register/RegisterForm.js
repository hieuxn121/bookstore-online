import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { userApi } from "../../apis";
import { useAuth, useSnackbar } from "../../contexts";
import { HTTP_STATUS, SNACKBAR } from "../../constants";

const validationSchema = yup.object({
  fullname: yup.string().required("Tên người dùng không được để trống"),
  email: yup
    .string()
    .email("Email sai định dạng")
    .required("Email không được để trống"),
  password: yup
    .string()
    .min(6, "Mật khẩu phải lớn hơn 6 kí tự")
    .required("Mật khẩu không được để trống"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Xác nhận lại mật khẩu không khớp")
    .required("Xác nhận mật khẩu không được để trống"),
});

const RegisterForm = () => {
  const history = useHistory();
  const auth = useAuth();
  const { openSnackbar } = useSnackbar();
  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission logic here
      const bodyPayload = {
        fullName: values.fullname,
        email: values.email,
        password: values.password,
      };

      const formData = new FormData();
      Object.keys(bodyPayload).forEach((key) => {
        formData.append(key, bodyPayload[key]);
      });

      try {
        const { status, data } = await userApi.signup(bodyPayload);
        if (status === HTTP_STATUS.OK) {
          history.replace({
            pathname: "/send-otp",
            state: {
              email: values?.email,
            },
          });
        } else if (status === HTTP_STATUS.BAD_REQUEST) {
          openSnackbar(SNACKBAR.ERROR, "Thử tài khoản email khác");
        }
      } catch (error) {
        openSnackbar(SNACKBAR.ERROR, "Thử tài khoản email khác");
      }
    },
  });

  return (
    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
      <Box
        sx={{
          my: 8,
          mx: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Đăng kí tài khoản
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              id="fullname"
              name="fullname"
              label="Tên đầy đủ"
              variant="outlined"
              fullWidth
              margin="normal"
              {...formik.getFieldProps("fullname")}
              error={formik.touched.fullname && Boolean(formik.errors.fullname)}
              helperText={formik.touched.fullname && formik.errors.fullname}
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
              id="password"
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              {...formik.getFieldProps("password")}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              {...formik.getFieldProps("confirmPassword")}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
            />

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Đăng kí
            </Button>
          </form>
        </Box>
      </Box>
    </Grid>
  );
};

export default RegisterForm;
