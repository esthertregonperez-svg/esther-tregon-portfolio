/**
 * Acceso a datos de categorias de material.
 * Listar y crear (las categorias tambien pueden crearse al vuelo
 * desde el formulario de material).
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

/**
 * Comprueba si ya existe una categoria con ese nombre.
 * El nombre es UNIQUE en la tabla, asi que evitamos duplicados.
 */
export async function existeNombre(nombre) {
  const [filas] = await pool.query(
    `SELECT id_categoria_material FROM categoria_material
     WHERE nombre_categoria = ?
     LIMIT 1`,
    [nombre]
  );
  return filas.length > 0;
}

/**
 * Inserta una categoria y devuelve el registro ya creado.
 */
export async function crear(datos) {
  const [resultado] = await pool.query(
    `INSERT INTO categoria_material (nombre_categoria, descripcion)
     VALUES (?, ?)`,
    [datos.nombre_categoria, datos.descripcion ?? null]
  );
  const [filas] = await pool.query(
    `SELECT id_categoria_material, nombre_categoria, descripcion
     FROM categoria_material
     WHERE id_categoria_material = ?`,
    [resultado.insertId]
  );
  return filas[0];
}