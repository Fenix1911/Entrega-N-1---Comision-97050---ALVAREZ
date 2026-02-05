const socket = io();

const productList = document.getElementById("productList");
const productForm = document.getElementById('productForm');


function renderProducts(products) {
    productList.innerHTML = "";
    products.forEach(p => {
        const li = document.createElement("li");
        li.dataset.id = p.id;
        li.innerHTML = `
            ${p.title} - $${p.price}
            <button class="deleteBtn">Eliminar</button>
        `;
        productList.appendChild(li);
    });
}

socket.on("initialProducts", (products) => {
    renderProducts(products);
});

socket.on("updatedProducts", (products) => {
    renderProducts(products);
});

productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(productForm));

    await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });

    productForm.reset();
});

productList.addEventListener("click", async (e) => {
    if (e.target.classList.contains("deleteBtn")) {
        const li = e.target.closest("li");
        const id = li.dataset.id;

        await fetch(`/api/products/${id}`, {
            method: "DELETE"
        });
    }
});