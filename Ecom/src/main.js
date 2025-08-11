const navCart = document.querySelector(".navCart");
const navItems = document.querySelector(".navItems");
// const cetagorie = document.querySelector(".cetagorie");
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

// document.querySelector("#cart-btn").addEventListener("click", () => {
//   window.location.href = "/pages/addToCart.html";
// });
if (btn && menu) {
  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });
}

import data from "../api/data.json";
console.log(data);
