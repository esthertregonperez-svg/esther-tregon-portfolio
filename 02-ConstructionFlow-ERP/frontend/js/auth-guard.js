/**
 * Protege las paginas privadas.
 * Si no hay sesion activa, redirige al login.
 * Debe cargarse el primero en toda pagina protegida.
 */

const token = sessionStorage.getItem('token');
const usuarioGuardado = sessionStorage.getItem('usuario');
const permisosGuardados = sessionStorage.getItem('permisos');

if (!token || !usuarioGuardado || !permisosGuardados) {
  window.location.replace('login.html');
}

const usuario = JSON.parse(usuarioGuardado);
const permisos = JSON.parse(permisosGuardados);