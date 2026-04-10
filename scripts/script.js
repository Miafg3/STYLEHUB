const contenedor = document.getElementById("productsGrid");
const botones = document.querySelectorAll(".filter-btn");

let productos = [];

// Cargamos archivo json
// Nota: todas las rutas parten desde el archivo HTML (index.html)

async function cargarProductos() {
  try {
    const res = await fetch("./scripts/productos.json");
    productos = await res.json();

    renderProductos(productos);
  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}

// render
function renderProductos(lista) {
  contenedor.innerHTML = "";

  lista.forEach((producto) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
            <div class="product-image">
                <img src="${producto.imagen}" alt="${producto.nombre}">

                <div class="product-badges">
                    ${producto.badge ? `<span class="product-badge">${producto.badge}</span>` : ""}
                </div>
            </div>

            <div class="product-info">
                <span class="product-category">${producto.categoriaLabel}</span>
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

// filtro
function filtrarProductos(filtro) {
  if (filtro === "all") {
    renderProductos(productos);
  } else {
    const filtrados = productos.filter((p) => p.categoria === filtro);
    renderProductos(filtrados);
  }
}

// eventos
botones.forEach((boton) => {
  boton.addEventListener("click", () => {
    botones.forEach((b) => b.classList.remove("active"));
    boton.classList.add("active");

    filtrarProductos(boton.dataset.filter);
  });
});

cargarProductos();