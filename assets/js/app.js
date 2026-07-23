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

    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;

    const end = start + PRODUCTS_PER_PAGE;

    const pageProducts = list.slice(start, end);

    pageProducts.forEach(product => {

        container.innerHTML += `

        <div class="col-md-4 mb-4">

            <div class="card h-100 bg-dark text-white shadow-lg border-0">

                <div class="d-flex justify-content-center align-items-center p-3" style="height:250px;">

                    <a href="product.html?id=${product.id}">
                        <img
                            src="${product.image}"
                            class="img-fluid"
                            style="max-height:220px;">
                    </a>

                </div>

                <div class="card-body d-flex flex-column">

                    <h5>

                        <a
                            href="product.html?id=${product.id}"
                            class="text-decoration-none text-dark">

                            ${product.name}

                        </a>

                    </h5>

                    <p class="price">
                        $${product.price.toFixed(2)}
                    </p>

                    <p>${product.description}</p>

                    <button
                        class="btn btn-success mt-auto"
                        onclick="addToCart(${product.id})">

                        Add to Cart

                    </button>

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