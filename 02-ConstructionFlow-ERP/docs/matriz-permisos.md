# Matriz de permisos — ConstructionFlow ERP

**Proyecto:** ConstructionFlow ERP
**Autora:** Esther Tregón Pérez
**Versión:** 1.0
**Estado:** aprobada para Sprint 1

---

## 1. Propósito

Este documento define qué puede hacer cada rol sobre cada módulo del ERP. Es la fuente de verdad del sistema de autorización: el middleware del backend se implementa a partir de esta tabla, no al revés.

Cualquier cambio de permisos empieza aquí y termina en el código.

---

## 2. Roles del sistema

| Rol | Identificador | Función |
|---|---|---|
| Administrador | `administrador` | Administración técnica del sistema |
| Dirección | `direccion` | Gerencia, visión global y económica |
| Administración | `administracion` | Gestión administrativa, facturación y personal |
| Comercial | `comercial` | Captación de clientes y presupuestos |
| Técnico | `tecnico` | Mediciones, presupuestos técnicos y materiales |
| Jefe de obra | `jefe_obra` | Ejecución de obra, personal y aprovisionamiento |
| Recepción | `recepcion` | Atención al cliente y consulta |

---

## 3. Acciones

Cada permiso se expresa con cuatro acciones independientes:

| Acción | Significado |
|---|---|
| **Ver** | Consultar listados y fichas |
| **Crear** | Dar de alta un registro nuevo |
| **Editar** | Modificar un registro existente |
| **Eliminar** | Dar de baja un registro |

**Nota sobre "Eliminar":** en los módulos con datos históricos (clientes, empleados, proveedores, materiales) el borrado es siempre **baja lógica**: se marca el registro como inactivo, no se ejecuta un `DELETE`. Las claves foráneas del esquema usan `ON DELETE RESTRICT`, así que un borrado real fallaría en cuanto el registro tenga obras, facturas o presupuestos asociados.

---

## 4. Permisos por módulo

### 4.1 Clientes

| Rol | Ver | Crear | Editar | Eliminar |
|---|:---:|:---:|:---:|:---:|
| Administrador | Sí | Sí | Sí | Sí |
| Dirección | Sí | No | No | No |
| Administración | Sí | Sí | Sí | No |
| Comercial | Sí | Sí | Sí | No |
| Técnico | Sí | No | No | No |
| Jefe de obra | Sí | No | No | No |
| Recepción | Sí | Sí | Sí | No |

Solo Administrador puede dar de baja un cliente.

---

### 4.2 Obras

| Rol | Ver | Crear | Editar | Eliminar |
|---|:---:|:---:|:---:|:---:|
| Administrador | Sí | Sí | Sí | Sí |
| Dirección | Sí | No | No | No |
| Administración | Sí | Sí | Sí | No |
| Comercial | Sí | No | No | No |
| Técnico | Sí | Sí | Sí | No |
| Jefe de obra | Sí | No | Sí | No |
| Recepción | Sí | No | No | No |

El jefe de obra edita el estado y el avance de sus obras, pero no las da de alta.

---

### 4.3 Asignación de personal a obra

Corresponde a la tabla `empleado_obra`. Es un módulo distinto de Empleados.

| Rol | Ver | Crear | Editar | Eliminar |
|---|:---:|:---:|:---:|:---:|
| Administrador | Sí | Sí | Sí | Sí |
| Dirección | Sí | No | No | No |
| Administración | Sí | Sí | Sí | Sí |
| Comercial | No | No | No | No |
| Técnico | Sí | No | No | No |
| Jefe de obra | Sí | Sí | Sí | Sí |
| Recepción | No | No | No | No |

---

### 4.4 Presupuestos

| Rol | Ver | Crear | Editar | Eliminar |
|---|:---:|:---:|:---:|:---:|
| Administrador | Sí | Sí | Sí | Sí |
| Dirección | Sí | No | No | No |
| Administración | Sí | Sí | Sí | No |
| Comercial | Sí | Sí | Sí | No |
| Técnico | Sí | Sí | Sí | No |
| Jefe de obra | Sí | No | No | No |
| Recepción | Sí | No | No | No |

Un presupuesto en estado `aceptado` no se edita: se genera uno nuevo. Esta regla se implementa en la capa de servicio.

---

### 4.5 Facturación

| Rol | Ver | Crear | Editar | Eliminar |
|---|:---:|:---:|:---:|:---:|
| Administrador | Sí | Sí | Sí | No |
| Dirección | Sí | No | No | No |
| Administración | Sí | Sí | Sí | No |
| Comercial | No | No | No | No |
| Técnico | No | No | No | No |
| Jefe de obra | No | No | No | No |
| Recepción | No | No | No | No |

**Nadie puede eliminar facturas, ni el Administrador.** Una factura emitida se rectifica con una factura rectificativa, nunca se borra. Es una obligación legal en España, no una decisión de diseño. El endpoint `DELETE /api/facturas/:id` no existirá.

---

### 4.6 Materiales (catálogo)

| Rol | Ver | Crear | Editar | Eliminar |
|---|:---:|:---:|:---:|:---:|
| Administrador | Sí | Sí | Sí | Sí |
| Dirección | Sí | No | No | No |
| Administración | Sí | No | No | No |
| Comercial | No | No | No | No |
| Técnico | Sí | Sí | Sí | No |
| Jefe de obra | Sí | Sí | Sí | No |
| Recepción | No | No | No | No |

