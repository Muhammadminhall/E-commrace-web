import products from "../api/data.json";

const localStorageProduct = () => {
  let cartProduct = localStorage.getItem("localCartProduct");
  return cartProduct ? JSON.parse(cartProduct) : [];
};

const saveToLocalStorage = (cartProducts) => {
  localStorage.setItem("localCartProduct", JSON.stringify(cartProducts));
};

document.addEventListener("DOMContentLoaded", () => {
  let cartProducts = localStorageProduct();

  let cartItems = cartProducts.map((cartItem) => {
    const prod = products.find((p) => p.id === cartItem.id);
    return {
      ...prod,
      quantity: Number(cartItem.quantity) || 1,
      status: cartItem.status || "pending",
    };
  });

  const container = document.querySelector(".cart-container");
  const template = document.querySelector(".cartTemplate");
  if (!container || !template) return;

  function showCartProduct() {
    container.innerHTML = "";
    cartItems.forEach((item) => {
      const clone = template.content.cloneNode(true);
      clone.querySelector(".product-img").src = item.image;
      clone.querySelector(".category").textContent = item.category;
      clone.querySelector(".title").textContent = item.title;
      clone.querySelector(".quantity-text").textContent = item.quantity;
      clone.querySelector(".price").textContent = `$${(
        item.price * item.quantity
      ).toFixed(2)}`;

      const statusElem = document.createElement("p");
      statusElem.className = "text-sm font-medium mt-1";
      if (item.status === "paid") {
        statusElem.textContent = "On Delivery / Processing";
        statusElem.classList.add("text-yellow-600");
      } else {
        statusElem.textContent = "";
      }
      clone.querySelector(".flex-grow").appendChild(statusElem);

      // Increment / Decrement
      const incBtn = clone.querySelector(".increment");
      const decBtn = clone.querySelector(".decrement");
      if (item.status === "paid") {
        incBtn.disabled = true;
        decBtn.disabled = true;
        incBtn.classList.add("opacity-50", "cursor-not-allowed");
        decBtn.classList.add("opacity-50", "cursor-not-allowed");
      } else {
        incBtn.disabled = false;
        decBtn.disabled = false;
        incBtn.classList.remove("opacity-50", "cursor-not-allowed");
        decBtn.classList.remove("opacity-50", "cursor-not-allowed");
      }

      incBtn.addEventListener("click", () => {
        if (item.status === "paid") return;
        item.quantity++;
        saveCart();
        showCartProduct();
      });
      decBtn.addEventListener("click", () => {
        if (item.status === "paid") return;
        if (item.quantity > 1) {
          item.quantity--;
          saveCart();
          showCartProduct();
        }
      });

      // Remove
      const removeBtn = clone.querySelector(".remove-btn");
      if (item.status === "paid") {
        removeBtn.disabled = true;
        removeBtn.classList.add("opacity-50", "cursor-not-allowed");
      }
      removeBtn.addEventListener("click", () => {
        if (item.status === "paid") return;
        cartItems = cartItems.filter((i) => i.id !== item.id);
        saveCart();
        showCartProduct();
      });

      container.appendChild(clone);
    });
    updateOrderSummary();
  }

  function saveCart() {
    const simpleCart = cartItems.map((i) => ({
      id: i.id,
      quantity: i.quantity,
      status: i.status,
    }));
    saveToLocalStorage(simpleCart);
  }

  function updateOrderSummary() {
    const subtotalElem = document.getElementById("subtotalAmount");
    const shippingElem = document.getElementById("shippingAmount");
    const totalElem = document.getElementById("totalAmount");

    let subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    let shipping = cartItems.length ? 5 : 0;
    let total = subtotal + shipping;

    if (subtotalElem) subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElem) shippingElem.textContent = `$${shipping.toFixed(2)}`;
    if (totalElem) totalElem.textContent = `$${total.toFixed(2)}`;
  }

  // ----- Payment Modal -----
  const checkoutBtn = document.getElementById("checkoutBtn");
  const paymentModal = document.getElementById("paymentModal");
  const cardNumberInput = document.getElementById("cardNumber");
  const cardExpiryInput = document.getElementById("cardExpiry");
  const cardCVVInput = document.getElementById("cardCVV");
  const cardAmountInput = document.getElementById("cardAmount");
  const cancelPaymentBtn = document.getElementById("cancelPayment");
  const confirmPaymentBtn = document.getElementById("confirmPayment");

  checkoutBtn?.addEventListener("click", () => {
    if (cartItems.length === 0) {
      alert("🛒 Cart is empty!");
      return;
    }

    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const shipping = cartItems.length ? 5 : 0;
    cardAmountInput.value = (subtotal + shipping).toFixed(2);

    cardNumberInput.disabled = false;
    cardExpiryInput.disabled = false;
    cardCVVInput.disabled = false;
    confirmPaymentBtn.disabled = false;
    cancelPaymentBtn.disabled = false;
    confirmPaymentBtn.textContent = "Confirm Payment";

    paymentModal.classList.remove("hidden");
  });

  cancelPaymentBtn.addEventListener("click", () => {
    paymentModal.classList.add("hidden");
  });

  confirmPaymentBtn.addEventListener("click", () => {
    const cardNumber = cardNumberInput.value.trim();
    const expiry = cardExpiryInput.value.trim();
    const cvv = cardCVVInput.value.trim();

    if (!cardNumber || !expiry || !cvv) {
      alert("❌ Please fill all card fields!");
      return;
    }
    if (!/^\d{16}$/.test(cardNumber)) {
      alert("❌ Card number must be 16 digits!");
      return;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      alert("❌ CVV must be 3 or 4 digits!");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      alert("❌ Expiry must be in MM/YY format!");
      return;
    }

    // Disable modal inputs
    cardNumberInput.disabled = true;
    cardExpiryInput.disabled = true;
    cardCVVInput.disabled = true;
    confirmPaymentBtn.disabled = true;
    cancelPaymentBtn.disabled = true;
    confirmPaymentBtn.textContent = "Processing...";

    setTimeout(() => {
      // Update cart items as paid
      cartItems = cartItems.map((item) => ({ ...item, status: "paid" }));
      saveCart();
      showCartProduct();

      alert(`✅ Payment Successful! Amount: $${cardAmountInput.value}`);

      // Navigate to cart page or reload page
      window.location.href = "/pages/addToCart.html"; // change if your cart URL is different
    }, 2000);
  });

  showCartProduct();
});
