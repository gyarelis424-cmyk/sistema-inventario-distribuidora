# QUICKSTART - Guía Rápida de Instalación

## 1. Requisitos Previos

- Node.js 18+ instalado
- Docker y Docker Compose (para PostgreSQL local)
- pnpm instalado (`npm install -g pnpm`)

## 2. Clonar y Preparar

```bash
# Clonar repo
git clone <repository-url>
cd distribuidora

# Instalar dependencias
pnpm install
```

## 3. Base de Datos (Opción A: Docker)

```bash
# Iniciar PostgreSQL en Docker
docker-compose up -d postgres

# Esperar 10 segundos a que PostgreSQL inicie
sleep 10
```

## 3B. Base de Datos (Opción B: Local)

Si tienes PostgreSQL instalado localmente, crear base de datos:

```sql
CREATE DATABASE distribuidora;
```

## 4. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar si es necesario (los valores por defecto funcionan con Docker)
nano .env.local
```

## 5. Iniciar en Desarrollo

```bash
# Terminal 1: Iniciar Todo (Frontend + Backend)
pnpm dev

# O en terminales separadas:

# Terminal 1: Frontend (http://localhost:3000)
pnpm dev:frontend

# Terminal 2: Backend (http://localhost:3001)
cd backend && pnpm start:dev
```

## 6. Acceder al Sistema

Abrir navegador:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api

Credenciales de demo:
- Email: `admin@distribuidora.com`
- Contraseña: `password123`

## Estructura del Proyecto

```
distribuidora/
├── app/                 # Páginas Next.js
├── components/          # Componentes React
├── lib/                 # Utilidades
├── backend/             # API NestJS
│   └── src/
│       ├── entities/    # Modelos de BD
│       ├── services/    # Lógica de negocio
│       ├── controllers/ # Rutas API
│       └── seeds/       # Datos iniciales
└── public/              # Archivos estáticos
```

## Próximas Contribuciones

1. **Autenticación Real**: Conectar el formulario de login
2. **CRUD Completo**: Crear, editar, eliminar productos
3. **Reportes**: Generar PDF/Excel
4. **Notificaciones**: Alertas en tiempo real
5. **Mobile**: App responsive mejorada

## Solución de Problemas

### Puerto 3000 u 3001 en uso

```bash
# Cambiar puerto del frontend
pnpm dev:frontend -- -p 3002

# O matar el proceso ocupando el puerto
lsof -i :3000  # Ver proceso
kill -9 <PID>  # Matar proceso
```

### Problemas de conexión a BD

```bash
# Verificar que PostgreSQL está corriendo
docker ps | grep postgres

# Ver logs
docker-compose logs postgres

# Reiniciar contenedor
docker-compose restart postgres
```

### Limpiar todo y empezar de cero

```bash
# Detener Docker
docker-compose down -v

# Borrar node_modules
rm -rf node_modules pnpm-lock.yaml

# Reinstalar
pnpm install

# Volver al paso 3
```

## Siguientes Pasos

1. Explorar el Dashboard
2. Crear un nuevo producto
3. Crear una entrada (compra)
4. Crear una salida (venta)
5. Ver reportes

¡Disfruta! 🚀
