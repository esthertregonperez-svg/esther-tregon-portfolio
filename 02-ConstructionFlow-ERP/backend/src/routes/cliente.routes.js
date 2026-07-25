/**
 * Rutas del modulo de clientes.
 * Cada endpoint valida rol segun la matriz de permisos.
 */

import { Router } from 'express';
import * as clienteController from '../controllers/cliente.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { exigirPermiso } from '../middlewares/permisos.middleware.js';

const router = Router();

router.get('/',    verificarToken, exigirPermiso('clientes', 'ver'),      clienteController.listar);
router.get('/:id', verificarToken, exigirPermiso('clientes', 'ver'),      clienteController.obtener);
router.post('/',   verificarToken, exigirPermiso('clientes', 'crear'),    clienteController.crear);
router.put('/:id', verificarToken, exigirPermiso('clientes', 'editar'),   clienteController.actualizar);
router.delete('/:id', verificarToken, exigirPermiso('clientes', 'eliminar'), clienteController.darDeBaja);

export default router;