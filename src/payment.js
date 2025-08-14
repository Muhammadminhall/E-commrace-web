import products from "../api/data.json";

// ----- LocalStorage Helpers -----
const localStorageProduct = () => {
  const cartProduct = localStorage.getItem("localCartProduct");
  return cartProduct ? JSON.parse(cartProduct) : [];
};

const saveToLocalStorage = (cartProducts) => {
  localStorage.setItem("localCartProduct", JSON.stringify(cartProducts));
};

document.addEventListener("DOMContentLoaded", () => {
  let cartProducts = localStorageProduct();

  // ----- Map cart items with product data -----
  let cartItems = cartProducts.map((cartItem) => {
    const prod = products.find((p) => String(p.id) === String(cartItem.id));
    return {
      ...prod,
      quantity: Number(cartItem.quantity) || 1,
      status: cartItem.status || "pending", // default to pending
    };
  });

  const container = document.querySelector(".cart-container");
  const template = document.querySelector(".cartTemplate");
  if (!container || !template) return;

  // ----- Show Cart Items -----
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

      // Status message
      const statusElem = document.createElement("p");
      statusElem.className = "text-sm font-medium mt-1";
      if (item.status === "processing") {
        statusElem.textContent = "Processing / Delivery in progress...";
        statusElem.classList.add("text-yellow-600");
      } else if (item.status === "paid") {
        statusElem.textContent = "Payment Completed!";
        statusElem.classList.add("text-green-600");
      }
      clone.querySelector(".flex-grow").appendChild(statusElem);

      // Buttons
      const incBtn = clone.querySelector(".increment");
      const decBtn = clone.querySelector(".decrement");
      const removeBtn = clone.querySelector(".remove-btn");

      if (item.status === "pending") {
        // Enable buttons for pending items
        incBtn.addEventListener("click", () => {
          item.quantity++;
          saveCart();
          showCartProduct();
        });
        decBtn.addEventListener("click", () => {
          if (item.quantity > 1) {
            item.quantity--;
            saveCart();
            showCartProduct();
          }
        });
        removeBtn.addEventListener("click", () => {
          cartItems = cartItems.filter((i) => String(i.id) !== String(item.id));
          saveCart();
          showCartProduct();
        });
      } else {
        // Disable buttons for non-editable items
        [incBtn, decBtn, removeBtn].forEach((btn) => {
          btn.disabled = true;
          btn.classList.add("opacity-50", "cursor-not-allowed");
        });
      }

      container.appendChild(clone);
    });

    updateOrderSummary();
  }

  // ----- Save Cart to LocalStorage -----
  function saveCart() {
    const simpleCart = cartItems.map((i) => ({
      id: i.id,
      quantity: i.quantity,
      status: i.status,
    }));
    saveToLocalStorage(simpleCart);
  }

  // ----- Update Order Summary -----
  function updateOrderSummary() {
    const subtotalElem = document.getElementById("subtotalAmount");
    const shippingElem = document.getElementById("shippingAmount");
    const totalElem = document.getElementById("totalAmount");

    // Only pending items count
    const pendingItems = cartItems.filter((i) => i.status === "pending");
    const subtotal = pendingItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const shipping = pendingItems.length ? 5 : 0;
    const total = subtotal + shipping;

    if (subtotalElem) subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElem) shippingElem.textContent = `$${shipping.toFixed(2)}`;
    if (totalElem) totalElem.textContent = `$${total.toFixed(2)}`;
  }

  // ----- Payment Modal -----
  const checkoutBtn = document.getElementById("checkoutBtn");
  const paymentModal = document.getElementById("paymentModal");
  const paymentTypeSelect = document.getElementById("paymentType");
  const personalFields = document.getElementById("personalFields");
  const personalNameInput = document.getElementById("personalName");
  const cardNumberInput = document.getElementById("cardNumber");
  const cardExpiryInput = document.getElementById("cardExpiry");
  const cardCVVInput = document.getElementById("cardCVV");
  const cardAmountInput = document.getElementById("cardAmount");
  const cancelPaymentBtn = document.getElementById("cancelPayment");
  const confirmPaymentBtn = document.getElementById("confirmPayment");

  checkoutBtn?.addEventListener("click", () => {
    const pendingItems = cartItems.filter((i) => i.status === "pending");
    if (pendingItems.length === 0) {
      return alert("🛒 No pending items to pay!");
    }

    const subtotal = pendingItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const shipping = pendingItems.length ? 5 : 0;
    cardAmountInput.value = (subtotal + shipping).toFixed(2);

    paymentModal.classList.remove("hidden");
  });

  paymentTypeSelect.addEventListener("change", () => {
    personalFields.classList.toggle(
      "hidden",
      paymentTypeSelect.value !== "personal"
    );
  });

  cancelPaymentBtn.addEventListener("click", () => {
    paymentModal.classList.add("hidden");
  });

  confirmPaymentBtn.addEventListener("click", () => {
    const type = paymentTypeSelect.value;
    const cardNumber = cardNumberInput.value.trim();
    const expiry = cardExpiryInput.value.trim();
    const cvv = cardCVVInput.value.trim();

    // ----- Validation -----
    if (!cardNumber || !expiry || !cvv)
      return alert("❌ Fill all card fields!");
    if (!/^\d{16}$/.test(cardNumber))
      return alert("❌ Card number must be 16 digits!");
    if (!/^\d{3,4}$/.test(cvv)) return alert("❌ CVV must be 3 or 4 digits!");
    if (!/^\d{2}\/\d{2}$/.test(expiry))
      return alert("❌ Expiry must be MM/YY!");
    if (type === "personal" && !personalNameInput.value.trim())
      return alert("❌ Enter name for personal payment!");

    // ----- Processing Simulation -----
    confirmPaymentBtn.textContent = "Processing...";
    confirmPaymentBtn.disabled = true;

    setTimeout(() => {
      // Mark pending items as paid
      cartItems = cartItems.map((i) =>
        i.status === "pending" ? { ...i, status: "paid" } : i
      );
      saveCart();
      showCartProduct();

      alert(`✅ Payment Successful! Amount: $${cardAmountInput.value}`);

      // Reset modal
      paymentModal.classList.add("hidden");
      cardNumberInput.value = "";
      cardExpiryInput.value = "";
      cardCVVInput.value = "";
      personalNameInput.value = "";
      confirmPaymentBtn.textContent = "Confirm Payment";
      confirmPaymentBtn.disabled = false;
    }, 2000);
  });

  // ----- Initial render -----
  showCartProduct();
});
