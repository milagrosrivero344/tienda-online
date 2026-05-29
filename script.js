// --- 1. MEMORIA Y VARIABLES ---
// Intentamos cargar los datos guardados en el navegador, si no hay, empezamos en 0.
let carrito = JSON.parse(localStorage.getItem('carritoSaved')) || [];
let total = parseInt(localStorage.getItem('totalSaved')) || 0;

// Esta función se ejecuta apenas carga la página para mostrar lo que había guardado
window.onload = function() {
    actualizarCarritoVisual();
};

// --- 2. LÓGICA DEL CARRITO ---
function abrirCarrito() {
    document.getElementById("carrito-lateral").classList.remove("carrito-oculto");
    document.getElementById("carrito-lateral").classList.add("carrito-visible");
}

function cerrarCarrito() {
    document.getElementById("carrito-lateral").classList.remove("carrito-visible");
    document.getElementById("carrito-lateral").classList.add("carrito-oculto");
}

function agregarAlCarrito(nombreProducto, precioProducto) {
    carrito.push(nombreProducto);
    total = total + precioProducto;
    
    // Guardamos en LocalStorage
    localStorage.setItem('carritoSaved', JSON.stringify(carrito));
    localStorage.setItem('totalSaved', total);
    
    actualizarCarritoVisual();
    abrirCarrito();
}

function vaciarCarrito() {
    carrito = [];
    total = 0;
    localStorage.removeItem('carritoSaved');
    localStorage.removeItem('totalSaved');
    actualizarCarritoVisual();
}

function actualizarCarritoVisual() {
    let lista = document.getElementById("lista-carrito");
    lista.innerHTML = ""; 
    
    for (let i = 0; i < carrito.length; i++) {
        lista.innerHTML += "<div class='item-carrito'>👗 " + carrito[i] + "</div>";
    }
    
    document.getElementById("total-precio").innerText = total;
}

// --- 3. FINALIZAR COMPRA (WHATSAPP) ---
function enviarPedidoWhatsApp() {
    if (carrito.length === 0) {
        alert("¡Tu carrito está vacío!");
        return;
    }
    
    // ACÁ PONÉS EL NÚMERO DE LA MARCA (54 = Argentina, 9 = Celular)
    let numeroTelefono = "5491123456789"; 
    
    let mensaje = "¡Hola! Quiero hacer este pedido:\n\n";
    
    for (let i = 0; i < carrito.length; i++) {
        mensaje += "- " + carrito[i] + "\n";
    }
    
    mensaje += "\n💰 Total a pagar: $" + total;
    
    let urlWhatsApp = "https://wa.me/" + numeroTelefono + "?text=" + encodeURIComponent(mensaje);
    window.open(urlWhatsApp, "_blank");
}

// --- 4. FILTROS DEL CATÁLOGO ---
function filtrarProductos(categoria) {
    const productos = document.querySelectorAll('.producto');
    const botones = document.querySelectorAll('.btn-filtro');

    botones.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    productos.forEach(producto => {
        const catProducto = producto.getAttribute('data-categoria');
        
        if (categoria === 'todos' || catProducto === categoria) {
            producto.style.display = 'block';
        } else {
            producto.style.display = 'none';
        }
    });
}