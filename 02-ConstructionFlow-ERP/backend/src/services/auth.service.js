/**
 * Logica de negocio de autenticacion.
 * No conoce HTTP: recibe datos, devuelve datos o lanza AppError.
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import * as usuarioRepository from '../repositories/usuario.repository.js';
import { obtenerPermisos } from '../config/permisos.js';
import { AppError } from '../utils/AppError.js';

const RONDAS_BCRYPT = 10;

/**
 * Valida las credenciales y devuelve el token de sesion.
 */
export async function iniciarSesion(email, password) {
  if (!email || !password) {
    throw new AppError(400, 'DATOS_INVALIDOS', 'El email y la contrasena son obligatorios');
  }

  const usuario = await usuarioRepository.buscarPorEmailConHash(email);

  if (!usuario) {
    throw new AppError(401, 'CREDENCIALES_INVALIDAS', 'Email o contrasena incorrectos');
  }

  const passwordCorrecta = await bcrypt.compare(password, usuario.password_hash);

  if (!passwordCorrecta) {
    throw new AppError(401, 'CREDENCIALES_INVALIDAS', 'Email o contrasena incorrectos');
  }

  if (!usuario.activo) {
    throw new AppError(403, 'USUARIO_INACTIVO', 'Esta cuenta esta desactivada');
  }

  await usuarioRepository.actualizarUltimoAcceso(usuario.id_usuario);

  const token = generarToken(usuario);

  return {
    token,
    expiresIn: 28800,
    usuario: {
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      rol: usuario.nombre_rol,
      id_empleado: usuario.id_empleado
    },
    permisos: obtenerPermisos(usuario.nombre_rol)
  };
}

/**
 * Genera el token firmado a partir de los datos del usuario.
 */
function generarToken(usuario) {
  return jwt.sign(
    {
      sub: usuario.id_usuario,
      rol: usuario.nombre_rol
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

/**
 * Cambia la contrasena del usuario autenticado.
 */
export async function cambiarPassword(idUsuario, passwordActual, passwordNueva) {
  if (!passwordActual || !passwordNueva) {
    throw new AppError(400, 'DATOS_INVALIDOS', 'Debes indicar la contrasena actual y la nueva');
  }

  if (passwordNueva.length < 8) {
    throw new AppError(400, 'DATOS_INVALIDOS', 'La nueva contrasena debe tener al menos 8 caracteres');
  }

  const usuario = await usuarioRepository.buscarPorId(idUsuario);

  if (!usuario) {
    throw new AppError(404, 'RECURSO_NO_ENCONTRADO', 'Usuario no encontrado');
  }

  const usuarioConHash = await usuarioRepository.buscarPorEmailConHash(usuario.email);
  const actualCorrecta = await bcrypt.compare(passwordActual, usuarioConHash.password_hash);

  if (!actualCorrecta) {
    throw new AppError(401, 'CREDENCIALES_INVALIDAS', 'La contrasena actual no es correcta');
  }

  const nuevoHash = await bcrypt.hash(passwordNueva, RONDAS_BCRYPT);
  await usuarioRepository.actualizarPasswordHash(idUsuario, nuevoHash);
}