/**
 * Rutas del modulo de obras.
 * Cada endpoint valida rol segun la matriz de permisos.
 */
import { Router } from 'express';
import * as obraController from '../controllers/obra.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { exigirPermiso } from '../middlewares/permisos.middleware.js';

const router = Router();

router.get('/',    verificarToken, exigirPermiso('obras', 'ver'),    obraController.listar);
router.get('/:id', verificarToken, exigirPermiso('obras', 'ver'),    obraController.obtener);
router.post('/',   verificarToken, exigirPermiso('obras', 'crear'),  obraController.crear);
router.put('/:id', verificarToken, exigirPermiso('obras', 'editar'), obraController.actualizar);

export default router;