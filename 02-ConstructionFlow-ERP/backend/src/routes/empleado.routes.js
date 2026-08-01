/**
 * Rutas del modulo de empleados.
 * Cada endpoint valida rol segun la matriz de permisos.
 */
import { Router } from 'express';
import * as empleadoController from '../controllers/empleado.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { exigirPermiso } from '../middlewares/permisos.middleware.js';

const router = Router();

router.get('/',    verificarToken, exigirPermiso('empleados', 'ver'),    empleadoController.listar);
router.get('/:id', verificarToken, exigirPermiso('empleados', 'ver'),    empleadoController.obtener);
router.post('/',   verificarToken, exigirPermiso('empleados', 'crear'),  empleadoController.crear);
router.put('/:id', verificarToken, exigirPermiso('empleados', 'editar'), empleadoController.actualizar);

export default router;