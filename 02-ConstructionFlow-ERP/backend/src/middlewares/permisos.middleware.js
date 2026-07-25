/**
 * Verificacion de permisos por rol.
 * Aplica la matriz definida en src/config/permisos.js
 *
 * Debe usarse siempre despues de verificarToken.
 */

import { tienePermiso } from '../config/permisos.js';
import { AppError } from '../utils/AppError.js';

/**
 * Genera un middleware que exige un permiso concreto.
 *
 * Ejemplo de uso en una ruta:
 *   router.delete('/:id', verificarToken, exigirPermiso('clientes', 'eliminar'), controlador);
 */
export function exigirPermiso(modulo, accion) {
  return (req, res, next) => {
    const rol = req.usuario?.rol;

    if (!rol) {
      return next(new AppError(401, 'TOKEN_AUSENTE', 'No se ha identificado al usuario'));
    }

    if (!tienePermiso(rol, modulo, accion)) {
      return next(new AppError(
        403,
        'PERMISO_DENEGADO',
        'No tienes permiso para realizar esta accion'
      ));
    }

    next();
  };
}