/**
 * Controlador de categorias de empleado.
 * Expone el listado para rellenar desplegables en el frontend.
 */
import * as categoriaRepository from '../repositories/categoria-empleado.repository.js';

export async function listar(req, res, next) {
  try {
    const categorias = await categoriaRepository.listar();
    res.status(200).json({ success: true, data: { items: categorias } });
  } catch (error) {
    next(error);
  }
}