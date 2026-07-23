/**
 * Manejador central de errores.
 * Unico punto donde se construyen las respuestas de error.
 */

import { AppError } from '../utils/AppError.js';

export function manejadorErrores(error, req, res, next) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: { code: error.code, message: error.message }
    });
  }

  console.error('Error no controlado:', error);

  res.status(500).json({
    success: false,
    error: {
      code: 'ERROR_INTERNO',
      message: 'Ha ocurrido un error inesperado'
    }
  });
}