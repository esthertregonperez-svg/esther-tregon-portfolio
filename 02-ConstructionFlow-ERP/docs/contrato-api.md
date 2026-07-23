# Contrato de la API REST — ConstructionFlow ERP

**Proyecto:** ConstructionFlow ERP
**Autora:** Esther Tregón Pérez
**Versión:** 1.0
**Estado:** aprobado para Sprint 1

---

## 1. Propósito

Este documento define cómo se comunican el frontend y el backend: qué URLs existen, qué se envía, qué se devuelve y qué significa cada código de estado.

Es un contrato. Una vez acordado, el frontend puede desarrollarse sin esperar al backend, y viceversa. Cualquier cambio en un endpoint se refleja aquí antes de tocar el código.

---

## 2. Convenciones generales

### 2.1 URL base

```
http://localhost:3000/api
```

En producción cambiará el dominio, no la estructura.

### 2.2 Formato de respuesta

Todas las respuestas siguen la misma estructura, sin excepción.

**Éxito:**

```json
{
  "success": true,
  "data": { }
}
```

**Error:**

```json
{
  "success": false,
  "error": {
    "code": "CLIENTE_NO_ENCONTRADO",
    "message": "No existe un cliente con ese identificador"
  }
}
```

El campo `code` es para el frontend: identificador estable, en mayúsculas, que nunca cambia. El campo `message` es para la persona: texto legible que puede reescribirse o traducirse sin romper nada.

### 2.3 Verbos HTTP

| Verbo | Uso |
|---|---|
| `GET` | Consultar. Nunca modifica datos |
| `POST` | Crear un recurso nuevo |
| `PUT` | Actualizar un recurso completo |
| `PATCH` | Actualizar un campo concreto (cambios de estado) |
| `DELETE` | Dar de baja |

### 2.4 Nomenclatura de rutas

Recursos en plural y minúsculas. Identificador en la ruta.

```
GET    /api/clientes          listar
GET    /api/clientes/5        obtener uno
POST   /api/clientes          crear
PUT    /api/clientes/5        actualizar
DELETE /api/clientes/5        dar de baja
```

Recursos anidados cuando la relación es de pertenencia:

```
GET    /api/obras/3/empleados
GET    /api/presupuestos/7/lineas
POST   /api/facturas/12/lineas
```

### 2.5 Códigos de estado

| Código | Significado | Cuándo se usa |
|---|---|---|
| 200 | OK | Consulta o actualización correcta |
| 201 | Created | Recurso creado con `POST` |
| 204 | No Content | Borrado correcto, sin cuerpo de respuesta |
| 400 | Bad Request | Datos ausentes o con formato inválido |
| 401 | Unauthorized | Token ausente, caducado o inválido |
| 403 | Forbidden | Autenticado, pero sin permiso para esta acción |
| 404 | Not Found | El recurso no existe |
| 409 | Conflict | Violación de unicidad o regla de negocio |
| 422 | Unprocessable Entity | Datos válidos en forma, inválidos en contenido |
| 500 | Internal Server Error | Fallo no controlado del servidor |

**Distinción clave entre 401 y 403.** El 401 significa "no sé quién eres": se resuelve iniciando sesión. El 403 significa "sé quién eres y no puedes hacer esto": no se resuelve reintentando. Confundirlos es un error habitual.

### 2.6 Paginación

Todos los listados están paginados desde el primer día.

**Parámetros de consulta:**

| Parámetro | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `page` | entero | 1 | Página solicitada |
| `limit` | entero | 20 | Registros por página (máximo 100) |
| `search` | texto | — | Búsqueda de texto libre |
| `sort` | texto | — | Campo de ordenación |
| `order` | texto | `asc` | Sentido: `asc` o `desc` |

**Ejemplo:**

```
GET /api/clientes?page=2&limit=20&search=perez&sort=nombre&order=asc
```

