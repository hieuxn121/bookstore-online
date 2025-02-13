import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Copyright from "./Copyright";
import { HTTP_STATUS, SNACKBAR } from "../constants";
import { useAuth, useSnackbar } from "../contexts";
import { userApi } from "../apis";

const SigninForm = () => {
  const { openSnackbar } = useSnackbar();
  const auth = useAuth();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { status, data } = await userApi.login(values);
    if (status === HTTP_STATUS.OK) {
      if (data.message === "authentication_fail") {
      } else {
        openSnackbar(SNACKBAR.SUCCESS, "Đăng nhập thành công");
        if (data?.data?.role === "ROLE_ADMIN") {
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
      openSnackbar(SNACKBAR.ERROR, "Email hoặc mật khẩu không đúng");
    }
  };

  return (
    <Grid
      item
      mt={5}
      xs={12}
      sm={8}
      md={5}
      component={Paper}
      elevation={6}
      square
    >
      <Box
        sx={{
          my: 8,
          mx: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Đăng nhập
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Đăng nhập
          </Button>
        </Box>
      </Box>
    </Grid>
  );
};

export default SigninForm;
