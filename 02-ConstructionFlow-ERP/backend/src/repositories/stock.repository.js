/**
 * Acceso a datos de stock.
 * Unica capa autorizada a ejecutar SQL sobre la tabla stock.
 *
 * Para LISTAR usamos la vista vista_materiales_stock, que ya junta
 * material + categoria + proveedor + stock y muestra 0 si un material
 * todavia no tiene fila de stock.
 */
import pool from '../config/database.js';

/**
 * Lista todos los materiales con su stock, usando la vista.
 * Permite buscar por nombre de material, categoria o proveedor.
 */
export async function listar({ page, limit, search }) {
  const offset = (page - 1) * limit;
  const filtro = `%${search}%`;

  const [items] = await pool.query(
    `SELECT id_material, nombre_material, categoria, proveedor,
            unidad_medida, precio_unitario, stock_minimo,
            cantidad_disponible, ubicacion_almacen
     FROM vista_materiales_stock
     WHERE (nombre_material LIKE ? OR categoria LIKE ? OR proveedor LIKE ?)
     ORDER BY nombre_material
     LIMIT ? OFFSET ?`,
    [filtro, filtro, filtro, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM vista_materiales_stock
     WHERE (nombre_material LIKE ? OR categoria LIKE ? OR proveedor LIKE ?)`,
    [filtro, filtro, filtro]
  );

  return { items, total };
}

/**
 * Devuelve la fila de stock de un material (o null si aun no tiene).
 * Sirve para saber cuanto hay antes de mover.
 */
export async function buscarPorMaterial(idMaterial) {
  const [filas] = await pool.query(
    `SELECT id_stock, id_material, cantidad_disponible, ubicacion_almacen
     FROM stock
     WHERE id_material = ?
     LIMIT 1`,
    [idMaterial]
  );
  return filas[0] ?? null;
}

/**
 * Devuelve la fila de la vista para un material concreto,
 * para responder con los datos completos tras un movimiento.
 */
export async function buscarEnVista(idMaterial) {
  const [filas] = await pool.query(
    `SELECT id_material, nombre_material, categoria, proveedor,
            unidad_medida, precio_unitario, stock_minimo,
            cantidad_disponible, ubicacion_almacen
     FROM vista_materiales_stock
     WHERE id_material = ?
     LIMIT 1`,
    [idMaterial]
  );
  return filas[0] ?? null;
}

/**
 * Fija la cantidad disponible de un material (upsert).
 * Si el material ya tiene fila de stock, la actualiza.
 * Si no la tiene, la crea con esa cantidad.
 * La logica de sumar/restar se hace en el servicio; aqui solo guardamos
 * el valor final ya calculado.
 */
export async function fijarCantidad(idMaterial, nuevaCantidad, ubicacion) {
  const existente = await buscarPorMaterial(idMaterial);

  if (existente) {
    // Si no nos pasan ubicacion, conservamos la que tenia.
    await pool.query(
      `UPDATE stock
       SET cantidad_disponible = ?,
           ubicacion_almacen = ?
       WHERE id_material = ?`,
      [nuevaCantidad, ubicacion ?? existente.ubicacion_almacen, idMaterial]
    );
  } else {
    await pool.query(
      `INSERT INTO stock (id_material, cantidad_disponible, ubicacion_almacen)
       VALUES (?, ?, ?)`,
      [idMaterial, nuevaCantidad, ubicacion ?? null]
    );
  }

  return buscarEnVista(idMaterial);
}