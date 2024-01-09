import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Grid } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import { Formik, Form } from "formik";
import Box from "@mui/material/Box";
import useStyles from "./styles";
import * as yup from "yup";
import { userApi } from "../../apis";
import { useSnackbar } from "../../contexts";
import { HTTP_STATUS, SNACKBAR } from "../../constants";
import { getData } from "../../utils/localStorage";

const validationSchema = yup.object().shape({
  fullName: yup.string().required("Tên người dùng không được để trống"),
  email: yup
    .string()
    .email("Email sai định dạng")
    .required("Email không được để trống"),
  phone: yup.string().matches(/^\d{10,12}$/, "Số điện thoại không hợp lệ"),
});
const UserProfile = () => {
  const { openSnackbar } = useSnackbar();
  const classes = useStyles();
  const token = getData("token");

  const [initialValues, setInitialValues] = useState(null);

  const getUserDetail = async () => {
    try {
      const { status, data } = await userApi.getUserDetail();
      if (status === HTTP_STATUS.OK) {
        const userInfor = {
          fullName: data?.data?.fullName,
          email: data?.data?.email,
          address: data?.data?.address,
          phone: data?.data?.phone,
        };
        setInitialValues(userInfor);
      } else {
        openSnackbar(SNACKBAR.ERROR, "Lấy thông tin người dùng thất bại");
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, "Lấy thông tin người dùng thất bại");
    }
  };

  const handleFormSubmit = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    try {
      const res = await fetch(`http://localhost:8889/api/users`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `ms2a=${token}`,
        },
      });
      if (res.status >= 400) {
        openSnackbar(SNACKBAR.ERROR, "Cập nhật thông tin người dùng thất bại");
      } else {
        openSnackbar(
          SNACKBAR.SUCCESS,
          "Cập nhật thông tin người dùng thành công"
        );
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, "Cập nhật thông tin người dùng thất bại");
    }
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  return (
    <Container style={{ marginBottom: "50px" }}>
      <div className={classes.toolbar} />
      <Typography className={classes.title} variant="h5" gutterBottom>
        <b>Thông tin khách hàng</b>
      </Typography>
      <hr />
      <Grid item xs={12} sm={8} md={5} elevation={6} square>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box component="form" noValidate sx={{ mt: 1 }}>
            {initialValues !== null && (
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({ values, handleBlur, handleChange, errors, touched }) => (
                  <Form>
                    <TextField
                      id="fullName"
                      name="fullName"
                      label="Tên đầy đủ"
                      variant="outlined"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      value={values.fullName}
                      error={touched.fullName && Boolean(errors.fullName)}
                      helperText={touched.fullName && errors.fullName}
                    />
                    <TextField
                      id="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      value={values.email}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                    <TextField
                      id="address"
                      name="address"
                      label="Địa chỉ"
                      variant="outlined"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      value={values.address}
                      error={touched.address && Boolean(errors.address)}
                      helperText={touched.address && errors.address}
                    />
                    <TextField
                      id="phone"
                      name="phone"
                      label="Số điện thoại"
                      variant="outlined"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      value={values.phone}
                      error={touched.phone && Boolean(errors.phone)}
                      helperText={touched.phone && errors.phone}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Cập nhật thông tin
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
            <Grid container>
              <Grid item xs></Grid>
              <Grid item></Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Container>
  );
};

export default UserProfile;
