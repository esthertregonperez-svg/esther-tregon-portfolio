// frontend/js/empleados.js
// Logica de la pantalla de empleados.
// Listar (con filtro de estado) + crear + editar (incluye cambio de categoria = ascenso).
// DNI unico. Sin contrasenas (eso va en el modulo de usuarios).

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

  const campoId         = document.getElementById('id_empleado');
  const selectCategoria = document.getElementById('id_categoria_empleado');

  function formatoEuros(valor) {
    const numero = Number(valor) || 0;
    return numero.toLocaleString('es-ES', {
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    }) + ' €';
  }

  function soloFecha(fechaIso) {
    if (!fechaIso) return '';
    return fechaIso.substring(0, 10);
  }

  // ---------------------------------------------------------
  // Rellenar el desplegable de categorias laborales.
  // ---------------------------------------------------------
  async function cargarCategoriasEnSelect() {
    const respuesta = await api.get('/categorias-empleado');
    if (!respuesta || !respuesta.success) return;
    respuesta.data.items.forEach((cat) => {
      const opcion = document.createElement('option');
      opcion.value = cat.id_categoria_empleado;
      opcion.textContent = cat.nombre_categoria;
      selectCategoria.appendChild(opcion);
    });
  }

  // ---------------------------------------------------------
  // LISTAR.
  // ---------------------------------------------------------
  async function cargarEmpleados() {
    tablaCuerpo.innerHTML =
      '<tr class="tabla__vacia"><td colspan="8">Cargando empleados...</td></tr>';
    mensajeVacio.hidden = true;

    const params = new URLSearchParams();
    const search = buscador.value.trim();
    if (search) params.append('search', search);
    params.append('estado', filtroEstado.value);

    const respuesta = await api.get('/empleados?' + params.toString());
    if (!respuesta) return;

    if (!respuesta.success) {
      tablaCuerpo.innerHTML =
        '<tr class="tabla__vacia"><td colspan="8">No se pudieron cargar los empleados.</td></tr>';
      console.error('Error al listar empleados:', respuesta.error);
      return;
    }

    pintarTabla(respuesta.data.items);
    actualizarContador(respuesta.data.pagination.total);
  }

  function pintarTabla(empleados) {
    tablaCuerpo.innerHTML = '';

    if (empleados.length === 0) {
      mensajeVacio.hidden = false;
      return;
    }
    mensajeVacio.hidden = true;

    empleados.forEach((e) => {
      const fila = document.createElement('tr');

      fila.appendChild(celda(e.nombre));
      fila.appendChild(celda(e.apellidos));
      fila.appendChild(celda(e.dni));
      fila.appendChild(celda(e.nombre_categoria));
      fila.appendChild(celda(e.telefono));
      fila.appendChild(celda(formatoEuros(e.salario_base)));
      fila.appendChild(celda(e.activo === 1 ? 'Alta' : 'Baja'));

      const acciones = document.createElement('td');
      acciones.className = 'tabla__acciones';
      const botonEditar = document.createElement('button');
      botonEditar.className = 'boton boton--secundario';
      botonEditar.textContent = 'Editar';
      botonEditar.addEventListener('click', () => abrirModalEditar(e));
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
    contador.textContent = total === 1 ? '1 empleado' : `${total} empleados`;
  }

  // ---------------------------------------------------------
  // MODAL.
  // ---------------------------------------------------------
  function abrirModalNuevo() {
    modalTitulo.textContent = 'Nuevo empleado';
    formulario.reset();
    campoId.value = '';
    document.getElementById('activo').value = '1';
    limpiarErrores();
    modal.hidden = false;
  }

  // El empleado que llega de la tabla (vista) no trae id_categoria_empleado,
  // asi que lo pedimos al backend por id para poder seleccionar su categoria.
  async function abrirModalEditar(empleadoLista) {
    modalTitulo.textContent = 'Editar empleado';
    limpiarErrores();

    const respuesta = await api.get('/empleados/' + empleadoLista.id_empleado);
    if (!respuesta || !respuesta.success) {
      console.error('No se pudo cargar el empleado para editar');
      return;
    }
    const e = respuesta.data;

    campoId.value = e.id_empleado;
    document.getElementById('nombre').value = e.nombre ?? '';
    document.getElementById('apellidos').value = e.apellidos ?? '';
    document.getElementById('dni').value = e.dni ?? '';
    selectCategoria.value = e.id_categoria_empleado;
    document.getElementById('fecha_alta').value = soloFecha(e.fecha_alta);
    document.getElementById('salario_base').value = e.salario_base ?? 0;
    document.getElementById('telefono').value = e.telefono ?? '';
    document.getElementById('email').value = e.email ?? '';
    document.getElementById('direccion').value = e.direccion ?? '';
    document.getElementById('activo').value = String(e.activo);

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

  buscador.addEventListener('input', cargarEmpleados);
  filtroEstado.addEventListener('change', cargarEmpleados);

  // ---------------------------------------------------------
  // GUARDAR.
  // ---------------------------------------------------------
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    limpiarErrores();

    const datos = {
      nombre:                 document.getElementById('nombre').value.trim(),
      apellidos:              document.getElementById('apellidos').value.trim(),
      dni:                    document.getElementById('dni').value.trim(),
      id_categoria_empleado:  document.getElementById('id_categoria_empleado').value,
      fecha_alta:             document.getElementById('fecha_alta').value,
      salario_base:           document.getElementById('salario_base').value || 0,
      telefono:               document.getElementById('telefono').value.trim(),
      email:                  document.getElementById('email').value.trim(),
      direccion:              document.getElementById('direccion').value.trim(),
      activo:                 Number(document.getElementById('activo').value),
    };

    const id = campoId.value;

    const respuesta = id
      ? await api.put('/empleados/' + id, datos)
      : await api.post('/empleados', datos);

    if (!respuesta) return;

    if (respuesta.success) {
      cerrarModal();
      cargarEmpleados();
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
      const span = document.getElementById('error-dni');
      if (span) span.textContent = error.message;
      return;
    }

    if (errorGeneral) {
      errorGeneral.textContent = error.message || 'No se pudo guardar el empleado.';
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
  montarLayout('empleados');
  cargarCategoriasEnSelect();
  cargarEmpleados();
});