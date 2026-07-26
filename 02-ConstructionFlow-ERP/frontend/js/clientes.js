// frontend/js/clientes.js
// Logica de la pantalla de clientes.
// ENTREGA 1: listar clientes + abrir/cerrar el modal.
// ENTREGA 2: crear cliente (guardar) con manejo de errores.

// Esperamos a que todo el HTML este cargado antes de tocar elementos.
document.addEventListener('DOMContentLoaded', () => {

  // --- Referencias a los elementos del HTML (por sus id) ---
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

  // Traduce el valor guardado en BD a un texto legible para el usuario.
  const TIPOS_LEGIBLES = {
    particular: 'Particular',
    empresa: 'Empresa',
    administracion_publica: 'Administración pública',
  };

  // ---------------------------------------------------------
  // LISTAR: pide los clientes al backend y los pinta en la tabla.
  // ---------------------------------------------------------
  async function cargarClientes(search = '') {
    // Mostramos un aviso de "cargando" mientras llega la respuesta.
    tablaCuerpo.innerHTML =
      '<tr class="tabla__vacia"><td colspan="6">Cargando clientes...</td></tr>';
    mensajeVacio.hidden = true;

    // Si hay texto de busqueda, lo mandamos como query param.
    const endpoint = search
      ? `/clientes?search=${encodeURIComponent(search)}`
      : '/clientes';

    const respuesta = await api.get(endpoint);

    // api.js devuelve undefined si hubo un 401 (ya redirige al login).
    if (!respuesta) return;

    // El backend responde {success, error} si algo fue mal.
    if (!respuesta.success) {
      tablaCuerpo.innerHTML =
        '<tr class="tabla__vacia"><td colspan="6">No se pudieron cargar los clientes.</td></tr>';
      console.error('Error al listar clientes:', respuesta.error);
      return;
    }

    // OJO: los clientes vienen en data.items, y el total en data.pagination.total.
    const clientes = respuesta.data.items;
    const total = respuesta.data.pagination.total;

    pintarTabla(clientes);
    actualizarContador(total);
  }

  // Dibuja una fila por cada cliente. Si no hay ninguno, muestra el aviso.
  function pintarTabla(clientes) {
    tablaCuerpo.innerHTML = ''; // limpiamos lo anterior

    if (clientes.length === 0) {
      mensajeVacio.hidden = false;
      return;
    }
    mensajeVacio.hidden = true;

    clientes.forEach((cliente) => {
      const fila = document.createElement('tr');

      // Creamos cada celda con textContent (seguro frente a caracteres raros).
      fila.appendChild(celda(cliente.nombre));
      fila.appendChild(celda(cliente.dni_cif));
      fila.appendChild(celda(TIPOS_LEGIBLES[cliente.tipo_cliente] ?? cliente.tipo_cliente));
      fila.appendChild(celda(cliente.telefono ?? '—'));
      fila.appendChild(celda(cliente.email ?? '—'));

      // Columna de acciones: de momento vacia. En la Entrega 3 meteremos
      // los botones Editar y Baja (usaran cliente.id_cliente).
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

  // Escribe cuantos clientes hay bajo el titulo.
  function actualizarContador(total) {
    if (!contador) return;
    contador.textContent =
      total === 1 ? '1 cliente' : `${total} clientes`;
  }

  // ---------------------------------------------------------
  // MODAL: abrir y cerrar.
  // ---------------------------------------------------------
  function abrirModal() {
    modalTitulo.textContent = 'Nuevo cliente';
    formulario.reset();               // limpia los campos por si quedaron datos
    limpiarErrores();                 // limpia mensajes de error de intentos previos
    modal.hidden = false;             // tu HTML oculta el modal con el atributo hidden
  }

  function cerrarModal() {
    modal.hidden = true;
  }

  // ---------------------------------------------------------
  // Conexion de eventos (quien reacciona a cada clic).
  // ---------------------------------------------------------
  botonNuevo.addEventListener('click', abrirModal);
  modalCerrar.addEventListener('click', cerrarModal);
  botonCancelar.addEventListener('click', cerrarModal);

  // Cerrar tambien al hacer clic en el fondo oscuro (fuera de la caja blanca).
  modal.addEventListener('click', (evento) => {
    if (evento.target === modal) cerrarModal();
  });

  // Buscador: al escribir, recargamos la lista filtrada.
  if (buscador) {
    buscador.addEventListener('input', () => {
      cargarClientes(buscador.value.trim());
    });
  }

  // ---------------------------------------------------------
  // GUARDAR: al enviar el formulario, creamos el cliente.
  // ---------------------------------------------------------
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();     // evita que el navegador recargue la pagina
    limpiarErrores();            // borra mensajes de error de intentos anteriores

    // Recogemos lo que hay en el formulario, con los mismos nombres
    // que espera el backend (nombre, dni_cif, tipo_cliente, etc.).
    const datos = {
      nombre:        document.getElementById('nombre').value.trim(),
      razon_social:  document.getElementById('razon_social').value.trim(),
      dni_cif:       document.getElementById('dni_cif').value.trim(),
      tipo_cliente:  document.getElementById('tipo_cliente').value,
      telefono:      document.getElementById('telefono').value.trim(),
      email:         document.getElementById('email').value.trim(),
      direccion:     document.getElementById('direccion').value.trim(),
    };

    // Enviamos al backend. POST /clientes = crear.
    const respuesta = await api.post('/clientes', datos);

    if (!respuesta) return; // 401: api.js ya redirige al login

    // Si todo fue bien: cerramos el modal y refrescamos la lista.
    if (respuesta.success) {
      cerrarModal();
      cargarClientes();   // vuelve a pedir la lista, ya con el cliente nuevo
      return;
    }

    // Si el backend rechazo los datos, mostramos el error.
    mostrarError(respuesta.error);
  });

  // Muestra el error devuelto por el backend.
  // Aprovecha los codigos que ya definimos en el servicio.
  function mostrarError(error) {
    const errorGeneral = document.getElementById('error-general');

    // Caso 1: datos invalidos con detalle por campo (nombre, dni_cif...).
    if (error.code === 'DATOS_INVALIDOS' && error.fields) {
      for (const campo in error.fields) {
        const span = document.getElementById('error-' + campo);
        if (span) span.textContent = error.fields[campo];
      }
      return;
    }

    // Caso 2: CIF duplicado. Lo mostramos bajo el campo CIF/DNI.
    if (error.code === 'VALOR_DUPLICADO') {
      const span = document.getElementById('error-dni_cif');
      if (span) span.textContent = error.message;
      return;
    }

    // Cualquier otro error: mensaje general arriba.
    if (errorGeneral) {
      errorGeneral.textContent = error.message || 'No se pudo guardar el cliente.';
      errorGeneral.hidden = false;
    }
  }

  // Borra todos los mensajes de error del formulario antes de reintentar.
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
  // Arranque: montamos el menu y pedimos los clientes.
  // ---------------------------------------------------------
  montarLayout('clientes');
  cargarClientes();
});