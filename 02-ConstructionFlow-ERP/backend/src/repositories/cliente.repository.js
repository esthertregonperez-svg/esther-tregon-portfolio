/**
 * Acceso a datos de clientes.
 * Unica capa autorizada a ejecutar SQL sobre la tabla cliente.
 */

import pool from '../config/database.js';

/**
 * Lista clientes activos con paginacion y busqueda.
 */
export async function listar({ page, limit, search }) {
  const offset = (page - 1) * limit;
  const filtro = `%${search}%`;

  const [items] = await pool.query(
    `SELECT id_cliente, nombre, razon_social, dni_cif,
            telefono, email, direccion, tipo_cliente, fecha_alta
     FROM cliente
     WHERE activo = 1
       AND (nombre LIKE ? OR razon_social LIKE ? OR dni_cif LIKE ?)
     ORDER BY nombre
     LIMIT ? OFFSET ?`,
    [filtro, filtro, filtro, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM cliente
     WHERE activo = 1
       AND (nombre LIKE ? OR razon_social LIKE ? OR dni_cif LIKE ?)`,
    [filtro, filtro, filtro]
  );

  return { items, total };
}

/**
 * Obtiene un cliente activo por su identificador.
 */
export async function buscarPorId(id) {
  const [filas] = await pool.query(
    `SELECT id_cliente, nombre, razon_social, dni_cif,
            telefono, email, direccion, tipo_cliente, fecha_alta
     FROM cliente
     WHERE id_cliente = ? AND activo = 1
     LIMIT 1`,
    [id]
  );

  return filas[0] ?? null;
}

/**
 * Comprueba si un CIF ya existe, opcionalmente excluyendo un id.
 * Sirve para validar tanto al crear como al editar.
 */
export async function existeCif(dniCif, idExcluir = null) {
  const [filas] = await pool.query(
    `SELECT id_cliente FROM cliente
     WHERE dni_cif = ? AND id_cliente <> ?
     LIMIT 1`,
    [dniCif, idExcluir ?? 0]
  );

  return filas.length > 0;
}

/**
 * Inserta un cliente y devuelve el registro completo ya creado.
 */
export async function crear(datos) {
  const [resultado] = await pool.query(
    `INSERT INTO cliente
       (nombre, razon_social, dni_cif, telefono, email, direccion, tipo_cliente)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      datos.nombre,
      datos.razon_social ?? null,
      datos.dni_cif,
      datos.telefono ?? null,
      datos.email ?? null,
      datos.direccion ?? null,
      datos.tipo_cliente
    ]
  );

  return buscarPorId(resultado.insertId);
}

/**
 * Actualiza un cliente y devuelve el registro ya modificado.
 */
export async function actualizar(id, datos) {
  await pool.query(
    `UPDATE cliente SET
       nombre = ?, razon_social = ?, dni_cif = ?,
       telefono = ?, email = ?, direccion = ?, tipo_cliente = ?
     WHERE id_cliente = ? AND activo = 1`,
    [
      datos.nombre,
      datos.razon_social ?? null,
      datos.dni_cif,
      datos.telefono ?? null,
      datos.email ?? null,
      datos.direccion ?? null,
      datos.tipo_cliente,
      id
    ]
  );

  return buscarPorId(id);
}

/**
 * Baja logica: marca el cliente como inactivo.
 * No borra la fila, para conservar obras y facturas asociadas.
 */
export async function darDeBaja(id) {
  const [resultado] = await pool.query(
    'UPDATE cliente SET activo = 0 WHERE id_cliente = ? AND activo = 1',
    [id]
  );

  return resultado.affectedRows > 0;
}