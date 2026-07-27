// frontend/js/proveedores.js
// Logica de la pantalla de proveedores.
// Listar (con filtro de estado) + crear + editar + cambiar estado alta/baja.

document.addEventListener('DOMContentLoaded', () => {

  // --- Referencias a los elementos del HTML ---
  const tablaCuerpo   = document.getElementById('tabla-cuerpo');
  const mensajeVacio  = document.getElementById('mensaje-vacio');
  const contador      = document.getElementById('contador');
  const buscador      = document.getElementById('buscador');
  const filtroEstado  = document.getElementById('filtro-estado');

  const modal         = document.getElementById('modal');
  const botonNuevo    = document.getElementById('boton-nuevo');
  const modalCerrar   = document.getElementById('modal-cerrar');
  const botonCancelar = document.getElementById('boton-cancelar');
  const modalTitulo   = document.getElementById('modal-titulo');
  const formulario    = document.getElementById('formulario');

  const campoId       = document.getElementById('id_proveedor');

  // ---------------------------------------------------------
  // LISTAR: pide los proveedores (segun buscador y filtro) y los pinta.
  // ---------------------------------------------------------
  async function cargarProveedores() {
    tablaCuerpo.innerHTML =
      '<tr class="tabla__vacia"><td colspan="7">Cargando proveedores...</td></tr>';
    mensajeVacio.hidden = true;

    const search = buscador.value.trim();
    const estado = filtroEstado.value; // activos | baja | todos

    // Montamos la query con los dos parametros.
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('estado', estado);

    const respuesta = await api.get('/proveedores?' + params.toString());
    if (!respuesta) return;

    if (!respuesta.success) {
      tablaCuerpo.innerHTML =
        '<tr class="tabla__vacia"><td colspan="7">No se pudieron cargar los proveedores.</td></tr>';
      console.error('Error al listar proveedores:', respuesta.error);
      return;
    }

    pintarTabla(respuesta.data.items);
    actualizarContador(respuesta.data.pagination.total);
  }

  function pintarTabla(proveedores) {
    tablaCuerpo.innerHTML = '';

    if (proveedores.length === 0) {
      mensajeVacio.hidden = false;
      return;
    }
    mensajeVacio.hidden = true;

    proveedores.forEach((p) => {
      const fila = document.createElement('tr');

      fila.appendChild(celda(p.nombre_empresa));
      fila.appendChild(celda(p.cif));
      fila.appendChild(celda(p.persona_contacto));
      fila.appendChild(celda(p.telefono));
      fila.appendChild(celda(p.email));
      fila.appendChild(celda(p.activo === 1 ? 'Alta' : 'Baja'));

      const acciones = document.createElement('td');
      acciones.className = 'tabla__acciones';
      const botonEditar = document.createElement('button');
      botonEditar.className = 'boton boton--secundario';
      botonEditar.textContent = 'Editar';
      botonEditar.addEventListener('click', () => abrirModalEditar(p));
      acciones.appendChild(botonEditar);
      fila.appendChild(acciones);

      tablaCuerpo.appendChild(fila);
    });
  }

  function celda(texto) {
    const td = document.createElement('td');
    td.textContent = (texto === null || texto === undefined || texto === '') ? '—' : texto;
    return td;
  }

  function actualizarContador(total) {
    if (!contador) return;
    contador.textContent = total === 1 ? '1 proveedor' : `${total} proveedores`;
  }

  // ---------------------------------------------------------
  // MODAL: abrir para crear, abrir para editar, y cerrar.
  // ---------------------------------------------------------
  function abrirModalNuevo() {
    modalTitulo.textContent = 'Nuevo proveedor';
    formulario.reset();
    campoId.value = '';
    document.getElementById('activo').value = '1'; // por defecto, alta
    limpiarErrores();
    modal.hidden = false;
  }

  function abrirModalEditar(p) {
    modalTitulo.textContent = 'Editar proveedor';
    limpiarErrores();

    campoId.value = p.id_proveedor;
    document.getElementById('nombre_empresa').value = p.nombre_empresa ?? '';
    document.getElementById('cif').value = p.cif ?? '';
    document.getElementById('persona_contacto').value = p.persona_contacto ?? '';
    document.getElementById('telefono').value = p.telefono ?? '';
    document.getElementById('email').value = p.email ?? '';
    document.getElementById('direccion').value = p.direccion ?? '';
    document.getElementById('activo').value = String(p.activo);

    modal.hidden = false;
  }

  function cerrarModal() {
    modal.hidden = true;
  }

  // ---------------------------------------------------------
  // Eventos.
  // ---------------------------------------------------------
  botonNuevo.addEventListener('click', abrirModalNuevo);
  modalCerrar.addEventListener('click', cerrarModal);
  botonCancelar.addEventListener('click', cerrarModal);

  modal.addEventListener('click', (evento) => {
    if (evento.target === modal) cerrarModal();
  });

  // Al escribir en el buscador o cambiar el filtro, recargamos.
  buscador.addEventListener('input', cargarProveedores);
  filtroEstado.addEventListener('change', cargarProveedores);

  // ---------------------------------------------------------
  // GUARDAR: crea (si no hay id) o edita (si hay id).
  // ---------------------------------------------------------
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    limpiarErrores();

    const datos = {
      nombre_empresa:    document.getElementById('nombre_empresa').value.trim(),
      cif:               document.getElementById('cif').value.trim(),
      persona_contacto:  document.getElementById('persona_contacto').value.trim(),
      telefono:          document.getElementById('telefono').value.trim(),
      email:             document.getElementById('email').value.trim(),
      direccion:         document.getElementById('direccion').value.trim(),
      activo:            Number(document.getElementById('activo').value),
    };

    const id = campoId.value;

    const respuesta = id
      ? await api.put('/proveedores/' + id, datos)
      : await api.post('/proveedores', datos);

    if (!respuesta) return;

    if (respuesta.success) {
      cerrarModal();
      cargarProveedores();
      return;
    }

    mostrarError(respuesta.error);
  });

  function mostrarError(error) {
    const errorGeneral = document.getElementById('error-general');

    if (error.code === 'DATOS_INVALIDOS' && error.fields) {
      for (const campo in error.fields) {
        const span = document.getElementById('error-' + campo);
        if (span) span.textContent = error.fields[campo];
      }
      return;
    }

    if (error.code === 'VALOR_DUPLICADO') {
      const span = document.getElementById('error-cif');
      if (span) span.textContent = error.message;
      return;
    }

    if (errorGeneral) {
      errorGeneral.textContent = error.message || 'No se pudo guardar el proveedor.';
      errorGeneral.hidden = false;
    }
  }

  function limpiarErrores() {
    document.querySelectorAll('.campo__error').forEach((span) => {
      span.textContent = '';
    });
    const errorGeneral = document.getElementById('error-general');
    if (errorGeneral) {
      errorGeneral.textContent = '';
      errorGeneral.hidden = true;
    }
  }

  // ---------------------------------------------------------
  // Arranque: menu y lista.
  // ---------------------------------------------------------
  montarLayout('proveedores');
  cargarProveedores();
});