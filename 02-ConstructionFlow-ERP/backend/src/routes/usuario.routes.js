/**
 * Rutas del modulo de usuarios.
 * Acceso exclusivo del rol administrador.
 */

import { Router } from 'express';
import * as usuarioController from '../controllers/usuario.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { exigirPermiso } from '../middlewares/permisos.middleware.js';

const router = Router();

router.get(
  '/',
  verificarToken,
  exigirPermiso('usuarios', 'ver'),
  usuarioController.listar
);

router.post(
  '/',
  verificarToken,
  exigirPermiso('usuarios', 'crear'),
  usuarioController.crear
);

router.put(
  '/:id/password',
  verificarToken,
  exigirPermiso('usuarios', 'editar'),
  usuarioController.resetearPassword
);

router.put(
  '/:id/rol',
  verificarToken,
  exigirPermiso('usuarios', 'editar'),
  usuarioController.cambiarRol
);

router.put(
  '/:id/activo',
  verificarToken,
  exigirPermiso('usuarios', 'eliminar'),
  usuarioController.cambiarActivo
);

export default router;