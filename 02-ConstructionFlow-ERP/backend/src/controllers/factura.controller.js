/**
 * Controlador de facturas.
 * Traduce entre HTTP y la capa de servicio.
 */
import * as facturaService from '../services/factura.service.js';

export async function listar(req, res, next) {
  try {
    const resultado = await facturaService.listar(req.query);
    res.status(200).json({ success: true, data: resultado });
  } catch (error) {
    next(error);
  }
}

export async function obtener(req, res, next) {
  try {
    const factura = await facturaService.obtener(req.params.id);
    res.status(200).json({ success: true, data: factura });
  } catch (error) {
    next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const factura = await facturaService.crear(req.body);
    res.status(201).json({ success: true, data: factura });
  } catch (error) {
    next(error);
  }
}

export async function actualizar(req, res, next) {
  try {
    const factura = await facturaService.actualizar(req.params.id, req.body);
    res.status(200).json({ success: true, data: factura });
  } catch (error) {
    next(error);
  }
}