/**
 * Acceso a datos de categorias de empleado (categorias laborales).
 * Solo lectura: se usan para rellenar el desplegable en el formulario de empleado.
 */
import pool from '../config/database.js';

export async function listar() {
  const [items] = await pool.query(
    `SELECT id_categoria_empleado, nombre_categoria, descripcion
     FROM categoria_empleado
     ORDER BY nombre_categoria`
  );
  return items;
}