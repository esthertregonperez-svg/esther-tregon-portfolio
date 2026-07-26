/**
 * Genera la cabecera y el menu lateral comunes a todas las paginas.
 * El menu se construye segun los permisos del usuario en sesion.
 *
 * Requiere que auth-guard.js se haya cargado antes,
 * de modo que 'usuario' y 'permisos' ya existan.
 */

// Raiz del frontend dentro del servidor. Todas las rutas del menu parten de aqui,
// de forma absoluta, para que funcionen desde cualquier pagina (raiz o /pages).
const BASE = '/02-ConstructionFlow-ERP/frontend';

const MODULOS = [
  { clave: 'inicio',       etiqueta: 'Panel',        icono: '▦', enlace: `${BASE}/dashboard.html`,            seccion: 'Principal' },
  { clave: 'clientes',     etiqueta: 'Clientes',     icono: '◉', enlace: `${BASE}/pages/clientes.html`,       seccion: 'Principal' },
  { clave: 'obras',        etiqueta: 'Obras',        icono: '▤', enlace: `${BASE}/pages/obras.html`,          seccion: 'Principal' },
  { clave: 'presupuestos', etiqueta: 'Presupuestos', icono: '▧', enlace: `${BASE}/pages/presupuestos.html`,   seccion: 'Principal' },
  { clave: 'materiales',   etiqueta: 'Materiales',   icono: '▩', enlace: `${BASE}/pages/materiales.html`,     seccion: 'Almacen' },
  { clave: 'stock',        etiqueta: 'Stock',        icono: '▣', enlace: `${BASE}/pages/stock.html`,          seccion: 'Almacen' },
  { clave: 'proveedores',  etiqueta: 'Proveedores',  icono: '◈', enlace: `${BASE}/pages/proveedores.html`,    seccion: 'Almacen' },
  { clave: 'pedidos',      etiqueta: 'Pedidos',      icono: '▨', enlace: `${BASE}/pages/pedidos.html`,        seccion: 'Almacen' },
  { clave: 'facturacion',  etiqueta: 'Facturacion',  icono: '▥', enlace: `${BASE}/pages/facturacion.html`,    seccion: 'Gestion' },
  { clave: 'empleados',    etiqueta: 'Empleados',    icono: '◐', enlace: `${BASE}/pages/empleados.html`,      seccion: 'Gestion' },
  { clave: 'usuarios',     etiqueta: 'Usuarios',     icono: '◑', enlace: `${BASE}/pages/usuarios.html`,       seccion: 'Sistema' },
  { clave: 'configuracion',etiqueta: 'Configuracion',icono: '◒', enlace: `${BASE}/pages/configuracion.html`,  seccion: 'Sistema' }
];

/**
 * Devuelve solo los modulos que el usuario puede ver.
 * El panel de inicio se muestra siempre.
 */
function modulosPermitidos() {
  return MODULOS.filter((modulo) => {
    if (modulo.clave === 'inicio') return true;
    const acciones = permisos[modulo.clave];
    return acciones && acciones.includes('ver');
  });
}

/**
 * Construye el HTML del menu lateral agrupado por secciones.
 */
function construirMenu(moduloActivo) {
  const modulos = modulosPermitidos();
  const secciones = [...new Set(modulos.map((m) => m.seccion))];

  return secciones.map((seccion) => {
    const items = modulos
      .filter((m) => m.seccion === seccion)
      .map((m) => {
        const activo = m.clave === moduloActivo ? ' menu__enlace--activo' : '';
        return `
          <a class="menu__enlace${activo}" href="${m.enlace}">
            <span class="menu__icono">${m.icono}</span>
            <span>${m.etiqueta}</span>
          </a>`;
      })
      .join('');

    return `
      <div class="menu__seccion">${seccion}</div>
      ${items}`;
  }).join('');
}

/**
 * Inserta cabecera y menu en la pagina y activa el cierre de sesion.
 */
function montarLayout(moduloActivo) {
  const inicial = usuario.email.charAt(0).toUpperCase();

  document.getElementById('cabecera').innerHTML = `
    <div class="cabecera__marca">
      <img src="${BASE}/img/logo-construcciones-perez.png" alt="Construcciones Perez" class="cabecera__logo">
      <div>
        <div class="cabecera__empresa">Construcciones Perez</div>
        <div class="cabecera__producto">ConstructionFlow ERP</div>
      </div>
    </div>
    <div class="cabecera__usuario">
      <div class="cabecera__avatar">${inicial}</div>
      <span class="cabecera__rol">${usuario.rol}</span>
      <button class="cabecera__salir" id="boton-salir">Salir</button>
    </div>`;

  document.getElementById('menu').innerHTML = construirMenu(moduloActivo);

  document.getElementById('boton-salir').addEventListener('click', () => {
    sessionStorage.clear();
    window.location.replace(`${BASE}/pages/login.html`);
  });
}