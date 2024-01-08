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
        openSnackbar(SNACKBAR.ERROR, "Get user detail failed");
      }
    } catch (error) {
      console.log("error: ", error);
      openSnackbar(SNACKBAR.ERROR, "Get user detail failed");
    }
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping address
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
              label="Full name"
              defaultValue={initialValues.fullName}
            />
            <FormInput
              required
              name="address"
              label="Address"
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
              label="Phone"
              defaultValue={initialValues.phone}
            />
          </Grid>
          <br />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button component={Link} variant="outlined" to="/cart">
              Back to Cart
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Next
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AddressForm;
