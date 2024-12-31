import React, { useState, useEffect } from "react";
import {
  CssBaseline,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Divider,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import AddressForm from "../AddressForm";
import PaymentForm from "../PaymentForm";
import useStyles from "./styles";
import { userApi } from "../../../apis";
import { useSnackbar } from "../../../contexts";
import { HTTP_STATUS, SNACKBAR } from "../../../constants";

const steps = ["Địa chỉ giao hàng", "Chi tiết đơn hàng"];

const Checkout = ({ cart, onCaptureCheckout, order, error }) => {
  const [checkoutToken, setCheckoutToken] = useState(null);
  const { openSnackbar } = useSnackbar();
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({});
  const classes = useStyles();
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
        openSnackbar(SNACKBAR.ERROR, "Đăng nhập lại để tiếp tục");
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, "Đăng nhập lại để tiếp tục");
    }
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  let Confirmation = () =>
    order.customer ? (
      <>
        <div>
          <Typography variant="h5">
            Thank you for your purchase, {order.customer.firstname}{" "}
            {order.customer.lastname}!
          </Typography>
          <Divider className={classes.divider} />
          <Typography variant="subtitle2">
            Order ref: {order.customer_reference}
          </Typography>
        </div>
        <br />
        <Button component={Link} variant="outlined" type="button" to="/">
          Back to home
        </Button>
      </>
    ) : (
      <div className={classes.spinner}>
        <CircularProgress />
      </div>
    );

  if (error) {
    Confirmation = () => (
      <>
        <Typography variant="h5">Error: {error}</Typography>
        <br />
        <Button component={Link} variant="outlined" type="button" to="/">
          Về trang chủ
        </Button>
      </>
    );
  }

  const Form = () =>
    activeStep === 0 ? (
      <AddressForm
        initialValues={initialValues}
        setInitialValues={setInitialValues}
        checkoutToken={checkoutToken}
        nextStep={nextStep}
      />
    ) : (
      <PaymentForm
        initialValues={initialValues}
        checkoutToken={checkoutToken}
        nextStep={nextStep}
        backStep={backStep}
        shippingData={shippingData}
        onCaptureCheckout={onCaptureCheckout}
        cart={cart}
      />
    );

  return (
    <>
      <CssBaseline />
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">
            Thanh toán
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? <Confirmation /> : cart && <Form />}
        </Paper>
      </main>
    </>
  );
};

export default Checkout;
