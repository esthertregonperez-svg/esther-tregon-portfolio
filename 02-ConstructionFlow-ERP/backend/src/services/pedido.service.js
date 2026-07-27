/**
 * Logica de negocio de pedidos de compra (cabecera).
 * Valida datos y aplica reglas antes de tocar el repositorio.
 */
import * as pedidoRepository from '../repositories/pedido.repository.js';
import { AppError } from '../utils/AppError.js';

const ESTADOS_VALIDOS = ['pendiente', 'recibido', 'cancelado'];

/**
 * Devuelve un listado paginado de pedidos.
 */
export async function listar(opciones) {
  const page = Math.max(1, Number(opciones.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(opciones.limit) || 20));
  const search = opciones.search ?? '';

  const { items, total } = await pedidoRepository.listar({ page, limit, search });

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * Devuelve un pedido por id o lanza 404.
 */
export async function obtener(id) {
  const pedido = await pedidoRepository.buscarPorId(id);
  if (!pedido) {
    throw new AppError(404, 'RECURSO_NO_ENCONTRADO', 'No existe un pedido con ese identificador');
  }
  return pedido;
}

/**
 * Crea un pedido tras validar los datos.
 */
export async function crear(datos) {
  validarDatos(datos);
  return pedidoRepository.crear(datos);
}

/**
 * Actualiza un pedido existente.
 */
export async function actualizar(id, datos) {
  await obtener(id);
  validarDatos(datos);
  return pedidoRepository.actualizar(id, datos);
}

/**
 * Valida los campos obligatorios y sus formatos.
 * Lanza AppError con detalle por campo si algo falla.
 */
function validarDatos(datos) {
  const errores = {};

  if (!datos.id_proveedor) {
    errores.id_proveedor = 'Debe seleccionar un proveedor';
  }
  if (!datos.fecha_pedido) {
    errores.fecha_pedido = 'La fecha del pedido es obligatoria';
  }
  if (!datos.estado || !ESTADOS_VALIDOS.includes(datos.estado)) {
    errores.estado = 'El estado del pedido no es valido';
  }

  if (Object.keys(errores).length > 0) {
    const error = new AppError(400, 'DATOS_INVALIDOS', 'Los datos enviados no son validos');
    error.fields = errores;
    throw error;
  }
}