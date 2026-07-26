/**
 * Logica de negocio de obras.
 * Valida datos y aplica reglas antes de tocar el repositorio.
 */
import * as obraRepository from '../repositories/obra.repository.js';
import { AppError } from '../utils/AppError.js';

const ESTADOS_VALIDOS = ['pendiente', 'en_ejecucion', 'finalizada', 'cancelada'];

/**
 * Devuelve un listado paginado de obras.
 */
export async function listar(opciones) {
  const page = Math.max(1, Number(opciones.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(opciones.limit) || 20));
  const search = opciones.search ?? '';

  const { items, total } = await obraRepository.listar({ page, limit, search });

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
 * Devuelve una obra por id o lanza 404.
 */
export async function obtener(id) {
  const obra = await obraRepository.buscarPorId(id);
  if (!obra) {
    throw new AppError(404, 'RECURSO_NO_ENCONTRADO', 'No existe una obra con ese identificador');
  }
  return obra;
}

/**
 * Crea una obra tras validar los datos.
 */
export async function crear(datos) {
  validarDatos(datos);
  return obraRepository.crear(datos);
}

/**
 * Actualiza una obra existente.
 */
export async function actualizar(id, datos) {
  await obtener(id);
  validarDatos(datos);
  return obraRepository.actualizar(id, datos);
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
  if (!datos.nombre_obra || datos.nombre_obra.trim() === '') {
    errores.nombre_obra = 'El nombre de la obra es obligatorio';
  }
  if (!datos.direccion_obra || datos.direccion_obra.trim() === '') {
    errores.direccion_obra = 'La direccion es obligatoria';
  }
  if (!datos.fecha_inicio) {
    errores.fecha_inicio = 'La fecha de inicio es obligatoria';
  }
  if (!datos.estado || !ESTADOS_VALIDOS.includes(datos.estado)) {
    errores.estado = 'El estado de la obra no es valido';
  }
  if (datos.presupuesto_total_estimado !== undefined &&
      datos.presupuesto_total_estimado !== null &&
      datos.presupuesto_total_estimado !== '') {
    const importe = Number(datos.presupuesto_total_estimado);
    if (Number.isNaN(importe) || importe < 0) {
      errores.presupuesto_total_estimado = 'El presupuesto debe ser un numero positivo';
    }
  }

  if (Object.keys(errores).length > 0) {
    const error = new AppError(400, 'DATOS_INVALIDOS', 'Los datos enviados no son validos');
    error.fields = errores;
    throw error;
  }
}