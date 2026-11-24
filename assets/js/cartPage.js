const container = document.getElementById("cart-items");
const checkoutBtn = document.getElementById("checkout-btn");
const clearCartBtn = document.getElementById("clear-cart");

function loadCart() {
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5 p-4 rounded-4" style="background: var(--dark-surface-card); border: 1px dashed var(--dark-surface-border);">
                <i class="bi bi-cart-x fs-1 text-secondary mb-3 d-block"></i>
                <h4 class="text-white fw-bold">Your cart is currently empty</h4>
                <p class="text-secondary mb-4">Looks like you haven't added anything to your cart yet.</p>
                <a href="index.html" class="btn btn-success px-4 py-2 rounded-pill fw-semibold">
                    <i class="bi bi-grid-fill me-1"></i> Start Shopping
                </a>
            </div>
        `;

        document.getElementById("cart-total").textContent = "$0.00";
        if (checkoutBtn) {
            checkoutBtn.classList.add("disabled", "opacity-50");
            checkoutBtn.setAttribute("aria-disabled", "true");
        }
        if (clearCartBtn) {
            clearCartBtn.disabled = true;
        }
        updateCartCounter();
        return;
    }

    if (checkoutBtn) {
        checkoutBtn.classList.remove("disabled", "opacity-50");
        checkoutBtn.removeAttribute("aria-disabled");
    }
    if (clearCartBtn) {
        clearCartBtn.disabled = false;
    }

    cart.forEach(item => {
        container.innerHTML += `
        <div class="cart-card-item">
            <div class="row align-items-center g-3">
                <div class="col-3 col-md-2 text-center">
                    <div class="p-2 rounded-3" style="background: rgba(255,255,255,0.03);">
                        <img
                            src="${item.image}"
                            class="img-fluid"
                            alt="${item.name}"
                            style="max-height: 80px; object-fit: contain;">
                    </div>
                </div>

                <div class="col-9 col-md-4">
                    <a href="product.html?id=${item.id}" class="text-white text-decoration-none fw-bold fs-6 d-block mb-1">
                        ${item.name}
                    </a>
                    <span class="text-secondary small">Unit Price: $${item.price.toFixed(2)}</span>
                </div>

                <div class="col-6 col-md-3">
                    <div class="d-inline-flex align-items-center border border-secondary border-opacity-25 rounded-pill p-1" style="background: #111419;">
                        <button
                            class="btn btn-sm text-white px-2 py-0 border-0"
                            title="Decrease quantity"
                            onclick="decrease(${item.id})">
                            <i class="bi bi-dash"></i>
                        </button>
                        <span class="px-2 fw-bold text-white small" style="min-width: 24px; text-align: center;">${item.quantity}</span>
                        <button
                            class="btn btn-sm text-white px-2 py-0 border-0"
                            title="Increase quantity"
                            onclick="increase(${item.id})">
                            <i class="bi bi-plus"></i>
                        </button>
                    </div>
                </div>

                <div class="col-4 col-md-2 text-md-end">
                    <span class="text-success fw-bold fs-6">
                        $${(item.price * item.quantity).toFixed(2)}
                    </span>
                </div>

                <div class="col-2 col-md-1 text-end">
                    <button
                        class="btn btn-link text-danger p-0"
                        title="Remove item"
                        onclick="removeItem(${item.id})">
                        <i class="bi bi-trash3 fs-5"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
    });

    document.getElementById("cart-total").textContent =
        "$" + getCartTotal().toFixed(2);

    updateCartCounter();
}


function increase(id) {

    increaseQuantity(id);

    loadCart();

}

function decrease(id) {

    decreaseQuantity(id);

    loadCart();

}

function removeItem(id) {

    removeFromCart(id);

    loadCart();

}

document
    .getElementById("clear-cart")
    .addEventListener("click", () => {

        cart = [];

        saveCart();

        loadCart();

    });

loadCart();