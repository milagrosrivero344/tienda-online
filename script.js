// --- 1. MEMORIA LOCAL (LOCALSTORAGE) ---
let carrito = JSON.parse(localStorage.getItem('carritoSaved')) || [];
let total = parseInt(localStorage.getItem('totalSaved')) || 0;
let favoritos = JSON.parse(localStorage.getItem('favoritosSaved')) || [];

// Se ejecuta automáticamente al cargar la página web
window.onload = function() {
    actualizarCarritoVisual();
    restaurarFavoritosVisuales();
};

// --- 2. APERTURA Y CIERRE DEL CARRITO ---
function abrirCarrito() {
    document.getElementById("carrito-lateral").classList.remove("carrito-oculto");
    document.getElementById("carrito-lateral").classList.add("carrito-visible");
}

function cerrarCarrito() {
    document.getElementById("carrito-lateral").classList.remove("carrito-visible");
    document.getElementById("carrito-lateral").classList.add("carrito-oculto");
}

// --- 3. NOTIFICACIONES FLOTANTES (TOASTS) ---
function mostrarToast(mensaje) {
    const contenedor = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerHTML = '✨ ' + mensaje; 

    contenedor.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// --- 4. LÓGICA INTERNA DEL CARRITO Y COVENTA (CROSS-SELLING) ---
function agregarAlCarrito(nombreProducto, precioProducto) {
    carrito.push(nombreProducto);
    total += precioProducto;
    
    localStorage.setItem('carritoSaved', JSON.stringify(carrito));
    localStorage.setItem('totalSaved', total);
    
    actualizarCarritoVisual();
    mostrarToast("Agregaste " + nombreProducto + " a tu pedido");
}

function vaciarCarrito() {
    carrito = [];
    total = 0;
    localStorage.removeItem('carritoSaved');
    localStorage.removeItem('totalSaved');
    actualizarCarritoVisual();
    mostrarToast("Carrito vaciado");
}

function actualizarCarritoVisual() {
    let lista = document.getElementById("lista-carrito");
    lista.innerHTML = ""; 
    
    for (let i = 0; i < carrito.length; i++) {
        lista.innerHTML += "<div class='item-carrito'>👗 " + carrito[i] + "</div>";
    }
    
    // --- FUNCIÓN INTELIGENTE DE VENTA CRUZADA (CROSS-SELLING) ---
    // Si compra la pollera pero no la lencería, el carrito le ofrece armar el look completo
    if (carrito.includes("Pollera Tiro Bajo") && !carrito.includes("Conjunto Lencería Mayorista")) {
        lista.innerHTML += `
            <div class="cross-selling">
                <strong>✨ Completá el look:</strong>
                <p>El Conjunto Lencería combina perfecto con esta silueta.</p>
                <button class="btn-cross-selling" onclick="agregarAlCarrito('Conjunto Lencería Mayorista', 22000)">
                    Agregar por $22.000
                </button>
            </div>
        `;
    }
    
    document.getElementById("total-precio").innerText = total;
}

// --- 5. ENVIAR PEDIDO COMPLETO A WHATSAPP ---
function enviarPedidoWhatsApp() {
    if (carrito.length === 0) {
        alert("¡Tu carrito está vacío! Agregá algunas prendas primero.");
        return;
    }
    
    let numeroTelefono = "5492661234567"; // Número de WhatsApp comercial
    let mensaje = "¡Hola! Vengo de la tienda online de belulo clothes y quiero hacer este pedido:\n\n";
    
    for (let i = 0; i < carrito.length; i++) {
        mensaje += "- " + carrito[i] + "\n";
    }
    
    mensaje += "\n💰 Total a pagar: $" + total;
    
    let urlWhatsApp = "https://wa.me/" + numeroTelefono + "?text=" + encodeURIComponent(mensaje);
    window.open(urlWhatsApp, "_blank");
}

// --- 6. SISTEMA DE FILTROS AVANZADOS Y BUSCADOR EN VIVO ---
function aplicarFiltros() {
    const textoBuscado = document.getElementById('buscador-texto').value.toLowerCase();
    const categoriaElegida = document.getElementById('filtro-categoria').value;
    const talleElegido = document.getElementById('filtro-talle').value;
    const colorElegido = document.getElementById('filtro-color').value;

    const productos = document.querySelectorAll('.producto');

    productos.forEach(producto => {
        const titulo = producto.querySelector('h3').innerText.toLowerCase();
        const catProd = producto.getAttribute('data-categoria');
        const talleProd = producto.getAttribute('data-talle');
        const colorProd = producto.getAttribute('data-color');

        // Cruzamos las 4 condiciones en simultáneo
        const coincideTexto = titulo.includes(textoBuscado);
        const coincideCategoria = (categoriaElegida === 'todos' || catProd === categoriaElegida);
        const coincideTalle = (talleElegido === 'todos' || talleProd.includes(talleElegido));
        const coincideColor = (colorElegido === 'todos' || colorProd === colorElegido);

        if (coincideTexto && coincideCategoria && coincideTalle && coincideColor) {
            producto.style.display = 'block';
        } else {
            producto.style.display = 'none';
        }
    });
}

// --- 7. MODAL DE LA GUÍA DE TALLES ---
function abrirModalTalles() {
    document.getElementById('modal-talles').classList.add('modal-visible');
}

function cerrarModalTalles() {
    document.getElementById('modal-talles').classList.remove('modal-visible');
}

// --- 8. EFECTO LUPA EN IMÁGENES ---
function efectoLupa(event) {
    const contenedor = event.currentTarget;
    const img = contenedor.querySelector('img');
    const rect = contenedor.getBoundingClientRect();
    
    // Calculamos las coordenadas del toque o puntero en base a la caja
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    img.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    img.style.transform = 'scale(1.8)'; // Hace zoom al 180%
}

function resetLupa(event) {
    const img = event.currentTarget.querySelector('img');
    img.style.transformOrigin = 'center center';
    img.style.transform = 'scale(1)'; // Resetea la imagen a tamaño real
}

// --- 9. SISTEMA DE FAVORITOS (WISHLIST) ---
function toggleFavorito(boton, nombreProducto) {
    const index = favoritos.indexOf(nombreProducto);
    
    if (index === -1) {
        favoritos.push(nombreProducto);
        boton.innerText = '❤️';
        mostrarToast("Guardaste " + nombreProducto + " en favoritos");
    } else {
        favoritos.splice(index, 1);
        boton.innerText = '🤍';
    }
    
    localStorage.setItem('favoritosSaved', JSON.stringify(favoritos));
}

// Pinta los corazones rojos al cargar si ya estaban en memoria anteriormente
function restaurarFavoritosVisuales() {
    const botonesFav = document.querySelectorAll('.btn-favorito');
    botonesFav.forEach(boton => {
        const productoCard = boton.closest('.producto');
        const nombre = productoCard.querySelector('h3').innerText;
        if (favoritos.includes(nombre)) {
            boton.innerText = '❤️';
        }
    });
}
