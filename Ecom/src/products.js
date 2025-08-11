import data from "../api/data.json";
const quantity = document.querySelector(".quantity");
// const productContainer = document.querySelector(".productContainer");
// const template = document.querySelector("#product-template");

console.log(data);
const productContainer = document.querySelector(".productContainer");
const template = document.querySelector("#product-template");

const showProduct = async () => {
  const response = await fetch("../api/data.json");
  const data = await response.json();

  data.forEach((item) => {
    const clone = template.content.cloneNode(true);

    clone.querySelector(".title").textContent = item.title;
    clone.querySelector(".product-image").src = item.image;
    clone.querySelector(".product-image").alt = item.title;
    clone.querySelector(".description").textContent = item.description || "";
    clone.querySelector(".price").textContent = item.price
      ? `$${item.price}`
      : "";
    clone.querySelector(".rating").textContent = item.rating
      ? `Rating: ${item.rating}`
      : "";
    clone.querySelector(".category").textContent = item.category || "";

    productContainer.appendChild(clone);

    // Get the buttons & quantity inside the current clone
    const currentCard = productContainer.lastElementChild;
    const incrementBtn = currentCard.querySelector(".increment");
    const decrementBtn = currentCard.querySelector(".decrement");
    const quantityElem = currentCard.querySelector(".quantity");

    incrementBtn.addEventListener("click", () => {
      let qty = parseInt(quantityElem.textContent);
      quantityElem.textContent = qty + 1;
    });

    decrementBtn.addEventListener("click", () => {
      let qty = parseInt(quantityElem.textContent);
      if (qty > 0) {
        quantityElem.textContent = qty - 1;
      }
    });
  });
};
showProduct();
