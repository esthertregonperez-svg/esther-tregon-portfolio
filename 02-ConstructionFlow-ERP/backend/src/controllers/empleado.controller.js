/**
 * Controlador de empleados.
 * Traduce entre HTTP y la capa de servicio.
 */
import * as empleadoService from '../services/empleado.service.js';

export async function listar(req, res, next) {
  try {
    const resultado = await empleadoService.listar(req.query);
    res.status(200).json({ success: true, data: resultado });
  } catch (error) {
    next(error);
  }
}

export async function obtener(req, res, next) {
  try {
    const empleado = await empleadoService.obtener(req.params.id);
    res.status(200).json({ success: true, data: empleado });
  } catch (error) {
    next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const empleado = await empleadoService.crear(req.body);
    res.status(201).json({ success: true, data: empleado });
  } catch (error) {
    next(error);
  }
}

export async function actualizar(req, res, next) {
  try {
    const empleado = await empleadoService.actualizar(req.params.id, req.body);
    res.status(200).json({ success: true, data: empleado });
  } catch (error) {
    next(error);
  }
}