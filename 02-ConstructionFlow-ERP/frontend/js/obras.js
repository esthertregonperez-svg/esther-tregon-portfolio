// frontend/js/obras.js
// Logica de la pantalla de obras.
// Listar + crear + editar (el editar permite cambiar el estado de la obra).

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

  const campoIdObra   = document.getElementById('id_obra');
  const selectCliente = document.getElementById('id_cliente');

  // Textos legibles para el estado (BD -> pantalla).
  const ESTADOS_LEGIBLES = {
    pendiente: 'Pendiente',
    en_ejecucion: 'En ejecución',
    finalizada: 'Finalizada',
    cancelada: 'Cancelada',
  };

  // ---------------------------------------------------------
  // Utilidad: recorta una fecha larga (2025-03-10T00:00:00Z) a 2025-03-10.
  // Si no hay fecha, devuelve cadena vacia.
  // ---------------------------------------------------------
  function soloFecha(fechaIso) {
    if (!fechaIso) return '';
    return fechaIso.substring(0, 10);
  }

  // Formatea un importe como euros (1234.5 -> "1.234,50 €").
  function formatoEuros(valor) {
    const numero = Number(valor) || 0;
    return numero.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' €';
  }

  // ---------------------------------------------------------
  // Rellena el desplegable de clientes pidiendolos al backend.
  // Se hace una vez al cargar la pagina.
  // ---------------------------------------------------------
  async function cargarClientesEnSelect() {
    const respuesta = await api.get('/clientes?limit=100');
    if (!respuesta || !respuesta.success) return;

    // Dejamos la primera opcion ("Selecciona...") y anadimos los clientes.
    respuesta.data.items.forEach((cliente) => {
      const opcion = document.createElement('option');
      opcion.value = cliente.id_cliente;
      opcion.textContent = cliente.nombre;
      selectCliente.appendChild(opcion);
    });
  }

  // ---------------------------------------------------------
  // LISTAR: pide las obras y las pinta en la tabla.
  // ---------------------------------------------------------
  async function cargarObras(search = '') {
    tablaCuerpo.innerHTML =
      '<tr class="tabla__vacia"><td colspan="7">Cargando obras...</td></tr>';
    mensajeVacio.hidden = true;

    const endpoint = search
      ? `/obras?search=${encodeURIComponent(search)}`
      : '/obras';

    const respuesta = await api.get(endpoint);
    if (!respuesta) return;

    if (!respuesta.success) {
      tablaCuerpo.innerHTML =
        '<tr class="tabla__vacia"><td colspan="7">No se pudieron cargar las obras.</td></tr>';
      console.error('Error al listar obras:', respuesta.error);
      return;
    }

    const obras = respuesta.data.items;
    const total = respuesta.data.pagination.total;

    pintarTabla(obras);
    actualizarContador(total);
  }

  // Dibuja una fila por cada obra, con un boton Editar.
  function pintarTabla(obras) {
    tablaCuerpo.innerHTML = '';

    if (obras.length === 0) {
      mensajeVacio.hidden = false;
      return;
    }
    mensajeVacio.hidden = true;

    obras.forEach((obra) => {
      const fila = document.createElement('tr');

      fila.appendChild(celda(obra.nombre_obra));
      fila.appendChild(celda(obra.nombre_cliente));
      fila.appendChild(celda(obra.direccion_obra));
      fila.appendChild(celda(soloFecha(obra.fecha_inicio)));
      fila.appendChild(celda(ESTADOS_LEGIBLES[obra.estado] ?? obra.estado));
      fila.appendChild(celda(formatoEuros(obra.presupuesto_total_estimado)));

      // Columna de acciones: boton Editar.
      const acciones = document.createElement('td');
      acciones.className = 'tabla__acciones';
      const botonEditar = document.createElement('button');
      botonEditar.className = 'boton boton--secundario';
      botonEditar.textContent = 'Editar';
      botonEditar.addEventListener('click', () => abrirModalEditar(obra));
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
    contador.textContent = total === 1 ? '1 obra' : `${total} obras`;
  }

  // ---------------------------------------------------------
  // MODAL: abrir para crear, abrir para editar, y cerrar.
  // ---------------------------------------------------------
  function abrirModalNueva() {
    modalTitulo.textContent = 'Nueva obra';
    formulario.reset();
    campoIdObra.value = '';   // vacio = estamos creando
    limpiarErrores();
    modal.hidden = false;
  }

  function abrirModalEditar(obra) {
    modalTitulo.textContent = 'Editar obra';
    limpiarErrores();

    // Rellenamos el formulario con los datos de la obra.
    campoIdObra.value = obra.id_obra;   // con id = estamos editando
    selectCliente.value = obra.id_cliente;
    document.getElementById('nombre_obra').value = obra.nombre_obra ?? '';
    document.getElementById('direccion_obra').value = obra.direccion_obra ?? '';
    document.getElementById('fecha_inicio').value = soloFecha(obra.fecha_inicio);
    document.getElementById('fecha_fin_prevista').value = soloFecha(obra.fecha_fin_prevista);
    document.getElementById('estado').value = obra.estado;
    document.getElementById('presupuesto_total_estimado').value = obra.presupuesto_total_estimado ?? 0;
    document.getElementById('descripcion').value = obra.descripcion ?? '';

    modal.hidden = false;
  }

  function cerrarModal() {
    modal.hidden = true;
  }

  // ---------------------------------------------------------
  // Eventos.
  // ---------------------------------------------------------
  botonNuevo.addEventListener('click', abrirModalNueva);
  modalCerrar.addEventListener('click', cerrarModal);
  botonCancelar.addEventListener('click', cerrarModal);

  modal.addEventListener('click', (evento) => {
    if (evento.target === modal) cerrarModal();
  });

  if (buscador) {
    buscador.addEventListener('input', () => {
      cargarObras(buscador.value.trim());
    });
  }

  // ---------------------------------------------------------
  // GUARDAR: crea (si no hay id) o edita (si hay id).
  // ---------------------------------------------------------
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    limpiarErrores();

    const datos = {
      id_cliente:                  document.getElementById('id_cliente').value,
      nombre_obra:                 document.getElementById('nombre_obra').value.trim(),
      direccion_obra:              document.getElementById('direccion_obra').value.trim(),
      fecha_inicio:                document.getElementById('fecha_inicio').value,
      fecha_fin_prevista:          document.getElementById('fecha_fin_prevista').value || null,
      estado:                      document.getElementById('estado').value,
      presupuesto_total_estimado:  document.getElementById('presupuesto_total_estimado').value || 0,
      descripcion:                 document.getElementById('descripcion').value.trim(),
    };

    const id = campoIdObra.value;

    // Si hay id, es editar (PUT). Si no, crear (POST).
    const respuesta = id
      ? await api.put('/obras/' + id, datos)
      : await api.post('/obras', datos);

    if (!respuesta) return;

    if (respuesta.success) {
      cerrarModal();
      cargarObras();
      return;
    }

    mostrarError(respuesta.error);
  });

  // Muestra el error devuelto por el backend.
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
      errorGeneral.textContent = error.message || 'No se pudo guardar la obra.';
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
  // Arranque: montamos el menu, rellenamos el select y cargamos las obras.
  // ---------------------------------------------------------
  montarLayout('obras');
  cargarClientesEnSelect();
  cargarObras();
});