import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logInsert } from "./reportSlice";

export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await fetch("http://localhost:8889/api/books/categories");
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const CategorySlice = createSlice({
  name: "category",
  initialState: { category: {}, categories: {}, isLoading: false, error: null },

  extraReducers: {
    //get Category
    [getCategories.pending]: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    [getCategories.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.categories = action.payload.data;
    },
    [getCategories.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default CategorySlice.reducer;
