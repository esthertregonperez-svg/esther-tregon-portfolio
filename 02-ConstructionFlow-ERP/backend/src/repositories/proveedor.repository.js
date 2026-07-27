/**
 * Acceso a datos de proveedores.
 * Unica capa autorizada a ejecutar SQL sobre la tabla proveedor.
 */
import pool from '../config/database.js';

// Columnas que devolvemos siempre.
const CAMPOS = `
  id_proveedor, nombre_empresa, cif, telefono, email,
  direccion, persona_contacto, activo
`;

/**
 * Construye la condicion de estado segun el filtro pedido.
 * - 'activos' (por defecto): solo activo = 1
 * - 'baja': solo activo = 0
 * - 'todos': sin filtro de estado
 * Devuelve un fragmento SQL que se anade al WHERE.
 */
function condicionEstado(estado) {
  if (estado === 'baja') return 'AND activo = 0';
  if (estado === 'todos') return '';
  return 'AND activo = 1'; // por defecto, solo activos
}

/**
 * Lista proveedores con paginacion, busqueda y filtro de estado.
 */
export async function listar({ page, limit, search, estado }) {
  const offset = (page - 1) * limit;
  const filtro = `%${search}%`;
  const filtroEstado = condicionEstado(estado);

  const [items] = await pool.query(
    `SELECT ${CAMPOS}
     FROM proveedor
     WHERE (nombre_empresa LIKE ? OR cif LIKE ? OR persona_contacto LIKE ?)
       ${filtroEstado}
     ORDER BY nombre_empresa
     LIMIT ? OFFSET ?`,
    [filtro, filtro, filtro, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM proveedor
     WHERE (nombre_empresa LIKE ? OR cif LIKE ? OR persona_contacto LIKE ?)
       ${filtroEstado}`,
    [filtro, filtro, filtro]
  );

  return { items, total };
}

/**
 * Obtiene un proveedor por su identificador.
 */
export async function buscarPorId(id) {
  const [filas] = await pool.query(
    `SELECT ${CAMPOS}
     FROM proveedor
     WHERE id_proveedor = ?
     LIMIT 1`,
    [id]
  );
  return filas[0] ?? null;
}

/**
 * Comprueba si un CIF ya existe, opcionalmente excluyendo un id.
 * Sirve para validar tanto al crear como al editar.
 */
export async function existeCif(cif, idExcluir = null) {
  const [filas] = await pool.query(
    `SELECT id_proveedor FROM proveedor
     WHERE cif = ? AND id_proveedor <> ?
     LIMIT 1`,
    [cif, idExcluir ?? 0]
  );
  return filas.length > 0;
}

/**
 * Inserta un proveedor y devuelve el registro completo ya creado.
 */
export async function crear(datos) {
  const [resultado] = await pool.query(
    `INSERT INTO proveedor
       (nombre_empresa, cif, telefono, email, direccion, persona_contacto, activo)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      datos.nombre_empresa,
      datos.cif,
      datos.telefono ?? null,
      datos.email ?? null,
      datos.direccion ?? null,
      datos.persona_contacto ?? null,
      datos.activo ?? 1
    ]
  );
  return buscarPorId(resultado.insertId);
}

/**
 * Actualiza un proveedor y devuelve el registro ya modificado.
 * Incluye el campo activo, para poder cambiar el estado alta/baja.
 */
export async function actualizar(id, datos) {
  await pool.query(
    `UPDATE proveedor SET
       nombre_empresa = ?, cif = ?, telefono = ?, email = ?,
       direccion = ?, persona_contacto = ?, activo = ?
     WHERE id_proveedor = ?`,
    [
      datos.nombre_empresa,
      datos.cif,
      datos.telefono ?? null,
      datos.email ?? null,
      datos.direccion ?? null,
      datos.persona_contacto ?? null,
      datos.activo ?? 1,
      id
    ]
  );
  return buscarPorId(id);
}