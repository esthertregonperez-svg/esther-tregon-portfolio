/**
 * Configuracion de la conexion a MySQL.
 * Punto unico de acceso a la base de datos en toda la aplicacion.
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  charset: 'utf8mb4',
  timezone: 'Z',
  decimalNumbers: true
});

/**
 * Comprueba que la base de datos responde.
 * Se ejecuta al arrancar el servidor para fallar pronto si algo va mal.
 */
export async function comprobarConexion() {
  const conexion = await pool.getConnection();
  try {
    await conexion.ping();
    console.log(`Conexion correcta con la base de datos "${process.env.DB_NAME}"`);
  } finally {
    conexion.release();
  }
}

export default pool;