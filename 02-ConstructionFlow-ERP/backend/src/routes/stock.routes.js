/**
 * Rutas del modulo de stock.
 * Solo ver y ajustar (entrada/salida). No hay crear ni borrar.
 * Cada endpoint valida rol segun la matriz de permisos.
 */
import { Router } from 'express';
import * as stockController from '../controllers/stock.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { exigirPermiso } from '../middlewares/permisos.middleware.js';

const router = Router();

router.get('/', verificarToken, exigirPermiso('stock', 'ver'), stockController.listar);

// Movimientos de almacen: el id es el del material.
router.post('/:id/entrada', verificarToken, exigirPermiso('stock', 'editar'), stockController.entrada);
router.post('/:id/salida',  verificarToken, exigirPermiso('stock', 'editar'), stockController.salida);

export default router;