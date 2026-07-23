/**
 * Crea los usuarios iniciales del sistema, uno por rol.
 * Uso: node src/scripts/crear-usuarios.js
 *
 * Idempotente: si el usuario ya existe, no lo duplica.
 */

import bcrypt from 'bcrypt';
import pool from '../config/database.js';

const RONDAS_BCRYPT = 10;
const PASSWORD_DESARROLLO = 'Erp2026!';

const USUARIOS = [
  { email: 'admin@construccionesperez.es',          rol: 'administrador' },
  { email: 'juan.perez@construccionesperez.es',     rol: 'direccion' },
  { email: 'maria.martin@construccionesperez.es',   rol: 'administracion' },
  { email: 'alberto.garcia@construccionesperez.es', rol: 'comercial' },
  { email: 'laura.lopez@construccionesperez.es',    rol: 'tecnico' },
  { email: 'roberto.ruiz@construccionesperez.es',   rol: 'jefe_obra' },
  { email: 'carmen.moreno@construccionesperez.es',  rol: 'recepcion' }
];

async function crearUsuarios() {
  const [roles] = await pool.query('SELECT id_rol, nombre_rol FROM rol');

  const idPorRol = new Map(
    roles.map((rol) => [rol.nombre_rol, rol.id_rol])
  );

  for (const usuario of USUARIOS) {
    const idRol = idPorRol.get(usuario.rol);

    if (!idRol) {
      console.warn(`Rol no encontrado, se omite: ${usuario.rol}`);
      continue;
    }

    const hash = await bcrypt.hash(PASSWORD_DESARROLLO, RONDAS_BCRYPT);

    const [resultado] = await pool.query(
      `INSERT INTO usuario (email, password_hash, id_rol, activo)
       VALUES (?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE email = email`,
      [usuario.email, hash, idRol]
    );

    const estado = resultado.affectedRows === 1 ? 'creado' : 'ya existia';
    console.log(`${usuario.rol.padEnd(16)} ${estado}`);
  }
}

try {
  await crearUsuarios();
  console.log(`\nContrasena de desarrollo para todos: ${PASSWORD_DESARROLLO}`);
} catch (error) {
  console.error('Error al crear usuarios:', error.message);
} finally {
  await pool.end();
}