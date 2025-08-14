import data from "../api/data.json";
import { showAllProducts } from "./products";
import { quantityToggle } from "./quantityToggle";
import { addToCart } from "./addToCart";

const btn = document.getElementById("menu-btn");
const menu = document.getElementById("mobile-menu");
const increment = document.querySelector(".increment");
const decrement = document.querySelector(".decrement");
const productCard = document.querySelector(".productCard");

if (btn && menu) {
  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });
}

const showProduct = async () => {
  const response = await fetch("../api/data.json");
  const data = await response.json();

  const productContainer = document.querySelector(".productContainer");
  const template = document.querySelector("#product-template");

  // console.log(data);

  data.slice(0, 3).forEach((product) => {
    // Hello
    const { id, title, price, description, category, image, rating } = product;
    const clone = template.content.cloneNode(true);
    clone.querySelector("#productCard").setAttribute("id", `card${id}`);

    clone.querySelector(".title").textContent = product.title;
    clone.querySelector(".category").textContent = product.category;
    clone.querySelector(".productImage").src = product.image;
    clone.querySelector(".productImage").alt = product.name;
    clone.querySelector(".stock-count").textContent = product.stock;
    clone.querySelector(".price").textContent = `RS ${product.price}`;
    clone.querySelector(".description").textContent = product.description;
    clone.querySelector(
      ".rating"
    ).textContent = `rating: ${product.rating.rate}`;

    clone
      .querySelector(".stock")
      .addEventListener("click", (event) =>
        quantityToggle(event, id, product.stock)
      );

    clone.querySelector(".addCart").addEventListener("click", (event) => {
      addToCart(event, id, product.stock);
    });

    productContainer.appendChild(clone);
  });
};
if (document.body.classList.contains("homepage")) {
  showProduct();
}

if (document.body.classList.contains("productpage")) {
  showAllProducts();
}
