const productosData = [
    {
        nombre: "Vestido Floral Elegante",
        categoria: "MUJER",
        imagen: "./imagenes/vestido-mujer.jpeg",
        precio: 79.99,
        precioAnterior: 119.99,
        badge: "-30%",
    },
    {
        nombre: "Camisa Clásica",
        categoria: "HOMBRE",
        imagen: "./imagenes/camisa.jpg",
        precio: 49.99,
        badge: "Nuevo",
    },
    {
        nombre: "Conjunto Bebé",
        categoria: "BEBÉS",
        imagen: "./imagenes/conjunto-bebe.jpg",
        precio: 34.99,
        precioAnterior: 49.99,
        badge: "-30%",
    },
    {
        nombre: "Sudadera de Niño",
        categoria: "NIÑOS",
        imagen: "./imagenes/sudadera.jpeg",
        precio: 39.99,
        badge: "Nuevo",
    },
    {
        nombre: "Blusa de Seda",
        categoria: "MUJER",
        imagen: "./imagenes/blusa.jpeg",
        precio: 59.99,
        precioAnterior: 80.99,
        badge: "-30%",
    },
    {
        nombre: "Chaqueta de Cuero",
        categoria: "HOMBRE",
        imagen: "./imagenes/chaqueta.jpeg",
        precio: 129.99,
        badge: "Nuevo",
    },
    {
        nombre: "Vestido de Niña",
        categoria: "NIÑOS",
        imagen: "./imagenes/vestido-niña.jpg",
        precio: 44.99,
        precioAnterior: 64.99,
        badge: "-30%",
    },
    {
        nombre: "Ropa de Bebé",
        categoria: "BEBÉS",
        imagen: "./imagenes/ropa-bebe.jpg",
        precio: 19.99,
        badge: "Nuevo",
    },
    {
        nombre: "Falda Casual",
        categoria: "MUJER",
        imagen: "./imagenes/falda.jpeg",
        precio: 45.99,
        badge: "-30%",
    },
    {
        nombre: "Pantalón de Hombre",
        categoria: "HOMBRE",
        imagen: "./imagenes/pantalon-hombre.jpg",
        precio: 54.99,
        precioAnterior: 76.99,
        badge: "-30%",
    },
    {
        nombre: "Tenis Deportivos",
        categoria: "HOMBRE",
        imagen: "./imagenes/zapatos.jpeg",
        precio: 89.99,
        badge: "Nuevo",
    },
    {
        nombre: "Pantalón de Mujer",
        categoria: "MUJER",
        imagen: "./imagenes/pantalon-mujer.jpg",
        precio: 69.99,
        precioAnterior: 99.99,
        badge: "-30%",
    },
];

const contenedor = document.getElementById("productsGrid");

function renderProductos(lista) {
    contenedor.innerHTML = "";

    lista.forEach((producto) => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        card.dataset.category = producto.categoria;

        card.innerHTML = `
            <div class="product-image">
                <img src="${producto.imagen}" alt="${producto.nombre}">

                <div class="product-badges">
                    ${producto.badge ? `<span class="product-badge">${producto.badge}</span>` : ""}
                </div>

                <div class="product-actions">
                    <button class="product-action-btn">❤️</button>
                </div>
            </div>

            <div class="product-info">
                <span class="product-category">${producto.categoria}</span>
                <h3 class="product-name">${producto.nombre}</h3>

                <div class="product-price">
                    <span class="price-current">$${producto.precio}</span>
                    ${producto.precioAnterior ? `<span class="price-old">$${producto.precioAnterior}</span>` : ""}
                </div>

                <button class="product-add">Añadir al Carrito</button>
            </div>
            `;

        contenedor.appendChild(card);
    });
}

const botones = document.querySelectorAll(".filter-btn");

function filtrarProductos(filtro) {
    if (filtro === "all") {
        renderProductos(productosData);
    } else {
        const filtrados = productosData.filter((p) => p.categoria === filtro);
        renderProductos(filtrados);
    }
}

botones.forEach((boton) => {
    boton.addEventListener("click", () => {
        botones.forEach((b) => b.classList.remove("active"));
        boton.classList.add("active");

        filtrarProductos(boton.dataset.filter);
    });
});

renderProductos(productosData);