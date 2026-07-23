/**
 * Rutas del modulo de autenticacion.
 */

import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', authController.login);
router.patch('/password', verificarToken, authController.cambiarPassword);

export default router;