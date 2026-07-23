/**
 * Error de aplicacion con codigo HTTP y codigo de negocio.
 * Permite que el manejador central de errores devuelva
 * siempre el formato acordado en el contrato de la API.
 */

export class AppError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.esOperacional = true;
  }
}