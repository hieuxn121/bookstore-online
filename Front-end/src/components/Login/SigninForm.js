import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { userApi } from "../../apis";
import { useAuth, useSnackbar } from "../../contexts";
import { HTTP_STATUS, SNACKBAR } from "../../constants";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Email sai định dạng")
    .required("Email không được để trống"),
  password: yup
    .string()
    .min(6, "Mật khẩu phải lớn hơn 6 kí tự")
    .required("Mật khẩu không được để trống"),
});

const SigninForm = () => {
  const auth = useAuth();
  const { openSnackbar } = useSnackbar();
  const [error, setError] = useState(null);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setError(null);
      // Handle form submission logic here
      const { status, data } = await userApi.login(values);
      if (status === HTTP_STATUS.OK) {
        if (data.message === "authentication_fail") {
          setError("Email hoặc password không đúng !");
        } else {
          openSnackbar(SNACKBAR.SUCCESS, "Đăng nhập thành công");
          if (data?.data?.role === "ROLE_USER") {
            auth.signin(
              {
                name: data.data.fullName,
                email: values.email,
                id: data.data.id,
                role: data.data.role,
              },
              data.data.accessToken,
              () => {
                window.location.href = "/";
              }
            );
          } else {
            openSnackbar(
              SNACKBAR.ERROR,
              "Tài khoản không có quyền truy cập vào trang web"
            );
          }
        }
      } else {
        openSnackbar(SNACKBAR.ERROR, "Email hoặc password không đúng");
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
          Đăng nhập
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <form onSubmit={formik.handleSubmit}>
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
            {error && <h7 style={{ color: "red" }}>{error}</h7>}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Đăng nhập
            </Button>
          </form>
          <Grid container>
            <Grid item xs>
              <Link to="#" variant="body2">
                Quên mật khẩu ?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/register" variant="body2">
                {"Chưa có tài khoản ? Đăng kí"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Grid>
  );
};

export default SigninForm;
