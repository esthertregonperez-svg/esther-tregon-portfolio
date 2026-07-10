CREATE DATABASE  IF NOT EXISTS `construcciones_perez` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `construcciones_perez`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: construcciones_perez
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categoria_empleado`
--

DROP TABLE IF EXISTS `categoria_empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria_empleado` (
  `id_categoria_empleado` int NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`id_categoria_empleado`),
  UNIQUE KEY `nombre_categoria` (`nombre_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria_empleado`
--

LOCK TABLES `categoria_empleado` WRITE;
/*!40000 ALTER TABLE `categoria_empleado` DISABLE KEYS */;
INSERT INTO `categoria_empleado` VALUES (1,'Albañil','Trabajos generales de albañilería'),(2,'Encargado','Responsable de obra'),(3,'Administrativo','Gestión administrativa'),(4,'Electricista','Instalaciones eléctricas');
/*!40000 ALTER TABLE `categoria_empleado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria_material`
--

DROP TABLE IF EXISTS `categoria_material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria_material` (
  `id_categoria_material` int NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`id_categoria_material`),
  UNIQUE KEY `nombre_categoria` (`nombre_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria_material`
--

LOCK TABLES `categoria_material` WRITE;
/*!40000 ALTER TABLE `categoria_material` DISABLE KEYS */;
INSERT INTO `categoria_material` VALUES (1,'Cemento','Materiales de cemento'),(2,'Ladrillos','Ladrillos y bloques'),(3,'Pintura','Pinturas y revestimientos'),(4,'Electricidad','Material eléctrico');
/*!40000 ALTER TABLE `categoria_material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_spanish_ci NOT NULL,
  `razon_social` varchar(200) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `dni_cif` varchar(20) COLLATE utf8mb4_spanish_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `tipo_cliente` enum('particular','empresa','administracion_publica') COLLATE utf8mb4_spanish_ci NOT NULL,
  `fecha_alta` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `dni_cif` (`dni_cif`),
  KEY `idx_cliente_dni_cif` (`dni_cif`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,'Juan Pérez',NULL,'12345678A','600111222','juanperez@email.com','Calle Mayor 10, Madrid','particular','2026-03-11 17:22:33'),(2,'Promociones Sierra S.L.','Promociones Sierra S.L.','B12345678','910111222','info@sierrasl.com','Avenida Sol 15, Madrid','empresa','2026-03-11 17:22:33'),(3,'Ayuntamiento de Toledo','Ayuntamiento de Toledo','P4516900J','925000111','urbanismo@toledo.es','Plaza del Ayuntamiento, Toledo','administracion_publica','2026-03-11 17:22:33');
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleado`
--

DROP TABLE IF EXISTS `empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleado` (
  `id_empleado` int NOT NULL AUTO_INCREMENT,
  `id_categoria_empleado` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `apellidos` varchar(150) COLLATE utf8mb4_spanish_ci NOT NULL,
  `dni` varchar(20) COLLATE utf8mb4_spanish_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `fecha_alta` date NOT NULL,
  `salario_base` decimal(10,2) NOT NULL DEFAULT '0.00',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_empleado`),
  UNIQUE KEY `dni` (`dni`),
  KEY `idx_empleado_categoria` (`id_categoria_empleado`),
  CONSTRAINT `fk_empleado_categoria` FOREIGN KEY (`id_categoria_empleado`) REFERENCES `categoria_empleado` (`id_categoria_empleado`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleado`
--

LOCK TABLES `empleado` WRITE;
/*!40000 ALTER TABLE `empleado` DISABLE KEYS */;
INSERT INTO `empleado` VALUES (1,1,'Antonio','García López','11111111A','600000001','antonio@empresa.com','Madrid','2024-01-10',1600.00,1),(2,2,'María','Sánchez Ruiz','22222222B','600000002','maria@empresa.com','Madrid','2024-02-15',2200.00,1),(3,3,'Laura','Fernández Gil','33333333C','600000003','laura@empresa.com','Madrid','2024-03-01',1800.00,1),(4,4,'Pedro','Martín Díaz','44444444D','600000004','pedro@empresa.com','Madrid','2024-04-20',1700.00,1);
/*!40000 ALTER TABLE `empleado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleado_obra`
--

DROP TABLE IF EXISTS `empleado_obra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleado_obra` (
  `id_empleado_obra` int NOT NULL AUTO_INCREMENT,
  `id_empleado` int NOT NULL,
  `id_obra` int NOT NULL,
  `fecha_asignacion` date NOT NULL,
  `horas_trabajadas` decimal(8,2) NOT NULL DEFAULT '0.00',
  `rol_en_obra` varchar(100) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`id_empleado_obra`),
  UNIQUE KEY `uq_empleado_obra` (`id_empleado`,`id_obra`),
  KEY `idx_empleado_obra_empleado` (`id_empleado`),
  KEY `idx_empleado_obra_obra` (`id_obra`),
  CONSTRAINT `fk_empleado_obra_empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_empleado_obra_obra` FOREIGN KEY (`id_obra`) REFERENCES `obra` (`id_obra`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleado_obra`
--

LOCK TABLES `empleado_obra` WRITE;
/*!40000 ALTER TABLE `empleado_obra` DISABLE KEYS */;
INSERT INTO `empleado_obra` VALUES (1,1,1,'2025-01-15',120.50,'Albañil'),(2,2,1,'2025-01-15',80.00,'Encargado'),(3,4,1,'2025-01-20',45.00,'Electricista'),(4,1,2,'2025-02-01',60.00,'Albañil'),(5,2,2,'2025-02-01',95.00,'Encargado');
/*!40000 ALTER TABLE `empleado_obra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `factura`
--

DROP TABLE IF EXISTS `factura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `factura` (
  `id_factura` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `id_obra` int NOT NULL,
  `fecha_factura` date NOT NULL,
  `estado` enum('emitida','pendiente','cobrada') COLLATE utf8mb4_spanish_ci NOT NULL DEFAULT 'emitida',
  `base_imponible` decimal(12,2) NOT NULL DEFAULT '0.00',
  `iva` decimal(5,2) NOT NULL DEFAULT '21.00',
  `total_factura` decimal(12,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id_factura`),
  KEY `idx_factura_cliente` (`id_cliente`),
  KEY `idx_factura_obra` (`id_obra`),
  CONSTRAINT `fk_factura_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_factura_obra` FOREIGN KEY (`id_obra`) REFERENCES `obra` (`id_obra`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `factura`
--

LOCK TABLES `factura` WRITE;
/*!40000 ALTER TABLE `factura` DISABLE KEYS */;
INSERT INTO `factura` VALUES (1,1,1,'2025-02-28','emitida',8000.00,21.00,9680.00),(2,2,2,'2025-03-05','pendiente',25000.00,21.00,30250.00);
/*!40000 ALTER TABLE `factura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `linea_factura`
--

DROP TABLE IF EXISTS `linea_factura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `linea_factura` (
  `id_linea_factura` int NOT NULL AUTO_INCREMENT,
  `id_factura` int NOT NULL,
  `concepto` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `cantidad` decimal(10,2) NOT NULL DEFAULT '1.00',
  `precio_unitario` decimal(10,2) NOT NULL DEFAULT '0.00',
  `importe_linea` decimal(12,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id_linea_factura`),
  KEY `fk_linea_factura_factura` (`id_factura`),
  CONSTRAINT `fk_linea_factura_factura` FOREIGN KEY (`id_factura`) REFERENCES `factura` (`id_factura`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linea_factura`
--

LOCK TABLES `linea_factura` WRITE;
/*!40000 ALTER TABLE `linea_factura` DISABLE KEYS */;
INSERT INTO `linea_factura` VALUES (1,1,'Primer pago reforma vivienda',1.00,8000.00,8000.00),(2,2,'Certificación parcial nave industrial',1.00,25000.00,25000.00);
/*!40000 ALTER TABLE `linea_factura` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_linea_factura_bi` BEFORE INSERT ON `linea_factura` FOR EACH ROW BEGIN
    SET NEW.importe_linea = NEW.cantidad * NEW.precio_unitario;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_linea_factura_ai` AFTER INSERT ON `linea_factura` FOR EACH ROW BEGIN
    UPDATE factura
    SET base_imponible = (
            SELECT IFNULL(SUM(importe_linea), 0)
            FROM linea_factura
            WHERE id_factura = NEW.id_factura
        ),
        total_factura = (
            SELECT IFNULL(SUM(importe_linea), 0)
            FROM linea_factura
            WHERE id_factura = NEW.id_factura
        ) * (1 + iva / 100)
    WHERE id_factura = NEW.id_factura;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_linea_factura_bu` BEFORE UPDATE ON `linea_factura` FOR EACH ROW BEGIN
    SET NEW.importe_linea = NEW.cantidad * NEW.precio_unitario;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_linea_factura_au` AFTER UPDATE ON `linea_factura` FOR EACH ROW BEGIN
    UPDATE factura
    SET base_imponible = (
            SELECT IFNULL(SUM(importe_linea), 0)
            FROM linea_factura
            WHERE id_factura = NEW.id_factura
        ),
        total_factura = (
            SELECT IFNULL(SUM(importe_linea), 0)
            FROM linea_factura
            WHERE id_factura = NEW.id_factura
        ) * (1 + iva / 100)
    WHERE id_factura = NEW.id_factura;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_linea_factura_ad` AFTER DELETE ON `linea_factura` FOR EACH ROW BEGIN
    UPDATE factura
    SET base_imponible = (
            SELECT IFNULL(SUM(importe_linea), 0)
            FROM linea_factura
            WHERE id_factura = OLD.id_factura
        ),
        total_factura = (
            SELECT IFNULL(SUM(importe_linea), 0)
            FROM linea_factura
            WHERE id_factura = OLD.id_factura
        ) * (1 + iva / 100)
    WHERE id_factura = OLD.id_factura;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `linea_pedido_compra`
--

DROP TABLE IF EXISTS `linea_pedido_compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `linea_pedido_compra` (
  `id_linea_pedido` int NOT NULL AUTO_INCREMENT,
  `id_pedido` int NOT NULL,
  `id_material` int NOT NULL,
  `cantidad` decimal(10,2) NOT NULL DEFAULT '1.00',
  `precio_unitario` decimal(10,2) NOT NULL DEFAULT '0.00',
  `importe_linea` decimal(12,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id_linea_pedido`),
  KEY `fk_linea_pedido_pedido` (`id_pedido`),
  KEY `idx_linea_pedido_material` (`id_material`),
  CONSTRAINT `fk_linea_pedido_material` FOREIGN KEY (`id_material`) REFERENCES `material` (`id_material`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_linea_pedido_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedido_compra` (`id_pedido`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linea_pedido_compra`
--

LOCK TABLES `linea_pedido_compra` WRITE;
/*!40000 ALTER TABLE `linea_pedido_compra` DISABLE KEYS */;
INSERT INTO `linea_pedido_compra` VALUES (1,1,1,30.00,6.20,186.00),(2,1,2,1000.00,0.40,400.00),(3,2,4,200.00,1.10,220.00);
/*!40000 ALTER TABLE `linea_pedido_compra` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_linea_pedido_bi` BEFORE INSERT ON `linea_pedido_compra` FOR EACH ROW BEGIN
    SET NEW.importe_linea = NEW.cantidad * NEW.precio_unitario;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_linea_pedido_ai` AFTER INSERT ON `linea_pedido_compra` FOR EACH ROW BEGIN
    UPDATE pedido_compra
    SET importe_total = (
        SELECT IFNULL(SUM(importe_linea), 0)
        FROM linea_pedido_compra
        WHERE id_pedido = NEW.id_pedido
    )
    WHERE id_pedido = NEW.id_pedido;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trigger_actualizar_stock` AFTER INSERT ON `linea_pedido_compra` FOR EACH ROW BEGIN
    UPDATE stock
    SET cantidad_disponible = cantidad_disponible + NEW.cantidad,
        fecha_actualizacion = CURRENT_DATE
    WHERE id_material = NEW.id_material;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_linea_pedido_bu` BEFORE UPDATE ON `linea_pedido_compra` FOR EACH ROW BEGIN
    SET NEW.importe_linea = NEW.cantidad * NEW.precio_unitario;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_linea_pedido_au` AFTER UPDATE ON `linea_pedido_compra` FOR EACH ROW BEGIN
    UPDATE pedido_compra
    SET importe_total = (
        SELECT IFNULL(SUM(importe_linea), 0)
        FROM linea_pedido_compra
        WHERE id_pedido = NEW.id_pedido
    )
    WHERE id_pedido = NEW.id_pedido;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_linea_pedido_ad` AFTER DELETE ON `linea_pedido_compra` FOR EACH ROW BEGIN
    UPDATE pedido_compra
    SET importe_total = (
        SELECT IFNULL(SUM(importe_linea), 0)
        FROM linea_pedido_compra
        WHERE id_pedido = OLD.id_pedido
    )
    WHERE id_pedido = OLD.id_pedido;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `linea_presupuesto`
--

DROP TABLE IF EXISTS `linea_presupuesto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `linea_presupuesto` (
  `id_linea_presupuesto` int NOT NULL AUTO_INCREMENT,
  `id_presupuesto` int NOT NULL,
  `concepto` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `cantidad` decimal(10,2) NOT NULL DEFAULT '1.00',
  `precio_unitario` decimal(10,2) NOT NULL DEFAULT '0.00',
  `importe_linea` decimal(12,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id_linea_presupuesto`),
  KEY `fk_linea_presupuesto_presupuesto` (`id_presupuesto`),
  CONSTRAINT `fk_linea_presupuesto_presupuesto` FOREIGN KEY (`id_presupuesto`) REFERENCES `presupuesto` (`id_presupuesto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linea_presupuesto`
--

LOCK TABLES `linea_presupuesto` WRITE;
/*!40000 ALTER TABLE `linea_presupuesto` DISABLE KEYS */;
INSERT INTO `linea_presupuesto` VALUES (1,1,'Demolición interior',1.00,2500.00,2500.00),(2,1,'Albañilería general',1.00,6000.00,6000.00),(3,1,'Instalación eléctrica',1.00,3200.00,3200.00),(4,2,'Movimiento de tierras',1.00,15000.00,15000.00),(5,2,'Cimentación',1.00,35000.00,35000.00),(6,2,'Estructura metálica',1.00,42000.00,42000.00),(7,3,'Estudio previo y rehabilitación',1.00,28000.00,28000.00);
/*!40000 ALTER TABLE `linea_presupuesto` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_linea_presupuesto_bi` BEFORE INSERT ON `linea_presupuesto` FOR EACH ROW BEGIN
    SET NEW.importe_linea = NEW.cantidad * NEW.precio_unitario;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trigger_calcular_importe_presupuesto` BEFORE INSERT ON `linea_presupuesto` FOR EACH ROW BEGIN
    SET NEW.importe_linea = NEW.cantidad * NEW.precio_unitario;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_linea_presupuesto_ai` AFTER INSERT ON `linea_presupuesto` FOR EACH ROW BEGIN
    UPDATE presupuesto
    SET importe_total = (
        SELECT IFNULL(SUM(importe_linea), 0)
        FROM linea_presupuesto
        WHERE id_presupuesto = NEW.id_presupuesto
    )
    WHERE id_presupuesto = NEW.id_presupuesto;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_linea_presupuesto_bu` BEFORE UPDATE ON `linea_presupuesto` FOR EACH ROW BEGIN
    SET NEW.importe_linea = NEW.cantidad * NEW.precio_unitario;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_linea_presupuesto_au` AFTER UPDATE ON `linea_presupuesto` FOR EACH ROW BEGIN
    UPDATE presupuesto
    SET importe_total = (
        SELECT IFNULL(SUM(importe_linea), 0)
        FROM linea_presupuesto
        WHERE id_presupuesto = NEW.id_presupuesto
    )
    WHERE id_presupuesto = NEW.id_presupuesto;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_linea_presupuesto_ad` AFTER DELETE ON `linea_presupuesto` FOR EACH ROW BEGIN
    UPDATE presupuesto
    SET importe_total = (
        SELECT IFNULL(SUM(importe_linea), 0)
        FROM linea_presupuesto
        WHERE id_presupuesto = OLD.id_presupuesto
    )
    WHERE id_presupuesto = OLD.id_presupuesto;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `material`
--

DROP TABLE IF EXISTS `material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material` (
  `id_material` int NOT NULL AUTO_INCREMENT,
  `id_categoria_material` int NOT NULL,
  `id_proveedor` int NOT NULL,
  `nombre_material` varchar(150) COLLATE utf8mb4_spanish_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `unidad_medida` enum('kg','uds','m','m2','m3','l','saco','palet') COLLATE utf8mb4_spanish_ci NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL DEFAULT '0.00',
  `stock_minimo` decimal(10,2) NOT NULL DEFAULT '0.00',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_material`),
  KEY `idx_material_categoria` (`id_categoria_material`),
  KEY `idx_material_proveedor` (`id_proveedor`),
  CONSTRAINT `fk_material_categoria` FOREIGN KEY (`id_categoria_material`) REFERENCES `categoria_material` (`id_categoria_material`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_material_proveedor` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material`
--

LOCK TABLES `material` WRITE;
/*!40000 ALTER TABLE `material` DISABLE KEYS */;
INSERT INTO `material` VALUES (1,1,1,'Cemento gris 25kg','Saco de cemento gris','saco',6.50,20.00,1),(2,2,1,'Ladrillo hueco','Ladrillo cerámico hueco','uds',0.45,500.00,1),(3,3,1,'Pintura blanca 15L','Pintura plástica interior','uds',32.00,10.00,1),(4,4,2,'Cable eléctrico 2.5mm','Bobina de cable eléctrico','m',1.20,100.00,1);
/*!40000 ALTER TABLE `material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `obra`
--

DROP TABLE IF EXISTS `obra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obra` (
  `id_obra` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `nombre_obra` varchar(200) COLLATE utf8mb4_spanish_ci NOT NULL,
  `direccion_obra` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin_prevista` date DEFAULT NULL,
  `fecha_fin_real` date DEFAULT NULL,
  `estado` enum('pendiente','en_ejecucion','finalizada','cancelada') COLLATE utf8mb4_spanish_ci NOT NULL DEFAULT 'pendiente',
  `descripcion` text COLLATE utf8mb4_spanish_ci,
  `presupuesto_total_estimado` decimal(12,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id_obra`),
  KEY `idx_obra_cliente` (`id_cliente`),
  CONSTRAINT `fk_obra_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obra`
--

LOCK TABLES `obra` WRITE;
/*!40000 ALTER TABLE `obra` DISABLE KEYS */;
INSERT INTO `obra` VALUES (1,1,'Reforma vivienda Calle Mayor','Calle Mayor 10, Madrid','2025-01-15','2025-04-30',NULL,'en_ejecucion','Reforma integral de vivienda',18000.00),(2,2,'Construcción nave industrial','Polígono Sur, Madrid','2025-02-01','2025-08-31',NULL,'en_ejecucion','Construcción de nave industrial',125000.00),(3,3,'Rehabilitación edificio municipal','Centro histórico, Toledo','2025-03-10','2025-10-30',NULL,'pendiente','Rehabilitación de edificio público',210000.00);
/*!40000 ALTER TABLE `obra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_compra`
--

DROP TABLE IF EXISTS `pedido_compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido_compra` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `id_proveedor` int NOT NULL,
  `fecha_pedido` date NOT NULL,
  `fecha_recepcion` date DEFAULT NULL,
  `estado` enum('pendiente','recibido','cancelado') COLLATE utf8mb4_spanish_ci NOT NULL DEFAULT 'pendiente',
  `importe_total` decimal(12,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id_pedido`),
  KEY `idx_pedido_proveedor` (`id_proveedor`),
  CONSTRAINT `fk_pedido_proveedor` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_compra`
--

LOCK TABLES `pedido_compra` WRITE;
/*!40000 ALTER TABLE `pedido_compra` DISABLE KEYS */;
INSERT INTO `pedido_compra` VALUES (1,1,'2025-01-18','2025-01-20','recibido',586.00),(2,2,'2025-02-05',NULL,'pendiente',220.00);
/*!40000 ALTER TABLE `pedido_compra` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_pedido_recibido_au` AFTER UPDATE ON `pedido_compra` FOR EACH ROW BEGIN
    IF OLD.estado <> 'recibido' AND NEW.estado = 'recibido' THEN

        INSERT INTO stock (id_material, cantidad_disponible, ubicacion_almacen)
        SELECT lpc.id_material, lpc.cantidad, 'Almacén principal'
        FROM linea_pedido_compra lpc
        WHERE lpc.id_pedido = NEW.id_pedido
        ON DUPLICATE KEY UPDATE
            cantidad_disponible = cantidad_disponible + VALUES(cantidad_disponible),
            fecha_actualizacion = CURRENT_TIMESTAMP;

    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `presupuesto`
--

DROP TABLE IF EXISTS `presupuesto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `presupuesto` (
  `id_presupuesto` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `id_obra` int DEFAULT NULL,
  `fecha_presupuesto` date NOT NULL,
  `estado` enum('pendiente','aceptado','rechazado') COLLATE utf8mb4_spanish_ci NOT NULL DEFAULT 'pendiente',
  `importe_total` decimal(12,2) NOT NULL DEFAULT '0.00',
  `observaciones` text COLLATE utf8mb4_spanish_ci,
  PRIMARY KEY (`id_presupuesto`),
  KEY `idx_presupuesto_cliente` (`id_cliente`),
  KEY `idx_presupuesto_obra` (`id_obra`),
  CONSTRAINT `fk_presupuesto_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_presupuesto_obra` FOREIGN KEY (`id_obra`) REFERENCES `obra` (`id_obra`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presupuesto`
--

LOCK TABLES `presupuesto` WRITE;
/*!40000 ALTER TABLE `presupuesto` DISABLE KEYS */;
INSERT INTO `presupuesto` VALUES (1,1,1,'2025-01-05','aceptado',11700.00,'Presupuesto aceptado por el cliente'),(2,2,2,'2025-01-20','aceptado',92000.00,'Proyecto industrial aprobado'),(3,3,NULL,'2025-02-25','pendiente',28000.00,'Pendiente de adjudicación');
/*!40000 ALTER TABLE `presupuesto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedor`
--

DROP TABLE IF EXISTS `proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedor` (
  `id_proveedor` int NOT NULL AUTO_INCREMENT,
  `nombre_empresa` varchar(200) COLLATE utf8mb4_spanish_ci NOT NULL,
  `cif` varchar(20) COLLATE utf8mb4_spanish_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `persona_contacto` varchar(150) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_proveedor`),
  UNIQUE KEY `cif` (`cif`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedor`
--

LOCK TABLES `proveedor` WRITE;
/*!40000 ALTER TABLE `proveedor` DISABLE KEYS */;
INSERT INTO `proveedor` VALUES (1,'Materiales Madrid S.L.','B87654321','910222333','ventas@materialesmadrid.com','Polígono Norte, Madrid','Carlos Gómez',1),(2,'Hormigones Centro S.A.','A11223344','910333444','pedidos@hormigonescentro.com','Getafe, Madrid','Ana Torres',1);
/*!40000 ALTER TABLE `proveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock` (
  `id_stock` int NOT NULL AUTO_INCREMENT,
  `id_material` int NOT NULL,
  `cantidad_disponible` decimal(10,2) NOT NULL DEFAULT '0.00',
  `ubicacion_almacen` varchar(150) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `fecha_actualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_stock`),
  UNIQUE KEY `id_material` (`id_material`),
  CONSTRAINT `fk_stock_material` FOREIGN KEY (`id_material`) REFERENCES `material` (`id_material`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
INSERT INTO `stock` VALUES (1,1,50.00,'Almacén principal','2026-03-11 17:22:34'),(2,2,1200.00,'Almacén principal','2026-03-11 17:22:34'),(3,3,15.00,'Almacén principal','2026-03-11 17:22:34'),(4,4,300.00,'Almacén principal','2026-03-11 17:22:34');
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vista_empleados_categoria`
--

DROP TABLE IF EXISTS `vista_empleados_categoria`;
/*!50001 DROP VIEW IF EXISTS `vista_empleados_categoria`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_empleados_categoria` AS SELECT 
 1 AS `id_empleado`,
 1 AS `nombre`,
 1 AS `apellidos`,
 1 AS `nombre_categoria`,
 1 AS `dni`,
 1 AS `telefono`,
 1 AS `email`,
 1 AS `fecha_alta`,
 1 AS `salario_base`,
 1 AS `activo`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_facturas_detalle`
--

DROP TABLE IF EXISTS `vista_facturas_detalle`;
/*!50001 DROP VIEW IF EXISTS `vista_facturas_detalle`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_facturas_detalle` AS SELECT 
 1 AS `id_factura`,
 1 AS `fecha_factura`,
 1 AS `estado`,
 1 AS `base_imponible`,
 1 AS `iva`,
 1 AS `total_factura`,
 1 AS `nombre_cliente`,
 1 AS `nombre_obra`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_materiales_stock`
--

DROP TABLE IF EXISTS `vista_materiales_stock`;
/*!50001 DROP VIEW IF EXISTS `vista_materiales_stock`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_materiales_stock` AS SELECT 
 1 AS `id_material`,
 1 AS `nombre_material`,
 1 AS `categoria`,
 1 AS `proveedor`,
 1 AS `unidad_medida`,
 1 AS `precio_unitario`,
 1 AS `stock_minimo`,
 1 AS `cantidad_disponible`,
 1 AS `ubicacion_almacen`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_obras_clientes`
--

DROP TABLE IF EXISTS `vista_obras_clientes`;
/*!50001 DROP VIEW IF EXISTS `vista_obras_clientes`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_obras_clientes` AS SELECT 
 1 AS `id_obra`,
 1 AS `nombre_obra`,
 1 AS `direccion_obra`,
 1 AS `fecha_inicio`,
 1 AS `fecha_fin_prevista`,
 1 AS `fecha_fin_real`,
 1 AS `estado`,
 1 AS `presupuesto_total_estimado`,
 1 AS `id_cliente`,
 1 AS `nombre_cliente`,
 1 AS `razon_social`,
 1 AS `telefono`,
 1 AS `email`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'construcciones_perez'
--

--
-- Dumping routines for database 'construcciones_perez'
--

--
-- Final view structure for view `vista_empleados_categoria`
--

/*!50001 DROP VIEW IF EXISTS `vista_empleados_categoria`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_empleados_categoria` AS select `e`.`id_empleado` AS `id_empleado`,`e`.`nombre` AS `nombre`,`e`.`apellidos` AS `apellidos`,`ce`.`nombre_categoria` AS `nombre_categoria`,`e`.`dni` AS `dni`,`e`.`telefono` AS `telefono`,`e`.`email` AS `email`,`e`.`fecha_alta` AS `fecha_alta`,`e`.`salario_base` AS `salario_base`,`e`.`activo` AS `activo` from (`empleado` `e` join `categoria_empleado` `ce` on((`e`.`id_categoria_empleado` = `ce`.`id_categoria_empleado`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_facturas_detalle`
--

/*!50001 DROP VIEW IF EXISTS `vista_facturas_detalle`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_facturas_detalle` AS select `f`.`id_factura` AS `id_factura`,`f`.`fecha_factura` AS `fecha_factura`,`f`.`estado` AS `estado`,`f`.`base_imponible` AS `base_imponible`,`f`.`iva` AS `iva`,`f`.`total_factura` AS `total_factura`,`c`.`nombre` AS `nombre_cliente`,`o`.`nombre_obra` AS `nombre_obra` from ((`factura` `f` join `cliente` `c` on((`f`.`id_cliente` = `c`.`id_cliente`))) join `obra` `o` on((`f`.`id_obra` = `o`.`id_obra`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_materiales_stock`
--

/*!50001 DROP VIEW IF EXISTS `vista_materiales_stock`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_materiales_stock` AS select `m`.`id_material` AS `id_material`,`m`.`nombre_material` AS `nombre_material`,`cm`.`nombre_categoria` AS `categoria`,`p`.`nombre_empresa` AS `proveedor`,`m`.`unidad_medida` AS `unidad_medida`,`m`.`precio_unitario` AS `precio_unitario`,`m`.`stock_minimo` AS `stock_minimo`,ifnull(`s`.`cantidad_disponible`,0) AS `cantidad_disponible`,`s`.`ubicacion_almacen` AS `ubicacion_almacen` from (((`material` `m` join `categoria_material` `cm` on((`m`.`id_categoria_material` = `cm`.`id_categoria_material`))) join `proveedor` `p` on((`m`.`id_proveedor` = `p`.`id_proveedor`))) left join `stock` `s` on((`m`.`id_material` = `s`.`id_material`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_obras_clientes`
--

/*!50001 DROP VIEW IF EXISTS `vista_obras_clientes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_obras_clientes` AS select `o`.`id_obra` AS `id_obra`,`o`.`nombre_obra` AS `nombre_obra`,`o`.`direccion_obra` AS `direccion_obra`,`o`.`fecha_inicio` AS `fecha_inicio`,`o`.`fecha_fin_prevista` AS `fecha_fin_prevista`,`o`.`fecha_fin_real` AS `fecha_fin_real`,`o`.`estado` AS `estado`,`o`.`presupuesto_total_estimado` AS `presupuesto_total_estimado`,`c`.`id_cliente` AS `id_cliente`,`c`.`nombre` AS `nombre_cliente`,`c`.`razon_social` AS `razon_social`,`c`.`telefono` AS `telefono`,`c`.`email` AS `email` from (`obra` `o` join `cliente` `c` on((`o`.`id_cliente` = `c`.`id_cliente`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-10 18:16:12
