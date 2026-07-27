/**
 * Controlador de materiales.
 * Traduce entre HTTP y la capa de servicio.
 */
import * as materialService from '../services/material.service.js';

export async function listar(req, res, next) {
  try {
    const resultado = await materialService.listar(req.query);
    res.status(200).json({ success: true, data: resultado });
  } catch (error) {
    next(error);
  }
}

export async function obtener(req, res, next) {
  try {
    const material = await materialService.obtener(req.params.id);
    res.status(200).json({ success: true, data: material });
  } catch (error) {
    next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const material = await materialService.crear(req.body);
    res.status(201).json({ success: true, data: material });
  } catch (error) {
    next(error);
  }
}

export async function actualizar(req, res, next) {
  try {
    const material = await materialService.actualizar(req.params.id, req.body);
    res.status(200).json({ success: true, data: material });
  } catch (error) {
    next(error);
  }
}