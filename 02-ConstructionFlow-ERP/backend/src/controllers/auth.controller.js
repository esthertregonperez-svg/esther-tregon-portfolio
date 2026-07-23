/**
 * Controlador de autenticacion.
 * Traduce entre HTTP y la capa de servicio. Sin logica de negocio.
 */

import * as authService from '../services/auth.service.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const resultado = await authService.iniciarSesion(email, password);

    res.status(200).json({ success: true, data: resultado });
  } catch (error) {
    next(error);
  }
}

export async function cambiarPassword(req, res, next) {
  try {
    const { passwordActual, passwordNueva } = req.body;

    await authService.cambiarPassword(
      req.usuario.id,
      passwordActual,
      passwordNueva
    );

    res.status(200).json({
      success: true,
      data: { message: 'Contrasena actualizada correctamente' }
    });
  } catch (error) {
    next(error);
  }
}