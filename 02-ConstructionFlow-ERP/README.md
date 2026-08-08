🏗️ 02-ConstructionFlow ERP

Sistema ERP para la gestión integral de empresas de construcción

¿Qué es?

ConstructionFlow ERP es una aplicación web desarrollada para digitalizar el flujo completo de trabajo de una empresa de construcción.

El sistema permite centralizar la información de clientes, obras, presupuestos, personal, materiales y documentación en una única plataforma, mejorando la organización, la comunicación entre departamentos y la toma de decisiones mediante datos en tiempo real.

La aplicación se apoya en la base de datos ConstructionDB, incorporando una interfaz moderna, control de usuarios por roles y automatización de procesos internos.
🎯 Objetivos

- Digitalizar los procesos administrativos y técnicos.
- Eliminar el uso de hojas de cálculo.
- Centralizar toda la información empresarial.
- Reducir errores administrativos.
- Mejorar la comunicación entre departamentos.
- Automatizar tareas repetitivas.
- Facilitar la toma de decisiones.

 👥 Roles de usuario

El acceso se controla mediante JWT y una matriz de permisos por rol (acciones: ver / crear / editar / eliminar). Los 7 roles son:

- Administrador
- Dirección
- Administración
- Recepción
- Comercial
- Técnico
- Jefe de obra

Cada usuario dispone de un menú y unos permisos personalizados según su rol.

🚀 Módulos

| Módulo | Descripción | Estado |
|---|---|---|
| 👤 Clientes | Alta, modificación, historial, obras asociadas | ✅ |
| 🏗️ Obras | Alta, seguimiento, estado, costes, documentación | ✅ |
| 📄 Presupuestos | Crear, modificar, versionado, exportar PDF | ✅ |
| 👷 Empleados | Categorías, asignación a obras, disponibilidad | ✅ |
| 📦 Materiales | Inventario, stock, consumos | ✅ |
| 📊 Stock | Existencias y movimientos | ✅ |
| 🚚 Proveedores | Alta, histórico, datos de contacto | ✅ |
| 🛒 Pedidos | Pedidos a proveedores, recepción de material | ✅ |
| 💰 Facturación | Facturas, pagos, cobros | 🚧 Fase 1 (cabecera) |
| 🔐 Usuarios | Alta, reseteo de contraseña, cambio de rol, baja lógica | 🚧 Backend completo + listado |
| ⚙️ Configuración | Idioma, tamaño de letra y tema claro/oscuro | ✅ |
| 📈 Dashboard | Obras activas, presupuestos pendientes, facturación, KPIs | ⬜ |

Leyenda: ✅ hecho · 🚧 parcial · ⬜ pendiente

 🛠 Tecnologías

Backend
- Node.js
- Express 5
- ES Modules (import/export)
- JWT + bcrypt (autenticación y hasheo de contraseñas)
- Arquitectura en capas: rutas → controlador → servicio → repositorio

Frontend
- HTML5
- CSS3 (sistema de diseño con variables)
- JavaScript (sin frameworks)

Base de datos
- MySQL (mysql2/promise)

Desarrollo
- Git y GitHub (Conventional Commits)
- Visual Studio Code
- Live Server

📂 Arquitectura
Frontend (HTML/CSS/JS)
│
▼
Backend (Node.js + Express)
│
▼
API REST (/api)
│
▼
ConstructionDB (MySQL)

Respuestas de la API normalizadas: `{ success, data }` en caso de éxito y `{ success, error: { code, message } }` en caso de error (códigos: DATOS_INVALIDOS, VALOR_DUPLICADO, RECURSO_NO_ENCONTRADO).

 📈 Estado del proyecto

🟡 En desarrollo

Actualmente se encuentra en fase de implementación y evoluciona de forma progresiva, incorporando nuevas funcionalidades y automatizaciones.

🔮 Hoja de ruta

- ✅ Iniciar sesión
- ✅ Roles y permisos
- ✅ Gestión de clientes
- ✅ Gestión de obras
- ✅ Presupuestos
- ✅ Empleados
- ✅ Materiales
- ✅ Stock
- ✅ Proveedores
- ✅ Pedidos
- 🚧 Facturación (fase 1: cabecera)
- 🚧 Usuarios (backend + listado; crear y acciones de fila pendientes)
- ✅ Configuración (idioma, tamaño de letra, tema)
- ⬜ Panel de control / Dashboard
- ⬜ Documentación
- ⬜ Exportación PDF
- ⬜ Power BI
- ⬜ Azul
- ⬜ IA

🔗 Proyecto relacionado

ConstructionFlow ERP utiliza como núcleo la base de datos 01-ConstructionDB, desarrollada previamente en MySQL y diseñada específicamente para gestionar toda la información de una empresa de construcción.

👩‍💻 Autor

Esther Tregón Pérez
Analista de Datos Junior | Desarrolladora de Software Junior
