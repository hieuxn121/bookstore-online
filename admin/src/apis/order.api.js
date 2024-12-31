import * as rest from "./base";

const listOrders = () =>
  rest.get(
    `/orders/all-user`
  );

export default {
    listOrders,
};
