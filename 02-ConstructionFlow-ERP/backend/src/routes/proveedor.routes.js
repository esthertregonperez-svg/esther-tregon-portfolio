/**
 * Rutas del modulo de proveedores.
 * Cada endpoint valida rol segun la matriz de permisos.
 */
import { Router } from 'express';
import * as proveedorController from '../controllers/proveedor.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { exigirPermiso } from '../middlewares/permisos.middleware.js';

const router = Router();

router.get('/',    verificarToken, exigirPermiso('proveedores', 'ver'),    proveedorController.listar);
router.get('/:id', verificarToken, exigirPermiso('proveedores', 'ver'),    proveedorController.obtener);
router.post('/',   verificarToken, exigirPermiso('proveedores', 'crear'),  proveedorController.crear);
router.put('/:id', verificarToken, exigirPermiso('proveedores', 'editar'), proveedorController.actualizar);

export default router;