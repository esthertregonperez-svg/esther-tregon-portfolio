/**
 * Acceso a datos de presupuestos (solo cabecera).
 * Unica capa autorizada a ejecutar SQL sobre la tabla presupuesto.
 *
 * NOTA: importe_total NO se escribe aqui: lo calcula un trigger de MySQL
 * a partir de las lineas del presupuesto.
 */
import pool from '../config/database.js';

// Traemos tambien el nombre del cliente y, si la hay, el de la obra.
// LEFT JOIN en obra porque id_obra puede ser NULL (presupuesto sin obra).
const SELECT_PRESUPUESTO = `
  SELECT p.id_presupuesto, p.id_cliente, c.nombre AS nombre_cliente,
         p.id_obra, o.nombre_obra,
         p.fecha_presupuesto, p.estado, p.importe_total, p.observaciones
  FROM presupuesto p
  JOIN cliente c ON c.id_cliente = p.id_cliente
  LEFT JOIN obra o ON o.id_obra = p.id_obra
`;

/**
 * Lista presupuestos con paginacion y busqueda por cliente u obra.
 */
export async function listar({ page, limit, search }) {
  const offset = (page - 1) * limit;
  const filtro = `%${search}%`;

  const [items] = await pool.query(
    `${SELECT_PRESUPUESTO}
     WHERE (c.nombre LIKE ? OR o.nombre_obra LIKE ?)
     ORDER BY p.fecha_presupuesto DESC
     LIMIT ? OFFSET ?`,
    [filtro, filtro, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM presupuesto p
     JOIN cliente c ON c.id_cliente = p.id_cliente
     LEFT JOIN obra o ON o.id_obra = p.id_obra
     WHERE (c.nombre LIKE ? OR o.nombre_obra LIKE ?)`,
    [filtro, filtro]
  );

  return { items, total };
}

/**
 * Obtiene un presupuesto por su identificador.
 */
export async function buscarPorId(id) {
  const [filas] = await pool.query(
    `${SELECT_PRESUPUESTO}
     WHERE p.id_presupuesto = ?
     LIMIT 1`,
    [id]
  );
  return filas[0] ?? null;
}

/**
 * Inserta un presupuesto (cabecera) y devuelve el registro ya creado.
 * No se toca importe_total: lo mantiene el trigger.
 */
export async function crear(datos) {
  const [resultado] = await pool.query(
    `INSERT INTO presupuesto
       (id_cliente, id_obra, fecha_presupuesto, estado, observaciones)
     VALUES (?, ?, ?, ?, ?)`,
    [
      datos.id_cliente,
      datos.id_obra ?? null,
      datos.fecha_presupuesto,
      datos.estado ?? 'pendiente',
      datos.observaciones ?? null
    ]
  );
  return buscarPorId(resultado.insertId);
}

/**
 * Actualiza la cabecera de un presupuesto y devuelve el registro modificado.
 * No se toca importe_total: lo mantiene el trigger.
 */
export async function actualizar(id, datos) {
  await pool.query(
    `UPDATE presupuesto SET
       id_cliente = ?, id_obra = ?, fecha_presupuesto = ?,
       estado = ?, observaciones = ?
     WHERE id_presupuesto = ?`,
    [
      datos.id_cliente,
      datos.id_obra ?? null,
      datos.fecha_presupuesto,
      datos.estado ?? 'pendiente',
      datos.observaciones ?? null,
      id
    ]
  );
  return buscarPorId(id);
}