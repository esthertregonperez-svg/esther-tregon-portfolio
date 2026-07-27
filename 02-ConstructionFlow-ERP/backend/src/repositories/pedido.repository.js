/**
 * Acceso a datos de pedidos de compra (solo cabecera).
 * Unica capa autorizada a ejecutar SQL sobre la tabla pedido_compra.
 *
 * NOTA: importe_total NO se escribe aqui: lo calcula un trigger de MySQL
 * a partir de las lineas del pedido.
 */
import pool from '../config/database.js';

// Traemos tambien el nombre del proveedor via JOIN.
const SELECT_PEDIDO = `
  SELECT ped.id_pedido, ped.id_proveedor, pr.nombre_empresa AS nombre_proveedor,
         ped.fecha_pedido, ped.fecha_recepcion, ped.estado, ped.importe_total
  FROM pedido_compra ped
  JOIN proveedor pr ON pr.id_proveedor = ped.id_proveedor
`;

/**
 * Lista pedidos con paginacion y busqueda por proveedor.
 */
export async function listar({ page, limit, search }) {
  const offset = (page - 1) * limit;
  const filtro = `%${search}%`;

  const [items] = await pool.query(
    `${SELECT_PEDIDO}
     WHERE pr.nombre_empresa LIKE ?
     ORDER BY ped.fecha_pedido DESC
     LIMIT ? OFFSET ?`,
    [filtro, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM pedido_compra ped
     JOIN proveedor pr ON pr.id_proveedor = ped.id_proveedor
     WHERE pr.nombre_empresa LIKE ?`,
    [filtro]
  );

  return { items, total };
}

/**
 * Obtiene un pedido por su identificador.
 */
export async function buscarPorId(id) {
  const [filas] = await pool.query(
    `${SELECT_PEDIDO}
     WHERE ped.id_pedido = ?
     LIMIT 1`,
    [id]
  );
  return filas[0] ?? null;
}

/**
 * Inserta un pedido (cabecera) y devuelve el registro ya creado.
 * No se toca importe_total: lo mantiene el trigger.
 */
export async function crear(datos) {
  const [resultado] = await pool.query(
    `INSERT INTO pedido_compra
       (id_proveedor, fecha_pedido, fecha_recepcion, estado)
     VALUES (?, ?, ?, ?)`,
    [
      datos.id_proveedor,
      datos.fecha_pedido,
      datos.fecha_recepcion ?? null,
      datos.estado ?? 'pendiente'
    ]
  );
  return buscarPorId(resultado.insertId);
}

/**
 * Actualiza la cabecera de un pedido y devuelve el registro modificado.
 * No se toca importe_total: lo mantiene el trigger.
 */
export async function actualizar(id, datos) {
  await pool.query(
    `UPDATE pedido_compra SET
       id_proveedor = ?, fecha_pedido = ?, fecha_recepcion = ?, estado = ?
     WHERE id_pedido = ?`,
    [
      datos.id_proveedor,
      datos.fecha_pedido,
      datos.fecha_recepcion ?? null,
      datos.estado ?? 'pendiente',
      id
    ]
  );
  return buscarPorId(id);
}