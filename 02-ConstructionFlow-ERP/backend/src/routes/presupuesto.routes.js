/**
 * Rutas del modulo de presupuestos.
 * Cada endpoint valida rol segun la matriz de permisos.
 */
import { Router } from 'express';
import * as presupuestoController from '../controllers/presupuesto.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { exigirPermiso } from '../middlewares/permisos.middleware.js';

const router = Router();

router.get('/',    verificarToken, exigirPermiso('presupuestos', 'ver'),    presupuestoController.listar);
router.get('/:id', verificarToken, exigirPermiso('presupuestos', 'ver'),    presupuestoController.obtener);
router.post('/',   verificarToken, exigirPermiso('presupuestos', 'crear'),  presupuestoController.crear);
router.put('/:id', verificarToken, exigirPermiso('presupuestos', 'editar'), presupuestoController.actualizar);

export default router;