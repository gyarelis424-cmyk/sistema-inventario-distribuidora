# DISTRIBUIDORA - Sistema Integral de Inventario Empresarial

Sistema web completo para la gestión de inventario, con módulos para productos, entradas, salidas, reportes y configuración. Construido con NestJS (backend) y Next.js (frontend).

## Características Principales

✅ **Autenticación & Autorización**: Sistema JWT sin expiración, roles de usuario (Administrador, Vendedor, Almacenista)

✅ **Gestión de Productos**: CRUD completo, categorías, unidades de medida, stock en tiempo real

✅ **Módulo de Entradas**: Registro de compras a proveedores con actualización automática de stock

✅ **Módulo de Salidas**: Registro de ventas a clientes con validación de disponibilidad

✅ **Dashboard en Tiempo Real**: KPIs dinámicos, gráficos de movimientos, stock por categoría

✅ **Configuración Flexible**: Gestión de usuarios, categorías, proveedores, clientes, unidades

✅ **Reportes Avanzados**: Stock actual, movimientos, Kardex, productos por categoría

✅ **Auditoría**: Registro detallado de todas las acciones del sistema

✅ **Base de Datos PostgreSQL**: Relaciones complejas, constraints, sincronización automática

## Stack Tecnológico

### Backend
- **NestJS**: Framework Node.js robusto
- **TypeORM**: ORM con soporte para PostgreSQL
- **Passport + JWT**: Autenticación segura
- **bcryptjs**: Encriptación de contraseñas
- **PostgreSQL**: Base de datos relacional

### Frontend
- **Next.js 16**: React SSR/SSG
- **Tailwind CSS v4**: Estilos utility-first
- **Recharts**: Gráficos dinámicos
- **Lucide Icons**: Iconografía moderna
- **SWR/Fetch**: Gestión de estado HTTP

## Instalación Local

### Requisitos Previos
- Node.js 18+
- PostgreSQL 12+
- pnpm (recomendado) o npm

### Pasos de Instalación

1. **Clonar repositorio**
```bash
git clone <repository-url>
cd distribuidora
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar base de datos**
```bash
cp .env.example .env.local
# Editar .env.local con credenciales de PostgreSQL
```

4. **Iniciar servidor de desarrollo**
```bash
pnpm dev
```

El frontend estará disponible en `http://localhost:3000`
El backend estará disponible en `http://localhost:3001`

## Estructura de Directorios

```
.
├── app/                    # Páginas Next.js (Frontend)
│   ├── dashboard/         # Dashboard con KPIs
│   ├── products/          # Gestión de productos
│   ├── entries/           # Módulo de entradas
│   ├── exits/             # Módulo de salidas
│   ├── reports/           # Generación de reportes
│   └── configuration/     # Configuración del sistema
├── backend/               # API NestJS
│   ├── src/
│   │   ├── entities/      # Modelos de base de datos
│   │   ├── services/      # Lógica de negocio
│   │   ├── controllers/   # Rutas API
│   │   └── seeds/         # Datos iniciales
│   └── database.config.ts # Configuración de BD
├── components/            # Componentes React reutilizables
├── lib/                   # Utilidades y helpers
└── public/                # Archivos estáticos
```

## API REST Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrarse

### Productos
- `GET /api/products?page=1&limit=10&search=&categoryId=` - Listar productos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `GET /api/products/stats/total` - Total de productos
- `GET /api/products/stats/stock` - Stock total
- `GET /api/products/stats/by-category` - Stock por categoría

### Entradas
- `GET /api/entries?page=1&limit=10` - Listar entradas
- `POST /api/entries` - Crear entrada
- `GET /api/entries/:id` - Obtener entrada
- `DELETE /api/entries/:id` - Eliminar entrada
- `GET /api/entries/stats/monthly` - Entradas mensuales
- `GET /api/entries/stats/total-monthly` - Total mes actual

### Salidas
- `GET /api/exits?page=1&limit=10` - Listar salidas
- `POST /api/exits` - Crear salida
- `GET /api/exits/:id` - Obtener salida
- `DELETE /api/exits/:id` - Eliminar salida
- `GET /api/exits/stats/monthly` - Salidas mensuales
- `GET /api/exits/stats/total-monthly` - Total mes actual

### Configuración
- `GET /api/categories/active` - Categorías activas
- `GET /api/units/active` - Unidades activas
- `GET /api/suppliers/active?search=` - Proveedores activos
- `GET /api/clients/active?search=` - Clientes activos
- `GET /api/users` - Listar usuarios
- `GET /api/configuration` - Configuración del sistema
- `PUT /api/configuration` - Actualizar configuración

## Esquema de Base de Datos

### Tablas Principales

**users**: Usuarios del sistema con roles y autenticación
**products**: Catálogo de productos con precio y stock
**categories**: Categorización de productos
**units**: Unidades de medida (kg, L, unidades, etc.)
**entries**: Registro de compras a proveedores
**entry_items**: Ítems detallados de cada entrada
**exits**: Registro de ventas a clientes
**exit_items**: Ítems detallados de cada salida
**suppliers**: Información de proveedores
**clients**: Información de clientes con límites de crédito
**audit**: Registro detallado de todas las acciones
**configurations**: Configuración global del sistema

## Seguridad

- ✅ Contraseñas encriptadas con bcryptjs
- ✅ JWT sin expiración (configurable)
- ✅ Roles basados en usuarios
- ✅ CORS habilitado
- ✅ Validación de entrada con class-validator
- ✅ Transacciones ACID en operaciones críticas

## Usuarios de Demo

**Administrador**
- Email: `admin@distribuidora.com`
- Contraseña: `password123`
- Rol: Administrador

## Despliegue en Render

### Pasos de Despliegue

1. **Crear nuevos servicios en Render**
   - Backend: Node.js
   - Frontend: Static Site (Next.js)
   - Database: PostgreSQL

2. **Variables de Entorno (Backend)**
```
DB_HOST=<postgres-internal-url>
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=<strong-password>
DB_NAME=distribuidora
JWT_SECRET=<strong-secret>
PORT=3001
```

3. **Build Command (Backend)**
```bash
pnpm install && pnpm run build:backend
```

4. **Start Command (Backend)**
```bash
cd backend && pnpm start:prod
```

5. **Build Command (Frontend)**
```bash
pnpm install && pnpm run build:frontend
```

6. **Environment Variables (Frontend)**
```
NEXT_PUBLIC_API_URL=<backend-url>
```

## Monitoreo y Logs

El sistema registra:
- Inicio/cierre de sesión
- Creación/modificación/eliminación de datos
- Cambios en stock
- Errores y excepciones

Ver logs en tiempo real:
```bash
# Backend
pnpm dev

# Registros de auditoría
SELECT * FROM audits ORDER BY createdAt DESC;
```

## Soporte y Contribuciones

Para reportar bugs o solicitar features, abrir un issue en el repositorio.

## Licencia

Propietario - 2024

---

**Última actualización**: Junio 2024
**Versión**: 1.0.0
