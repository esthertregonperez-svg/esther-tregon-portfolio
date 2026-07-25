/**
 * Controlador de clientes.
 * Traduce entre HTTP y la capa de servicio.
 */

import * as clienteService from '../services/cliente.service.js';

export async function listar(req, res, next) {
  try {
    const resultado = await clienteService.listar(req.query);
    res.status(200).json({ success: true, data: resultado });
  } catch (error) {
    next(error);
  }
}

export async function obtener(req, res, next) {
  try {
    const cliente = await clienteService.obtener(req.params.id);
    res.status(200).json({ success: true, data: cliente });
  } catch (error) {
    next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const cliente = await clienteService.crear(req.body);
    res.status(201).json({ success: true, data: cliente });
  } catch (error) {
    next(error);
  }
}

export async function actualizar(req, res, next) {
  try {
    const cliente = await clienteService.actualizar(req.params.id, req.body);
    res.status(200).json({ success: true, data: cliente });
  } catch (error) {
    next(error);
  }
}

export async function darDeBaja(req, res, next) {
  try {
    await clienteService.darDeBaja(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}