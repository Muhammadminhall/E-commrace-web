import products from "../api/data.json";

// ✅ LocalStorage helpers
const localStorageProduct = () => {
  let cartProduct = localStorage.getItem("localCartProduct");
  return cartProduct ? JSON.parse(cartProduct) : [];
};

const saveToLocalStorage = (cartProducts) => {
  localStorage.setItem("localCartProduct", JSON.stringify(cartProducts));
};

document.addEventListener("DOMContentLoaded", () => {
  let cartProducts = localStorageProduct();

  // Add status to cart items
  let cartItems = cartProducts.map((cartItem) => {
    const prod = products.find((p) => p.id === cartItem.id);
    return {
      ...prod,
      quantity: Number(cartItem.quantity) || 1,
      status: cartItem.status || "pending", // pending by default
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

      // Show status
      const statusElem = document.createElement("p");
      statusElem.className = "text-sm font-medium mt-1";
      if (item.status === "processing") {
        statusElem.textContent = "Processing / Delivery in progress...";
        statusElem.className += " text-yellow-600";
      } else if (item.status === "paid") {
        statusElem.textContent = "Payment Completed!";
        statusElem.className += " text-green-600";
      }
      clone.querySelector(".flex-grow").appendChild(statusElem);

      // Disable increment/decrement/remove if processing
      if (item.status !== "processing") {
        clone.querySelector(".increment").addEventListener("click", () => {
          item.quantity++;
          saveCart();
          showCartProduct();
        });
        clone.querySelector(".decrement").addEventListener("click", () => {
          if (item.quantity > 1) {
            item.quantity--;
            saveCart();
            showCartProduct();
          }
        });
        clone.querySelector(".remove-btn").addEventListener("click", () => {
          cartItems = cartItems.filter((i) => i.id !== item.id);
          saveCart();
          showCartProduct();
        });
      } else {
        clone.querySelector(".increment").disabled = true;
        clone.querySelector(".decrement").disabled = true;
        clone.querySelector(".remove-btn").disabled = true;
      }

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

  // ----- Payment Modal Logic -----
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

    // Disable card fields if any item is processing
    const anyProcessing = cartItems.some((i) => i.status === "processing");
    cardNumberInput.disabled = anyProcessing;
    cardExpiryInput.disabled = anyProcessing;
    cardCVVInput.disabled = anyProcessing;
    confirmPaymentBtn.disabled = anyProcessing;

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

    // --- Basic validation ---
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
    if (type === "personal") {
      const name = personalNameInput.value.trim();
      if (!name) {
        alert("❌ Please enter your name for personal payment!");
        return;
      }
    }

    // --- Simulate processing ---
    confirmPaymentBtn.textContent = "Processing...";
    confirmPaymentBtn.disabled = true;

    setTimeout(() => {
      // Mark all items as processing
      cartItems = cartItems.map((item) => ({ ...item, status: "processing" }));
      saveCart();
      showCartProduct();

      if (type === "personal") {
        alert(
          `✅ Personal Payment received from ${personalNameInput.value}! Amount: $${cardAmountInput.value}`
        );
      } else {
        alert(`✅ Dummy Payment Successful for $${cardAmountInput.value}!`);
      }

      // Disable card fields after payment
      cardNumberInput.disabled = true;
      cardExpiryInput.disabled = true;
      cardCVVInput.disabled = true;
      confirmPaymentBtn.disabled = true;

      // Reset modal (keep it visible if you want)
      paymentModal.classList.add("hidden");

      // Reset fields visually
      cardNumberInput.value = "";
      cardExpiryInput.value = "";
      cardCVVInput.value = "";
      personalNameInput.value = "";
      confirmPaymentBtn.textContent = "Confirm Payment";
    }, 2000);
  });

  showCartProduct();
});
