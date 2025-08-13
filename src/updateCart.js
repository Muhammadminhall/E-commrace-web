const cartValue = document.querySelector("#cartValue");
export const updateCart = (cartProduct) => {
  return (cartValue.innerHTML = `<a
              id="cartValue"
              href="/pages/addToCart.html"
              class="bg-black text-white px-3 py-1 rounded-xl hover:bg-gray-800 flex items-center justify-center gap-x-2"
            >
              <img
                src="../images/icons8-cart-50.png"
                alt="Cart"
                class="invert h-4 w-4"
              />
              ${cartProduct.length}
            </a>`);
};
