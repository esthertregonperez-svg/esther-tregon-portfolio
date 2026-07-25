/**
 * Controlador del modulo de usuarios.
 */

import * as usuarioRepository from '../repositories/usuario.repository.js';

export async function listar(req, res, next) {
  try {
    const usuarios = await usuarioRepository.listarTodos();
    res.status(200).json({ success: true, data: { items: usuarios } });
  } catch (error) {
    next(error);
  }
}