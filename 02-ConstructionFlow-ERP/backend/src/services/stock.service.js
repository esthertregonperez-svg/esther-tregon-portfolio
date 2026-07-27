/**
 * Logica de negocio de stock.
 * Gestiona las entradas y salidas de material del almacen.
 */
import * as stockRepository from '../repositories/stock.repository.js';
import { AppError } from '../utils/AppError.js';

/**
 * Devuelve el listado de materiales con su stock.
 */
export async function listar(opciones) {
  const page = Math.max(1, Number(opciones.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(opciones.limit) || 20));
  const search = opciones.search ?? '';

  const { items, total } = await stockRepository.listar({ page, limit, search });

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * Valida que la cantidad de un movimiento sea un numero positivo mayor que 0.
 * Devuelve el numero ya convertido.
 */
function validarCantidadMovimiento(cantidad) {
  const numero = Number(cantidad);
  if (Number.isNaN(numero) || numero <= 0) {
    const error = new AppError(400, 'DATOS_INVALIDOS', 'Los datos enviados no son validos');
    error.fields = { cantidad: 'La cantidad debe ser un numero mayor que cero' };
    throw error;
  }
  return numero;
}

/**
 * ENTRADA: registra material que entra al almacen (suma al stock).
 * Si el material no tenia stock, se crea la fila.
 */
export async function entrada(idMaterial, datos) {
  const cantidad = validarCantidadMovimiento(datos.cantidad);

  const stockActual = await stockRepository.buscarPorMaterial(idMaterial);
  const disponibleAhora = stockActual ? Number(stockActual.cantidad_disponible) : 0;

  const nuevaCantidad = disponibleAhora + cantidad;

  return stockRepository.fijarCantidad(idMaterial, nuevaCantidad, datos.ubicacion_almacen);
}

/**
 * SALIDA: registra material que sale del almacen (resta del stock).
 * No permite sacar mas de lo que hay: el stock no baja de 0.
 */
export async function salida(idMaterial, datos) {
  const cantidad = validarCantidadMovimiento(datos.cantidad);

  const stockActual = await stockRepository.buscarPorMaterial(idMaterial);
  const disponibleAhora = stockActual ? Number(stockActual.cantidad_disponible) : 0;

  if (cantidad > disponibleAhora) {
    throw new AppError(
      400,
      'STOCK_INSUFICIENTE',
      `No hay suficiente stock. Disponible: ${disponibleAhora}`
    );
  }

  const nuevaCantidad = disponibleAhora - cantidad;

  return stockRepository.fijarCantidad(idMaterial, nuevaCantidad, datos.ubicacion_almacen);
}