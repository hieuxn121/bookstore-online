import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logInsert } from "./reportSlice";
import Cookies from "js-cookie";
import { getData } from "../utils/localStorage";

export const getUsers = createAsyncThunk(
  "users/getUsers",

  async (_, thunkAPI) => {
    const { rejectWithValue, dispatch, getState } = thunkAPI;
    const token = getData("token");

    try {
      const res = await fetch("http://localhost:8889/api/users/dashboard", {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.status >= 400) {
        return rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (credentials, thunkAPI) => {
    const { rejectWithValue, getState, dispatch } = thunkAPI;
    try {
      const state = getState();
      const token = state.users.token;
      const res = await fetch("http://localhost:8889/api/users/login", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`,
        },
      });
      //report

      const data = await res.json();
      if (res.status >= 400) {
        return rejectWithValue(data.message);
      }
      localStorage.setItem("token", data?.data?.accessToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: data?.data?.fullName,
        })
      );
      localStorage.setItem("isLogedIn", true);
      dispatch(logInsert({ name: "login", status: "success" }));
      return data;
    } catch (error) {
      dispatch(logInsert({ name: "login", status: "failed" }));
      return rejectWithValue(error.message);
    }
  }
);

const token = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : null;

const isLogedIn = localStorage.getItem("isLogedIn")
  ? localStorage.getItem("isLogedIn")
  : false;

const initialState = {
  isLoading: false,
  user: null,
  token,
  error: null,
  success: false,
  users: [],
  isLogedIn,
  isActive: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token"); // deletes token from storage
      localStorage.removeItem("isLogedIn"); // deletes isLogedIn
      Cookies.remove("ms2a"); // deletes token from cookies
      state.user = null;
      //   state.token = null
      state.user = null;
      state.error = null;
      state.isLoading = false;
      state.isLogedIn = false;
    },
  },

  extraReducers: {
    //get Users
    [getUsers.pending]: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    [getUsers.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.users = action.payload.data.content;
    },
    [getUsers.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    //login
    [login.pending]: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    [login.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isLogedIn = true;
      state.token = action.payload.token;

      // state.user = action.payload.user

      Cookies.set("ms2a", action.payload.token);
    },
    [login.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});
export const userAction = userSlice.actions;
export default userSlice.reducer;
