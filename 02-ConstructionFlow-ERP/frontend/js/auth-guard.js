/**
 * Protege las paginas privadas.
 * Si no hay sesion activa, redirige al login.
 * Debe cargarse el primero en toda pagina protegida.
 *
 * Expone 'usuario' y 'permisos' como variables globales (window)
 * para que layout.js y los scripts de cada pagina puedan usarlas.
 */

const token = sessionStorage.getItem('token');
const usuarioGuardado = sessionStorage.getItem('usuario');
const permisosGuardados = sessionStorage.getItem('permisos');

if (!token || !usuarioGuardado || !permisosGuardados) {
  window.location.replace('login.html');
}

// Las colgamos de window para que sean visibles desde cualquier otro script.
window.usuario = JSON.parse(usuarioGuardado);
window.permisos = JSON.parse(permisosGuardados);