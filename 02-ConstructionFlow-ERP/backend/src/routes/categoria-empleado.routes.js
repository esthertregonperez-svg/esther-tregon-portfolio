/**
 * Rutas de categorias de empleado (solo lectura).
 * Se usan para el desplegable de categoria en el formulario de empleado.
 */
import { Router } from 'express';
import * as categoriaController from '../controllers/categoria-empleado.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { exigirPermiso } from '../middlewares/permisos.middleware.js';

const router = Router();

router.get('/', verificarToken, exigirPermiso('empleados', 'ver'), categoriaController.listar);

export default router;