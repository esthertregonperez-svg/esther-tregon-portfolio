/**
 * Acceso a datos de categorias de material.
 * Solo lectura: las categorias se gestionan directamente en la BD.
 */
import pool from '../config/database.js';

/**
 * Devuelve todas las categorias de material, ordenadas por nombre.
 */
export async function listar() {
  const [items] = await pool.query(
    `SELECT id_categoria_material, nombre_categoria, descripcion
     FROM categoria_material
     ORDER BY nombre_categoria`
  );
  return items;
}