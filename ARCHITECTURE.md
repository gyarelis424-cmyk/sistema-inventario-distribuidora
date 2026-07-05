Arquitectura del Sistema - DISTRIBUIDORA
========================================

## Visión General

DISTRIBUIDORA es un sistema de gestión de inventario empresarial con arquitetura **monorepo** que separa claramente el backend (NestJS) del frontend (Next.js).

```
┌─────────────────────────────────────────────────────────────┐
│                    Cliente Web (Next.js)                     │
│  - Login                - Productos                          │
│  - Dashboard            - Entradas                           │
│  - Reportes             - Salidas                            │
│  - Configuración        - Perfil de Usuario                  │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS / REST API
                           │
┌──────────────────────────────────────────────────────────────┐
│                   Backend API (NestJS)                       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Controllers (REST Endpoints)              │  │
│  │  - Auth         - User      - Product    - Entry       │  │
│  │  - Category     - Unit      - Supplier   - Exit        │  │
│  │  - Client       - Configuration           - Dashboard  │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                   Services (Business Logic)            │  │
│  │  - Autenticación (JWT)      - Gestión de Productos    │  │
│  │  - Usuarios                 - Entradas/Salidas         │  │
│  │  - Categorías/Unidades      - Reportes                 │  │
│  │  - Proveedores/Clientes     - Auditoría                │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Data Access (TypeORM Repositories)        │  │
│  │  - User  - Product  - Entry  - Exit  - Audit  - Config│  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │ SQL Queries
                           │
┌──────────────────────────────────────────────────────────────┐
│               Base de Datos (PostgreSQL)                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Tablas: users, products, categories, units,          │  │
│  │          suppliers, clients, entries, entry_items,    │  │
│  │          exits, exit_items, audit_logs, config        │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Capas de la Aplicación

### 1. Capa de Presentación (Frontend - Next.js)

**Ubicación**: `/app` y `/components`

**Responsabilidades**:
- Interfaz de usuario moderna
- Gestión de estado del cliente
- Autenticación local (JWT token)
- Navegación y routing
- Validación de formularios en cliente

**Componentes principales**:
```
/app
  /login          → Autenticación
  /dashboard      → KPIs e indicadores
  /products       → Catálogo de productos
  /entries        → Registro de entradas
  /exits          → Registro de salidas
  /reports        → Generación de reportes
  /configuration  → Gestión de datos maestros
  /profile        → Perfil de usuario

/components
  sidebar.tsx     → Navegación lateral
  header.tsx      → Encabezado con usuario
  main-layout.tsx → Layout principal
```

### 2. Capa de API (Backend - NestJS)

**Ubicación**: `/backend/src`

**Responsabilidades**:
- Lógica de negocio
- Validación de datos
- Autenticación y autorización
- Gestión de transacciones
- Auditoría de cambios

**Estructura**:

```
/backend/src
  /controllers    → Puntos finales HTTP
  /services       → Lógica de negocio
  /entities       → Modelos de datos (TypeORM)
  /dtos           → Objetos de transferencia de datos
  /strategies     → Estrategias de Passport (JWT)
  /guards         → Guards de autenticación
  /database       → Configuración de BD
  /utils          → Utilidades y helpers
  /seeds          → Datos iniciales
  app.module.ts   → Módulo principal
  main.ts         → Entry point
```

### 3. Capa de Datos (PostgreSQL)

**Responsabilidades**:
- Persistencia de datos
- Integridad referencial
- Índices y optimización

**Entidades principales**:

```
users                 → Usuarios del sistema
├─ roles (Administrador, Vendedor, etc.)
├─ status (Activo, Inactivo)

products             → Catálogo de productos
├─ category_id       → Relación con categorías
├─ unit_id           → Relación con unidades
├─ price             → Precio en C$
├─ current_stock     → Stock disponible
├─ minimum_stock     → Stock mínimo

categories           → Clasificación de productos
units                → Unidades de medida

suppliers            → Proveedores
clients              → Clientes

entries              → Compras a proveedores
├─ entry_items[]     → Detalle de productos
├─ supplier_id       → Proveedor
├─ document          → Número de factura

exits                → Ventas a clientes
├─ exit_items[]      → Detalle de productos
├─ client_id         → Cliente
├─ document          → Número de factura

audit_logs           → Registro de cambios
configuration        → Parámetros del sistema
```

## Flujos de Datos Principales

### Flujo de Entrada de Inventario

```
Frontend (Crear Entrada)
  ↓
POST /api/entries {supplierId, items[]}
  ↓
Backend: EntryController.create()
  ↓
EntryService.create()
  ├─ Validar datos
  ├─ Crear registro Entry
  ├─ Crear EntryItem para cada producto
  ├─ Actualizar Product.currentStock
  ├─ Registrar en Audit
  └─ Retornar resultado
  ↓
