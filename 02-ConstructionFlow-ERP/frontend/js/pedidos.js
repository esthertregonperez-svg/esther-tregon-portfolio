// frontend/js/pedidos.js
// Logica de la pantalla de pedidos a proveedores (cabecera).
// Listar + crear + editar. El importe es calculado (triggers): no se edita.

document.addEventListener('DOMContentLoaded', () => {

  // --- Referencias ---
  const tablaCuerpo   = document.getElementById('tabla-cuerpo');
  const mensajeVacio  = document.getElementById('mensaje-vacio');
  const contador      = document.getElementById('contador');
  const buscador      = document.getElementById('buscador');

  const modal         = document.getElementById('modal');
  const botonNuevo    = document.getElementById('boton-nuevo');
  const modalCerrar   = document.getElementById('modal-cerrar');
  const botonCancelar = document.getElementById('boton-cancelar');
  const modalTitulo   = document.getElementById('modal-titulo');
  const formulario    = document.getElementById('formulario');

  const campoId       = document.getElementById('id_pedido');
  const selectProveedor = document.getElementById('id_proveedor');

  const ESTADOS_LEGIBLES = {
    pendiente: 'Pendiente',
    recibido: 'Recibido',
    cancelado: 'Cancelado',
  };

  function soloFecha(fechaIso) {
    if (!fechaIso) return '';
    return fechaIso.substring(0, 10);
  }

  function formatoEuros(valor) {
    const numero = Number(valor) || 0;
    return numero.toLocaleString('es-ES', {
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    }) + ' €';
  }

  // ---------------------------------------------------------
  // Rellenar el desplegable de proveedores (una vez al cargar).
  // ---------------------------------------------------------
  async function cargarProveedoresEnSelect() {
    const respuesta = await api.get('/proveedores?limit=100&estado=activos');
    if (!respuesta || !respuesta.success) return;
    respuesta.data.items.forEach((p) => {
      const opcion = document.createElement('option');
      opcion.value = p.id_proveedor;
      opcion.textContent = p.nombre_empresa;
      selectProveedor.appendChild(opcion);
    });
  }

  // ---------------------------------------------------------
  // LISTAR.
  // ---------------------------------------------------------
  async function cargarPedidos(search = '') {
    tablaCuerpo.innerHTML =
      '<tr class="tabla__vacia"><td colspan="6">Cargando pedidos...</td></tr>';
    mensajeVacio.hidden = true;

    const endpoint = search
      ? `/pedidos?search=${encodeURIComponent(search)}`
      : '/pedidos';

    const respuesta = await api.get(endpoint);
    if (!respuesta) return;

    if (!respuesta.success) {
      tablaCuerpo.innerHTML =
        '<tr class="tabla__vacia"><td colspan="6">No se pudieron cargar los pedidos.</td></tr>';
      console.error('Error al listar pedidos:', respuesta.error);
      return;
    }

    pintarTabla(respuesta.data.items);
    actualizarContador(respuesta.data.pagination.total);
  }

  function pintarTabla(pedidos) {
    tablaCuerpo.innerHTML = '';

    if (pedidos.length === 0) {
      mensajeVacio.hidden = false;
      return;
    }
    mensajeVacio.hidden = true;

    pedidos.forEach((p) => {
      const fila = document.createElement('tr');

      fila.appendChild(celda(p.nombre_proveedor));
      fila.appendChild(celda(soloFecha(p.fecha_pedido)));
      fila.appendChild(celda(soloFecha(p.fecha_recepcion)));
      fila.appendChild(celda(ESTADOS_LEGIBLES[p.estado] ?? p.estado));
      fila.appendChild(celda(formatoEuros(p.importe_total)));

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
    contador.textContent = total === 1 ? '1 pedido' : `${total} pedidos`;
  }

  // ---------------------------------------------------------
  // MODAL.
  // ---------------------------------------------------------
  function abrirModalNuevo() {
    modalTitulo.textContent = 'Nuevo pedido';
    formulario.reset();
    campoId.value = '';
    limpiarErrores();
    modal.hidden = false;
  }

  function abrirModalEditar(p) {
    modalTitulo.textContent = 'Editar pedido';
    limpiarErrores();

    campoId.value = p.id_pedido;
    selectProveedor.value = p.id_proveedor;
    document.getElementById('fecha_pedido').value = soloFecha(p.fecha_pedido);
    document.getElementById('fecha_recepcion').value = soloFecha(p.fecha_recepcion);
    document.getElementById('estado').value = p.estado;

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

  if (buscador) {
    buscador.addEventListener('input', () => {
      cargarPedidos(buscador.value.trim());
    });
  }

  // ---------------------------------------------------------
  // GUARDAR: crea o edita.
  // ---------------------------------------------------------
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    limpiarErrores();

    const datos = {
      id_proveedor:    document.getElementById('id_proveedor').value,
      fecha_pedido:    document.getElementById('fecha_pedido').value,
      fecha_recepcion: document.getElementById('fecha_recepcion').value || null,
      estado:          document.getElementById('estado').value,
    };

    const id = campoId.value;

    const respuesta = id
      ? await api.put('/pedidos/' + id, datos)
      : await api.post('/pedidos', datos);

    if (!respuesta) return;

    if (respuesta.success) {
      cerrarModal();
      cargarPedidos();
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

    if (errorGeneral) {
      errorGeneral.textContent = error.message || 'No se pudo guardar el pedido.';
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
  // Arranque.
  // ---------------------------------------------------------
  montarLayout('pedidos');
  cargarProveedoresEnSelect();
  cargarPedidos();
});