/**
 * Controlador de pedidos de compra.
 * Traduce entre HTTP y la capa de servicio.
 */
import * as pedidoService from '../services/pedido.service.js';

export async function listar(req, res, next) {
  try {
    const resultado = await pedidoService.listar(req.query);
    res.status(200).json({ success: true, data: resultado });
  } catch (error) {
    next(error);
  }
}

export async function obtener(req, res, next) {
  try {
    const pedido = await pedidoService.obtener(req.params.id);
    res.status(200).json({ success: true, data: pedido });
  } catch (error) {
    next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const pedido = await pedidoService.crear(req.body);
    res.status(201).json({ success: true, data: pedido });
  } catch (error) {
    next(error);
  }
}

export async function actualizar(req, res, next) {
  try {
    const pedido = await pedidoService.actualizar(req.params.id, req.body);
    res.status(200).json({ success: true, data: pedido });
  } catch (error) {
    next(error);
  }
}
