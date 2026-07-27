/**
 * Rutas de categorias de material (solo lectura).
 * Se usan para rellenar el desplegable de categorias al crear/editar materiales,
 * asi que basta con el permiso de ver materiales.
 */
import { Router } from 'express';
import * as categoriaController from '../controllers/categoria-material.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { exigirPermiso } from '../middlewares/permisos.middleware.js';

const router = Router();

router.get('/', verificarToken, exigirPermiso('materiales', 'ver'), categoriaController.listar);

export default router;
