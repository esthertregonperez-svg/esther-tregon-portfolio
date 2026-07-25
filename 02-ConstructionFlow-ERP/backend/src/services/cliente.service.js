/**
 * Logica de negocio de clientes.
 * Valida datos y aplica reglas antes de tocar el repositorio.
 */

import * as clienteRepository from '../repositories/cliente.repository.js';
import { AppError } from '../utils/AppError.js';

const TIPOS_VALIDOS = ['particular', 'empresa', 'administracion_publica'];

/**
 * Devuelve un listado paginado de clientes.
 */
export async function listar(opciones) {
  const page = Math.max(1, Number(opciones.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(opciones.limit) || 20));
  const search = opciones.search ?? '';

  const { items, total } = await clienteRepository.listar({ page, limit, search });

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
 * Devuelve un cliente por id o lanza 404.
 */
export async function obtener(id) {
  const cliente = await clienteRepository.buscarPorId(id);

  if (!cliente) {
    throw new AppError(404, 'RECURSO_NO_ENCONTRADO', 'No existe un cliente con ese identificador');
  }

  return cliente;
}

/**
 * Crea un cliente tras validar los datos.
 */
export async function crear(datos) {
  validarDatos(datos);

  const existe = await clienteRepository.existeCif(datos.dni_cif);
  if (existe) {
    throw new AppError(409, 'VALOR_DUPLICADO', 'Ya existe un cliente con ese CIF o DNI');
  }

  return clienteRepository.crear(datos);
}

/**
 * Actualiza un cliente existente.
 */
export async function actualizar(id, datos) {
  await obtener(id);

  validarDatos(datos);

  const cifDuplicado = await clienteRepository.existeCif(datos.dni_cif, id);
  if (cifDuplicado) {
    throw new AppError(409, 'VALOR_DUPLICADO', 'Ya existe otro cliente con ese CIF o DNI');
  }

  return clienteRepository.actualizar(id, datos);
}

/**
 * Da de baja un cliente (baja logica).
 */
export async function darDeBaja(id) {
  const dadoDeBaja = await clienteRepository.darDeBaja(id);

  if (!dadoDeBaja) {
    throw new AppError(404, 'RECURSO_NO_ENCONTRADO', 'No existe un cliente activo con ese identificador');
  }
}

/**
 * Valida los campos obligatorios y sus formatos.
 * Lanza AppError con detalle por campo si algo falla.
 */
function validarDatos(datos) {
  const errores = {};

  if (!datos.nombre || datos.nombre.trim() === '') {
    errores.nombre = 'El nombre es obligatorio';
  }

  if (!datos.dni_cif || datos.dni_cif.trim() === '') {
    errores.dni_cif = 'El DNI o CIF es obligatorio';
  }

  if (!datos.tipo_cliente || !TIPOS_VALIDOS.includes(datos.tipo_cliente)) {
    errores.tipo_cliente = 'El tipo de cliente no es valido';
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