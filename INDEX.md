📦 DISTRIBUIDORA - Sistema de Inventario Empresarial
===================================================

## 📋 Índice de Documentación

### Para Empezar
1. **[QUICKSTART.md](./QUICKSTART.md)** - Inicia el proyecto en 5 minutos
2. **[README.md](./README.md)** - Descripción general y características

### Desarrollo
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura del sistema
4. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Estructura técnica detallada
5. **[IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)** - Estado de implementación

### Despliegue
6. **[RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)** - Guía de despliegue en Render
7. **[docker-compose.yml](./docker-compose.yml)** - Desarrollo con Docker
8. **[Dockerfile](./Dockerfile)** - Imagen para producción

### Referencia
9. **[CHANGES.md](./CHANGES.md)** - Cambios realizados en v1.0
10. **[.env.example](./.env.example)** - Variables de entorno

---

## 🎯 Inicio Rápido

```bash
# 1. Clonar y configurar
git clone <repository>
cd distribuidora
pnpm install

# 2. Base de datos (opción 1: Docker)
docker-compose up -d

# 3. Variables de entorno
cp .env.example .env
# Editar .env con credenciales reales

# 4. Iniciar desarrollo
pnpm dev

# 5. Acceder a la aplicación
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

---

## 📁 Estructura del Proyecto

```
distribuidora/
├── app/                          # Frontend (Next.js)
│   ├── login/                    # Página de autenticación
│   ├── dashboard/                # Panel principal
│   ├── products/                 # Gestión de productos
│   ├── entries/                  # Registro de entradas
│   ├── exits/                    # Registro de salidas
│   ├── reports/                  # Generación de reportes
│   ├── configuration/            # Datos maestros
│   ├── layout.tsx                # Layout principal
│   └── globals.css               # Estilos globales
│
├── components/                   # Componentes React
│   ├── sidebar.tsx               # Navegación
│   ├── header.tsx                # Encabezado
│   └── main-layout.tsx           # Layout wrapper
│
├── lib/                          # Utilidades
│   ├── api.ts                    # Cliente API (fetch)
│   ├── api-client.ts             # Cliente API mejorado
│   └── utils.ts                  # Funciones auxiliares
│
├── backend/                      # Backend (NestJS)
│   ├── src/
│   │   ├── entities/             # Modelos TypeORM
│   │   ├── services/             # Lógica de negocio
│   │   ├── controllers/          # Endpoints REST
│   │   ├── dtos/                 # Validación de datos
│   │   ├── strategies/           # JWT strategy
│   │   ├── guards/               # Autenticación
│   │   ├── database/             # Configuración BD
│   │   ├── seeds/                # Datos iniciales
│   │   ├── utils/                # Utilidades
│   │   ├── app.module.ts         # Módulo principal
│   │   ├── app.ts                # Inicialización
│   │   └── main.ts               # Entry point
│   ├── tsconfig.json
│   └── build.js
│
├── public/                       # Archivos estáticos
├── node_modules/                 # Dependencias
│
├── .env.example                  # Variables de entorno
├── .gitignore                    # Git ignore
├── docker-compose.yml            # Docker local
├── Dockerfile                    # Imagen producción
├── next.config.mjs               # Config Next.js
├── package.json                  # Dependencies
│
├── README.md                     # Guía general
├── QUICKSTART.md                 # Inicio rápido
├── ARCHITECTURE.md               # Arquitectura
├── PROJECT_SUMMARY.md            # Resumen técnico
├── CHANGES.md                    # Cambios realizados
├── RENDER_DEPLOYMENT.md          # Despliegue
├── IMPLEMENTATION_CHECKLIST.md   # Estado actual
└── INDEX.md                      # Este archivo
```

---

## 🚀 Características Implementadas

### ✅ Backend (NestJS + TypeORM)
- [x] 12 entidades completas
- [x] 10 servicios con lógica de negocio
- [x] 10 controladores REST
- [x] Autenticación JWT (sin expiración)
- [x] Validación de datos con DTOs
- [x] Auditoría de cambios
- [x] CORS configurado
- [x] Seed data con ejemplos

### ✅ Frontend (Next.js)
- [x] 7 páginas principales
- [x] Autenticación con tokens JWT
- [x] Dashboard con KPIs en tiempo real
- [x] Tablas con búsqueda y paginación
- [x] Formularios con validación
- [x] Componentes reutilizables
- [x] Design system corporativo
- [x] Responsive design

### ✅ Base de Datos (PostgreSQL)
- [x] Esquema relacional completo
- [x] Integridad referencial
- [x] Índices en campos clave
- [x] Timestamps automáticos
- [x] Auditoría de cambios

### ✅ Documentación
- [x] README completo
- [x] Guía de inicio rápido
- [x] Arquitectura detallada
- [x] Guía de despliegue
- [x] Checklist de implementación
- [x] Documentación de cambios

---

## 📊 Módulos del Sistema

### 1. Autenticación (Auth)
- Login/Logout
- JWT sin expiración
- Gestión de sesiones
- Recuperación de contraseña (futuro)

### 2. Gestión de Productos
- Catálogo completo
- Categorías jerárquicas
- Unidades de medida
- Precios en C$
- Stock actual y mínimo

### 3. Gestión de Inventario
- **Entradas**: Compras a proveedores
- **Salidas**: Ventas a clientes
- Actualización automática de stock
- Validación de disponibilidad

### 4. Gestión Transaccional
- Entrada de Compras
- Salida de Ventas
- Detalle de artículos
- Documento asociado

### 5. Configuración del Sistema
- Usuarios y roles
- Categorías de productos
- Unidades de medida
- Proveedores
- Clientes
- Parámetros generales

### 6. Reportes
- Stock actual
- Movimientos (Entradas/Salidas)
- Kardex de productos
- Productos por categoría
- Análisis de proveedores

### 7. Auditoría
- Registro de cambios
- Usuario responsable
- Fecha y hora
- Datos anteriores y nuevos

---

## 🔐 Seguridad

- ✅ Contraseñas hasheadas (bcryptjs)
- ✅ JWT sin expiración configurable
- ✅ CORS configurado
- ✅ Validación de datos robusta
- ✅ Auditoría de cambios
- ✅ HTTPS en producción
- ✅ Protección contra SQL injection

---

## 📈 Rendimiento

- ✅ Paginación en listados
- ✅ Índices en BD
- ✅ Lazy loading en frontend
- ✅ Compresión gzip
- ✅ Next.js SSR
- ✅ Caché de respuestas

---

## 🎨 Diseño

**Colores Corporativos**:
- Primario: #0066cc (Azul)
- Sidebar: #0f172a (Azul Marino Oscuro)
- Texto: #1a2332 (Gris Oscuro)
- Fondo: Blanco (#ffffff)
- Bordes: #e5e5e5 (Gris Claro)

**Tipografía**:
- Headings: Geist (Next.js default)
- Body: Geist (Next.js default)

**Componentes**:
- Tablas responsivas
- Botones estilizados
- Formularios validados
- Modales y diálogos
- Cards y containers

---

## 📱 Responsividad

- ✅ Desktop (1920px y más)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)
- ✅ Dark mode support

---

## 🌍 Despliegue

### Desarrollo Local
```bash
docker-compose up -d    # PostgreSQL
pnpm dev                # Frontend + Backend
```

### Producción (Render)
Ver [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

### Variables de Entorno Requeridas

**Backend** (.env):
```
NODE_ENV=production
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=distribuidora
JWT_SECRET=tu-clave-segura-aqui
CORS_ORIGIN=http://localhost:3000
PORT=3001
```

**Frontend** (.env.local):
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 👥 Usuarios por Defecto

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@distribuidora.com | Admin123! | Administrador |

⚠️ **CAMBIAR INMEDIATAMENTE EN PRODUCCIÓN**

---

## 📚 Stack Tecnológico

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes**: shadcn/ui ready
- **Gestión de estado**: React hooks + localStorage
- **HTTP Client**: Fetch API

### Backend
- **Framework**: NestJS 10
- **ORM**: TypeORM
- **Base de Datos**: PostgreSQL 14+
- **Autenticación**: Passport + JWT
- **Validación**: class-validator
- **Hash**: bcryptjs

### Infraestructura
- **Contenedorización**: Docker
- **Hosting**: Render (recomendado)
- **BD**: PostgreSQL en Render
- **CI/CD**: Render (automático)

---

## 🔄 Flujo de Trabajo

1. **Desarrollo Local**:
   ```bash
   pnpm dev
   # Frontend: http://localhost:3000
   # Backend: http://localhost:3001
   ```

2. **Testing**:
   ```bash
   # (Implementar en fase 2)
   ```

3. **Build**:
   ```bash
   pnpm build
   ```

4. **Despliegue**:
   - Push a rama main en GitHub
   - Render se redespliega automáticamente

---

## 📞 Soporte y Recursos

- 📖 [Next.js Docs](https://nextjs.org/docs)
- 📖 [NestJS Docs](https://docs.nestjs.com)
- 📖 [TypeORM Docs](https://typeorm.io)
- 📖 [PostgreSQL Docs](https://www.postgresql.org/docs)
- 📖 [Tailwind CSS Docs](https://tailwindcss.com)

---

## 📝 Licencia

Propietario - Uso exclusivo para DISTRIBUIDORA

---

## ✨ Versión

**v1.0.0** - 2024

Última actualización: 20 de Junio de 2024

---

**🎉 ¡Sistema listo para producción!**

Para empezar: [QUICKSTART.md](./QUICKSTART.md)
