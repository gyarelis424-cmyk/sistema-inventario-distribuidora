# 📊 DISTRIBUIDORA - Visión General del Proyecto

## 🎯 Objetivo del Sistema

**Sistema Integral de Gestión de Inventario Empresarial** para la administración completa de:
- Catálogo de productos
- Entrada y salida de inventario
- Gestión de proveedores y clientes
- Reportes y análisis
- Auditoría y trazabilidad

---

## 🏗️ Arquitectura de 3 Capas

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTACIÓN                              │
│  ┌─────────────┬──────────────┬─────────────┬──────────────┐    │
│  │   Login     │  Dashboard   │  Productos  │   Entradas   │    │
│  │   Page      │     Page     │    Page     │    Page      │    │
│  ├─────────────┼──────────────┼─────────────┼──────────────┤    │
│  │   Salidas   │  Reports     │Configuration│   Perfil     │    │
│  │   Page      │    Page      │    Page     │    Page      │    │
│  └─────────────┴──────────────┴─────────────┴──────────────┘    │
│              Next.js 15 + React 19 + Tailwind CSS                │
└────────────────────────────┬─────────────────────────────────────┘
                             │ REST API + JSON
┌────────────────────────────────────────────────────────────────┐
│                          APLICACIÓN                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Auth API   │  │ Products API │  │  Inventory   │         │
│  │              │  │              │  │     API      │         │
│  ├──────────────┼──────────────┬──┤  ├──────────────┤         │
│  │  Auth        │  │  Product   │  │  │  Entry/Exit │         │
│  │  Service     │  │  Service   │  │  │  Service    │         │
│  │              │  │            │  │  │             │         │
│  └──────────────┴──────────────┴──┴──┴──────────────┘         │
│              NestJS 10 + TypeORM                               │
└────────────────────────────┬─────────────────────────────────────┘
                             │ SQL Queries
┌────────────────────────────────────────────────────────────────┐
│                       BASE DE DATOS                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ users    │  │ products │  │ suppliers│  │ clients  │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │categories│  │  units   │  │ entries  │  │  exits   │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│  ┌──────────┐  ┌──────────┐                                    │
│  │   audit  │  │   config │                                    │
│  └──────────┘  └──────────┘                                    │
│              PostgreSQL 14+                                    │
└────────────────────────────────────────────────────────────────┘
```

---

## 📊 Diagrama de Flujo de Datos

### Entrada de Producto al Inventario

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuario va a "Entradas"                                 │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Completa formulario:                                    │
│    - Selecciona Proveedor                                  │
│    - Documento (ej: FACT-00125)                           │
│    - Agrega items: Producto + Cantidad + Precio           │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Frontend: POST /api/entries                            │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Backend - EntryController.create()                       │
│    - Valida datos                                          │
│    - Valida que el proveedor exista                       │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Backend - EntryService.create()                          │
│    - Crea registro Entry                                   │
│    - Crea EntryItem para cada producto                     │
│    - ACTUALIZA Product.currentStock ← +cantidad           │
│    - Registra en AuditLog                                  │
│    - Retorna resultado                                     │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Frontend: Muestra confirmación                           │
│    "Entrada E-000125 registrada exitosamente"            │
│    Stock actualizado: Producto X → +100 unidades         │
└─────────────────────────────────────────────────────────────┘
```

### Salida de Producto del Inventario

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuario va a "Salidas"                                  │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Completa formulario:                                    │
│    - Selecciona Cliente                                    │
│    - Documento (ej: FACT-01152)                           │
│    - Agrega items: Producto + Cantidad + Precio           │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Frontend: POST /api/exits                              │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Backend - ExitController.create()                        │
│    - Valida datos                                          │
│    - Valida que el cliente exista                         │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Backend - ExitService.create()                           │
│    - VALIDA stock disponible ← currentStock >= cantidad   │
│    - SI NO HAY STOCK → ERROR                              │
│    - Crea registro Exit                                    │
│    - Crea ExitItem para cada producto                      │
│    - ACTUALIZA Product.currentStock ← -cantidad           │
│    - Registra en AuditLog                                  │
│    - Retorna resultado                                     │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Frontend: Muestra confirmación                           │
│    "Salida S-001152 registrada exitosamente"             │
│    Stock actualizado: Producto X → -20 unidades          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Estructura de Carpetas Detallada

