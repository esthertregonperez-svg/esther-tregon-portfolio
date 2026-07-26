// frontend/js/presupuestos.js
// Logica de la pantalla de presupuestos (cabecera).
// Listar + crear + editar. El importe es calculado (triggers): no se edita.

document.addEventListener('DOMContentLoaded', () => {

  // --- Referencias a los elementos del HTML ---
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

  const campoId       = document.getElementById('id_presupuesto');
  const selectCliente = document.getElementById('id_cliente');
  const selectObra    = document.getElementById('id_obra');

  // Textos legibles para el estado (BD -> pantalla).
  const ESTADOS_LEGIBLES = {
    pendiente: 'Pendiente',
    aceptado: 'Aceptado',
    rechazado: 'Rechazado',
  };

  // Recorta una fecha larga a formato corto (2025-02-25).
  function soloFecha(fechaIso) {
    if (!fechaIso) return '';
    return fechaIso.substring(0, 10);
  }

  // Formatea un importe como euros.
  function formatoEuros(valor) {
    const numero = Number(valor) || 0;
    return numero.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' €';
  }

  // ---------------------------------------------------------
  // Rellena los desplegables de clientes y obras (una vez al cargar).
  // ---------------------------------------------------------
  async function cargarClientesEnSelect() {
    const respuesta = await api.get('/clientes?limit=100');
    if (!respuesta || !respuesta.success) return;
    respuesta.data.items.forEach((cliente) => {
      const opcion = document.createElement('option');
      opcion.value = cliente.id_cliente;
      opcion.textContent = cliente.nombre;
      selectCliente.appendChild(opcion);
    });
  }

  async function cargarObrasEnSelect() {
    const respuesta = await api.get('/obras?limit=100');
    if (!respuesta || !respuesta.success) return;
    respuesta.data.items.forEach((obra) => {
      const opcion = document.createElement('option');
      opcion.value = obra.id_obra;
      opcion.textContent = obra.nombre_obra;
      selectObra.appendChild(opcion);
    });
  }

  // ---------------------------------------------------------
  // LISTAR: pide los presupuestos y los pinta en la tabla.
  // ---------------------------------------------------------
  async function cargarPresupuestos(search = '') {
    tablaCuerpo.innerHTML =
      '<tr class="tabla__vacia"><td colspan="6">Cargando presupuestos...</td></tr>';
    mensajeVacio.hidden = true;

    const endpoint = search
      ? `/presupuestos?search=${encodeURIComponent(search)}`
      : '/presupuestos';

    const respuesta = await api.get(endpoint);
    if (!respuesta) return;

    if (!respuesta.success) {
      tablaCuerpo.innerHTML =
        '<tr class="tabla__vacia"><td colspan="6">No se pudieron cargar los presupuestos.</td></tr>';
      console.error('Error al listar presupuestos:', respuesta.error);
      return;
    }

    const presupuestos = respuesta.data.items;
    const total = respuesta.data.pagination.total;

    pintarTabla(presupuestos);
    actualizarContador(total);
  }

  // Dibuja una fila por cada presupuesto, con un boton Editar.
  function pintarTabla(presupuestos) {
    tablaCuerpo.innerHTML = '';

    if (presupuestos.length === 0) {
      mensajeVacio.hidden = false;
      return;
    }
    mensajeVacio.hidden = true;

    presupuestos.forEach((p) => {
      const fila = document.createElement('tr');

      fila.appendChild(celda(p.nombre_cliente));
      fila.appendChild(celda(p.nombre_obra));   // sera '—' si no tiene obra
      fila.appendChild(celda(soloFecha(p.fecha_presupuesto)));
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
    contador.textContent = total === 1 ? '1 presupuesto' : `${total} presupuestos`;
  }

  // ---------------------------------------------------------
  // MODAL: abrir para crear, abrir para editar, y cerrar.
  // ---------------------------------------------------------
  function abrirModalNuevo() {
    modalTitulo.textContent = 'Nuevo presupuesto';
    formulario.reset();
    campoId.value = '';
    limpiarErrores();
    modal.hidden = false;
  }

  function abrirModalEditar(p) {
    modalTitulo.textContent = 'Editar presupuesto';
    limpiarErrores();

    campoId.value = p.id_presupuesto;
    selectCliente.value = p.id_cliente;
    selectObra.value = p.id_obra ?? '';   // '' = sin obra asignada
    document.getElementById('fecha_presupuesto').value = soloFecha(p.fecha_presupuesto);
    document.getElementById('estado').value = p.estado;
    document.getElementById('observaciones').value = p.observaciones ?? '';

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
      cargarPresupuestos(buscador.value.trim());
    });
  }

  // ---------------------------------------------------------
  // GUARDAR: crea (si no hay id) o edita (si hay id).
  // El importe NO se envia: lo calculan los triggers.
  // ---------------------------------------------------------
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    limpiarErrores();

    const datos = {
      id_cliente:        document.getElementById('id_cliente').value,
      id_obra:           document.getElementById('id_obra').value || null,
      fecha_presupuesto: document.getElementById('fecha_presupuesto').value,
      estado:            document.getElementById('estado').value,
      observaciones:     document.getElementById('observaciones').value.trim(),
    };

    const id = campoId.value;

    const respuesta = id
      ? await api.put('/presupuestos/' + id, datos)
      : await api.post('/presupuestos', datos);

    if (!respuesta) return;

    if (respuesta.success) {
      cerrarModal();
      cargarPresupuestos();
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
      errorGeneral.textContent = error.message || 'No se pudo guardar el presupuesto.';
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
  // Arranque: menu, desplegables y lista.
  // ---------------------------------------------------------
  montarLayout('presupuestos');
  cargarClientesEnSelect();
  cargarObrasEnSelect();
  cargarPresupuestos();
});
