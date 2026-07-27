/**
 * Acceso a datos de materiales.
 * Unica capa autorizada a ejecutar SQL sobre la tabla material.
 */
import pool from '../config/database.js';

// Traemos el nombre de la categoria y del proveedor via JOIN,
// para mostrarlos en la tabla sin consultas extra.
const SELECT_MATERIAL = `
  SELECT m.id_material, m.id_categoria_material, cat.nombre_categoria,
         m.id_proveedor, p.nombre_empresa AS nombre_proveedor,
         m.nombre_material, m.descripcion, m.unidad_medida,
         m.precio_unitario, m.stock_minimo, m.activo
  FROM material m
  JOIN categoria_material cat ON cat.id_categoria_material = m.id_categoria_material
  JOIN proveedor p ON p.id_proveedor = m.id_proveedor
`;

/**
 * Construye la condicion de estado segun el filtro pedido.
 */
function condicionEstado(estado) {
  if (estado === 'baja') return 'AND m.activo = 0';
  if (estado === 'todos') return '';
  return 'AND m.activo = 1';
}

/**
 * Lista materiales con paginacion, busqueda y filtro de estado.
 */
export async function listar({ page, limit, search, estado }) {
  const offset = (page - 1) * limit;
  const filtro = `%${search}%`;
  const filtroEstado = condicionEstado(estado);

  const [items] = await pool.query(
    `${SELECT_MATERIAL}
     WHERE (m.nombre_material LIKE ? OR cat.nombre_categoria LIKE ? OR p.nombre_empresa LIKE ?)
       ${filtroEstado}
     ORDER BY m.nombre_material
     LIMIT ? OFFSET ?`,
    [filtro, filtro, filtro, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM material m
     JOIN categoria_material cat ON cat.id_categoria_material = m.id_categoria_material
     JOIN proveedor p ON p.id_proveedor = m.id_proveedor
     WHERE (m.nombre_material LIKE ? OR cat.nombre_categoria LIKE ? OR p.nombre_empresa LIKE ?)
       ${filtroEstado}`,
    [filtro, filtro, filtro]
  );

  return { items, total };
}

/**
 * Obtiene un material por su identificador.
 */
export async function buscarPorId(id) {
  const [filas] = await pool.query(
    `${SELECT_MATERIAL}
     WHERE m.id_material = ?
     LIMIT 1`,
    [id]
  );
  return filas[0] ?? null;
}

/**
 * Inserta un material y devuelve el registro completo ya creado.
 */
export async function crear(datos) {
  const [resultado] = await pool.query(
    `INSERT INTO material
       (id_categoria_material, id_proveedor, nombre_material, descripcion,
        unidad_medida, precio_unitario, stock_minimo, activo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      datos.id_categoria_material,
      datos.id_proveedor,
      datos.nombre_material,
      datos.descripcion ?? null,
      datos.unidad_medida,
      datos.precio_unitario ?? 0,
      datos.stock_minimo ?? 0,
      datos.activo ?? 1
    ]
  );
  return buscarPorId(resultado.insertId);
}

/**
 * Actualiza un material y devuelve el registro ya modificado.
 */
export async function actualizar(id, datos) {
  await pool.query(
    `UPDATE material SET
       id_categoria_material = ?, id_proveedor = ?, nombre_material = ?,
       descripcion = ?, unidad_medida = ?, precio_unitario = ?,
       stock_minimo = ?, activo = ?
     WHERE id_material = ?`,
    [
      datos.id_categoria_material,
      datos.id_proveedor,
      datos.nombre_material,
      datos.descripcion ?? null,
      datos.unidad_medida,
      datos.precio_unitario ?? 0,
      datos.stock_minimo ?? 0,
      datos.activo ?? 1,
      id
    ]
  );
  return buscarPorId(id);
}