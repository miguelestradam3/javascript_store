const container = document.getElementById("products");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const priceInput = document.getElementById("maxPrice");
const sortSelect = document.getElementById("sort");

searchInput.addEventListener("input", applyFilters);

categorySelect.addEventListener("change", applyFilters);

priceInput.addEventListener("input", applyFilters);

sortSelect.addEventListener("change", applyFilters);

const pagination = document.getElementById("pagination");

const PRODUCTS_PER_PAGE = 3;

let filteredProducts = [...products];

let currentPage = 1;

function sortProducts(products) {

    const sorted = [...products];

    switch (sortSelect.value) {

        case "name-asc":
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;

        case "name-desc":
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;

        case "price-asc":
            sorted.sort((a, b) => a.price - b.price);
            break;

        case "price-desc":
            sorted.sort((a, b) => b.price - a.price);
            break;

    }

    return sorted;
}

function loadCategories() {

    const categories = [...new Set(products.map(product => product.category))];

    categories.forEach(category => {

        categorySelect.innerHTML += `
            <option value="${category}">
                ${category}
            </option>
        `;

    });

}

function applyFilters() {

    const search = searchInput.value.toLowerCase();

    const category = categorySelect.value;

    const maxPrice = Number(priceInput.value);

    const filtered = products.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(search);

        const matchesCategory =
            category === "All" ||
            product.category === category;

        const matchesPrice =
            !maxPrice ||
            product.price <= maxPrice;

        return matchesSearch &&
               matchesCategory &&
               matchesPrice;

    });

    filteredProducts = sortProducts(filtered);

    currentPage = 1;

    displayProducts();

}

function renderPagination(list = filteredProducts) {

    pagination.innerHTML = "";

    const totalPages = Math.ceil(list.length / PRODUCTS_PER_PAGE);

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {

        pagination.innerHTML += `

        <li class="page-item ${i === currentPage ? "active" : ""}">

            <button
                class="page-link"
                onclick="changePage(${i})">

                ${i}

            </button>

        </li>

        `;

    }

}

function changePage(page) {

    currentPage = page;

    displayProducts();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

function displayProducts(list = filteredProducts) {
    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="p-5 rounded-4" style="background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1);">
                    <i class="bi bi-search fs-1 text-secondary mb-3 d-block"></i>
                    <h4 class="text-white">No products found</h4>
                    <p class="text-secondary">Try adjusting your search criteria or resetting filters.</p>
                </div>
            </div>
        `;
        renderPagination(list);
        return;
    }

    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    const pageProducts = list.slice(start, end);

    pageProducts.forEach(product => {
        container.innerHTML += `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="product-card h-100">
                <span class="category-pill">${product.category}</span>
                <div class="image-container">
                    <a href="product.html?id=${product.id}" class="image-link">
                        <img
                            src="${product.image}"
                            alt="${product.name}"
                            class="product-image img-fluid">
                    </a>
                </div>

                <div class="card-body">
                    <div class="d-flex align-items-center justify-content-between mb-1">
                        <span class="text-warning small"><i class="bi bi-star-fill me-1"></i>${product.rating}</span>
                        <span class="text-secondary small">In stock: ${product.stock}</span>
                    </div>

                    <a href="product.html?id=${product.id}" class="product-title">
                        ${product.name}
                    </a>

                    <p class="product-desc">${product.description}</p>

                    <div class="product-footer">
                        <span class="price">$${product.price.toFixed(2)}</span>
                        <button
                            class="btn-add-cart"
                            onclick="addToCart(${product.id})">
                            <i class="bi bi-cart-plus"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    });

    renderPagination(list);
}


loadCategories();

filteredProducts = [...products];

displayProducts();

updateCartCounter();

// Listen for changes made in other tabs
window.addEventListener("storage", updateCartCounter);