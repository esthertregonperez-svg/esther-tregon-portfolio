/**
 * Controlador de obras.
 * Traduce entre HTTP y la capa de servicio.
 */
import * as obraService from '../services/obra.service.js';

export async function listar(req, res, next) {
  try {
    const resultado = await obraService.listar(req.query);
    res.status(200).json({ success: true, data: resultado });
  } catch (error) {
    next(error);
  }
}

export async function obtener(req, res, next) {
  try {
    const obra = await obraService.obtener(req.params.id);
    res.status(200).json({ success: true, data: obra });
  } catch (error) {
    next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const obra = await obraService.crear(req.body);
    res.status(201).json({ success: true, data: obra });
  } catch (error) {
    next(error);
  }
}

export async function actualizar(req, res, next) {
  try {
    const obra = await obraService.actualizar(req.params.id, req.body);
    res.status(200).json({ success: true, data: obra });
  } catch (error) {
    next(error);
  }
}