**Respuesta de un listado paginado:**

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 2,
      "limit": 20,
      "total": 143,
      "totalPages": 8
    }
  }
}
```

### 2.7 Autenticación

Todos los endpoints requieren token salvo `POST /api/auth/login`.

El token viaja en la cabecera:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Caducidad: 8 horas, definida en `JWT_EXPIRES_IN`. Equivale a una jornada laboral.

### 2.8 Formatos de datos

| Tipo | Formato | Ejemplo |
|---|---|---|
| Fecha | `YYYY-MM-DD` | `2026-07-23` |
| Fecha y hora | ISO 8601 UTC | `2026-07-23T10:30:00Z` |
| Decimales | Número, punto decimal | `1250.50` |
| Booleanos | `true` / `false` | `true` |

Los importes viajan como número, nunca como texto con símbolo de moneda. El formateo es responsabilidad del frontend.

---

## 3. Códigos de error

Catálogo de códigos estables. El frontend puede reaccionar a ellos de forma específica.

### 3.1 Autenticación

| Código | HTTP | Significado |
|---|---|---|
| `CREDENCIALES_INVALIDAS` | 401 | Email o contraseña incorrectos |
| `TOKEN_AUSENTE` | 401 | No se envió la cabecera Authorization |
| `TOKEN_INVALIDO` | 401 | Token malformado o firma incorrecta |
| `TOKEN_EXPIRADO` | 401 | La sesión ha caducado |
| `USUARIO_INACTIVO` | 403 | La cuenta está desactivada |
| `PERMISO_DENEGADO` | 403 | El rol no permite esta acción |

### 3.2 Validación

| Código | HTTP | Significado |
|---|---|---|
| `DATOS_INVALIDOS` | 400 | Faltan campos o el formato es incorrecto |
| `RECURSO_NO_ENCONTRADO` | 404 | El identificador no existe |
| `VALOR_DUPLICADO` | 409 | Violación de restricción única |

### 3.3 Negocio

| Código | HTTP | Significado |
|---|---|---|
| `PRESUPUESTO_NO_EDITABLE` | 409 | Un presupuesto aceptado no se modifica |
| `FACTURA_NO_ELIMINABLE` | 403 | Las facturas no se borran nunca |
| `CLIENTE_CON_DEPENDENCIAS` | 409 | Tiene obras o facturas asociadas |
| `STOCK_INSUFICIENTE` | 409 | No hay cantidad disponible |
| `PEDIDO_YA_RECIBIDO` | 409 | El pedido ya entró en almacén |

**Respuesta de error de validación con detalle por campo:**

```json
{
  "success": false,
  "error": {
    "code": "DATOS_INVALIDOS",
    "message": "Los datos enviados no son válidos",
    "fields": {
      "email": "El formato del email no es correcto",
      "dni_cif": "Este campo es obligatorio"
    }
  }
}
```

---

## 4. Módulo de autenticación

Especificación completa. Es el módulo del Sprint 1.

### 4.1 Iniciar sesión

```
POST /api/auth/login
```

Único endpoint público de la API.

**Petición:**

```json
{
  "email": "admin@construccionesperez.es",
  "password": "MiClaveSegura123"
}
```

**Respuesta 200:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 28800,
    "usuario": {
      "id_usuario": 1,
      "email": "admin@construccionesperez.es",
      "rol": "administrador",
      "id_empleado": null,
      "nombre_completo": null
    },
    "permisos": {
      "clientes":    ["ver", "crear", "editar", "eliminar"],
      "obras":       ["ver", "crear", "editar", "eliminar"],
      "presupuestos":["ver", "crear", "editar", "eliminar"],
      "facturacion": ["ver", "crear", "editar"],
      "materiales":  ["ver", "crear", "editar", "eliminar"],
      "stock":       ["ver", "editar"],
      "proveedores": ["ver", "crear", "editar", "eliminar"],
      "pedidos":     ["ver", "crear", "editar", "eliminar"],
      "empleados":   ["ver", "crear", "editar", "eliminar"],
      "usuarios":    ["ver", "crear", "editar", "eliminar"]
    }
  }
}
```

