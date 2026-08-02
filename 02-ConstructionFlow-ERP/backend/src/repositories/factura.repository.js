/**
 * Acceso a datos de facturas (solo cabecera).
 * Unica capa autorizada a ejecutar SQL sobre la tabla factura.
 *
 * NOTA: base_imponible y total_factura NO se escriben aqui: los calculan
 * los triggers de MySQL a partir de las lineas (linea_factura). La API
 * solo los LEE. El iva (porcentaje) si lo elige el usuario.
 */
import pool from '../config/database.js';

// Traemos el nombre del cliente y el de la obra via JOIN.
// Ambos INNER JOIN: en factura, id_cliente e id_obra son NOT NULL
// (una factura siempre tiene cliente y obra).
const SELECT_FACTURA = `
  SELECT f.id_factura, f.id_cliente, c.nombre AS nombre_cliente,
         f.id_obra, o.nombre_obra,
         f.fecha_factura, f.estado, f.iva,
         f.base_imponible, f.total_factura
  FROM factura f
  JOIN cliente c ON c.id_cliente = f.id_cliente
  JOIN obra o ON o.id_obra = f.id_obra
`;

/**
 * Lista facturas con paginacion y busqueda por cliente u obra.
 */
export async function listar({ page, limit, search }) {
  const offset = (page - 1) * limit;
  const filtro = `%${search}%`;

  const [items] = await pool.query(
    `${SELECT_FACTURA}
     WHERE (c.nombre LIKE ? OR o.nombre_obra LIKE ?)
     ORDER BY f.fecha_factura DESC
     LIMIT ? OFFSET ?`,
    [filtro, filtro, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM factura f
     JOIN cliente c ON c.id_cliente = f.id_cliente
     JOIN obra o ON o.id_obra = f.id_obra
     WHERE (c.nombre LIKE ? OR o.nombre_obra LIKE ?)`,
    [filtro, filtro]
  );

  return { items, total };
}

/**
 * Obtiene una factura por su identificador.
 */
export async function buscarPorId(id) {
  const [filas] = await pool.query(
    `${SELECT_FACTURA}
     WHERE f.id_factura = ?
     LIMIT 1`,
    [id]
  );
  return filas[0] ?? null;
}

/**
 * Inserta una factura (cabecera) y devuelve el registro ya creado.
 * No se tocan base_imponible ni total_factura: los mantienen los triggers.
 */
export async function crear(datos) {
  const [resultado] = await pool.query(
    `INSERT INTO factura
       (id_cliente, id_obra, fecha_factura, estado, iva)
     VALUES (?, ?, ?, ?, ?)`,
    [
      datos.id_cliente,
      datos.id_obra,
      datos.fecha_factura,
      datos.estado ?? 'emitida',
      datos.iva ?? 21.00
    ]
  );
  return buscarPorId(resultado.insertId);
}

/**
 * Actualiza la cabecera de una factura y devuelve el registro modificado.
 * No se tocan base_imponible ni total_factura: los mantienen los triggers.
 */
export async function actualizar(id, datos) {
  await pool.query(
    `UPDATE factura SET
       id_cliente = ?, id_obra = ?, fecha_factura = ?,
       estado = ?, iva = ?
     WHERE id_factura = ?`,
    [
      datos.id_cliente,
      datos.id_obra,
      datos.fecha_factura,
      datos.estado ?? 'emitida',
      datos.iva ?? 21.00,
      id
    ]
  );
  return buscarPorId(id);
}