```
distribuidora/
│
├── 📂 app/                          ← Frontend (Next.js)
│   ├── login/
│   │   └── page.tsx                 ← Formulario de autenticación
│   ├── dashboard/
│   │   └── page.tsx                 ← KPIs y estadísticas
│   ├── products/
│   │   └── page.tsx                 ← Catálogo de productos
│   ├── entries/
│   │   └── page.tsx                 ← Registro de entradas
│   ├── exits/
│   │   └── page.tsx                 ← Registro de salidas
│   ├── reports/
│   │   └── page.tsx                 ← Reportes y análisis
│   ├── configuration/
│   │   └── page.tsx                 ← Gestión de datos maestros
│   ├── layout.tsx                   ← Layout global
│   ├── globals.css                  ← Estilos globales
│   └── page.tsx                     ← Página raíz → redirect /login
│
├── 📂 components/                   ← Componentes React
│   ├── sidebar.tsx                  ← Navegación lateral
│   ├── header.tsx                   ← Encabezado con perfil
│   └── main-layout.tsx              ← Wrapper layout
│
├── 📂 lib/                          ← Utilidades
│   ├── api.ts                       ← Cliente API simple
│   ├── api-client.ts                ← Cliente API avanzado
│   ├── utils.ts                     ← Funciones auxiliares
│   └── cn.ts                        ← Utilidad de clases
│
├── 📂 backend/                      ← Backend (NestJS)
│   ├── 📂 src/
│   │   ├── 📂 entities/             ← Modelos de datos
│   │   │   ├── user.entity.ts       ← Usuarios con roles
│   │   │   ├── product.entity.ts    ← Productos
│   │   │   ├── category.entity.ts   ← Categorías
│   │   │   ├── unit.entity.ts       ← Unidades de medida
│   │   │   ├── supplier.entity.ts   ← Proveedores
│   │   │   ├── client.entity.ts     ← Clientes
│   │   │   ├── entry.entity.ts      ← Compras
│   │   │   ├── entry-item.entity.ts ← Detalle compras
│   │   │   ├── exit.entity.ts       ← Ventas
│   │   │   ├── exit-item.entity.ts  ← Detalle ventas
│   │   │   ├── audit.entity.ts      ← Auditoría
│   │   │   └── configuration.entity.ts ← Configuración
│   │   │
│   │   ├── 📂 services/             ← Lógica de negocio
│   │   │   ├── auth.service.ts      ← Autenticación
│   │   │   ├── user.service.ts      ← Gestión usuarios
│   │   │   ├── product.service.ts   ← Gestión productos
│   │   │   ├── category.service.ts  ← Gestión categorías
│   │   │   ├── unit.service.ts      ← Gestión unidades
│   │   │   ├── supplier.service.ts  ← Gestión proveedores
│   │   │   ├── client.service.ts    ← Gestión clientes
│   │   │   ├── entry.service.ts     ← Entradas (stock +)
│   │   │   ├── exit.service.ts      ← Salidas (stock -)
│   │   │   └── configuration.service.ts ← Config sistema
│   │   │
│   │   ├── 📂 controllers/          ← Endpoints REST
│   │   │   ├── auth.controller.ts   ← POST /login
│   │   │   ├── user.controller.ts   ← CRUD usuarios
│   │   │   ├── product.controller.ts← CRUD productos
│   │   │   ├── category.controller.ts ← CRUD categorías
│   │   │   ├── unit.controller.ts   ← CRUD unidades
│   │   │   ├── supplier.controller.ts ← CRUD proveedores
│   │   │   ├── client.controller.ts ← CRUD clientes
│   │   │   ├── entry.controller.ts  ← POST/GET entradas
│   │   │   ├── exit.controller.ts   ← POST/GET salidas
│   │   │   └── configuration.controller.ts ← GET/PUT config
│   │   │
│   │   ├── 📂 dtos/                 ← Validación de datos
│   │   │   ├── auth.dto.ts          ← Login, usuario
│   │   │   ├── product.dto.ts       ← Producto
│   │   │   ├── entry.dto.ts         ← Entrada
│   │   │   └── exit.dto.ts          ← Salida
│   │   │
│   │   ├── 📂 strategies/           ← Autenticación
│   │   │   └── jwt.strategy.ts      ← JWT strategy
│   │   │
│   │   ├── 📂 guards/               ← Protección de rutas
│   │   │   └── jwt.guard.ts         ← Guard JWT
│   │   │
│   │   ├── 📂 database/             ← BD
│   │   │   └── migrations.ts        ← DataSource TypeORM
│   │   │
│   │   ├── 📂 utils/                ← Utilidades
│   │   │   └── response.ts          ← Respuesta API
│   │   │
│   │   ├── 📂 seeds/                ← Datos iniciales
│   │   │   └── init-data.ts         ← Seed data
│   │   │
│   │   ├── app.module.ts            ← Módulo principal
│   │   ├── app.ts                   ← Inicialización
│   │   └── main.ts                  ← Entry point
│   │
│   ├── tsconfig.json
│   ├── build.js
│   └── .env                         ← Variables entorno
│
├── 📂 public/                       ← Archivos estáticos
│
├── 📄 .env.example                  ← Template .env
├── 📄 .gitignore                    ← Git ignore
├── 📄 docker-compose.yml            ← Docker desarrollo
├── 📄 Dockerfile                    ← Docker producción
├── 📄 next.config.mjs               ← Config Next.js
├── 📄 package.json                  ← Dependencias
├── 📄 tsconfig.json                 ← TypeScript config
│
├── 📚 DOCUMENTACIÓN/
│   ├── 📖 INDEX.md                  ← Índice general
│   ├── 📖 README.md                 ← Guía principal
│   ├── 📖 QUICKSTART.md             ← Inicio rápido
│   ├── 📖 ARCHITECTURE.md           ← Arquitectura
│   ├── 📖 PROJECT_SUMMARY.md        ← Resumen técnico
│   ├── 📖 PROJECT_OVERVIEW.md       ← Visión general
│   ├── 📖 RENDER_DEPLOYMENT.md      ← Despliegue
│   ├── 📖 IMPLEMENTATION_CHECKLIST.md ← Estado
│   ├── 📖 CHANGES.md                ← Cambios realizados
│   └── 📖 DELIVERY_SUMMARY.md       ← Entrega final
│
└── 📄 node_modules/                 ← Dependencias instaladas
```