El objeto `permisos` procede de la matriz de permisos. Permite al frontend construir el menú y el panel de cada rol sin consultas adicionales.

**Recordatorio de seguridad:** este objeto sirve para adaptar la interfaz, no para protegerla. Cada endpoint vuelve a validar el permiso en el servidor.

**Errores posibles:**

| HTTP | Código | Situación |
|---|---|---|
| 400 | `DATOS_INVALIDOS` | Falta email o contraseña |
| 401 | `CREDENCIALES_INVALIDAS` | Email o contraseña incorrectos |
| 403 | `USUARIO_INACTIVO` | La cuenta está desactivada |

**Nota importante:** si el email no existe o la contraseña es incorrecta, la respuesta es idéntica en ambos casos: `CREDENCIALES_INVALIDAS`. Distinguirlos permitiría a un atacante averiguar qué emails están registrados.

### 4.2 Obtener perfil propio

```
GET /api/auth/me
```

Devuelve los datos del usuario autenticado a partir del token. Útil al recargar la página.

**Respuesta 200:** mismo objeto `usuario` y `permisos` que en el login, sin el token.

**Errores:** 401 `TOKEN_AUSENTE`, `TOKEN_INVALIDO` o `TOKEN_EXPIRADO`.

### 4.3 Cambiar la contraseña propia

```
PATCH /api/auth/password
```

**Petición:**

```json
{
  "passwordActual": "MiClaveVieja123",
  "passwordNueva": "MiClaveNueva456"
}
```

**Respuesta 200:**

```json
{
  "success": true,
  "data": { "message": "Contraseña actualizada correctamente" }
}
```

Se exige la contraseña actual aunque el usuario ya esté autenticado: protege frente a una sesión abierta en un equipo desatendido.

**Errores:** 400 `DATOS_INVALIDOS`, 401 `CREDENCIALES_INVALIDAS` si la actual no coincide.

### 4.4 Cerrar sesión

```
POST /api/auth/logout
```

En esta versión el cierre de sesión es responsabilidad del cliente: basta con descartar el token. El endpoint existe por coherencia y para registrar el evento en los logs.

---

## 5. Endpoints por módulo

Los permisos indicados remiten a `docs/matriz-permisos.md`.

### 5.1 Clientes

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/clientes` | Listado paginado |
| `GET` | `/api/clientes/:id` | Ficha de un cliente |
| `GET` | `/api/clientes/:id/obras` | Obras del cliente |
| `GET` | `/api/clientes/:id/facturas` | Facturas del cliente |
| `POST` | `/api/clientes` | Crear |
| `PUT` | `/api/clientes/:id` | Actualizar |
| `DELETE` | `/api/clientes/:id` | Baja lógica. Solo Administrador |

Filtros propios: `tipo_cliente`, `activo`.

`dni_cif` es único: un duplicado devuelve 409 `VALOR_DUPLICADO`.

### 5.2 Obras

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/obras` | Listado paginado |
| `GET` | `/api/obras/:id` | Ficha de una obra |
| `GET` | `/api/obras/:id/empleados` | Personal asignado |
| `GET` | `/api/obras/:id/presupuestos` | Presupuestos asociados |
| `POST` | `/api/obras` | Crear |
| `PUT` | `/api/obras/:id` | Actualizar |
| `PATCH` | `/api/obras/:id/estado` | Cambiar estado |
| `DELETE` | `/api/obras/:id` | Eliminar |

Filtros propios: `estado`, `id_cliente`, rango de fechas.

Estados válidos: `pendiente`, `en_ejecucion`, `finalizada`, `cancelada`.

