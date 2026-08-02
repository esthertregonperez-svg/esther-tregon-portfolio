/**
 * Logica de negocio de facturas (cabecera).
 * Valida datos y aplica reglas antes de tocar el repositorio.
 */
import * as facturaRepository from '../repositories/factura.repository.js';
import { AppError } from '../utils/AppError.js';

const ESTADOS_VALIDOS = ['emitida', 'pendiente', 'cobrada'];

/**
 * Devuelve un listado paginado de facturas.
 */
export async function listar(opciones) {
  const page = Math.max(1, Number(opciones.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(opciones.limit) || 20));
  const search = opciones.search ?? '';

  const { items, total } = await facturaRepository.listar({ page, limit, search });

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
 * Devuelve una factura por id o lanza 404.
 */
export async function obtener(id) {
  const factura = await facturaRepository.buscarPorId(id);
  if (!factura) {
    throw new AppError(404, 'RECURSO_NO_ENCONTRADO', 'No existe una factura con ese identificador');
  }
  return factura;
}

/**
 * Crea una factura tras validar los datos.
 */
export async function crear(datos) {
  validarDatos(datos);
  return facturaRepository.crear(datos);
}

/**
 * Actualiza una factura existente.
 */
export async function actualizar(id, datos) {
  await obtener(id);
  validarDatos(datos);
  return facturaRepository.actualizar(id, datos);
}

/**
 * Valida los campos obligatorios y sus formatos.
 * Lanza AppError con detalle por campo si algo falla.
 *
 * OJO: base_imponible y total_factura NO se validan ni se aceptan aqui;
 * los calculan los triggers a partir de las lineas. Solo validamos lo
 * que escribe el usuario en la cabecera.
 */
function validarDatos(datos) {
  const errores = {};

  if (!datos.id_cliente) {
    errores.id_cliente = 'Debe seleccionar un cliente';
  }
  if (!datos.id_obra) {
    errores.id_obra = 'Debe seleccionar una obra';
  }
  if (!datos.fecha_factura) {
    errores.fecha_factura = 'La fecha de la factura es obligatoria';
  }
  if (!datos.estado || !ESTADOS_VALIDOS.includes(datos.estado)) {
    errores.estado = 'El estado de la factura no es valido';
  }

  // El iva es opcional (si no viene, el repo aplica 21 por defecto).
  // Pero si viene, debe ser un numero entre 0 y 100.
  if (datos.iva !== undefined && datos.iva !== null && datos.iva !== '') {
    const iva = Number(datos.iva);
    if (Number.isNaN(iva) || iva < 0 || iva > 100) {
      errores.iva = 'El IVA debe ser un numero entre 0 y 100';
    }
  }

  if (Object.keys(errores).length > 0) {
    const error = new AppError(400, 'DATOS_INVALIDOS', 'Los datos enviados no son validos');
    error.fields = errores;
    throw error;
  }
}