---

### 4.7 Stock

| Rol | Ver | Crear | Editar | Eliminar |
|---|:---:|:---:|:---:|:---:|
| Administrador | Sí | No | Sí | No |
| Dirección | Sí | No | No | No |
| Administración | Sí | No | No | No |
| Comercial | No | No | No | No |
| Técnico | Sí | No | No | No |
| Jefe de obra | Sí | No | Sí | No |
| Recepción | No | No | No | No |

**El stock no se crea ni se elimina desde la interfaz.** Las filas de `stock` las genera el trigger `trg_pedido_recibido_au` cuando un pedido pasa a estado `recibido`. La acción "Editar" queda reservada a ajustes de inventario (mermas, roturas, recuentos), y debe registrarse siempre con motivo.

---

### 4.8 Proveedores

| Rol | Ver | Crear | Editar | Eliminar |
|---|:---:|:---:|:---:|:---:|
| Administrador | Sí | Sí | Sí | Sí |
| Dirección | Sí | No | No | No |
| Administración | Sí | Sí | Sí | No |
| Comercial | No | No | No | No |
| Técnico | Sí | No | No | No |
| Jefe de obra | Sí | No | No | No |
| Recepción | No | No | No | No |

---

### 4.9 Pedidos de compra

| Rol | Ver | Crear | Editar | Eliminar |
|---|:---:|:---:|:---:|:---:|
| Administrador | Sí | Sí | Sí | Sí |
| Dirección | Sí | No | No | No |
| Administración | Sí | Sí | Sí | No |
| Comercial | No | No | No | No |
| Técnico | Sí | No | No | No |
| Jefe de obra | Sí | Sí | Sí | No |
| Recepción | No | No | No | No |

Marcar un pedido como `recibido` dispara la entrada de stock. Solo Administración y Jefe de obra pueden hacerlo.

---

### 4.10 Empleados

| Rol | Ver | Crear | Editar | Eliminar |
|---|:---:|:---:|:---:|:---:|
| Administrador | Sí | Sí | Sí | Sí |
| Dirección | Sí | No | No | No |
| Administración | Sí | Sí | Sí | No |
| Comercial | No | No | No | No |
| Técnico | Sí | No | No | No |
| Jefe de obra | Sí | Sí | Sí | No |
| Recepción | No | No | No | No |

El jefe de obra puede contratar, con la restricción salarial de la sección 5.

---

### 4.11 Usuarios y roles

| Rol | Ver | Crear | Editar | Eliminar |
|---|:---:|:---:|:---:|:---:|
| Administrador | Sí | Sí | Sí | Sí |
| Resto de roles | No | No | No | No |

Todo usuario puede cambiar su propia contraseña. Eso no es el módulo de Usuarios: es una acción sobre el propio perfil.

---

### 4.12 Configuración del sistema

| Rol | Ver | Crear | Editar | Eliminar |
|---|:---:|:---:|:---:|:---:|
| Administrador | Sí | Sí | Sí | Sí |
| Resto de roles | No | No | No | No |

---

### 4.13 Dashboard

Pendiente de definir. No tendrá permisos propios: cada indicador heredará el permiso de su módulo de origen. Un rol sin acceso a facturación no recibirá los datos de facturación del dashboard, ni siquiera calculados.

---

## 5. Permisos a nivel de campo

La matriz anterior funciona a nivel de módulo. Un campo requiere regla propia.

### `empleado.salario_base`

| Rol | Acceso al campo |
|---|---|
| Administrador | Sí |
| Dirección | Sí |
| Administración | Sí |
| Jefe de obra | No |
| Técnico | No |
| Comercial | Sin acceso al módulo |
| Recepción | Sin acceso al módulo |

**Implementación obligatoria:** el backend elimina el campo del objeto antes de serializar la respuesta. Cuando el jefe de obra crea un empleado, el campo se guarda vacío y lo completa Administración.

Ocultar el campo con CSS o con un `v-if` en el frontend **no es seguridad**: el dato viaja en la respuesta y cualquiera lo ve abriendo las herramientas de desarrollo.

---

## 6. Reglas transversales

1. **El frontend adapta, el backend impide.** Ocultar una opción de menú mejora la experiencia; no protege nada. Todo endpoint valida el rol en el servidor, siempre.

2. **Denegación por defecto.** Si un módulo o acción no aparece en esta matriz, está prohibido para todos los roles salvo Administrador.

3. **Verificación en dos capas.** El middleware comprueba el rol antes de llegar al controlador. La capa de servicio comprueba las reglas de negocio (por ejemplo, que un presupuesto aceptado no se edite).

4. **Un rol por usuario.** La tabla `usuario` tiene una única clave foránea a `rol`. No hay permisos acumulables en esta versión.

---

## 7. Implicaciones técnicas pendientes

**Migración 002 necesaria.** La tabla `cliente` no tiene columna `activo`, a diferencia de `empleado`, `material` y `proveedor`. Sin ella no se puede implementar la baja lógica de clientes acordada en la sección 4.1.

```sql
ALTER TABLE cliente
  ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1 AFTER fecha_alta;
```

**Respuesta del login.** El endpoint de autenticación debe devolver el rol y la lista de módulos permitidos, para que el frontend construya el panel correspondiente a cada perfil.

---

## 8. Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | Julio 2026 | Versión inicial aprobada para Sprint 1 |


