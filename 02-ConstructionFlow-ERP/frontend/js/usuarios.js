// frontend/js/usuarios.js
// Logica de la pantalla de usuarios.
// ENTREGA 1: listar usuarios + abrir/cerrar el modal de nuevo usuario.

document.addEventListener('DOMContentLoaded', () => {

  // --- Referencias a los elementos del HTML (por sus id) ---
  const tablaCuerpo   = document.getElementById('tabla-cuerpo');
  const mensajeVacio  = document.getElementById('mensaje-vacio');
  const contador      = document.getElementById('contador');
  const buscador      = document.getElementById('buscador');

  const modalUsuario  = document.getElementById('modal-usuario');
  const botonNuevo    = document.getElementById('boton-nuevo');
  const usuarioCerrar = document.getElementById('usuario-cerrar');
  const usuarioCancelar = document.getElementById('usuario-cancelar');
  const formUsuario   = document.getElementById('form-usuario');

  // Guardamos la lista completa en memoria para poder filtrar sin ir al backend.
  let usuarios = [];

  // Traduce el nombre_rol de la BD a un texto con mayuscula inicial legible.
  const ROLES_LEGIBLES = {
    administrador: 'Administrador',
    direccion: 'Dirección',
    administracion: 'Administración',
    recepcion: 'Recepción',
    comercial: 'Comercial',
    tecnico: 'Técnico',
    jefe_obra: 'Jefe de obra',
  };

  // ---------------------------------------------------------
  // LISTAR: pide los usuarios al backend y los pinta en la tabla.
  // ---------------------------------------------------------
  async function cargarUsuarios() {
    tablaCuerpo.innerHTML =
      '<tr class="tabla__vacia"><td colspan="5">Cargando usuarios...</td></tr>';
    mensajeVacio.hidden = true;

    const respuesta = await api.get('/usuarios');

    // api.js devuelve undefined si hubo un 401 (ya redirige al login).
    if (!respuesta) return;

    if (!respuesta.success) {
      tablaCuerpo.innerHTML =
        '<tr class="tabla__vacia"><td colspan="5">No se pudieron cargar los usuarios.</td></tr>';
      console.error('Error al listar usuarios:', respuesta.error);
      return;
    }

    // OJO: usuarios NO tiene paginacion. Vienen en data.items y ya esta.
    usuarios = respuesta.data.items;

    pintarTabla(usuarios);
    actualizarContador(usuarios.length);
  }

  // Filtra en memoria por email o rol y repinta.
  function filtrar(texto) {
    const t = texto.toLowerCase();
    const filtrados = usuarios.filter((u) =>
      u.email.toLowerCase().includes(t) ||
      (ROLES_LEGIBLES[u.nombre_rol] ?? u.nombre_rol).toLowerCase().includes(t)
    );
    pintarTabla(filtrados);
    actualizarContador(filtrados.length);
  }

  // Dibuja una fila por cada usuario. Si no hay ninguno, muestra el aviso.
  function pintarTabla(lista) {
    tablaCuerpo.innerHTML = '';

    if (lista.length === 0) {
      mensajeVacio.hidden = false;
      return;
    }
    mensajeVacio.hidden = true;

    lista.forEach((usuario) => {
      const fila = document.createElement('tr');

      fila.appendChild(celda(usuario.email));
      fila.appendChild(celda(ROLES_LEGIBLES[usuario.nombre_rol] ?? usuario.nombre_rol));
      fila.appendChild(celda(formatearFecha(usuario.ultimo_acceso)));
      fila.appendChild(celda(usuario.activo ? 'Activo' : 'Baja'));

      // Columna de acciones: vacia hasta la Entrega 3 (cambiar rol / resetear).
      const acciones = document.createElement('td');
      acciones.className = 'tabla__acciones';
      acciones.textContent = '—';
      fila.appendChild(acciones);

      tablaCuerpo.appendChild(fila);
    });
  }

  // Ayuda: crea una celda <td> con el texto dado.
  function celda(texto) {
    const td = document.createElement('td');
    td.textContent = texto ?? '—';
    return td;
  }

  // Convierte la fecha ISO en algo legible; si es null, "Nunca".
  function formatearFecha(iso) {
    if (!iso) return 'Nunca';
    const f = new Date(iso);
    return f.toLocaleDateString('es-ES') + ' ' +
      f.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  // Escribe cuantos usuarios hay bajo el titulo.
  function actualizarContador(total) {
    if (!contador) return;
    contador.textContent =
      total === 1 ? '1 usuario' : `${total} usuarios`;
  }

  // ---------------------------------------------------------
  // MODAL nuevo usuario: abrir y cerrar.
  // ---------------------------------------------------------
  function abrirModalUsuario() {
    formUsuario.reset();
    limpiarErrores();
    modalUsuario.hidden = false;
  }

  function cerrarModalUsuario() {
    modalUsuario.hidden = true;
  }

  // Borra los mensajes de error del formulario de nuevo usuario.
  function limpiarErrores() {
    document.querySelectorAll('#form-usuario .campo__error').forEach((span) => {
      span.textContent = '';
    });
    const errorGeneral = document.getElementById('error-general');
    if (errorGeneral) {
      errorGeneral.textContent = '';
      errorGeneral.hidden = true;
    }
  }

  // ---------------------------------------------------------
  // Conexion de eventos.
  // ---------------------------------------------------------
  botonNuevo.addEventListener('click', abrirModalUsuario);
  usuarioCerrar.addEventListener('click', cerrarModalUsuario);
  usuarioCancelar.addEventListener('click', cerrarModalUsuario);

  // Cerrar al hacer clic en el fondo oscuro.
  modalUsuario.addEventListener('click', (evento) => {
    if (evento.target === modalUsuario) cerrarModalUsuario();
  });

  // Buscador: filtra en memoria (sin llamar al backend).
  if (buscador) {
    buscador.addEventListener('input', () => {
      filtrar(buscador.value.trim());
    });
  }

  // ---------------------------------------------------------
  // Arranque: montamos el menu y pedimos los usuarios.
  // ---------------------------------------------------------
  montarLayout('usuarios');
  cargarUsuarios();
});