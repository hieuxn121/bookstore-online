import * as rest from "./base";

const login = (data) => rest.post("/users/login", data);

const signup = (data) => rest.post("/users/register", data);

const sendOtp = (action, email) =>
  rest.post(`/users/send-otp?action=${action}&email=${email}`);

const verify = (action, body) =>
  rest.post(`/users/verify?action=${action}`, body);

const getUserDetail = () => rest.get("/users/shipping-info");

const getUsersByEmail = (email) => rest.get("/result?email=" + email);

export default {
  login,
  signup,
  getUserDetail,
  getUsersByEmail,
  sendOtp,
  verify,
};
