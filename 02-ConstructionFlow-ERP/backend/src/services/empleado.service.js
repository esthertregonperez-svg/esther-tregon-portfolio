/**
 * Logica de negocio de empleados.
 * Valida datos y aplica reglas antes de tocar el repositorio.
 */
import * as empleadoRepository from '../repositories/empleado.repository.js';
import { AppError } from '../utils/AppError.js';

/**
 * Devuelve un listado paginado de empleados.
 */
export async function listar(opciones) {
  const page = Math.max(1, Number(opciones.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(opciones.limit) || 20));
  const search = opciones.search ?? '';
  const estado = opciones.estado ?? 'activos';

  const { items, total } = await empleadoRepository.listar({ page, limit, search, estado });

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
 * Devuelve un empleado por id o lanza 404.
 */
export async function obtener(id) {
  const empleado = await empleadoRepository.buscarPorId(id);
  if (!empleado) {
    throw new AppError(404, 'RECURSO_NO_ENCONTRADO', 'No existe un empleado con ese identificador');
  }
  return empleado;
}

/**
 * Crea un empleado tras validar los datos.
 */
export async function crear(datos) {
  validarDatos(datos);
  const existe = await empleadoRepository.existeDni(datos.dni);
  if (existe) {
    throw new AppError(409, 'VALOR_DUPLICADO', 'Ya existe un empleado con ese DNI');
  }
  return empleadoRepository.crear(datos);
}

/**
 * Actualiza un empleado existente.
 */
export async function actualizar(id, datos) {
  await obtener(id);
  validarDatos(datos);
  const dniDuplicado = await empleadoRepository.existeDni(datos.dni, id);
  if (dniDuplicado) {
    throw new AppError(409, 'VALOR_DUPLICADO', 'Ya existe otro empleado con ese DNI');
  }
  return empleadoRepository.actualizar(id, datos);
}

/**
 * Valida los campos obligatorios y sus formatos.
 * Lanza AppError con detalle por campo si algo falla.
 */
function validarDatos(datos) {
  const errores = {};

  if (!datos.id_categoria_empleado) {
    errores.id_categoria_empleado = 'Debe seleccionar una categoria';
  }
  if (!datos.nombre || datos.nombre.trim() === '') {
    errores.nombre = 'El nombre es obligatorio';
  }
  if (!datos.apellidos || datos.apellidos.trim() === '') {
    errores.apellidos = 'Los apellidos son obligatorios';
  }
  if (!datos.dni || datos.dni.trim() === '') {
    errores.dni = 'El DNI es obligatorio';
  }
  if (!datos.fecha_alta) {
    errores.fecha_alta = 'La fecha de alta es obligatoria';
  }
  if (datos.email && !esEmailValido(datos.email)) {
    errores.email = 'El formato del email no es correcto';
  }
  if (datos.salario_base !== undefined && datos.salario_base !== null && datos.salario_base !== '') {
    const salario = Number(datos.salario_base);
    if (Number.isNaN(salario) || salario < 0) {
      errores.salario_base = 'El salario debe ser un numero positivo';
    }
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