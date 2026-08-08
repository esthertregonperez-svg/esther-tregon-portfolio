/**
 * Logica de negocio de usuarios.
 * Valida datos, hashea contrasenas y aplica reglas antes de tocar el repositorio.
 * Regla de oro: password_hash nunca sale de aqui hacia la API.
 */

import bcrypt from 'bcrypt';

import * as usuarioRepository from '../repositories/usuario.repository.js';
import { AppError } from '../utils/AppError.js';

const RONDAS_BCRYPT = 10;
const ROLES_VALIDOS = [1, 2, 3, 4, 5, 6, 7];

/**
 * Devuelve el listado completo de usuarios (sin hash).
 */
export async function listar() {
  return usuarioRepository.listarTodos();
}

/**
 * Devuelve un usuario por id o lanza 404.
 */
export async function obtener(id) {
  const usuario = await usuarioRepository.buscarPorId(id);

  if (!usuario) {
    throw new AppError(404, 'RECURSO_NO_ENCONTRADO', 'No existe un usuario con ese identificador');
  }

  return usuario;
}

/**
 * Crea un usuario tras validar los datos y comprobar que el email es unico.
 * Hashea la contrasena; devuelve el registro ya creado (sin hash).
 */
export async function crear(datos) {
  validarDatosCreacion(datos);

  const existe = await usuarioRepository.existeEmail(datos.email);
  if (existe) {
    throw new AppError(409, 'VALOR_DUPLICADO', 'Ya existe un usuario con ese email');
  }

  const passwordHash = await bcrypt.hash(datos.password, RONDAS_BCRYPT);

  return usuarioRepository.crear({
    id_rol: datos.id_rol,
    id_empleado: null,
    email: datos.email,
    password_hash: passwordHash
  });
}

/**
 * Resetea la contrasena de un usuario (accion de admin, sin pedir la actual).
 */
export async function resetearPassword(id, passwordNueva) {
  await obtener(id);

  if (!passwordNueva || passwordNueva.length < 8) {
    const error = new AppError(400, 'DATOS_INVALIDOS', 'Los datos enviados no son validos');
    error.fields = { password: 'La contrasena debe tener al menos 8 caracteres' };
    throw error;
  }

  const passwordHash = await bcrypt.hash(passwordNueva, RONDAS_BCRYPT);
  await usuarioRepository.actualizarPasswordHash(id, passwordHash);
}

/**
 * Cambia el rol de un usuario existente y devuelve el registro actualizado.
 */
export async function cambiarRol(id, idRol) {
  await obtener(id);

  if (!esRolValido(idRol)) {
    const error = new AppError(400, 'DATOS_INVALIDOS', 'Los datos enviados no son validos');
    error.fields = { id_rol: 'El rol indicado no es valido' };
    throw error;
  }

  return usuarioRepository.cambiarRol(id, idRol);
}

/**
 * Baja logica o reactivacion de un usuario.
 * Preparada para el futuro filtro activos/baja/todos.
 */
export async function cambiarActivo(id, activo) {
  await obtener(id);
  await usuarioRepository.cambiarActivo(id, activo);
}

/**
 * Valida los campos obligatorios al crear un usuario.
 * Lanza AppError con detalle por campo si algo falla.
 */
function validarDatosCreacion(datos) {
  const errores = {};

  if (!datos.email || datos.email.trim() === '') {
    errores.email = 'El email es obligatorio';
  } else if (!esEmailValido(datos.email)) {
    errores.email = 'El formato del email no es correcto';
  }

  if (!datos.password || datos.password.length < 8) {
    errores.password = 'La contrasena debe tener al menos 8 caracteres';
  }

  if (!esRolValido(datos.id_rol)) {
    errores.id_rol = 'El rol indicado no es valido';
  }

  if (Object.keys(errores).length > 0) {
    const error = new AppError(400, 'DATOS_INVALIDOS', 'Los datos enviados no son validos');
    error.fields = errores;
    throw error;
  }
}

function esRolValido(idRol) {
  return ROLES_VALIDOS.includes(Number(idRol));
}

function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}