# DISTRIBUIDORA - Sistema Integral de Inventario Empresarial

Sistema web completo para la gestión de inventario, con módulos para productos, entradas, salidas, reportes y configuración. Construido con NestJS (backend) y Next.js (frontend).

## Características Principales

✅ **Autenticación & Autorización**: Sistema JWT seguro con control de acceso basado en roles (Administrador, Vendedor y Almacenista).

✅ **Gestión de Productos**: CRUD completo, categorías, unidades de medida y control de stock en tiempo real.

✅ **Módulo de Entradas**: Registro de compras a proveedores con actualización automática de inventario.

✅ **Módulo de Salidas**: Registro de ventas a clientes con validación automática de disponibilidad.

✅ **Dashboard en Tiempo Real**: KPIs dinámicos, métricas operativas y visualización de movimientos de inventario.

✅ **Configuración Flexible**: Gestión de usuarios, categorías, proveedores, clientes y unidades de medida.

✅ **Reportes Avanzados**: Reportes de stock, movimientos, Kardex y análisis por categorías.

✅ **Auditoría**: Registro detallado de acciones realizadas dentro del sistema.

✅ **Base de Datos MySQL**: Estructura relacional optimizada, integridad referencial y alto rendimiento para entornos empresariales.

## Tecnologías Utilizadas

### Backend

* **Node.js**
* **NestJS**
* **TypeORM**
* **JWT (JSON Web Token)**
* **Passport**
* **bcryptjs**
* **MySQL**
* **Class Validator**
* **REST API**

### Frontend

* **Next.js**
* **React**
* **Tailwind CSS**
* **Recharts**
* **Lucide Icons**
* **Fetch API**

### Herramientas de Desarrollo

* **Git** (Control de versiones)
* **GitHub** (Gestión de repositorio)
* **Postman** (Pruebas y documentación de APIs)
* **Render** (Despliegue en la nube)

## Instalación Local

### Requisitos Previos

* Node.js 18 o superior
* MySQL 8 o superior
* pnpm o npm
* Git

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd distribuidora
```

2. **Instalar dependencias**

```bash
pnpm install
```

3. **Configurar variables de entorno**

```bash
cp .env.example .env
```

4. **Configurar conexión MySQL**

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password
DB_NAME=distribuidora
JWT_SECRET=tu_clave_secreta
```

5. **Iniciar el proyecto**

```bash
pnpm dev
```

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:3001
```

## Estructura de Directorios

```text
.
├── app/
│   ├── dashboard/
│   ├── products/
│   ├── entries/
│   ├── exits/
│   ├── reports/
│   └── configuration/
├── backend/
│   ├── src/
│   │   ├── entities/
│   │   ├── services/
│   │   ├── controllers/
│   │   ├── modules/
│   │   ├── guards/
│   │   └── seeds/
│   └── database.config.ts
├── components/
├── lib/
└── public/
```

## API REST

### Autenticación

* POST `/api/auth/login`
* POST `/api/auth/register`

### Productos

* GET `/api/products`
* GET `/api/products/:id`
* POST `/api/products`
* PUT `/api/products/:id`
* DELETE `/api/products/:id`

### Entradas

* GET `/api/entries`
* POST `/api/entries`
* GET `/api/entries/:id`
* DELETE `/api/entries/:id`

### Salidas

* GET `/api/exits`
* POST `/api/exits`
* GET `/api/exits/:id`
* DELETE `/api/exits/:id`

### Configuración

* GET `/api/categories`
* GET `/api/units`
* GET `/api/suppliers`
* GET `/api/clients`
* GET `/api/users`
* GET `/api/configuration`
* PUT `/api/configuration`

## Modelo de Base de Datos

### Tablas Principales

* **users** → Usuarios del sistema.
* **products** → Catálogo de productos.
* **categories** → Categorías de productos.
* **units** → Unidades de medida.
* **entries** → Entradas de inventario.
* **entry_items** → Detalles de entradas.
* **exits** → Salidas de inventario.
* **exit_items** → Detalles de salidas.
* **suppliers** → Proveedores.
* **clients** → Clientes.
* **audits** → Auditoría del sistema.
* **configurations** → Configuración general.

## Seguridad

* Contraseñas encriptadas mediante bcryptjs.
* Autenticación basada en JWT.
* Protección de rutas mediante Guards de NestJS.
* Validación de datos con Class Validator.
* Control de acceso por roles.
* Manejo seguro de excepciones.
* Protección contra solicitudes inválidas.
* Transacciones para operaciones críticas.

## Arquitectura

El sistema implementa una arquitectura cliente-servidor basada en:

* Frontend desacoplado con Next.js.
* Backend modular desarrollado con NestJS.
* Persistencia de datos mediante MySQL.
* Mapeo objeto-relacional utilizando TypeORM.
* API REST para comunicación entre servicios.
* Gestión de autenticación mediante JWT.
* Control de versiones con Git.

## Pruebas y Consumo de API

Las pruebas funcionales y validaciones de endpoints fueron realizadas utilizando:

* Postman
* Colecciones de pruebas REST
* Validación de respuestas HTTP
* Pruebas de autenticación JWT
* Verificación de operaciones CRUD

## Despliegue en Render

### Backend

Variables de entorno:

```env
DB_HOST=<mysql-host>
DB_PORT=3306
DB_USERNAME=<usuario>
DB_PASSWORD=<password>
DB_NAME=distribuidora
JWT_SECRET=<secret>
PORT=3001
```

Build:

```bash
pnpm install && pnpm run build
```

Start:

```bash
pnpm start:prod
```

### Frontend

Variables:

```env
NEXT_PUBLIC_API_URL=<backend-url>
```

Build:

```bash
pnpm install && pnpm run build
```

## Monitoreo y Auditoría

El sistema registra:

* Inicio de sesión.
* Cierre de sesión.
* Creación de registros.
* Actualización de registros.
* Eliminación de registros.
* Movimientos de inventario.
* Errores del sistema.
* Actividades administrativas.

## Herramientas Implementadas

* Node.js
* NestJS
* Next.js
* TypeORM
* MySQL
* JWT
* Postman
* Git
* GitHub
* Tailwind CSS
* React
* Render

## Licencia

Propietario - 2026

---

**Versión:** 1.0.0

**Tecnologías principales:** Node.js, NestJS, Next.js, MySQL, TypeORM, JWT, Git y Postman.
