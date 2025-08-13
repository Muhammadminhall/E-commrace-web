import { updateCart } from "./updateCart";

export const localStorageProduct = () => {
  let cartProduct = localStorage.getItem("localCartProduct");
  if (!cartProduct) {
    return [];
  }
  cartProduct = JSON.parse(cartProduct);

  updateCart(cartProduct);
  return cartProduct;
};
