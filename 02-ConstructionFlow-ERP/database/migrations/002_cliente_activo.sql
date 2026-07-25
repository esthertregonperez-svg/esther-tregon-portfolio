-- =====================================================
-- Migracion 002: Baja logica de clientes
-- Proyecto: ConstructionFlow ERP
-- Autora: Esther Tregon Perez
-- =====================================================

USE construcciones_perez;

-- Anade la columna 'activo' para permitir la baja logica.
-- Por defecto todos los clientes existentes quedan activos.
ALTER TABLE cliente
  ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1
  AFTER fecha_alta;