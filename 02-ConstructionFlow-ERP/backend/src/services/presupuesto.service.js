/**
 * Logica de negocio de presupuestos (cabecera).
 * Valida datos y aplica reglas antes de tocar el repositorio.
 */
import * as presupuestoRepository from '../repositories/presupuesto.repository.js';
import { AppError } from '../utils/AppError.js';

const ESTADOS_VALIDOS = ['pendiente', 'aceptado', 'rechazado'];

/**
 * Devuelve un listado paginado de presupuestos.
 */
export async function listar(opciones) {
  const page = Math.max(1, Number(opciones.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(opciones.limit) || 20));
  const search = opciones.search ?? '';

  const { items, total } = await presupuestoRepository.listar({ page, limit, search });

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
 * Devuelve un presupuesto por id o lanza 404.
 */
export async function obtener(id) {
  const presupuesto = await presupuestoRepository.buscarPorId(id);
  if (!presupuesto) {
    throw new AppError(404, 'RECURSO_NO_ENCONTRADO', 'No existe un presupuesto con ese identificador');
  }
  return presupuesto;
}

/**
 * Crea un presupuesto tras validar los datos.
 */
export async function crear(datos) {
  validarDatos(datos);
  return presupuestoRepository.crear(datos);
}

/**
 * Actualiza un presupuesto existente.
 */
export async function actualizar(id, datos) {
  await obtener(id);
  validarDatos(datos);
  return presupuestoRepository.actualizar(id, datos);
}

/**
 * Valida los campos obligatorios y sus formatos.
 * Lanza AppError con detalle por campo si algo falla.
 */
function validarDatos(datos) {
  const errores = {};

  if (!datos.id_cliente) {
    errores.id_cliente = 'Debe seleccionar un cliente';
  }
  if (!datos.fecha_presupuesto) {
    errores.fecha_presupuesto = 'La fecha del presupuesto es obligatoria';
  }
  if (!datos.estado || !ESTADOS_VALIDOS.includes(datos.estado)) {
    errores.estado = 'El estado del presupuesto no es valido';
  }

  if (Object.keys(errores).length > 0) {
    const error = new AppError(400, 'DATOS_INVALIDOS', 'Los datos enviados no son validos');
    error.fields = errores;
    throw error;
  }
}