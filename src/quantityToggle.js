export const quantityToggle = (event, id, stock) => {
  const currentCard = document.querySelector(`#card${id}`);
  //   console.log(currentCard);

  const productQuantity = currentCard.querySelector(".quantity");
  //   console.log(productQuantity);
  let quantity = parseInt(productQuantity.getAttribute("dataQuantity")) || 1;

  if (event.target.classList.contains("increment")) {
    if (quantity < stock) {
      quantity++;
    }
  } else if (quantity === stock) {
    quantity = stock;
  }

  if (event.target.classList.contains("decrement")) {
    if (quantity > 1) {
      quantity -= 1;
    }
  }
  productQuantity.innerText = quantity;
  productQuantity.setAttribute("dataQuantity", quantity);
  // console.log(quantity);
  return quantity;
};
