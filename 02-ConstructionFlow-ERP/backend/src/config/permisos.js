/**
 * Matriz de permisos del sistema.
 * Traduccion literal de docs/matriz-permisos.md
 *
 * Regla de denegacion por defecto: lo que no aparece aqui,
 * esta prohibido.
 */

export const ACCIONES = {
  VER: 'ver',
  CREAR: 'crear',
  EDITAR: 'editar',
  ELIMINAR: 'eliminar'
};

const { VER, CREAR, EDITAR, ELIMINAR } = ACCIONES;

const TODO = [VER, CREAR, EDITAR, ELIMINAR];
const LECTURA = [VER];
const SIN_BORRAR = [VER, CREAR, EDITAR];

export const PERMISOS = {
  administrador: {
    clientes: TODO,
    obras: TODO,
    asignaciones: TODO,
    presupuestos: TODO,
    facturacion: SIN_BORRAR,
    materiales: TODO,
    stock: [VER, EDITAR],
    proveedores: TODO,
    pedidos: TODO,
    empleados: TODO,
    usuarios: TODO,
    configuracion: TODO
  },

  direccion: {
    clientes: LECTURA,
    obras: LECTURA,
    asignaciones: LECTURA,
    presupuestos: LECTURA,
    facturacion: LECTURA,
    materiales: LECTURA,
    stock: LECTURA,
    proveedores: LECTURA,
    pedidos: LECTURA,
    empleados: LECTURA
  },

  administracion: {
    clientes: SIN_BORRAR,
    obras: SIN_BORRAR,
    asignaciones: TODO,
    presupuestos: SIN_BORRAR,
    facturacion: SIN_BORRAR,
    materiales: LECTURA,
    stock: LECTURA,
    proveedores: SIN_BORRAR,
    pedidos: SIN_BORRAR,
    empleados: SIN_BORRAR
  },

  comercial: {
    clientes: SIN_BORRAR,
    obras: LECTURA,
    presupuestos: SIN_BORRAR
  },

  tecnico: {
    clientes: LECTURA,
    obras: SIN_BORRAR,
    asignaciones: LECTURA,
    presupuestos: SIN_BORRAR,
    materiales: SIN_BORRAR,
    stock: LECTURA,
    proveedores: LECTURA,
    pedidos: LECTURA,
    empleados: LECTURA
  },

  jefe_obra: {
    clientes: LECTURA,
    obras: [VER, EDITAR],
    asignaciones: TODO,
    presupuestos: LECTURA,
    materiales: SIN_BORRAR,
    stock: [VER, EDITAR],
    proveedores: LECTURA,
    pedidos: SIN_BORRAR,
    empleados: SIN_BORRAR
  },

  recepcion: {
    clientes: SIN_BORRAR,
    obras: LECTURA,
    presupuestos: LECTURA
  }
};

/**
 * Roles autorizados a ver el campo salario_base.
 */
export const ROLES_CON_ACCESO_SALARIAL = [
  'administrador',
  'direccion',
  'administracion'
];

/**
 * Comprueba si un rol puede ejecutar una accion sobre un modulo.
 */
export function tienePermiso(rol, modulo, accion) {
  const permisosDelRol = PERMISOS[rol];

  if (!permisosDelRol) return false;

  const accionesPermitidas = permisosDelRol[modulo];

  if (!accionesPermitidas) return false;

  return accionesPermitidas.includes(accion);
}

/**
 * Devuelve el mapa completo de permisos de un rol.
 * Se envia al frontend tras el login para construir el menu.
 */
export function obtenerPermisos(rol) {
  return PERMISOS[rol] ?? {};
}