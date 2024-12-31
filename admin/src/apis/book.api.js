import * as rest from "./base";

const listbooks = (title='', author='', category='', page='', size='') =>
  rest.get(
    `/books?title=${title}&author=${author}&category=${category}&page=${page}&size=${size}`
  );

export default {
  listbooks,
};
