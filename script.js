function renderCart() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cart-items");

  const deliveryFee = 5.0;

  let subtotal = 0;
  cartContainer.innerHTML = "";

  cartItems.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "dish-card";
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}" />
      <h3>${item.name}</h3>
      <p class="price">$${item.price}</p>
      <button class="remove-btn" data-index="${index}">🗑</button>
    `;
    cartContainer.appendChild(div);
    subtotal += parseFloat(item.price);
  });

  const total = subtotal + deliveryFee;

  const totalPriceEl = document.getElementById("total-price");
  if (totalPriceEl) {
    totalPriceEl.innerHTML = `
      <p>Subtotal: $${subtotal.toFixed(2)}</p>
      <p>Delivery: $${deliveryFee.toFixed(2)}</p>
      <hr>
      <strong>Total: $${total.toFixed(2)}</strong>
    `;
  }

  const cartCount = document.getElementById("cart-count");
  if (cartCount) cartCount.textContent = cartItems.length;

  document.querySelectorAll(".remove-btn").forEach(button => {
    button.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      cartItems.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cartItems));
      renderCart();
    });
  });
}

function clearCart() {
  localStorage.removeItem("cart");
  renderCart();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const countEl = document.getElementById("cart-count");
  if (countEl) {
    countEl.textContent = cart.length;
  }
}

function addToCart(element) {
  const item = {
    name: element.getAttribute("data-name"),
    price: element.getAttribute("data-price"),
    img: element.getAttribute("data-img")
  };

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${item.name} added to cart!`);
  updateCartCount();
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("order-form");
  if (form) {
    form.addEventListener("submit", handleOrderSubmit);
  }

  if (document.body.classList.contains("cart-page")) {
    renderCart();
    const clearBtn = document.querySelector(".clear-btn");
    if (clearBtn) clearBtn.addEventListener("click", clearCart);
  } else {
    updateCartCount();
  }

  const modal = document.getElementById("confirmation-modal");
  const closeBtn = document.querySelector(".close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  });
});

function handleOrderSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  if (!cartItems.length) {
    alert("Your cart is empty.");
    return;
  }

  const deliveryFee = 5.0;
  const subtotal = cartItems.reduce((acc, item) => acc + parseFloat(item.price), 0);
  const total = subtotal + deliveryFee;

  const modal = document.getElementById("confirmation-modal");
  const details = document.getElementById("confirmation-details");

  details.innerHTML = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Address:</strong> ${address}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Items:</strong></p>
    <ul>
      ${cartItems.map(item => `<li>${item.name} - $${item.price}</li>`).join('')}
    </ul>
    <hr>
    <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
    <p><strong>Delivery:</strong> $${deliveryFee.toFixed(2)}</p>
    <p><strong>Total:</strong> $${total.toFixed(2)}</p>
  `;

  modal.style.display = "block";

  document.getElementById("confirm-order-btn").onclick = function () {
    window.location.href = 'payment.html';
  };
}
