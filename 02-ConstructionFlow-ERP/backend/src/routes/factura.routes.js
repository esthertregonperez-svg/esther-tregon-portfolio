/**
 * Rutas del modulo de facturas.
 * Cada endpoint valida rol segun la matriz de permisos.
 *
 * OJO: en la matriz de permisos (config/permisos.js) el modulo se llama
 * 'facturacion' (no 'facturas'). La URL sigue siendo /api/facturas.
 */
import { Router } from 'express';
import * as facturaController from '../controllers/factura.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { exigirPermiso } from '../middlewares/permisos.middleware.js';

const router = Router();

router.get('/',    verificarToken, exigirPermiso('facturacion', 'ver'),    facturaController.listar);
router.get('/:id', verificarToken, exigirPermiso('facturacion', 'ver'),    facturaController.obtener);
router.post('/',   verificarToken, exigirPermiso('facturacion', 'crear'),  facturaController.crear);
router.put('/:id', verificarToken, exigirPermiso('facturacion', 'editar'), facturaController.actualizar);

export default router;