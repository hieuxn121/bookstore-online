import * as rest from "./base";

const login = (data) => rest.post("/users/login", data);

const signup = (data) => rest.post("/users/register", data);

const sendOtp = (action, email) =>
  rest.post(`/users/send-otp?action=${action}&email=${email}`);

const verify = (action, body) =>
  rest.post(`/users/verify?action=${action}`, body);

const getUserDetail = (userId) => rest.get("/detail?userId=" + userId);

const getUsersByEmail = (email) => rest.get("/result?email=" + email);

const listUsers = () => rest.get('/users/dashboard');

export default {
  login,
  signup,
  getUserDetail,
  getUsersByEmail,
  sendOtp,
  verify,
  listUsers
};
