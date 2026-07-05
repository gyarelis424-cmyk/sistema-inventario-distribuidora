🚀 COMIENZA AQUÍ - DISTRIBUIDORA
================================

**Bienvenido al Sistema Integral de Gestión de Inventario Empresarial**

---

## 📌 Lo Primero Que Necesitas Saber

### ¿Qué es DISTRIBUIDORA?
Un sistema profesional para gestionar:
- ✅ Catálogo de productos
- ✅ Entradas de inventario (compras)
- ✅ Salidas de inventario (ventas)
- ✅ Proveedores y clientes
- ✅ Reportes y análisis
- ✅ Auditoría y trazabilidad

### ¿Qué tecnologías se usan?
- **Frontend**: Next.js 15 + React 19 + Tailwind CSS
- **Backend**: NestJS 10 + TypeORM
- **Base de Datos**: PostgreSQL 14+
- **Autenticación**: JWT sin expiración
- **Despliegue**: Docker + Render

---

## ⚡ INICIO RÁPIDO (5 MINUTOS)

### Paso 1: Clonar e Instalar
```bash
git clone <tu-repositorio>
cd distribuidora
pnpm install
```

### Paso 2: Configurar Base de Datos
```bash
# Opción A: Con Docker (recomendado)
docker-compose up -d
# → PostgreSQL estará disponible en localhost:5432

# Opción B: PostgreSQL local
# Asegúrate de que PostgreSQL está instalado y ejecutándose
```

### Paso 3: Crear archivo .env
```bash
cp .env.example .env
```

Edita `.env` con los valores de tu base de datos:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=distribuidora
JWT_SECRET=tu-clave-segura-aqui
```

### Paso 4: Iniciar la aplicación
```bash
pnpm dev
```

### Paso 5: Acceder a la aplicación
```
Frontend:  http://localhost:3000
Backend:   http://localhost:3001
```

### Paso 6: Login
```
Email:    admin@distribuidora.com
Password: Admin123!
```

⚠️ **CAMBIAR INMEDIATAMENTE EN PRODUCCIÓN**

---

## 📚 DOCUMENTACIÓN POR TIPO

### Para Empezar Rápido
1. **[QUICKSTART.md](./QUICKSTART.md)** - Instalación en 5 minutos

### Para Entender el Sistema
2. **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Visión general + diagramas
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Cómo funciona internamente

### Para Desarrollar
4. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Estructura técnica
5. **[README.md](./README.md)** - Características y uso

### Para Desplegar
6. **[RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)** - Guía de producción
7. **[docker-compose.yml](./docker-compose.yml)** - Docker local

### Referencia Rápida
8. **[INDEX.md](./INDEX.md)** - Índice completo
9. **[IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)** - Estado actual

---

## 🎯 ¿Cuál es mi siguiente paso?

### Si quieres...

**Ejecutar la aplicación localmente**
→ Ve a [QUICKSTART.md](./QUICKSTART.md)

**Entender cómo funciona**
→ Lee [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)

**Modificar el código**
→ Estudia [ARCHITECTURE.md](./ARCHITECTURE.md)

**Desplegar en producción**
→ Sigue [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

**Ver todas las características**
→ Consulta [README.md](./README.md)

**Buscar algo específico**
→ Usa [INDEX.md](./INDEX.md)

---

## 🎨 ¿Cómo se ve?

### Página de Login
```
┌─────────────────────────────────┐
│                                 │
│      DISTRIBUIDORA              │
│   Sistema de Inventario         │
│                                 │
│   [Email____________________]   │
│   [Contraseña______________]   │
│   ☐ Recuérdame                  │
│                                 │
│   [INICIAR SESIÓN]              │
│   ¿Olvidó su contraseña?        │
│                                 │
└─────────────────────────────────┘
```

### Dashboard
```
┌──────────┬──────────┬──────────┬──────────┐
│Productos │Stock Tot │Entradas  │ Salidas  │
│  1,248   │ 15,780   │   342    │   298    │
└──────────┴──────────┴──────────┴──────────┘

