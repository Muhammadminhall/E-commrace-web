import { addToCart } from "./addToCart";
import { quantityToggle } from "./quantityToggle";

export async function showAllProducts() {
  const response = await fetch("../api/data.json");
  const data = await response.json();

  const productContainer = document.querySelector(".productContainer");
  const template = document.querySelector("#product-template");

  data.forEach((product) => {
    // Hello
    const { id, title, price, description, category, image, rating, stock } =
      product;
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
      .addEventListener("click", (event) => quantityToggle(event, id, stock));

    clone.querySelector(".addCart").addEventListener("click", (event) => {
      addToCart(event, id, product.stock);
    });

    productContainer.appendChild(clone);
  });
}
