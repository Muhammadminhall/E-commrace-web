import { localStorageProduct } from "./localStorageProduct";
import { updateCart } from "./updateCart";

localStorageProduct();
export const addToCart = (event, id, stock) => {
  let cartProduct = localStorageProduct();

  const currentCard = document.querySelector(`#card${id}`);
  let quantity = Number(currentCard.querySelector(".quantity").innerText);
  let price = Number(
    currentCard.querySelector(".price").innerText.replace("RS", "")
  );

  // Check if product exists
  let existing = cartProduct.find((currProduct) => currProduct.id === id);

  if (existing) {
    // Update quantity and price
    existing.quantity += quantity;
    existing.price = existing.quantity * price;

    // Save the updated array
    localStorage.setItem("localCartProduct", JSON.stringify(cartProduct));
  } else {
    // Add new product
    cartProduct.push({ id, quantity, price: quantity * price });
    localStorage.setItem("localCartProduct", JSON.stringify(cartProduct));
  }

  updateCart(cartProduct);
  // console.log(price, quantity);
};
