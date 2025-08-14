import { localStorageProduct } from "./localStorageProduct.js";

export const localData = (id, price) => {
  // Get current cart
  let cartProducts = localStorageProduct();

  // Check if product already exists
  let existingProduct = cartProducts.find((prod) => prod.id === id);

  if (existingProduct) {
    alert("⚠️ This product is already in your cart!");
    return null; // Stop adding
  }

  // If not exists, add new product
  const newProduct = { id, quantity: 1, price };
  cartProducts.push(newProduct);

  // Save updated cart to localStorage
  localStorage.setItem("localCartProduct", JSON.stringify(cartProducts));

  return newProduct;
};
