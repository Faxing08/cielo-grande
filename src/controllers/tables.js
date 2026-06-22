// ==========================================
// 1. CONFIGURACIÓN Y ESTADOS DE LAS MESAS
// ==========================================
const TABLE_STATES = {
  AVAILABLE: { label: "Disponible", colorClass: "success" },
  OCCUPIED: { label: "Ocupada", colorClass: "danger" },
  WAITING: { label: "En Espera", colorClass: "warning" },
};

// ==========================================
// 2. MODELO DE DATOS (ESTRUCTURADO)
// ==========================================
const SALON_TABLES = [
  {
    id: "01",
    status: TABLE_STATES.OCCUPIED,
    createdAt: new Date(Date.now() - 12 * 60 * 1000), // Hace 12 minutos
    orders: [
      {
        name: "Hamburguesa sencilla",
        price: 20000,
      },
      { name: "Chorizo Ahumado", price: 15000 },
      { name: "Coca Cola 500 ml", price: 5000 },
      { name: "Papas Fritas", price: 7000 },
      { name: "Perro Caliente", price: 12000 },
      { name: "Jugos Naturales", price: 4000 },
      { name: "Cerveza Club Colombia", price: 4000 },
    ],
  },
  {
    id: "02",
    status: TABLE_STATES.AVAILABLE,
    createdAt: null,
    orders: [],
  },
  {
    id: "03",
    status: TABLE_STATES.AVAILABLE,
    createdAt: null,
    orders: [],
  },
  {
    id: "03",
    status: TABLE_STATES.OCCUPIED,
    createdAt: null,
    orders: [],
  },
];

// Datos semilla temporales para Barra y Granja (para que no queden vacíos)
const BARRA_TABLES = [
  { id: "Gral", status: TABLE_STATES.AVAILABLE, createdAt: null, orders: [] },
  {
    id: "01",
    status: TABLE_STATES.OCCUPIED,
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    orders: [{ name: "Cerveza Corona Extra de Botella", price: 5000 }],
  },
];

const GRANJA_TABLES = [
  { id: "13", status: TABLE_STATES.AVAILABLE, createdAt: null, orders: [] },
  { id: "14", status: TABLE_STATES.AVAILABLE, createdAt: null, orders: [] },
];

// ==========================================
// 3. FUNCIONES UTILITARIAS (MANTENIBILIDAD)
// ==========================================
const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
};

const getElapsedTime = (date) => {
  if (!date) return "";
  const diffMs = new Date() - new Date(date);
  const diffMins = Math.floor(diffMs / 1000 / 60);
  return `Hace ${diffMins} min`;
};

const renderOrdersList = (orders) => {
  const maxVisible = 3;
  let html = "";

  // Estilo CSS inline para asegurar una sola línea y truncado con guion largo o elipsis corta
  const textTruncateStyle =
    "display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;";

  // Renderizar renglones (siempre genera exactamente 3 bloques para mantener la misma altura)
  for (let i = 0; i < maxVisible; i++) {
    if (orders[i]) {
      html += `
        <span style="${textTruncateStyle}" title="${orders[i].name}">${orders[i].name}</span>
        <hr class="my-1">
      `;
    } else {
      // Espacio reservado invisible si no hay producto para mantener simetría
      html += `
        <span class="opacity-0" style="display: block;">&nbsp;</span>
        <hr class="my-1 opacity-25">
      `;
    }
  }

  // Zona del contador extra ("+4 más...")
  const extraCount = orders.length - maxVisible;
  if (extraCount > 0) {
    html += `<span class="fw-bold text-secondary d-block">+${extraCount} más...</span>`;
  } else {
    // Espacio invisible reservado equivalente al renglón "+X más..."
    html += `<span class="opacity-0 d-block">&nbsp;</span>`;
  }

  return html;
};

// ==========================================
// 4. COMPONENTE CARD (INTERFAZ)
// ==========================================
function createTableCard(table) {
  const { id, status, createdAt, orders } = table;

  const totalAmount = orders.reduce((sum, item) => sum + item.price, 0);
  const timeLabel = getElapsedTime(createdAt);
  const ordersHtml = renderOrdersList(orders);

  const borderClass = `border-${status.colorClass}`;
  const bgBadgeClass = `bg-${status.colorClass}`;

  return `
    <div class="col-6 col-md-4 col-lg-3">
      <article class="card ${borderClass} bg-body-tertiary text-center h-100 shadow-sm">
        <div class="card-body d-flex flex-column justify-content-between">
          
          <div>
            <div class="${bgBadgeClass} rounded p-1 mb-2">
              <span class="text-white fw-medium">${status.label}</span>
            </div>

            <h2 class="fw-bold my-2" style="font-size:2rem">
              ${id}
            </h2>

            <p class="text-muted small mb-1">${timeLabel || "&nbsp;"}</p>

            <div class="small my-3">
              ${ordersHtml}
            </div>
          </div>

          <p class="fw-bold mt-2 mb-0 text-success fs-5">
            ${formatCurrency(totalAmount)}
          </p>

        </div>
      </article>
    </div>
  `;
}

// ==========================================
// 5. RENDERIZADO EN CONTENEDORES
// ==========================================
const SALON_CONTAINER = document.querySelector("#salonView .tables-container");
const BARRA_CONTAINER = document.querySelector("#barraView .tables-container");
const GRANJA_CONTAINER = document.querySelector(
  "#granjaView .tables-container",
);

if (SALON_CONTAINER) {
  SALON_CONTAINER.innerHTML = SALON_TABLES.map(createTableCard).join("");
}
if (BARRA_CONTAINER) {
  BARRA_CONTAINER.innerHTML = BARRA_TABLES.map(createTableCard).join("");
}
if (GRANJA_CONTAINER) {
  GRANJA_CONTAINER.innerHTML = GRANJA_TABLES.map(createTableCard).join("");
}

// ==========================================
// 6. SISTEMA DE NAVEGACIÓN
// ==========================================
const navigationLinks = document.querySelectorAll(".tabbed .nav-link");
const views = [
  document.getElementById("salonView"),
  document.getElementById("barraView"),
  document.getElementById("granjaView"),
];

navigationLinks.forEach((link, index) => {
  link.addEventListener("click", () => {
    // Cambiar estado activo en la pestaña visual
    navigationLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");

    // Alternar visibilidad de las secciones
    views.forEach((view) => {
      if (view) {
        view.classList.add("d-none");
        view.classList.remove("active");
      }
    });

    if (views[index]) {
      views[index].classList.remove("d-none");
      views[index].classList.add("active");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (usuario) {
    document.getElementById("name-count").textContent = usuario.nombre;
  }
});
// Función para cerrar sesión
function cerrarSesion() {
  // Eliminar el objeto "usuario" del localStorage
  localStorage.removeItem("usuario");

  // Redirigir a la página de inicio de sesión
  window.location.href = "../../../index.html";
}

// Agregar el evento de clic al botón de cerrar sesión
document
  .getElementById("cerrar-sesion")
  .addEventListener("click", cerrarSesion);
