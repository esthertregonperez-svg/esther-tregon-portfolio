// frontend/js/stock.js
// Logica de la pantalla de stock de almacen.
// Ver el stock + registrar entradas (suma) y salidas (resta, sin bajar de 0).
// Movimientos desde cada fila O desde los botones generales de arriba.
// Las cantidades por debajo del stock minimo se resaltan en rojo.

document.addEventListener('DOMContentLoaded', () => {

  // --- Referencias ---
  const tablaCuerpo   = document.getElementById('tabla-cuerpo');
  const mensajeVacio  = document.getElementById('mensaje-vacio');
  const contador      = document.getElementById('contador');
  const buscador      = document.getElementById('buscador');

  const botonEntradaGeneral = document.getElementById('boton-entrada-general');
  const botonSalidaGeneral  = document.getElementById('boton-salida-general');

  const modal         = document.getElementById('modal');
  const modalCerrar   = document.getElementById('modal-cerrar');
  const botonCancelar = document.getElementById('boton-cancelar');
  const botonGuardar  = document.getElementById('boton-guardar');
  const modalTitulo   = document.getElementById('modal-titulo');
  const formulario    = document.getElementById('formulario');

  const campoIdHidden   = document.getElementById('id_material_hidden');
  const campoTipo       = document.getElementById('tipo_movimiento');
  const infoMaterial    = document.getElementById('info-material');
  const campoSelectWrap = document.getElementById('campo-select-material');
  const selectMaterial  = document.getElementById('select_material');

  // Guardamos aqui la lista de materiales (con su stock) para el desplegable
  // y para poder mostrar el disponible al elegir uno.
  let materialesCache = [];

  // ---------------------------------------------------------
  // LISTAR.
  // ---------------------------------------------------------
  async function cargarStock() {
    tablaCuerpo.innerHTML =
      '<tr class="tabla__vacia"><td colspan="7">Cargando stock...</td></tr>';
    mensajeVacio.hidden = true;

    const search = buscador.value.trim();
    const endpoint = search
      ? `/stock?search=${encodeURIComponent(search)}`
      : '/stock';

    const respuesta = await api.get(endpoint);
    if (!respuesta) return;

    if (!respuesta.success) {
      tablaCuerpo.innerHTML =
        '<tr class="tabla__vacia"><td colspan="7">No se pudo cargar el stock.</td></tr>';
      console.error('Error al listar stock:', respuesta.error);
      return;
    }

    materialesCache = respuesta.data.items;
    pintarTabla(materialesCache);
    actualizarContador(respuesta.data.pagination.total);
    rellenarSelectMateriales(materialesCache);
  }

  function pintarTabla(materiales) {
    tablaCuerpo.innerHTML = '';

    if (materiales.length === 0) {
      mensajeVacio.hidden = false;
      return;
    }
    mensajeVacio.hidden = true;

    materiales.forEach((m) => {
      const fila = document.createElement('tr');

      const disponible = Number(m.cantidad_disponible);
      const minimo = Number(m.stock_minimo);
      const bajoMinimo = disponible < minimo;

      fila.appendChild(celda(m.nombre_material));
      fila.appendChild(celda(m.categoria));
      fila.appendChild(celda(m.unidad_medida));

      // Celda de disponible: en rojo si esta por debajo del minimo.
      const celdaDisp = celda(disponible);
      if (bajoMinimo) {
        celdaDisp.classList.add('stock--bajo');
        celdaDisp.title = 'Por debajo del stock minimo';
      }
      fila.appendChild(celdaDisp);

      fila.appendChild(celda(minimo));
      fila.appendChild(celda(m.ubicacion_almacen));

      const acciones = document.createElement('td');
      acciones.className = 'tabla__acciones';

      const btnEntrada = document.createElement('button');
      btnEntrada.className = 'boton boton--primario';
      btnEntrada.textContent = 'Entrada';
      btnEntrada.addEventListener('click', () => abrirDesdeFila(m, 'entrada'));

      const btnSalida = document.createElement('button');
      btnSalida.className = 'boton boton--secundario';
      btnSalida.textContent = 'Salida';
      btnSalida.addEventListener('click', () => abrirDesdeFila(m, 'salida'));

      acciones.appendChild(btnEntrada);
      acciones.appendChild(btnSalida);
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
    contador.textContent = total === 1 ? '1 material' : `${total} materiales`;
  }

  // Rellena el desplegable de material del modal (para los botones de arriba).
  function rellenarSelectMateriales(materiales) {
    selectMaterial.innerHTML = '<option value="">Selecciona un material...</option>';
    materiales.forEach((m) => {
      const opcion = document.createElement('option');
      opcion.value = m.id_material;
      opcion.textContent = `${m.nombre_material} (disp: ${m.cantidad_disponible} ${m.unidad_medida})`;
      selectMaterial.appendChild(opcion);
    });
  }

  // ---------------------------------------------------------
  // ABRIR MODAL desde una fila concreta (material ya conocido).
  // Ocultamos el desplegable de material.
  // ---------------------------------------------------------
  function abrirDesdeFila(material, tipo) {
    prepararModal(tipo);
    campoSelectWrap.hidden = true;      // no hace falta elegir: ya sabemos cual
    campoIdHidden.value = material.id_material;
    infoMaterial.textContent =
      `${material.nombre_material} — Disponible: ${material.cantidad_disponible} ${material.unidad_medida}`;
    document.getElementById('ubicacion_almacen').value = material.ubicacion_almacen ?? '';
    modal.hidden = false;
  }

  // ---------------------------------------------------------
  // ABRIR MODAL desde los botones de arriba (material aun por elegir).
  // Mostramos el desplegable de material.
  // ---------------------------------------------------------
  function abrirGeneral(tipo) {
    prepararModal(tipo);
    campoSelectWrap.hidden = false;     // hay que elegir material
    campoIdHidden.value = '';
    selectMaterial.value = '';
    infoMaterial.textContent = '';
    modal.hidden = false;
  }

  // Ajustes comunes al abrir (titulo, boton, limpiar).
  function prepararModal(tipo) {
    limpiarErrores();
    formulario.reset();
    campoTipo.value = tipo;

    if (tipo === 'entrada') {
      modalTitulo.textContent = 'Registrar entrada';
      botonGuardar.textContent = 'Registrar entrada';
    } else {
      modalTitulo.textContent = 'Registrar salida';
      botonGuardar.textContent = 'Registrar salida';
    }
  }

  // Cuando eligen un material en el desplegable, mostramos su disponible.
  selectMaterial.addEventListener('change', () => {
    const id = selectMaterial.value;
    const material = materialesCache.find((m) => String(m.id_material) === String(id));
    if (material) {
      campoIdHidden.value = material.id_material;
      infoMaterial.textContent =
        `Disponible: ${material.cantidad_disponible} ${material.unidad_medida}`;
    } else {
      campoIdHidden.value = '';
      infoMaterial.textContent = '';
    }
  });

  function cerrarModal() {
    modal.hidden = true;
  }

  // ---------------------------------------------------------
  // Eventos.
  // ---------------------------------------------------------
  botonEntradaGeneral.addEventListener('click', () => abrirGeneral('entrada'));
  botonSalidaGeneral.addEventListener('click', () => abrirGeneral('salida'));

  modalCerrar.addEventListener('click', cerrarModal);
  botonCancelar.addEventListener('click', cerrarModal);

  modal.addEventListener('click', (evento) => {
    if (evento.target === modal) cerrarModal();
  });

  buscador.addEventListener('input', cargarStock);

  // ---------------------------------------------------------
  // GUARDAR el movimiento (entrada o salida).
  // ---------------------------------------------------------
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    limpiarErrores();

    const idMaterial = campoIdHidden.value;
    const tipo = campoTipo.value;

    // Si vino de los botones de arriba y no eligio material, avisamos.
    if (!idMaterial) {
      const span = document.getElementById('error-select_material');
      if (span) span.textContent = 'Debe seleccionar un material';
      return;
    }

    const datos = {
      cantidad: document.getElementById('cantidad').value,
      ubicacion_almacen: document.getElementById('ubicacion_almacen').value.trim() || null,
    };

    const respuesta = await api.post(`/stock/${idMaterial}/${tipo}`, datos);

    if (!respuesta) return;

    if (respuesta.success) {
      cerrarModal();
      cargarStock();
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

    if (error.code === 'STOCK_INSUFICIENTE') {
      if (errorGeneral) {
        errorGeneral.textContent = error.message;
        errorGeneral.hidden = false;
      }
      return;
    }

    if (errorGeneral) {
      errorGeneral.textContent = error.message || 'No se pudo registrar el movimiento.';
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
  montarLayout('stock');
  cargarStock();
});