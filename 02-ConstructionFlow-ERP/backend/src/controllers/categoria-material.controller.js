/**
 * Controlador de categorias de material.
 * Expone el listado y la creacion (para el "+ Nueva categoria" al vuelo).
 */
import * as categoriaRepository from '../repositories/categoria-material.repository.js';
import { AppError } from '../utils/AppError.js';

export async function listar(req, res, next) {
  try {
    const categorias = await categoriaRepository.listar();
    res.status(200).json({ success: true, data: { items: categorias } });
  } catch (error) {
    next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const nombre = (req.body.nombre_categoria ?? '').trim();

    // Validacion: nombre obligatorio.
    if (nombre === '') {
      const error = new AppError(400, 'DATOS_INVALIDOS', 'Los datos enviados no son validos');
      error.fields = { nombre_categoria: 'El nombre de la categoria es obligatorio' };
      throw error;
    }

    // Validacion: nombre no duplicado.
    const existe = await categoriaRepository.existeNombre(nombre);
    if (existe) {
      throw new AppError(409, 'VALOR_DUPLICADO', 'Ya existe una categoria con ese nombre');
    }

    const categoria = await categoriaRepository.crear({
      nombre_categoria: nombre,
      descripcion: req.body.descripcion ?? null,
    });

    res.status(201).json({ success: true, data: categoria });
  } catch (error) {
    next(error);
  }
}