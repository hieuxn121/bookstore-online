import * as rest from "./base";

const createCart = (body) => rest.post(`/shopping-cart-items`, body);

const checkCart = (body) => rest.get(`/orders/validate-cart`);

export default {
  createCart,
  checkCart,
};
