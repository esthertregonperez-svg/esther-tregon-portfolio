/**
 * Rutas del modulo de pedidos de compra.
 * Cada endpoint valida rol segun la matriz de permisos.
 */
import { Router } from 'express';
import * as pedidoController from '../controllers/pedido.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { exigirPermiso } from '../middlewares/permisos.middleware.js';

const router = Router();

router.get('/',    verificarToken, exigirPermiso('pedidos', 'ver'),    pedidoController.listar);
router.get('/:id', verificarToken, exigirPermiso('pedidos', 'ver'),    pedidoController.obtener);
router.post('/',   verificarToken, exigirPermiso('pedidos', 'crear'),  pedidoController.crear);
router.put('/:id', verificarToken, exigirPermiso('pedidos', 'editar'), pedidoController.actualizar);

export default router;