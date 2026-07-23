/**
 * Script de comprobacion manual de la conexion a MySQL.
 * Uso: node src/scripts/test-conexion.js
 */

import pool, { comprobarConexion } from '../config/database.js';

try {
  await comprobarConexion();
} catch (error) {
  console.error('Error de conexion:', error.message);
} finally {
  await pool.end();
}