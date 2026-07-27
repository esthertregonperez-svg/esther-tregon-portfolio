/**
 * Rutas del modulo de materiales.
 * Cada endpoint valida rol segun la matriz de permisos.
 */
import { Router } from 'express';
import * as materialController from '../controllers/material.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { exigirPermiso } from '../middlewares/permisos.middleware.js';

const router = Router();

router.get('/',    verificarToken, exigirPermiso('materiales', 'ver'),    materialController.listar);
router.get('/:id', verificarToken, exigirPermiso('materiales', 'ver'),    materialController.obtener);
router.post('/',   verificarToken, exigirPermiso('materiales', 'crear'),  materialController.crear);
router.put('/:id', verificarToken, exigirPermiso('materiales', 'editar'), materialController.actualizar);

export default router;