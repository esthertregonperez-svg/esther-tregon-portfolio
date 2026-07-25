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

export default router;