### 5.3 Asignación de personal

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/obras/:id/empleados` | Asignar empleado a obra |
| `PUT` | `/api/obras/:id/empleados/:idEmpleado` | Modificar asignación |
| `DELETE` | `/api/obras/:id/empleados/:idEmpleado` | Retirar asignación |

La pareja empleado-obra es única: reasignar el mismo empleado devuelve 409.

### 5.4 Presupuestos

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/presupuestos` | Listado paginado |
| `GET` | `/api/presupuestos/:id` | Cabecera con sus líneas |
| `POST` | `/api/presupuestos` | Crear cabecera |
| `PUT` | `/api/presupuestos/:id` | Actualizar cabecera |
| `PATCH` | `/api/presupuestos/:id/estado` | Aceptar o rechazar |
| `DELETE` | `/api/presupuestos/:id` | Eliminar |
| `POST` | `/api/presupuestos/:id/lineas` | Añadir línea |
| `PUT` | `/api/presupuestos/:id/lineas/:idLinea` | Modificar línea |
| `DELETE` | `/api/presupuestos/:id/lineas/:idLinea` | Eliminar línea |

**Regla crítica.** El campo `importe_linea` lo calcula un trigger de MySQL. La API **nunca** lo acepta en la petición ni permite escribirlo. Se envían `concepto`, `cantidad` y `precio_unitario`.

Igual sucede con `importe_total` de la cabecera: se recalcula solo tras cada cambio en las líneas.

Tras crear o modificar una línea, el backend relee el registro para devolver los valores ya calculados por la base de datos.

Un presupuesto en estado `aceptado` no se modifica: devuelve 409 `PRESUPUESTO_NO_EDITABLE`.

### 5.5 Facturación

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/facturas` | Listado paginado |
| `GET` | `/api/facturas/:id` | Cabecera con sus líneas |
| `POST` | `/api/facturas` | Crear |
| `PUT` | `/api/facturas/:id` | Actualizar |
| `PATCH` | `/api/facturas/:id/estado` | Marcar como cobrada |
| `POST` | `/api/facturas/:id/lineas` | Añadir línea |
| `PUT` | `/api/facturas/:id/lineas/:idLinea` | Modificar línea |
| `DELETE` | `/api/facturas/:id/lineas/:idLinea` | Eliminar línea |
| `GET` | `/api/facturas/:id/pdf` | Descargar en PDF |

**No existe `DELETE /api/facturas/:id`.** Una factura emitida no se borra: se rectifica con otra factura. Es una obligación legal. El endpoint no se implementa; si se solicita, la respuesta es 403 `FACTURA_NO_ELIMINABLE`.

Los campos `base_imponible` y `total_factura` los calculan triggers. La API no los acepta en la petición.

### 5.6 Materiales y categorías

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/materiales` | Listado paginado |
| `GET` | `/api/materiales/:id` | Ficha con stock actual |
| `POST` | `/api/materiales` | Crear |
| `PUT` | `/api/materiales/:id` | Actualizar |
| `DELETE` | `/api/materiales/:id` | Baja lógica |
| `GET` | `/api/categorias-material` | Listar categorías |
| `POST` | `/api/categorias-material` | Crear categoría |

Filtros propios: `id_categoria_material`, `id_proveedor`, `activo`, `bajo_minimo`.

### 5.7 Stock

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/stock` | Listado con nivel actual |
| `GET` | `/api/stock/alertas` | Materiales bajo mínimo |
| `PATCH` | `/api/stock/:idMaterial` | Ajuste de inventario |

**No existen `POST` ni `DELETE`.** Las filas de stock las genera el trigger `trg_pedido_recibido_au` al recibir un pedido. El `PATCH` sirve solo para ajustes (mermas, roturas, recuentos) y exige un campo `motivo` obligatorio.

### 5.8 Proveedores

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/proveedores` | Listado paginado |
| `GET` | `/api/proveedores/:id` | Ficha |
| `GET` | `/api/proveedores/:id/materiales` | Catálogo del proveedor |
| `POST` | `/api/proveedores` | Crear |
| `PUT` | `/api/proveedores/:id` | Actualizar |
| `DELETE` | `/api/proveedores/:id` | Baja lógica |

`cif` es único.

