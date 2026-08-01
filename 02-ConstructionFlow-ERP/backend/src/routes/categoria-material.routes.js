/**
 * Rutas de categorias de material.
 * GET  /  -> listar (para rellenar desplegables); permiso ver materiales.
 * POST /  -> crear al vuelo desde el formulario de material; permiso crear materiales.
 */
import { Router } from 'express';
import * as categoriaController from '../controllers/categoria-material.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { exigirPermiso } from '../middlewares/permisos.middleware.js';

const router = Router();

router.get('/',  verificarToken, exigirPermiso('materiales', 'ver'),   categoriaController.listar);
router.post('/', verificarToken, exigirPermiso('materiales', 'crear'), categoriaController.crear);

export default router;