Frontend: Mostrar confirmación
```

### Flujo de Salida de Inventario

```
Frontend (Crear Salida)
  ↓
POST /api/exits {clientId, items[]}
  ↓
Backend: ExitController.create()
  ↓
ExitService.create()
  ├─ Validar disponibilidad de stock
  ├─ Crear registro Exit
  ├─ Crear ExitItem para cada producto
  ├─ Reducir Product.currentStock
  ├─ Registrar en Audit
  └─ Retornar resultado
  ↓
Frontend: Mostrar confirmación
```

### Flujo de Autenticación

```
Frontend: LoginForm
  ↓
POST /api/auth/login {email, password}
  ↓
Backend: AuthController.login()
  ↓
AuthService.login()
  ├─ Buscar usuario por email
  ├─ Validar contraseña (bcrypt)
  ├─ Generar JWT (sin expiración)
  └─ Retornar token
  ↓
Frontend: localStorage.setItem('authToken', token)
  ↓
Todas las peticiones posteriores incluyen:
Authorization: Bearer {token}
```

## Patrones y Convenciones

### Estructura de Respuestas API

**Éxito (200)**:
```json
{
  "success": true,
  "message": "Operación completada",
  "data": { /* datos */ },
  "timestamp": "2024-06-20T15:30:00Z"
}
```

**Error (400, 500, etc)**:
```json
{
  "success": false,
  "message": "Descripción del error",
  "error": { /* detalles del error */ },
  "timestamp": "2024-06-20T15:30:00Z"
}
```

### Convenciones de Base de Datos

- **Nombres de tablas**: snake_case en plural
- **Nombres de columnas**: snake_case
- **IDs**: id (entero, auto-increment, primary key)
- **Timestamps**: created_at, updated_at (automáticos)
- **Soft deletes**: deleted_at (nullable)

### Convenciones de API REST

- **GET /api/resource** → Listar (con paginación)
- **GET /api/resource/:id** → Obtener uno
- **POST /api/resource** → Crear
- **PUT /api/resource/:id** → Actualizar
- **DELETE /api/resource/:id** → Eliminar

### Convenciones de Código

- **TypeScript**: Tipado fuerte en todo
- **Validación**: class-validator + DTOs
- **Errores**: Try-catch en servicios
- **Logs**: console.log para debugging

## Seguridad

### Autenticación
- JWT sin expiración (token infinito)
- Almacenado en localStorage en cliente
- Header: `Authorization: Bearer {token}`

### Validación
- Validación en DTOs (backend)
- Validación en formularios (frontend)
- Whitelist de campos permitidos

### Protección de Datos
- Contraseñas hasheadas con bcryptjs
- CORS configurado
- HTTPS en producción

### Auditoría
- Registro de todos los cambios
- Usuario que realizó la acción
- Fecha y hora del cambio
- Datos antiguos y nuevos

## Rendimiento

### Optimizaciones Implementadas

1. **BD**:
   - Índices en foreign keys
   - Índices en campos frecuentemente buscados
   - Paginación en listados

2. **API**:
   - Caché de entidades
   - Compresión gzip
   - Limit de resultados por página

3. **Frontend**:
   - Next.js SSR para SEO
   - Lazy loading de componentes
   - Tailwind CSS (utility-first)

## Escalabilidad

### Consideraciones Futuras

1. **Base de Datos**:
   - Replicación master-slave
   - Read replicas para reportes
   - Particionamiento de tablas grandes

2. **Backend**:
   - Clustering con PM2
   - Balanceador de carga
   - Cache distribuido (Redis)
   - Queue de tareas (Bull/RabbitMQ)

3. **Frontend**:
   - Precompilación de bundlers
   - CDN para assets estáticos
   - Service Workers para offline

## Monitoreo y Mantenimiento

### Logs
- Backend: console logs con timestamps
- Frontend: errores en console.error
- BD: query logs en development

### Alertas Recomendadas
- Errores 5xx en API
- Conexión a BD caída
- Alto uso de CPU/memoria
- Transacciones lentas

### Backups
- Base de datos: Diario
- Archivos: Git (versionado)
- Configuración: Variables de entorno seguras

## Despliegue

### Desarrollo Local
```bash
docker-compose up           # PostgreSQL
pnpm dev                    # Frontend + Backend
```

### Producción (Render)
```
Frontend: render.com/web-services
Backend: render.com/web-services
DB: render.com/postgres
```

Ver RENDER_DEPLOYMENT.md para detalles completos.

## Contacto y Soporte

Para preguntas sobre la arquitectura, referirse a:
- README.md (guía general)
- QUICKSTART.md (inicio rápido)
- PROJECT_SUMMARY.md (resumen técnico)
