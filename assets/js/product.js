const container = document.getElementById("product-details");

const params = new URLSearchParams(window.location.search);

const id = Number(params.get("id"));

const product = products.find(p => p.id === id);

if (!product) {
    container.innerHTML = `
        <div class="p-5 text-center rounded-4" style="background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.15);">
            <i class="bi bi-exclamation-circle text-danger fs-1 mb-3 d-block"></i>
            <h3 class="text-white">Product Not Found</h3>
            <p class="text-secondary mb-4">The item you requested does not exist or has been removed.</p>
            <a href="index.html" class="btn btn-success px-4 py-2 rounded-pill">
                <i class="bi bi-arrow-left me-1"></i> Back to Products
            </a>
        </div>
    `;
} else {
    container.innerHTML = `
    <div class="row g-5 align-items-center">
        <div class="col-lg-6">
            <div class="p-4 rounded-4 text-center position-relative" style="background: var(--dark-surface-card); border: 1px solid var(--dark-surface-border);">
                <span class="category-pill">${product.category}</span>
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    class="img-fluid"
                    style="max-height: 380px; object-fit: contain; filter: drop-shadow(0 15px 25px rgba(0,0,0,0.5));">
            </div>
        </div>

        <div class="col-lg-6">
            <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-success-subtle text-success border border-success px-3 py-1 rounded-pill">
                    <i class="bi bi-check2-circle me-1"></i> In Stock (${product.stock} available)
                </span>
                <span class="text-warning small">
                    <i class="bi bi-star-fill me-1"></i>${product.rating} Rating
                </span>
            </div>

            <h1 class="display-6 fw-bold text-white mb-3">${product.name}</h1>

            <div class="d-flex align-items-baseline gap-3 mb-4">
                <span class="display-5 fw-bold text-success">$${product.price.toFixed(2)}</span>
                <span class="text-secondary small text-decoration-line-through">$${(product.price * 1.25).toFixed(2)}</span>
                <span class="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill">Save 20%</span>
            </div>

            <p class="lead text-secondary mb-4" style="font-size: 1.05rem; line-height: 1.7;">
                ${product.description}
            </p>

            <div class="p-3 rounded-3 mb-4" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);">
                <div class="row g-2 text-secondary small">
                    <div class="col-6"><i class="bi bi-shield-check text-success me-2"></i>2-Year Warranty</div>
                    <div class="col-6"><i class="bi bi-truck text-success me-2"></i>Free Express Shipping</div>
                    <div class="col-6"><i class="bi bi-arrow-repeat text-success me-2"></i>30-Day Free Returns</div>
                    <div class="col-6"><i class="bi bi-lock text-success me-2"></i>Secure Payment</div>
                </div>
            </div>

            <div class="d-flex flex-wrap gap-3">
                <button
                    class="btn btn-success btn-lg px-4 py-3 rounded-pill fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
                    onclick="addToCart(${product.id})">
                    <i class="bi bi-cart-plus fs-5"></i> Add to Cart
                </button>

                <a
                    href="cart.html"
                    class="btn btn-outline-light btn-lg px-4 py-3 rounded-pill fw-semibold d-inline-flex align-items-center gap-2">
                    <i class="bi bi-bag-check fs-5"></i> Go to Cart
                </a>

                <a
                    href="index.html"
                    class="btn btn-link text-secondary text-decoration-none d-inline-flex align-items-center gap-1 ms-auto">
                    <i class="bi bi-arrow-left"></i> Continue Shopping
                </a>
            </div>
        </div>
    </div>
    `;
}


updateCartCounter();

window.addEventListener("storage", updateCartCounter);