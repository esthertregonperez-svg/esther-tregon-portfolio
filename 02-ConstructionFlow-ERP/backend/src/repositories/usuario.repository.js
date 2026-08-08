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
/**
 * Lista todos los usuarios del sistema.
 * Nunca incluye password_hash.
 */
export async function listarTodos() {
  const [filas] = await pool.query(
    `SELECT
       u.id_usuario,
       u.email,
       u.activo,
       u.ultimo_acceso,
       u.fecha_alta,
       r.nombre_rol,
       e.nombre    AS nombre_empleado,
       e.apellidos AS apellidos_empleado
     FROM usuario u
     INNER JOIN rol r ON u.id_rol = r.id_rol
     LEFT JOIN empleado e ON u.id_empleado = e.id_empleado
     ORDER BY r.nombre_rol, u.email`
  );

  return filas;
}

/**
 * Comprueba si un email ya existe, opcionalmente excluyendo un id.
 * Sirve para validar tanto al crear como al editar.
 */
export async function existeEmail(email, idExcluir = null) {
  const [filas] = await pool.query(
    `SELECT id_usuario FROM usuario
     WHERE email = ? AND id_usuario <> ?
     LIMIT 1`,
    [email, idExcluir ?? 0]
  );

  return filas.length > 0;
}

/**
 * Inserta un usuario y devuelve el registro completo ya creado.
 * Recibe el password ya hasheado; nunca hashea aqui.
 * El registro devuelto por buscarPorId no incluye password_hash.
 */
export async function crear(datos) {
  const [resultado] = await pool.query(
    `INSERT INTO usuario
       (id_rol, id_empleado, email, password_hash)
     VALUES (?, ?, ?, ?)`,
    [
      datos.id_rol,
      datos.id_empleado ?? null,
      datos.email,
      datos.password_hash
    ]
  );

  return buscarPorId(resultado.insertId);
}

/**
 * Cambia el rol de un usuario y devuelve el registro ya modificado.
 */
export async function cambiarRol(id, idRol) {
  await pool.query(
    'UPDATE usuario SET id_rol = ? WHERE id_usuario = ?',
    [idRol, id]
  );

  return buscarPorId(id);
}

/**
 * Baja logica (o reactivacion): fija el valor de activo.
 * No borra la fila, para conservar el historial asociado.
 */
export async function cambiarActivo(id, activo) {
  const [resultado] = await pool.query(
    'UPDATE usuario SET activo = ? WHERE id_usuario = ?',
    [activo ? 1 : 0, id]
  );

  return resultado.affectedRows > 0;
}