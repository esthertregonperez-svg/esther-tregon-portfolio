// frontend/js/facturacion.js
// Logica de la pantalla de facturacion (cabecera).
// Listar + crear + editar. base_imponible y total_factura son calculados
// (triggers de MySQL a partir de las lineas): NO se editan, solo se muestran.

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

  const campoId       = document.getElementById('id_factura');
  const selectCliente = document.getElementById('id_cliente');
  const selectObra    = document.getElementById('id_obra');

  const ESTADOS_LEGIBLES = {
    emitida: 'Emitida',
    pendiente: 'Pendiente',
    cobrada: 'Cobrada',
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

  function formatoIva(valor) {
    const numero = Number(valor) || 0;
    return numero.toLocaleString('es-ES', { maximumFractionDigits: 2 }) + ' %';
  }

  // ---------------------------------------------------------
  // Rellenar los desplegables de cliente y obra (una vez al cargar).
  // ---------------------------------------------------------
  async function cargarClientesEnSelect() {
    const respuesta = await api.get('/clientes?limit=100&estado=activos');
    if (!respuesta || !respuesta.success) return;
    respuesta.data.items.forEach((c) => {
      const opcion = document.createElement('option');
      opcion.value = c.id_cliente;
      opcion.textContent = c.nombre;
      selectCliente.appendChild(opcion);
    });
  }

  async function cargarObrasEnSelect() {
    const respuesta = await api.get('/obras?limit=100');
    if (!respuesta || !respuesta.success) return;
    respuesta.data.items.forEach((o) => {
      const opcion = document.createElement('option');
      opcion.value = o.id_obra;
      opcion.textContent = o.nombre_obra;
      selectObra.appendChild(opcion);
    });
  }

  // ---------------------------------------------------------
  // LISTAR.
  // ---------------------------------------------------------
  async function cargarFacturas(search = '') {
    tablaCuerpo.innerHTML =
      '<tr class="tabla__vacia"><td colspan="8">Cargando facturas...</td></tr>';
    mensajeVacio.hidden = true;

    const endpoint = search
      ? `/facturas?search=${encodeURIComponent(search)}`
      : '/facturas';

    const respuesta = await api.get(endpoint);
    if (!respuesta) return;

    if (!respuesta.success) {
      tablaCuerpo.innerHTML =
        '<tr class="tabla__vacia"><td colspan="8">No se pudieron cargar las facturas.</td></tr>';
      console.error('Error al listar facturas:', respuesta.error);
      return;
    }

    pintarTabla(respuesta.data.items);
    actualizarContador(respuesta.data.pagination.total);
  }

  function pintarTabla(facturas) {
    tablaCuerpo.innerHTML = '';

    if (facturas.length === 0) {
      mensajeVacio.hidden = false;
      return;
    }
    mensajeVacio.hidden = true;

    facturas.forEach((f) => {
      const fila = document.createElement('tr');

      fila.appendChild(celda(f.nombre_cliente));
      fila.appendChild(celda(f.nombre_obra));
      fila.appendChild(celda(soloFecha(f.fecha_factura)));
      fila.appendChild(celda(ESTADOS_LEGIBLES[f.estado] ?? f.estado));
      fila.appendChild(celda(formatoIva(f.iva)));
      fila.appendChild(celda(formatoEuros(f.base_imponible)));
      fila.appendChild(celda(formatoEuros(f.total_factura)));

      const acciones = document.createElement('td');
      acciones.className = 'tabla__acciones';
      const botonEditar = document.createElement('button');
      botonEditar.className = 'boton boton--secundario';
      botonEditar.textContent = 'Editar';
      botonEditar.addEventListener('click', () => abrirModalEditar(f));
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
    contador.textContent = total === 1 ? '1 factura' : `${total} facturas`;
  }

  // ---------------------------------------------------------
  // MODAL.
  // ---------------------------------------------------------
  function abrirModalNuevo() {
    modalTitulo.textContent = 'Nueva factura';
    formulario.reset();
    campoId.value = '';
    document.getElementById('iva').value = '21';
    limpiarErrores();
    modal.hidden = false;
  }

  function abrirModalEditar(f) {
    modalTitulo.textContent = 'Editar factura';
    limpiarErrores();

    campoId.value = f.id_factura;
    selectCliente.value = f.id_cliente;
    selectObra.value = f.id_obra;
    document.getElementById('fecha_factura').value = soloFecha(f.fecha_factura);
    document.getElementById('estado').value = f.estado;
    document.getElementById('iva').value = f.iva;

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
      cargarFacturas(buscador.value.trim());
    });
  }

  // ---------------------------------------------------------
  // GUARDAR: crea o edita.
  // base_imponible y total_factura NO se envian: los mantienen los triggers.
  // ---------------------------------------------------------
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    limpiarErrores();

    const datos = {
      id_cliente:    document.getElementById('id_cliente').value,
      id_obra:       document.getElementById('id_obra').value,
      fecha_factura: document.getElementById('fecha_factura').value,
      estado:        document.getElementById('estado').value,
      iva:           document.getElementById('iva').value || null,
    };

    const id = campoId.value;

    const respuesta = id
      ? await api.put('/facturas/' + id, datos)
      : await api.post('/facturas', datos);

    if (!respuesta) return;

    if (respuesta.success) {
      cerrarModal();
      cargarFacturas();
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
      errorGeneral.textContent = error.message || 'No se pudo guardar la factura.';
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
  montarLayout('facturacion');
  cargarClientesEnSelect();
  cargarObrasEnSelect();
  cargarFacturas();
});