// PRODUCTS

let products = [];

async function loadProducts() {
    try {
        const res = await fetch("./js/productos.json");
        const data = await res.json();

        products = data;

        renderProducts();
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

// CART

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// DOM

const productsGrid = document.getElementById("productsGrid");
const cartBtn = document.getElementById("cartBtn");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartItemsCount = document.getElementById("cartItemsCount");
const cartTotal = document.getElementById("cartTotal");
const filterBtns = document.querySelectorAll(".filter-btn");
const searchModal = document.getElementById("searchModal");
const searchClose = document.getElementById("searchClose");
const searchInput = document.getElementById("searchInput");
const newsletterForm = document.getElementById("newsletterForm");

// RENDER

function renderProducts(filter = "all") {
    const filtered =
        filter === "all"
            ? products
            : products.filter((p) => p.categoria === filter);

  productsGrid.innerHTML = filtered.map((product) => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.imagen}" alt="${product.nombre}" loading="lazy">

                <div class="product-badges">
                    ${product.badge === "Nuevo" ? '<span class="product-badge badge-new">Nuevo</span>' : ""}
                    ${product.badge?.includes("-") ? `<span class="product-badge badge-sale">${product.badge}</span>` : ""}
                </div>
            </div>

            <div class="product-info">
                <span class="product-category">${product.categoriaLabel}</span>
                <h3 class="product-name">${product.nombre}</h3>

                <div class="product-price">
                    <span class="price-current">$${product.precio.toFixed(2)}</span>
                    ${product.precioAnterior ? `<span class="price-old">$${product.precioAnterior.toFixed(2)}</span>` : ""}
                </div>

                <button class="product-add" onclick="addToCart(${product.id})">
                    Añadir al carrito
                </button>
            </div>
        </div>
    `).join("");
}

// CART FUNCTIONS

function addToCart(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const existing = cart.find((item) => item.id === productId);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.nombre,
            price: product.precio,
            image: product.imagen,
            quantity: 1,
        });
    }

    saveCart();
    updateCartUI();
    openCart();
}

function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    saveCart();
    updateCartUI();
}

function updateQuantity(id, change) {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(id);
    } else {
        saveCart();
        updateCartUI();
    }
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    if (cartCount) cartCount.textContent = totalItems;
    if (cartItemsCount) cartItemsCount.textContent = totalItems;
    if (cartTotal) cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `<p>Tu carrito está vacío</p>`;
    } else {
        cartItems.innerHTML = cart.map((item) => `
            <div class="cart-item">
                <img src="${item.image}" width="50">
                <div>
                    <h4>${item.name}</h4>
                    <span>$${item.price}</span>
                    <div>
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})">✕</button>
            </div>
        `).join("");
    }
}

// CART UI

function openCart() {
    cartSidebar?.classList.add("active");
    cartOverlay?.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cartSidebar?.classList.remove("active");
    cartOverlay?.classList.remove("active");
    document.body.style.overflow = "";
}

cartBtn?.addEventListener("click", openCart);
cartClose?.addEventListener("click", closeCart);
cartOverlay?.addEventListener("click", closeCart);

// FILTER

filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderProducts(btn.dataset.filter);
    });
});

// SEARCH

searchClose?.addEventListener("click", () => {
    searchModal.classList.remove("active");
});

// NEWSLETTER

newsletterForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = newsletterForm.querySelector("input").value;

    newsletterForm.innerHTML = `
        <h3>¡Gracias!</h3>
        <p>${email}</p>
    `;
});

// COUNTDOWN

function updateCountdown() {
    const now = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 2);

    const diff = end - now;

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);

    document.getElementById("days").textContent = d;
    document.getElementById("hours").textContent = h;
    document.getElementById("minutes").textContent = m;
    document.getElementById("seconds").textContent = s;
}

setInterval(updateCountdown, 1000);

// INIT

loadProducts();
updateCartUI();