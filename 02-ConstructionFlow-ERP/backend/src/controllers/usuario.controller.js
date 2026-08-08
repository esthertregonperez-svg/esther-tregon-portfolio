/**
 * Controlador del modulo de usuarios.
 */

import * as usuarioRepository from '../repositories/usuario.repository.js';
import * as usuarioService from '../services/usuario.service.js';

export async function listar(req, res, next) {
  try {
    const usuarios = await usuarioRepository.listarTodos();
    res.status(200).json({ success: true, data: { items: usuarios } });
  } catch (error) {
    next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const usuario = await usuarioService.crear(req.body);
    res.status(201).json({ success: true, data: usuario });
  } catch (error) {
    next(error);
  }
}

export async function resetearPassword(req, res, next) {
  try {
    await usuarioService.resetearPassword(req.params.id, req.body.password);
    res.status(200).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

export async function cambiarRol(req, res, next) {
  try {
    const usuario = await usuarioService.cambiarRol(req.params.id, req.body.id_rol);
    res.status(200).json({ success: true, data: usuario });
  } catch (error) {
    next(error);
  }
}

export async function cambiarActivo(req, res, next) {
  try {
    await usuarioService.cambiarActivo(req.params.id, req.body.activo);
    res.status(200).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}