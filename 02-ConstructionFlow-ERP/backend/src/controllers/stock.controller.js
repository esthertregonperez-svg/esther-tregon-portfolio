/**
 * Controlador de stock.
 * Traduce entre HTTP y la capa de servicio.
 */
import * as stockService from '../services/stock.service.js';

export async function listar(req, res, next) {
  try {
    const resultado = await stockService.listar(req.query);
    res.status(200).json({ success: true, data: resultado });
  } catch (error) {
    next(error);
  }
}

export async function entrada(req, res, next) {
  try {
    const stock = await stockService.entrada(req.params.id, req.body);
    res.status(200).json({ success: true, data: stock });
  } catch (error) {
    next(error);
  }
}

export async function salida(req, res, next) {
  try {
    const stock = await stockService.salida(req.params.id, req.body);
    res.status(200).json({ success: true, data: stock });
  } catch (error) {
    next(error);
  }
}