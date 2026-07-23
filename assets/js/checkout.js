const summary = document.getElementById("order-summary");

function loadSummary() {

    summary.innerHTML = "";

    cart.forEach(item => {

        summary.innerHTML += `

            <div class="d-flex justify-content-between mb-2">

                <span>

                    ${item.name}

                    x${item.quantity}

                </span>

                <span>

                    $${(item.price * item.quantity).toFixed(2)}

                </span>

            </div>

        `;

    });

    document.getElementById("checkout-total").textContent =
        "$" + getCartTotal().toFixed(2);

}

document
.getElementById("placeOrder")
.addEventListener("click", () => {

    const form = document.getElementById("checkoutForm");

    if (!form.checkValidity()) {

        form.reportValidity();

        return;

    }

    showToast("Order placed successfully!");

    cart = [];

    saveCart();

    setTimeout(() => {

        window.location.href = "index.html";

    }, 2000);

});

loadSummary();