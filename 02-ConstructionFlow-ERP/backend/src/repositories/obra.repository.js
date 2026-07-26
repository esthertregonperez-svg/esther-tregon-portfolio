/**
 * Acceso a datos de obras.
 * Unica capa autorizada a ejecutar SQL sobre la tabla obra.
 */
import pool from '../config/database.js';

// Columnas de obra que devolvemos siempre, mas el nombre del cliente
// (via JOIN) para poder mostrarlo en la tabla sin otra consulta.
const SELECT_OBRA = `
  SELECT o.id_obra, o.id_cliente, c.nombre AS nombre_cliente,
         o.nombre_obra, o.direccion_obra,
         o.fecha_inicio, o.fecha_fin_prevista, o.fecha_fin_real,
         o.estado, o.descripcion, o.presupuesto_total_estimado
  FROM obra o
  JOIN cliente c ON c.id_cliente = o.id_cliente
`;

/**
 * Lista obras con paginacion y busqueda por nombre de obra o de cliente.
 */
export async function listar({ page, limit, search }) {
  const offset = (page - 1) * limit;
  const filtro = `%${search}%`;

  const [items] = await pool.query(
    `${SELECT_OBRA}
     WHERE (o.nombre_obra LIKE ? OR c.nombre LIKE ? OR o.direccion_obra LIKE ?)
     ORDER BY o.fecha_inicio DESC
     LIMIT ? OFFSET ?`,
    [filtro, filtro, filtro, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM obra o
     JOIN cliente c ON c.id_cliente = o.id_cliente
     WHERE (o.nombre_obra LIKE ? OR c.nombre LIKE ? OR o.direccion_obra LIKE ?)`,
    [filtro, filtro, filtro]
  );

  return { items, total };
}

/**
 * Obtiene una obra por su identificador.
 */
export async function buscarPorId(id) {
  const [filas] = await pool.query(
    `${SELECT_OBRA}
     WHERE o.id_obra = ?
     LIMIT 1`,
    [id]
  );
  return filas[0] ?? null;
}

/**
 * Inserta una obra y devuelve el registro completo ya creado.
 */
export async function crear(datos) {
  const [resultado] = await pool.query(
    `INSERT INTO obra
       (id_cliente, nombre_obra, direccion_obra, fecha_inicio,
        fecha_fin_prevista, fecha_fin_real, estado, descripcion,
        presupuesto_total_estimado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      datos.id_cliente,
      datos.nombre_obra,
      datos.direccion_obra,
      datos.fecha_inicio,
      datos.fecha_fin_prevista ?? null,
      datos.fecha_fin_real ?? null,
      datos.estado ?? 'pendiente',
      datos.descripcion ?? null,
      datos.presupuesto_total_estimado ?? 0
    ]
  );
  return buscarPorId(resultado.insertId);
}

/**
 * Actualiza una obra y devuelve el registro ya modificado.
 */
export async function actualizar(id, datos) {
  await pool.query(
    `UPDATE obra SET
       id_cliente = ?, nombre_obra = ?, direccion_obra = ?, fecha_inicio = ?,
       fecha_fin_prevista = ?, fecha_fin_real = ?, estado = ?,
       descripcion = ?, presupuesto_total_estimado = ?
     WHERE id_obra = ?`,
    [
      datos.id_cliente,
      datos.nombre_obra,
      datos.direccion_obra,
      datos.fecha_inicio,
      datos.fecha_fin_prevista ?? null,
      datos.fecha_fin_real ?? null,
      datos.estado ?? 'pendiente',
      datos.descripcion ?? null,
      datos.presupuesto_total_estimado ?? 0,
      id
    ]
  );
  return buscarPorId(id);
}