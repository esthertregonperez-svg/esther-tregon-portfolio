-- =====================================================
-- Migracion 001: Autenticacion y correccion de stock
-- Proyecto: ConstructionFlow ERP
-- Autor: Esther Tregon Perez
-- =====================================================

USE construcciones_perez;

-- -----------------------------------------------------
-- 1. Eliminar trigger que duplica el stock
-- -----------------------------------------------------
DROP TRIGGER IF EXISTS trigger_actualizar_stock;

-- -----------------------------------------------------
-- 2. Tabla de roles
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS rol (
  id_rol INT NOT NULL AUTO_INCREMENT,
  nombre_rol VARCHAR(50) NOT NULL,
  descripcion VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id_rol),
  UNIQUE KEY uq_nombre_rol (nombre_rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

INSERT IGNORE INTO rol (nombre_rol, descripcion) VALUES
  ('administrador', 'Acceso total al sistema'),
  ('direccion',     'Vision global y datos economicos'),
  ('administracion','Facturacion, cobros y personal'),
  ('recepcion',     'Atencion a clientes y agenda'),
  ('comercial',     'Clientes y presupuestos'),
  ('tecnico',       'Obras y mediciones'),
  ('jefe_obra',     'Obras asignadas y partes de trabajo');

-- -----------------------------------------------------
-- 3. Tabla de usuarios
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario (
  id_usuario INT NOT NULL AUTO_INCREMENT,
  id_rol INT NOT NULL,
  id_empleado INT DEFAULT NULL,
  email VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  ultimo_acceso DATETIME DEFAULT NULL,
  fecha_alta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY uq_usuario_email (email),
  KEY idx_usuario_rol (id_rol),
  KEY idx_usuario_empleado (id_empleado),
  CONSTRAINT fk_usuario_rol
    FOREIGN KEY (id_rol) REFERENCES rol (id_rol)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_usuario_empleado
    FOREIGN KEY (id_empleado) REFERENCES empleado (id_empleado)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;