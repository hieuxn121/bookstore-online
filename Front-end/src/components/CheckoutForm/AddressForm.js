import React, { useState, useEffect } from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import { useForm, FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";
import FormInput from "./CustomTextField";
import { userApi } from "../../apis";
import { useSnackbar } from "../../contexts";
import { HTTP_STATUS, SNACKBAR } from "../../constants";

const AddressForm = ({ checkoutToken, test }) => {
  const methods = useForm();
  const { openSnackbar } = useSnackbar();
  const [initialValues, setInitialValues] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
  });
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

  useEffect(() => {
    getUserDetail();
  }, []);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Địa chỉ giao hàng
      </Typography>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit((data) =>
            test({
              ...data,
            })
          )}
        >
          <Grid container spacing={3}>
            <FormInput
              required
              name="fullName"
              label="Tên đầy đủ"
              defaultValue={initialValues.fullName}
            />
            <FormInput
              required
              name="address"
              label="Địa chỉ"
              defaultValue={initialValues.address}
            />
            <FormInput
              required
              name="email"
              label="Email"
              defaultValue={initialValues.email}
            />
            <FormInput
              required
              name="phone"
              label="Số điện thoại"
              defaultValue={initialValues.phone}
            />
          </Grid>
          <br />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button component={Link} variant="outlined" to="/cart">
              Quay lại giỏ hàng
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Tiếp theo
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AddressForm;