---

## 📊 Base de Datos - Diagrama ER

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIOS                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ id (PK) | email | password | name | role | status | date │   │
│ └───────────────────────────────────────────────────────────┘   │
│ Roles: Administrator, Seller                                    │
│ Status: Active, Inactive                                        │
└─────────────────────┬───────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      PRODUCTOS                                   │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ id (PK) | code | name | description | price | currentStock│  │
│ │ minimumStock | category (FK) | unit (FK) | status | date  │   │
│ └───────────────────────────────────────────────────────────┘   │
│                        ↓↓                                        │
│            ┌───────────────┬──────────────┐                     │
│            ↓               ↓              ↓                     │
│     ┌──────────────┐  ┌──────────┐  ┌──────────┐             │
│     │  CATEGORÍAS  │  │ UNIDADES │  │PROVEEDORES│            │
│     └──────────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    ENTRADAS/COMPRAS                              │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ id (PK) | number | date | supplier (FK) | document | total│   │
│ │ status | createdBy | notes | createdAt                   │   │
│ └───────────────────────────────────────────────────────────┘   │
│            ↓ (Relación 1:N)                                    │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │               ENTRY_ITEMS (Detalle)                       │   │
│ │ id | entry (FK) | product (FK) | quantity | unitPrice |   │   │
│ │ total | createdAt                                         │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│ Efecto: INCREMENTA Product.currentStock += quantity            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    SALIDAS/VENTAS                                │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ id (PK) | number | date | client (FK) | document | total │   │
│ │ status | createdBy | notes | createdAt                   │   │
│ └───────────────────────────────────────────────────────────┘   │
│            ↓ (Relación 1:N)                                    │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │               EXIT_ITEMS (Detalle)                        │   │
│ │ id | exit (FK) | product (FK) | quantity | unitPrice |   │   │
│ │ total | createdAt                                         │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│ Efecto: DECREMENTA Product.currentStock -= quantity            │
│         (Con validación de disponibilidad)                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    AUDITORÍA                                     │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ id (PK) | entityType | entityId | action | userId (FK)   │   │
│ │ oldValue | newValue | createdAt | ipAddress               │   │
│ └───────────────────────────────────────────────────────────┘   │
│ Registra: CREATE, UPDATE, DELETE, EXPORT                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                 CONFIGURACIÓN DEL SISTEMA                        │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ id (PK) | companyName | ruc | logo | address | phone │   │   │
│ │ email | currency | timezone | dateFormat | updatedAt     │   │
│ └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Ciclo de Vida de un Producto

