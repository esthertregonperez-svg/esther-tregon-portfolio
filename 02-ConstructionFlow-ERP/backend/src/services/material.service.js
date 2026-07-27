/**
 * Logica de negocio de materiales.
 * Valida datos y aplica reglas antes de tocar el repositorio.
 */
import * as materialRepository from '../repositories/material.repository.js';
import { AppError } from '../utils/AppError.js';

const UNIDADES_VALIDAS = ['kg', 'uds', 'm', 'm2', 'm3', 'l', 'saco', 'palet'];

/**
 * Devuelve un listado paginado de materiales.
 */
export async function listar(opciones) {
  const page = Math.max(1, Number(opciones.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(opciones.limit) || 20));
  const search = opciones.search ?? '';
  const estado = opciones.estado ?? 'activos';

  const { items, total } = await materialRepository.listar({ page, limit, search, estado });

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
 * Devuelve un material por id o lanza 404.
 */
export async function obtener(id) {
  const material = await materialRepository.buscarPorId(id);
  if (!material) {
    throw new AppError(404, 'RECURSO_NO_ENCONTRADO', 'No existe un material con ese identificador');
  }
  return material;
}

/**
 * Crea un material tras validar los datos.
 */
export async function crear(datos) {
  validarDatos(datos);
  return materialRepository.crear(datos);
}

/**
 * Actualiza un material existente.
 */
export async function actualizar(id, datos) {
  await obtener(id);
  validarDatos(datos);
  return materialRepository.actualizar(id, datos);
}

/**
 * Valida los campos obligatorios y sus formatos.
 * Lanza AppError con detalle por campo si algo falla.
 */
function validarDatos(datos) {
  const errores = {};

  if (!datos.id_categoria_material) {
    errores.id_categoria_material = 'Debe seleccionar una categoria';
  }
  if (!datos.id_proveedor) {
    errores.id_proveedor = 'Debe seleccionar un proveedor';
  }
  if (!datos.nombre_material || datos.nombre_material.trim() === '') {
    errores.nombre_material = 'El nombre del material es obligatorio';
  }
  if (!datos.unidad_medida || !UNIDADES_VALIDAS.includes(datos.unidad_medida)) {
    errores.unidad_medida = 'La unidad de medida no es valida';
  }
  if (datos.precio_unitario !== undefined && datos.precio_unitario !== null && datos.precio_unitario !== '') {
    const precio = Number(datos.precio_unitario);
    if (Number.isNaN(precio) || precio < 0) {
      errores.precio_unitario = 'El precio debe ser un numero positivo';
    }
  }
  if (datos.stock_minimo !== undefined && datos.stock_minimo !== null && datos.stock_minimo !== '') {
    const minimo = Number(datos.stock_minimo);
    if (Number.isNaN(minimo) || minimo < 0) {
      errores.stock_minimo = 'El stock minimo debe ser un numero positivo';
    }
  }

  if (Object.keys(errores).length > 0) {
    const error = new AppError(400, 'DATOS_INVALIDOS', 'Los datos enviados no son validos');
    error.fields = errores;
    throw error;
  }
}