┌──────────────────────────┐
│ Movimientos (6 meses)    │
│ (Gráfico de líneas)      │
└──────────────────────────┘
```

### Tabla de Productos
```
┌─────┬──────────┬──────────┬──────┬────────┬───────┐
│ Cod │ Producto │ Categoría│ Unit │ Precio │ Stock │
├─────┼──────────┼──────────┼──────┼────────┼───────┤
│P001 │Leche 1L  │Lácteos   │Unidad│C$ 45  │  250  │
│P002 │Arroz 5kg │Abarrotas │Unidad│C$150  │  180  │
└─────┴──────────┴──────────┴──────┴────────┴───────┘
```

---

## 📊 Módulos Disponibles

| Módulo | Descripción | Estado |
|--------|-----------|--------|
| **Autenticación** | Login con JWT | ✅ |
| **Dashboard** | KPIs en tiempo real | ✅ |
| **Productos** | Catálogo completo | ✅ |
| **Entradas** | Registro de compras | ✅ |
| **Salidas** | Registro de ventas | ✅ |
| **Reportes** | Stock, movimientos, kardex | ✅ |
| **Configuración** | Datos maestros | ✅ |
| **Auditoría** | Registro de cambios | ✅ |

---

## 🔐 Credenciales por Defecto

```
Email:    admin@distribuidora.com
Password: Admin123!
```

⚠️ **CAMBIAR INMEDIATAMENTE EN PRODUCCIÓN**

Instrucciones: Ve a Configuración → Usuarios → Editar administrador

---

## 🗂️ Estructura del Proyecto

```
distribuidora/
├── app/                  ← Frontend (Next.js)
├── backend/              ← Backend (NestJS)
├── components/           ← Componentes React
├── lib/                  ← Utilidades
├── docker-compose.yml    ← Docker local
├── Dockerfile            ← Docker producción
└── [DOCUMENTACIÓN]       ← 9 guías completas
```

---

## 🚀 Próximos Pasos

### Fase 1: Desarrollo Local (AHORA)
1. ✅ Instalar dependencias
2. ✅ Configurar .env
3. ✅ Ejecutar docker-compose up -d
4. ✅ Iniciar con pnpm dev
5. ✅ Probar en http://localhost:3000

### Fase 2: Desarrollo
1. Crear productos y categorías
2. Registrar proveedores y clientes
3. Hacer entradas de prueba
4. Hacer salidas de prueba
5. Verificar reportes

### Fase 3: Personalización
1. Cambiar logo y nombre de empresa
2. Agregar más productos
3. Modificar precios y stock mínimo
4. Crear usuarios adicionales

### Fase 4: Despliegue
1. Ver [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
2. Configurar PostgreSQL en Render
3. Desplegar backend
4. Desplegar frontend
5. Configurar dominio

---

## 🆘 Problemas Comunes

### "No puedo conectar a la BD"
- Verifica que docker-compose está corriendo: `docker ps`
- Verifica las credenciales en .env
- Intenta: `docker-compose restart`

### "Frontend no se conecta al backend"
- Verifica que backend está corriendo: http://localhost:3001
- Revisa console.log en el navegador para errores
- Verifica CORS en backend

### "Página en blanco"
- Abre las herramientas de desarrollador (F12)
- Revisa la pestaña Console para errores
- Reinicia el servidor: `pnpm dev`

### "Error de contraseña al login"
- Usa las credenciales por defecto
- No cambies la contraseña antes de entender el sistema

---

## 📖 Leer Después

Cuando tengas más tiempo:

1. **ARCHITECTURE.md** - Entiende los patrones
2. **PROJECT_SUMMARY.md** - Estudia la estructura
3. **RENDER_DEPLOYMENT.md** - Aprende sobre producción
4. **IMPLEMENTATION_CHECKLIST.md** - Verifica el estado

---

## 💡 Tips Importantes

1. **Siempre cambiar credenciales en producción**
2. **Hacer backups de la BD regularmente**
3. **Revisar auditoría periódicamente**
4. **Mantener stock mínimo adecuado**
5. **Validar datos antes de grandes importaciones**

---

## 🎯 Verificación Rápida

Después de pnpm dev, verifica:

```
✅ Frontend abre en http://localhost:3000
✅ Puedes hacer login
✅ Dashboard muestra datos
✅ Puedes ver productos
✅ Puedes crear entradas
✅ Puedes crear salidas
```

---

## 📞 Ayuda

**¿No encuentras algo?**

1. Busca en [INDEX.md](./INDEX.md)
2. Revisa [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
3. Estudia [ARCHITECTURE.md](./ARCHITECTURE.md)
4. Consulta [README.md](./README.md)

---

## ✨ ¡Estás listo!

```
$ pnpm dev

→ Abre http://localhost:3000
→ Login con admin@distribuidora.com / Admin123!
→ ¡Explora el sistema!
```

---

**Creado con ❤️ para DISTRIBUIDORA**

v1.0.0 | 2024

[← Volver a INDEX.md](./INDEX.md) | [QUICKSTART →](./QUICKSTART.md)
