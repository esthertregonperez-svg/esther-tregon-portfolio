/**
 * Controlador de presupuestos.
 * Traduce entre HTTP y la capa de servicio.
 */
import * as presupuestoService from '../services/presupuesto.service.js';

export async function listar(req, res, next) {
  try {
    const resultado = await presupuestoService.listar(req.query);
    res.status(200).json({ success: true, data: resultado });
  } catch (error) {
    next(error);
  }
}

export async function obtener(req, res, next) {
  try {
    const presupuesto = await presupuestoService.obtener(req.params.id);
    res.status(200).json({ success: true, data: presupuesto });
  } catch (error) {
    next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const presupuesto = await presupuestoService.crear(req.body);
    res.status(201).json({ success: true, data: presupuesto });
  } catch (error) {
    next(error);
  }
}

export async function actualizar(req, res, next) {
  try {
    const presupuesto = await presupuestoService.actualizar(req.params.id, req.body);
    res.status(200).json({ success: true, data: presupuesto });
  } catch (error) {
    next(error);
  }
}