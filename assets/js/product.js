const container = document.getElementById("product-details");

const params = new URLSearchParams(window.location.search);

const id = Number(params.get("id"));

const product = products.find(p => p.id === id);

if (!product) {

    container.innerHTML = `

        <div class="alert alert-danger">

            Product not found.

        </div>

    `;

}
else{

container.innerHTML = `

<div class="row">

    <div class="col-md-6 justify-content-center align-items-center p-3">

        <img
            src="${product.image}"
            class="img-fluid rounded">

    </div>

    <div class="col-md-6">

        <h1>${product.name}</h1>

        <h3 class="text-success">

            $${product.price.toFixed(2)}

        </h3>

        <p>

            ${product.description}

        </p>

        <p>

            <strong>Category:</strong>

            ${product.category}

        </p>

        <p>

            <strong>Rating:</strong>

            ⭐ ${product.rating}

        </p>

        <p>

            <strong>Stock:</strong>

            ${product.stock}

        </p>

        <button
            class="btn btn-success"
            onclick="addToCart(${product.id})">

            Add to Cart

        </button>

        <a
            href="index.html"
            class="btn btn-secondary">

            Back

        </a>

    </div>

</div>

`;

}

updateCartCounter();

window.addEventListener("storage", updateCartCounter);