const container = document.getElementById("cart-items");

function loadCart() {

    container.innerHTML = "";

    if (cart.length === 0) {

        container.innerHTML = `
            <div class="alert alert-info">
                Your cart is empty.
            </div>
        `;

        document.getElementById("cart-total").textContent = "$0.00";
        updateCartCounter();

        return;
    }

    cart.forEach(item => {

        container.innerHTML += `

        <div class="card border-0 bg-dark text-white shadow-lg p-3 mb-3">

            <div class="row g-0">

                <div class="col-md-3 justify-content-center align-items-center p-3">

                    <img
                        src="${item.image}"
                        class="img-fluid rounded-start"
                        alt="${item.name}">

                </div>

                <div class="col-md-9">

                    <div class="card-body">

                        <h4>${item.name}</h4>

                        <p>$${item.price.toFixed(2)}</p>

                        <div class="d-flex align-items-center gap-2">

                            <button
                                class="btn btn-outline-secondary"
                                onclick="decrease(${item.id})">
                                -
                            </button>

                            <strong>${item.quantity}</strong>

                            <button
                                class="btn btn-outline-secondary"
                                onclick="increase(${item.id})">
                                +
                            </button>

                            <button
                                class="btn btn-danger ms-4"
                                onclick="removeItem(${item.id})">
                                Remove
                            </button>

                        </div>

                        <h5 class="mt-3">

                            Subtotal:
                            $${(item.price * item.quantity).toFixed(2)}

                        </h5>

                    </div>

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