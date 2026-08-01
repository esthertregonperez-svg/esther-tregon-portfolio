// frontend/js/materiales.js
// Logica de la pantalla de materiales.
// Listar (con filtro) + crear + editar. Tres desplegables: categoria, proveedor, unidad.
// Ademas: crear una categoria nueva al vuelo desde el formulario.

document.addEventListener('DOMContentLoaded', () => {

  // --- Referencias ---
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

  const campoId         = document.getElementById('id_material');
  const selectCategoria = document.getElementById('id_categoria_material');
  const selectProveedor = document.getElementById('id_proveedor');

  // Referencias del bloque "nueva categoria al vuelo".
  const botonNuevaCategoria    = document.getElementById('boton-nueva-categoria');
  const cajaNuevaCategoria     = document.getElementById('nueva-categoria-caja');
  const inputNuevaCategoria    = document.getElementById('nueva_categoria_nombre');
  const errorNuevaCategoria    = document.getElementById('error-nueva-categoria');
  const botonGuardarCategoria  = document.getElementById('boton-guardar-categoria');
  const botonCancelarCategoria = document.getElementById('boton-cancelar-categoria');

  const UNIDADES_LEGIBLES = {
    kg: 'kg', uds: 'uds', m: 'm', m2: 'm²', m3: 'm³',
    l: 'l', saco: 'saco', palet: 'palet',
  };

  function formatoEuros(valor) {
    const numero = Number(valor) || 0;
    return numero.toLocaleString('es-ES', {
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    }) + ' €';
  }

  // ---------------------------------------------------------
  // Rellenar desplegables (categorias y proveedores).
  // ---------------------------------------------------------
  async function cargarCategoriasEnSelect() {
    const respuesta = await api.get('/categorias-material');
    if (!respuesta || !respuesta.success) return;
    // Vaciamos y reconstruimos (util tras crear una nueva).
    selectCategoria.innerHTML = '<option value="">Selecciona una categoría...</option>';
    respuesta.data.items.forEach((cat) => {
      const opcion = document.createElement('option');
      opcion.value = cat.id_categoria_material;
      opcion.textContent = cat.nombre_categoria;
      selectCategoria.appendChild(opcion);
    });
  }

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
  // NUEVA CATEGORIA AL VUELO.
  // ---------------------------------------------------------
  function mostrarCajaCategoria() {
    errorNuevaCategoria.textContent = '';
    inputNuevaCategoria.value = '';
    cajaNuevaCategoria.hidden = false;
    inputNuevaCategoria.focus();
  }

  function ocultarCajaCategoria() {
    cajaNuevaCategoria.hidden = true;
    errorNuevaCategoria.textContent = '';
  }

  async function guardarNuevaCategoria() {
    errorNuevaCategoria.textContent = '';
    const nombre = inputNuevaCategoria.value.trim();

    if (nombre === '') {
      errorNuevaCategoria.textContent = 'Escribe un nombre para la categoría';
      return;
    }

    const respuesta = await api.post('/categorias-material', { nombre_categoria: nombre });
    if (!respuesta) return;

    if (!respuesta.success) {
      // Duplicado u otro error: mostramos el mensaje del backend.
      errorNuevaCategoria.textContent = respuesta.error.message || 'No se pudo crear la categoría';
      return;
    }

    // Exito: recargamos el desplegable y seleccionamos la nueva.
    await cargarCategoriasEnSelect();
    selectCategoria.value = respuesta.data.id_categoria_material;
    ocultarCajaCategoria();
  }

  botonNuevaCategoria.addEventListener('click', mostrarCajaCategoria);
  botonCancelarCategoria.addEventListener('click', ocultarCajaCategoria);
  botonGuardarCategoria.addEventListener('click', guardarNuevaCategoria);

  // ---------------------------------------------------------
  // LISTAR.
  // ---------------------------------------------------------
  async function cargarMateriales() {
    tablaCuerpo.innerHTML =
      '<tr class="tabla__vacia"><td colspan="8">Cargando materiales...</td></tr>';
    mensajeVacio.hidden = true;

    const params = new URLSearchParams();
    const search = buscador.value.trim();
    if (search) params.append('search', search);
    params.append('estado', filtroEstado.value);

    const respuesta = await api.get('/materiales?' + params.toString());
    if (!respuesta) return;

    if (!respuesta.success) {
      tablaCuerpo.innerHTML =
        '<tr class="tabla__vacia"><td colspan="8">No se pudieron cargar los materiales.</td></tr>';
      console.error('Error al listar materiales:', respuesta.error);
      return;
    }

    pintarTabla(respuesta.data.items);
    actualizarContador(respuesta.data.pagination.total);
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

      fila.appendChild(celda(m.nombre_material));
      fila.appendChild(celda(m.nombre_categoria));
      fila.appendChild(celda(m.nombre_proveedor));
      fila.appendChild(celda(UNIDADES_LEGIBLES[m.unidad_medida] ?? m.unidad_medida));
      fila.appendChild(celda(formatoEuros(m.precio_unitario)));
      fila.appendChild(celda(m.stock_minimo));
      fila.appendChild(celda(m.activo === 1 ? 'Alta' : 'Baja'));

      const acciones = document.createElement('td');
      acciones.className = 'tabla__acciones';
      const botonEditar = document.createElement('button');
      botonEditar.className = 'boton boton--secundario';
      botonEditar.textContent = 'Editar';
      botonEditar.addEventListener('click', () => abrirModalEditar(m));
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
    contador.textContent = total === 1 ? '1 material' : `${total} materiales`;
  }

  // ---------------------------------------------------------
  // MODAL material.
  // ---------------------------------------------------------
  function abrirModalNuevo() {
    modalTitulo.textContent = 'Nuevo material';
    formulario.reset();
    campoId.value = '';
    document.getElementById('activo').value = '1';
    ocultarCajaCategoria();
    limpiarErrores();
    modal.hidden = false;
  }

  function abrirModalEditar(m) {
    modalTitulo.textContent = 'Editar material';
    ocultarCajaCategoria();
    limpiarErrores();

    campoId.value = m.id_material;
    document.getElementById('nombre_material').value = m.nombre_material ?? '';
    selectCategoria.value = m.id_categoria_material;
    selectProveedor.value = m.id_proveedor;
    document.getElementById('unidad_medida').value = m.unidad_medida;
    document.getElementById('precio_unitario').value = m.precio_unitario ?? 0;
    document.getElementById('stock_minimo').value = m.stock_minimo ?? 0;
    document.getElementById('descripcion').value = m.descripcion ?? '';
    document.getElementById('activo').value = String(m.activo);

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

  buscador.addEventListener('input', cargarMateriales);
  filtroEstado.addEventListener('change', cargarMateriales);

  // ---------------------------------------------------------
  // GUARDAR material.
  // ---------------------------------------------------------
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    limpiarErrores();

    const datos = {
      nombre_material:        document.getElementById('nombre_material').value.trim(),
      id_categoria_material:  document.getElementById('id_categoria_material').value,
      id_proveedor:           document.getElementById('id_proveedor').value,
      unidad_medida:          document.getElementById('unidad_medida').value,
      precio_unitario:        document.getElementById('precio_unitario').value || 0,
      stock_minimo:           document.getElementById('stock_minimo').value || 0,
      descripcion:            document.getElementById('descripcion').value.trim(),
      activo:                 Number(document.getElementById('activo').value),
    };

    const id = campoId.value;

    const respuesta = id
      ? await api.put('/materiales/' + id, datos)
      : await api.post('/materiales', datos);

    if (!respuesta) return;

    if (respuesta.success) {
      cerrarModal();
      cargarMateriales();
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
      errorGeneral.textContent = error.message || 'No se pudo guardar el material.';
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
  montarLayout('materiales');
  cargarCategoriasEnSelect();
  cargarProveedoresEnSelect();
  cargarMateriales();
});