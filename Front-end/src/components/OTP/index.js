import "./style.css";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useFormik } from "formik";
import { userApi } from "../../apis";
import { useSnackbar } from "../../contexts";
import { HTTP_STATUS, SNACKBAR } from "../../constants";
import { useLocation } from "react-router-dom";

const initialValues = {
  otp: [
    { digit: "" },
    { digit: "" },
    { digit: "" },
    { digit: "" },
    { digit: "" },
    { digit: "" },
  ],
};
const OTPform = () => {
  const { openSnackbar } = useSnackbar();
  const location = useLocation();
  const { email } = location.state;
  const [errors, setErrors] = useState("");
  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      let finalOtp = values.otp.map((item) => item.digit).join("");
      const { status, data } = await userApi.verify("VERIFY_EMAIL", {
        email,
        otp: finalOtp,
      });
      if (status === HTTP_STATUS.OK && data?.message === "success") {
        window.location.href = "/login";
        openSnackbar(SNACKBAR.SUCCESS, "Đăng kí tài khoản thành công");
      } else {
        setErrors(data?.message);
        openSnackbar(SNACKBAR.ERROR, data?.message);
      }
    },
  });

  const handleOTPChange = (event, element) => {
    if (event.target.value === "") {
      return;
    }
    formik.setFieldValue(element, event.target.value);
    const nextElementSibling = event.target.nextElementSibling;

    if (nextElementSibling) {
      nextElementSibling.focus();
    }
  };

  const inputOnKeyDown = (e, element) => {
    const target = e.target;
    formik.setFieldValue(element, "");

    if (e.key !== "Backspace" || target.value !== "") {
      return;
    }

    const previousElementSibling = target.previousElementSibling;

    if (previousElementSibling) {
      previousElementSibling.focus();
    }
  };

  const handleResendCode = async () => {
    setErrors("");
    const { status, data } = await userApi.sendOtp("VERIFY_EMAIL", email);
    if (status === HTTP_STATUS.OK && data?.message === "success") {
      openSnackbar(SNACKBAR.SUCCESS, "Resend code successfully");
    } else {
      openSnackbar(SNACKBAR.ERROR, "Resend code failed");
    }
  };

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
          Two-Factor Verification
        </Typography>
        <div className="card-header">
          <div className="header-subtext">
            Enter the verification code we sent to {email}
          </div>
        </div>
        <form className="otp-conatiner" onSubmit={formik.handleSubmit}>
          <div className="otp-subtext">Type your 6 digit security code</div>
          <div className="otp-inputs">
            {initialValues.otp.map((item, index) => {
              return (
                <input
                  className="otp-input"
                  type="text"
                  {...formik.getFieldProps(`otp.${index}.digit`)}
                  onChange={(event) =>
                    handleOTPChange(event, `otp.${index}.digit`)
                  }
                  onKeyDown={(event) =>
                    inputOnKeyDown(event, `otp.${index}.digit`)
                  }
                  autoComplete="one-time-code"
                  maxLength={1}
                />
              );
            })}
          </div>
          {errors === "wrong_otp" && (
            <div style={{ color: "red" }}>Wrong OTP. Please enter again!</div>
          )}
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
        <div className="otp-resend" onClick={handleResendCode}>
          Didn’t get the code ? Resend code
        </div>
      </Box>
    </Grid>
  );
};

export default OTPform;
