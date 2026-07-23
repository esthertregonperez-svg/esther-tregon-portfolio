/**
 * Verifica el token JWT y adjunta el usuario a la peticion.
 */

import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

export function verificarToken(req, res, next) {
  const cabecera = req.headers.authorization;

  if (!cabecera || !cabecera.startsWith('Bearer ')) {
    return next(new AppError(401, 'TOKEN_AUSENTE', 'No se ha proporcionado un token'));
  }

  const token = cabecera.substring(7);

  try {
    const contenido = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = {
      id: contenido.sub,
      rol: contenido.rol
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError(401, 'TOKEN_EXPIRADO', 'La sesion ha caducado'));
    }
    return next(new AppError(401, 'TOKEN_INVALIDO', 'El token no es valido'));
  }
}