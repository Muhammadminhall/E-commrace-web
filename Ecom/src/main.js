import data from "../api/data.json";

const navCart = document.querySelector(".navCart");
const navItems = document.querySelector(".navItems");
const category = document.querySelector(".cetagorie");
const productImage = document.querySelector(".productImage");
const title = document.querySelector(".title");
const description = document.querySelector(".description");
const price = document.querySelector(".price");
const rating = document.querySelector(".rating");
const increment = document.querySelector(".increment");
const decrement = document.querySelector(".decrement");
const cart = document.querySelector(".cart");

const btn = document.getElementById("menu-btn");
const menu = document.getElementById("mobile-menu");

const productCard = document.querySelector(".productCard");

if (btn && menu) {
  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });
}

// const showProduct = async () => {
//   const response = await fetch("../api/data.json");
//   const data = await response.json();
//   const productContainer = document.querySelector(".productContainer");
//   const template = document.querySelector(".product-template");

//   data.slice(0, 3).forEach((item) => {
//     // Clone the template content
//     const clone = template.content.cloneNode(true);

//     // Fill the clone with data
//     clone.querySelector(".title").textContent = item.title;
//     clone.querySelector(".product-image").src = item.image;
//     clone.querySelector(".product-image").alt = item.title;
//     clone.querySelector(".description").textContent = item.description || "";
//     clone.querySelector(".price").textContent = item.price
//       ? `$${item.price}`
//       : "";
//     clone.querySelector(".rating").textContent = item.rating
//       ? `Rating: ${item.rating}`
//       : "";
//     clone.querySelector(".category").textContent = item.category || "";

//     // Append the filled clone to container
//     productContainer.appendChild(clone);

//     // Get the newly appended product card (last child)
//     const productCard = productContainer.lastElementChild;

//     const incrementBtn = productCard.querySelector(".increment");
//     const decrementBtn = productCard.querySelector(".decrement");
//     const quantityElem = productCard.querySelector(".quantity");

//     incrementBtn.addEventListener("click", () => {
//       let qty = parseInt(quantityElem.textContent);
//       quantityElem.textContent = qty + 1;
//     });

//     decrementBtn.addEventListener("click", () => {
//       let qty = parseInt(quantityElem.textContent);
//       if (qty > 0) {
//         quantityElem.textContent = qty - 1;
//       }
//     });
//   });
// };

const showProduct = async () => {
  const response = await fetch("../api/data.json");
  const data = await response.json();

  const productContainer = document.querySelector(".productContainer");
  const template = document.querySelector("#product-template");

  console.log(data);
  data.slice(0, 3).forEach((item) => {
    const clone = template.content.cloneNode(true);

    clone.querySelector(".title").textContent = item.title;
    clone.querySelector(".category").textContent = item.category;
    clone.querySelector(".productImage").src = item.image;
    clone.querySelector(".productImage").alt = item.name;
    clone.querySelector(".price").textContent = `RS ${item.price}`;
    clone.querySelector(".description").textContent = item.description;
    clone.querySelector(".rating").textContent = `rating: ${item.rating.rate}`;
    productContainer.appendChild(clone);
  });
};

showProduct();
