/**
 * Acceso a datos de usuarios.
 * Unica capa autorizada a ejecutar SQL sobre las tablas usuario y rol.
 */

import pool from '../config/database.js';

/**
 * Busca un usuario por email incluyendo el hash de su contrasena.
 * Uso exclusivo del proceso de login.
 */
export async function buscarPorEmailConHash(email) {
  const [filas] = await pool.query(
    `SELECT
       u.id_usuario,
       u.email,
       u.password_hash,
       u.activo,
       u.id_empleado,
       r.id_rol,
       r.nombre_rol
     FROM usuario u
     INNER JOIN rol r ON u.id_rol = r.id_rol
     WHERE u.email = ?
     LIMIT 1`,
    [email]
  );

  return filas[0] ?? null;
}

/**
 * Obtiene un usuario por su identificador, sin el hash.
 * Uso general en el resto de la aplicacion.
 */
export async function buscarPorId(idUsuario) {
  const [filas] = await pool.query(
    `SELECT
       u.id_usuario,
       u.email,
       u.activo,
       u.id_empleado,
       u.ultimo_acceso,
       u.fecha_alta,
       r.id_rol,
       r.nombre_rol,
       e.nombre     AS nombre_empleado,
       e.apellidos  AS apellidos_empleado
     FROM usuario u
     INNER JOIN rol r ON u.id_rol = r.id_rol
     LEFT JOIN empleado e ON u.id_empleado = e.id_empleado
     WHERE u.id_usuario = ?
     LIMIT 1`,
    [idUsuario]
  );

  return filas[0] ?? null;
}

/**
 * Registra la fecha del ultimo acceso correcto.
 */
export async function actualizarUltimoAcceso(idUsuario) {
  await pool.query(
    'UPDATE usuario SET ultimo_acceso = NOW() WHERE id_usuario = ?',
    [idUsuario]
  );
}

/**
 * Sustituye el hash de la contrasena de un usuario.
 */
export async function actualizarPasswordHash(idUsuario, passwordHash) {
  await pool.query(
    'UPDATE usuario SET password_hash = ? WHERE id_usuario = ?',
    [passwordHash, idUsuario]
  );
}