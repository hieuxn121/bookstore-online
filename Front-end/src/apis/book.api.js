import * as rest from "./base";

const listbooks = (keyword, category, page, size) =>
  rest.get(
    `/books?keyword=${keyword}&category=${category}&page=${page}&size=${size}`
  );

const getBook = (id) => rest.get(`/books/${id}`);

export default {
  listbooks,
  getBook,
};
