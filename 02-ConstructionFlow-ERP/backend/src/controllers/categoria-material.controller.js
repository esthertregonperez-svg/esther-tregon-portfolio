/**
 * Controlador de categorias de material.
 * Solo expone el listado, para rellenar desplegables en el frontend.
 */
import * as categoriaRepository from '../repositories/categoria-material.repository.js';

export async function listar(req, res, next) {
  try {
    const categorias = await categoriaRepository.listar();
    res.status(200).json({ success: true, data: { items: categorias } });
  } catch (error) {
    next(error);
  }
}