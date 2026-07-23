/**
 * Punto de entrada de la aplicacion.
 * Comprueba la base de datos y arranca el servidor.
 */

import app from './src/app.js';
import pool, { comprobarConexion } from './src/config/database.js';

const PORT = process.env.PORT || 3000;

try {
  await comprobarConexion();

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('No se pudo arrancar el servidor:', error.message);
  await pool.end();
  process.exit(1);
}