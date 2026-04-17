// Products (from JSON)

let products = [];

// Load Products

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

// Cart State

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// DOM Elements

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
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const searchBtn = document.getElementById("searchBtn");
const searchModal = document.getElementById("searchModal");
const searchClose = document.getElementById("searchClose");
const searchInput = document.getElementById("searchInput");
const newsletterForm = document.getElementById("newsletterForm");

// Render Products 

function renderProducts(filter = "all") {
    const filtered =
        filter === "all"
        ? products
        : products.filter((p) => p.categoria === filter);

        productsGrid.innerHTML = filtered
          .map(
            (product) => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.imagen}" alt="${product.nombre}" loading="lazy">
    
                    <div class="product-badges">
                        ${product.badge === "Nuevo" ? '<span class="product-badge badge-new">Nuevo</span>' : ""}
                        ${product.badge?.includes("-") ? `<span class="product-badge badge-sale">${product.badge}</span>` : ""}
                    </div>
    
                    <div class="product-actions">
                        <button class="product-action-btn" onclick="toggleWishlist(${product.id})">❤️</button>
                        <button class="product-action-btn" onclick="quickView(${product.id})">👁️</button>
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
        `,
        )
        .join("");
    }

// Cart Functions

function addToCart(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
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

    const btn = document.querySelector(`[data-id="${productId}"] .product-add`);
    if (btn) {
        btn.textContent = "¡Añadido! ✓";
        btn.style.background = "#10b981";

        setTimeout(() => {
        btn.textContent = "Añadir al carrito";
        btn.style.background = "";
        }, 1500);
    }
}

function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cart.find((item) => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartUI();
    }
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    cartCount.textContent = totalItems;
    cartItemsCount.textContent = totalItems;
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

    if (cart.length === 0) {
        cartItems.innerHTML = `
                <div class="cart-empty">
                    <span>🛒</span>
                    <h4>Tu carrito está vacío</h4>
                    <p>¡Añade productos para empezar!</p>
                </div>
            `;
    } else {
        cartItems.innerHTML = cart
        .map(
            (item) => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <span class="cart-item-price">$${item.price.toFixed(2)}</span>

                        <div class="cart-item-qty">
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>

                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
                </div>
            `,
        )
        .join("");
    }
}

// Cart Sidebar

function openCart() {
    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

cartBtn.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// Filter Products

filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderProducts(btn.dataset.filter);
    });
});

// Mobile Menu

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

// Close menu on link click

document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});

// Search Modal

searchBtn.addEventListener("click", () => {
    searchModal.classList.add("active");
    setTimeout(() => searchInput.focus(), 100);
});

searchClose.addEventListener("click", () => {
    searchModal.classList.remove("active");
});

searchModal.addEventListener("click", (e) => {
  if (e.target === searchModal) {
    searchModal.classList.remove("active");
  }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        searchModal.classList.remove("active");
    }
});

// Newsletter

newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector("input").value;

  newsletterForm.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <span style="font-size: 48px;">🎉</span>
            <h3 style="color: white; margin: 16px 0;">¡Gracias por suscribirte!</h3>
            <p style="color: rgba(255,255,255,0.9);">
                Recibirás un 15% de descuento en tu email: ${email}
            </p>
        </div>
    `;
});

// Wishlist & Quick View

function toggleWishlist(productId) {
    const btn = document.querySelector(
        `[data-id="${productId}"] .product-action-btn`,
    );
    if (btn) {
        btn.style.transform = "scale(1.2)";
        setTimeout(() => (btn.style.transform = ""), 200);
    }
}

function quickView(productId) {
    addToCart(productId);
}

// Countdown

function updateCountdown() {
    const now = new Date();
    const endDate = new Date();

    endDate.setDate(endDate.getDate() + 2);
    endDate.setHours(23, 59, 59);

    const diff = endDate - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(
        2,
        "0",
    );
    document.getElementById("seconds").textContent = String(seconds).padStart(
        2,
        "0",
    );
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Scroll Animations

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
});

setTimeout(() => {
    document
        .querySelectorAll(".category-card, .product-card, .feature-card, .new-item")
        .forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s ease-out";
        observer.observe(el);
    });
}, 500);
  
// Smooth Scroll

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
            });
        }
    });
});

// Init

loadProducts(console.log(products));
updateCartUI();

// Navbar effect

window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {
        navbar.style.background = "rgba(255,255,255,0.95)";
        navbar.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
    } else {
        navbar.style.background = "rgba(255,255,255,0.8)";
        navbar.style.boxShadow = "none";
    }
});