```
1. CREACIÓN
   Frontend → POST /api/products
   └─ Catálogo completo + stock inicial

2. ENTRADA
   Compra a Proveedor → POST /api/entries
   └─ currentStock += cantidad_entrada
   └─ Registra en AuditLog

3. DISPONIBLE
   currentStock >= minimumStock ✓
   └─ Disponible para venta

4. SALIDA
   Venta a Cliente → POST /api/exits
   └─ Validar: currentStock >= cantidad_salida
   └─ SI: currentStock -= cantidad_salida
   └─ NO: Error "Stock insuficiente"
   └─ Registra en AuditLog

5. BAJO STOCK
   currentStock < minimumStock ⚠️
   └─ Alerta: Reponer inventario
   └─ Sugerir entrada de compra

6. INACTIVO
   Cambiar status → Inactivo ✗
   └─ No disponible para ventas
   └─ Pero visible en reportes históricos

7. HISTÓRICO
   Reportes → Ver movimientos del producto
   └─ Entradas/Salidas por período
   └─ Kardex completo
```

---

## 📈 Flujo de Usuario Típico

```
1. ACCESO
   Usuario → http://localhost:3000
   └─ Redirige a /login

2. AUTENTICACIÓN
   Ingresa: admin@distribuidora.com / Admin123!
   └─ Valida credenciales en backend
   └─ Retorna JWT token
   └─ Frontend almacena en localStorage
   └─ Redirige a /dashboard

3. DASHBOARD
   Ve KPIs en tiempo real:
   ├─ Total de productos
   ├─ Stock total
   ├─ Entradas del mes
   └─ Salidas del mes

4. GESTIÓN DE PRODUCTOS
   Accede a Productos
   ├─ Buscar producto
   ├─ Ver detalles
   ├─ Crear nuevo
   ├─ Editar
   └─ Eliminar (si no tiene movimientos)

5. ENTRADA DE COMPRA
   Accede a Entradas
   ├─ Selecciona proveedor
   ├─ Agrega productos (cantidad, precio)
   ├─ Genera número de documento
   └─ Stock se actualiza automáticamente

6. SALIDA DE VENTA
   Accede a Salidas
   ├─ Selecciona cliente
   ├─ Agrega productos (cantidad, precio)
   ├─ Sistema valida stock
   ├─ Si hay stock → registra salida
   ├─ Si NO → muestra error
   └─ Stock se reduce automáticamente

7. REPORTES
   Accede a Reportes
   ├─ Stock actual
   ├─ Movimientos por período
   ├─ Kardex de producto
   └─ Exporta datos

8. CONFIGURACIÓN
   Accede a Configuración
   ├─ Gestiona usuarios
   ├─ Gestiona categorías
   ├─ Gestiona proveedores
   ├─ Gestiona clientes
   ├─ Gestiona unidades
   └─ Configura parámetros del sistema

9. SALIDA
   Cierra sesión → localStorage.removeItem('authToken')
   └─ Redirige a /login
```

---

