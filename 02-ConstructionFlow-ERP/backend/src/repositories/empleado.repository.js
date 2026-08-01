/**
 * Acceso a datos de empleados.
 * Unica capa autorizada a ejecutar SQL sobre la tabla empleado.
 *
 * Para LISTAR usamos la vista vista_empleados_categoria (trae el nombre
 * de la categoria). Para obtener uno concreto leemos la tabla directa,
 * porque necesitamos el id_categoria_empleado para el formulario de edicion.
 */
import pool from '../config/database.js';

/**
 * Condicion de estado segun el filtro pedido.
 */
function condicionEstado(estado) {
  if (estado === 'baja') return 'AND activo = 0';
  if (estado === 'todos') return '';
  return 'AND activo = 1';
}

/**
 * Lista empleados con paginacion, busqueda y filtro de estado.
 * Lee de la vista para traer el nombre de la categoria.
 */
export async function listar({ page, limit, search, estado }) {
  const offset = (page - 1) * limit;
  const filtro = `%${search}%`;
  const filtroEstado = condicionEstado(estado);

  const [items] = await pool.query(
    `SELECT id_empleado, nombre, apellidos, nombre_categoria,
            dni, telefono, email, fecha_alta, salario_base, activo
     FROM vista_empleados_categoria
     WHERE (nombre LIKE ? OR apellidos LIKE ? OR dni LIKE ?)
       ${filtroEstado}
     ORDER BY apellidos, nombre
     LIMIT ? OFFSET ?`,
    [filtro, filtro, filtro, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM vista_empleados_categoria
     WHERE (nombre LIKE ? OR apellidos LIKE ? OR dni LIKE ?)
       ${filtroEstado}`,
    [filtro, filtro, filtro]
  );

  return { items, total };
}

/**
 * Obtiene un empleado por id (de la tabla directa, con id_categoria_empleado).
 */
export async function buscarPorId(id) {
  const [filas] = await pool.query(
    `SELECT id_empleado, id_categoria_empleado, nombre, apellidos, dni,
            telefono, email, direccion, fecha_alta, salario_base, activo
     FROM empleado
     WHERE id_empleado = ?
     LIMIT 1`,
    [id]
  );
  return filas[0] ?? null;
}

/**
 * Comprueba si un DNI ya existe, opcionalmente excluyendo un id.
 */
export async function existeDni(dni, idExcluir = null) {
  const [filas] = await pool.query(
    `SELECT id_empleado FROM empleado
     WHERE dni = ? AND id_empleado <> ?
     LIMIT 1`,
    [dni, idExcluir ?? 0]
  );
  return filas.length > 0;
}

/**
 * Inserta un empleado y devuelve el registro ya creado.
 */
export async function crear(datos) {
  const [resultado] = await pool.query(
    `INSERT INTO empleado
       (id_categoria_empleado, nombre, apellidos, dni, telefono,
        email, direccion, fecha_alta, salario_base, activo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      datos.id_categoria_empleado,
      datos.nombre,
      datos.apellidos,
      datos.dni,
      datos.telefono ?? null,
      datos.email ?? null,
      datos.direccion ?? null,
      datos.fecha_alta,
      datos.salario_base ?? 0,
      datos.activo ?? 1
    ]
  );
  return buscarPorId(resultado.insertId);
}

/**
 * Actualiza un empleado y devuelve el registro ya modificado.
 * Incluye id_categoria_empleado (para ascensos) y activo (alta/baja).
 */
export async function actualizar(id, datos) {
  await pool.query(
    `UPDATE empleado SET
       id_categoria_empleado = ?, nombre = ?, apellidos = ?, dni = ?,
       telefono = ?, email = ?, direccion = ?, fecha_alta = ?,
       salario_base = ?, activo = ?
     WHERE id_empleado = ?`,
    [
      datos.id_categoria_empleado,
      datos.nombre,
      datos.apellidos,
      datos.dni,
      datos.telefono ?? null,
      datos.email ?? null,
      datos.direccion ?? null,
      datos.fecha_alta,
      datos.salario_base ?? 0,
      datos.activo ?? 1,
      id
    ]
  );
  return buscarPorId(id);
}