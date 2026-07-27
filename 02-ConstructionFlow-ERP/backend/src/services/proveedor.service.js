/**
 * Logica de negocio de proveedores.
 * Valida datos y aplica reglas antes de tocar el repositorio.
 */
import * as proveedorRepository from '../repositories/proveedor.repository.js';
import { AppError } from '../utils/AppError.js';

/**
 * Devuelve un listado paginado de proveedores.
 * Acepta un filtro de estado: 'activos' (defecto), 'baja' o 'todos'.
 */
export async function listar(opciones) {
  const page = Math.max(1, Number(opciones.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(opciones.limit) || 20));
  const search = opciones.search ?? '';
  const estado = opciones.estado ?? 'activos';

  const { items, total } = await proveedorRepository.listar({ page, limit, search, estado });

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
 * Devuelve un proveedor por id o lanza 404.
 */
export async function obtener(id) {
  const proveedor = await proveedorRepository.buscarPorId(id);
  if (!proveedor) {
    throw new AppError(404, 'RECURSO_NO_ENCONTRADO', 'No existe un proveedor con ese identificador');
  }
  return proveedor;
}

/**
 * Crea un proveedor tras validar los datos.
 */
export async function crear(datos) {
  validarDatos(datos);
  const existe = await proveedorRepository.existeCif(datos.cif);
  if (existe) {
    throw new AppError(409, 'VALOR_DUPLICADO', 'Ya existe un proveedor con ese CIF');
  }
  return proveedorRepository.crear(datos);
}

/**
 * Actualiza un proveedor existente.
 */
export async function actualizar(id, datos) {
  await obtener(id);
  validarDatos(datos);
  const cifDuplicado = await proveedorRepository.existeCif(datos.cif, id);
  if (cifDuplicado) {
    throw new AppError(409, 'VALOR_DUPLICADO', 'Ya existe otro proveedor con ese CIF');
  }
  return proveedorRepository.actualizar(id, datos);
}

/**
 * Valida los campos obligatorios y sus formatos.
 * Lanza AppError con detalle por campo si algo falla.
 */
function validarDatos(datos) {
  const errores = {};

  if (!datos.nombre_empresa || datos.nombre_empresa.trim() === '') {
    errores.nombre_empresa = 'El nombre de la empresa es obligatorio';
  }
  if (!datos.cif || datos.cif.trim() === '') {
    errores.cif = 'El CIF es obligatorio';
  }
  if (datos.email && !esEmailValido(datos.email)) {
    errores.email = 'El formato del email no es correcto';
  }

  if (Object.keys(errores).length > 0) {
    const error = new AppError(400, 'DATOS_INVALIDOS', 'Los datos enviados no son validos');
    error.fields = errores;
    throw error;
  }
}

function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}