## 🎯 Mapeo de Pantallas → Backend

```
PANTALLA                    ENDPOINT                  MÉTODO
─────────────────────────────────────────────────────────────
Login                       POST /auth/login         POST
Dashboard                   GET /dashboard/stats     GET
                           GET /dashboard/movements  GET

Productos                   GET /products             GET
                           GET /products/search      GET
                           POST /products            POST
                           PUT /products/:id         PUT
                           DELETE /products/:id      DELETE

Entradas                    GET /entries              GET
                           POST /entries             POST
                           GET /entries/:id          GET

Salidas                     GET /exits                GET
                           POST /exits               POST
                           GET /exits/:id            GET

Reportes                    GET /reports/stock       GET
                           GET /reports/movements   GET
                           GET /reports/kardex      GET

Configuración:
  Usuarios                  GET /users                GET
                           POST /users              POST
                           PUT /users/:id           PUT
                           DELETE /users/:id        DELETE

  Categorías               GET /categories           GET
                           POST /categories         POST
                           PUT /categories/:id      PUT

  Unidades                 GET /units                GET
                           POST /units              POST
                           PUT /units/:id           PUT

  Proveedores             GET /suppliers            GET
                           POST /suppliers          POST
                           PUT /suppliers/:id       PUT

  Clientes                GET /clients              GET
                           POST /clients            POST
                           PUT /clients/:id         PUT

  Parámetros              GET /configuration        GET
                           PUT /configuration       PUT

Perfil de Usuario          GET /auth/profile        GET
                           PUT /auth/profile        PUT
```

---

## 🚀 Estados de Despliegue

```
LOCAL
├─ npm install
├─ docker-compose up -d
├─ npm run dev
└─ http://localhost:3000 ✓

RENDER
├─ Conectar GitHub
├─ PostgreSQL DB
├─ Backend Service
├─ Frontend Service
└─ https://distribuidora-frontend.onrender.com ✓
```

---

## ✅ Checklist de Funcionalidades

### Usuarios
- [x] Crear usuario
- [x] Listar usuarios
- [x] Editar usuario
- [x] Cambiar status
- [x] Eliminar usuario
- [x] Cambiar contraseña
- [x] Asignar roles

### Productos
- [x] Crear producto
- [x] Listar productos
- [x] Buscar producto
- [x] Ver detalles
- [x] Editar producto
- [x] Eliminar producto
- [x] Filtrar por categoría
- [x] Validar stock mínimo

### Entradas
- [x] Crear entrada
- [x] Seleccionar proveedor
- [x] Agregar ítems
- [x] Actualizar stock automáticamente
- [x] Listar entradas
- [x] Ver detalles
- [x] Exportar datos
- [x] Historial de cambios

### Salidas
- [x] Crear salida
- [x] Seleccionar cliente
- [x] Agregar ítems
- [x] Validar disponibilidad
- [x] Reducir stock automáticamente
- [x] Listar salidas
- [x] Ver detalles
- [x] Exportar datos

### Reportes
- [x] Stock actual
- [x] Movimientos últimos 6 meses
- [x] Kardex de producto
- [x] Productos por categoría
- [x] Filtro por fechas
- [x] Filtro por categoría
- [x] Filtro por proveedor
- [x] Exportar a CSV

### Auditoría
- [x] Registro de cambios
- [x] Usuario responsable
- [x] Timestamp
- [x] Datos anteriores/nuevos
- [x] Ver historial

---

## 🎨 Paleta de Colores

```
Primario:       #0066cc (Azul corporativo)
Sidebar:        #0f172a (Azul marino oscuro)
Texto:          #1a2332 (Gris oscuro)
Fondo:          #ffffff (Blanco)
Bordes:         #e5e5e5 (Gris claro)
Éxito:          #10b981 (Verde)
Error:          #ef4444 (Rojo)
Warning:        #f59e0b (Naranja)
Info:           #3b82f6 (Azul cielo)
```

---

**¡Sistema completamente implementado y listo para usar!** 🎉

Comienza en: [QUICKSTART.md](./QUICKSTART.md)
