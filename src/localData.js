import { localStorageProduct } from "./localStorageProduct.js";

export const localData = (id, price) => {
  let cartProducts = localStorageProduct();
  let existingProduct = cartProducts.find((prod) => prod.id === id);

  if (!existingProduct) {
    existingProduct = { id, quantity: 1, price };
    cartProducts.push(existingProduct);
  }

  return existingProduct;
};

// ✅ Define this here so we don’t touch localStorageProduct.js
const saveToLocalStorage = (cartProduct) => {
  localStorage.setItem("localCartProduct", JSON.stringify(cartProduct));
};
