/**
 * Controlador de proveedores.
 * Traduce entre HTTP y la capa de servicio.
 */
import * as proveedorService from '../services/proveedor.service.js';

export async function listar(req, res, next) {
  try {
    const resultado = await proveedorService.listar(req.query);
    res.status(200).json({ success: true, data: resultado });
  } catch (error) {
    next(error);
  }
}

export async function obtener(req, res, next) {
  try {
    const proveedor = await proveedorService.obtener(req.params.id);
    res.status(200).json({ success: true, data: proveedor });
  } catch (error) {
    next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const proveedor = await proveedorService.crear(req.body);
    res.status(201).json({ success: true, data: proveedor });
  } catch (error) {
    next(error);
  }
}

export async function actualizar(req, res, next) {
  try {
    const proveedor = await proveedorService.actualizar(req.params.id, req.body);
    res.status(200).json({ success: true, data: proveedor });
  } catch (error) {
    next(error);
  }
}