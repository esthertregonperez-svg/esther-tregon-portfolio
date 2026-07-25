/**
 * Logica del panel de control.
 * Monta el layout y muestra los accesos rapidos segun el rol.
 */

montarLayout('inicio');

document.getElementById('saludo').textContent =
  `Has accedido como ${usuario.rol}. Estos son tus accesos disponibles.`;

const tarjetas = modulosPermitidos()
  .filter((modulo) => modulo.clave !== 'inicio')
  .map((modulo) => `
    <a class="tarjeta" href="${modulo.enlace}">
      <span class="tarjeta__icono">${modulo.icono}</span>
      <span class="tarjeta__titulo">${modulo.etiqueta}</span>
    </a>`)
  .join('');

document.getElementById('tarjetas').innerHTML = tarjetas;