### 5.9 Pedidos de compra

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/pedidos` | Listado paginado |
| `GET` | `/api/pedidos/:id` | Cabecera con sus líneas |
| `POST` | `/api/pedidos` | Crear |
| `PUT` | `/api/pedidos/:id` | Actualizar |
| `PATCH` | `/api/pedidos/:id/estado` | Marcar como recibido |
| `POST` | `/api/pedidos/:id/lineas` | Añadir línea |
| `PUT` | `/api/pedidos/:id/lineas/:idLinea` | Modificar línea |
| `DELETE` | `/api/pedidos/:id/lineas/:idLinea` | Eliminar línea |

**Efecto secundario documentado.** Cambiar el estado a `recibido` incrementa el stock automáticamente, mediante trigger. Es irreversible desde la API: volver a marcarlo devuelve 409 `PEDIDO_YA_RECIBIDO`.

### 5.10 Empleados

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/empleados` | Listado paginado |
| `GET` | `/api/empleados/:id` | Ficha |
| `GET` | `/api/empleados/:id/obras` | Obras asignadas |
| `POST` | `/api/empleados` | Crear |
| `PUT` | `/api/empleados/:id` | Actualizar |
| `DELETE` | `/api/empleados/:id` | Baja lógica |
| `GET` | `/api/categorias-empleado` | Listar categorías |

**Filtrado obligatorio de campo.** El campo `salario_base` solo se incluye en la respuesta para los roles Administrador, Dirección y Administración. Para el resto, el backend lo elimina del objeto antes de serializar.

Cuando el Jefe de obra crea un empleado, el campo `salario_base` se ignora si viene en la petición y queda a `NULL`.

### 5.11 Usuarios y roles

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/usuarios` | Listado paginado |
| `GET` | `/api/usuarios/:id` | Ficha |
| `POST` | `/api/usuarios` | Crear |
| `PUT` | `/api/usuarios/:id` | Actualizar |
| `PATCH` | `/api/usuarios/:id/activo` | Activar o desactivar |
| `DELETE` | `/api/usuarios/:id` | Eliminar |
| `GET` | `/api/roles` | Listar roles |

Exclusivo del rol Administrador.

**El campo `password_hash` no aparece nunca en ninguna respuesta de la API.** Ni en listados, ni en fichas, ni por error. El repositorio lo excluye explícitamente en el `SELECT`.

Al crear un usuario se envía `password` en claro sobre HTTPS; el servicio la cifra con bcrypt antes de guardarla y descarta el valor original.

---

## 6. Estructura de rutas en el código

Cada módulo se implementa en cuatro archivos, uno por capa:

```
src/routes/cliente.routes.js
src/controllers/cliente.controller.js
src/services/cliente.service.js
src/repositories/cliente.repository.js
```

Las rutas se registran en `src/app.js` con un prefijo común:

```javascript
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
```

---

## 7. Middlewares

Orden de ejecución de cada petición:

1. `cors` — permite peticiones del frontend
2. `express.json()` — interpreta el cuerpo JSON
3. `authMiddleware` — verifica el token JWT
4. `roleMiddleware` — comprueba el permiso según la matriz
5. Controlador del módulo
6. `errorHandler` — captura cualquier error y le da el formato acordado

Los pasos 3 y 4 se saltan únicamente en `POST /api/auth/login`.

---

## 8. Decisiones pendientes

**Dashboard.** Sin endpoints definidos. Cada indicador heredará el permiso de su módulo de origen. Se especificará en el Sprint 6.

**Refresh token.** No se implementa en la versión 1.0. La sesión caduca a las 8 horas y exige volver a iniciar sesión. Es una simplificación consciente, adecuada al uso previsto en jornada laboral.

**Limitación de intentos.** Conveniente en `POST /api/auth/login` para frenar ataques por fuerza bruta. Queda anotado como mejora futura.

---

## 9. Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | Julio 2026 | Versión inicial aprobada para Sprint 1 |
