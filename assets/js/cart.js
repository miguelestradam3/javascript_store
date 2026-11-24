let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(id) {

    const product = products.find(p => p.id === id);

    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartCounter();

    showToast(`${product.name} added to cart!`);
}

function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    saveCart();
    updateCartCounter();
}

function increaseQuantity(id) {

    const item = cart.find(item => item.id === id);

    if (item) {

        item.quantity++;

        saveCart();
        updateCartCounter();
    }

}

function decreaseQuantity(id) {

    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity--;

    if (item.quantity <= 0) {

        removeFromCart(id);

    } else {

        saveCart();
        updateCartCounter();

    }

}

function getCartCount() {

    return cart.reduce((total, item) => total + item.quantity, 0);

}

function getCartTotal() {

    return cart.reduce((total, item) => {

        return total + item.price * item.quantity;

    }, 0);

}

function updateCartCounter() {

    const badge = document.getElementById("cartcount");

    if (!badge) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const count = cart.reduce((total, item) => total + item.quantity, 0);

    badge.textContent = count;
}

function showToast(message) {
    const toastEl = document.getElementById("cartToast");
    const msgEl = document.getElementById("toastMessage");
    if (!toastEl || !msgEl) return;

    msgEl.textContent = message;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// Auto-sync cart badge across all pages
document.addEventListener("DOMContentLoaded", updateCartCounter);
window.addEventListener("storage", updateCartCounter);
updateCartCounter();

