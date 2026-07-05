Guía de Despliegue en Render
============================

Este documento describe cómo desplegar la aplicación DISTRIBUIDORA en Render.

## Requisitos previos

1. Cuenta en Render (render.com)
2. Repositorio GitHub con el código
3. Base de datos PostgreSQL (Render proporciona una)

## Paso 1: Crear servicio PostgreSQL en Render

1. Inicia sesión en Render Dashboard
2. Haz clic en "New +" → "PostgreSQL"
3. Configura:
   - **Name**: distribuidora-db
   - **Database**: distribuidora
   - **User**: postgres
   - **Region**: Elige tu región más cercana
   - **Plan**: Free (o superior según necesidades)

4. Nota la cadena de conexión que proporciona Render

## Paso 2: Desplegar Backend (NestJS)

1. En Render Dashboard, haz clic en "New +" → "Web Service"
2. Conecta tu repositorio GitHub
3. Configura:
   - **Name**: distribuidora-backend
   - **Environment**: Node
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `node dist/main.js`
   - **Region**: Misma región que la BD

4. Agrega variables de entorno:
   ```
   NODE_ENV=production
   DB_HOST=[hostname de la BD de Render]
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=[contraseña de la BD]
   DB_NAME=distribuidora
   JWT_SECRET=[genera una cadena segura aleatoria]
   CORS_ORIGIN=https://tu-frontend-url.onrender.com
   ```

5. Haz clic en "Create Web Service"
6. Espera a que compile (5-10 minutos)

## Paso 3: Desplegar Frontend (Next.js)

1. En Render Dashboard, haz clic en "New +" → "Web Service"
2. Conecta tu repositorio GitHub
3. Configura:
   - **Name**: distribuidora-frontend
   - **Environment**: Node
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`
   - **Region**: Misma región

4. Agrega variables de entorno:
   ```
   NEXT_PUBLIC_API_URL=https://tu-backend-url.onrender.com/api
   ```

5. Haz clic en "Create Web Service"
6. Espera a que compile

## Paso 4: Inicializar Base de Datos

Una vez el backend esté corriendo:

1. Conectate a la base de datos desde tu máquina local:
   ```bash
   psql postgresql://postgres:[password]@[host]:5432/distribuidora
   ```

2. O desde el backend, ejecuta el seed script:
   ```bash
   curl https://tu-backend-url.onrender.com/api/seed/init
   ```

## Configuración de Variables de Entorno

### Backend (.env)
```
NODE_ENV=production
PORT=3001
DB_HOST=[postgres-host]
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=[password]
DB_NAME=distribuidora
JWT_SECRET=[secret-key-segura]
CORS_ORIGIN=https://frontend-url.onrender.com
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://backend-url.onrender.com/api
```

## Monitoreo

1. **Logs del Backend**: Dashboard → Backend Service → "Logs"
2. **Logs del Frontend**: Dashboard → Frontend Service → "Logs"
3. **Estado de la BD**: Dashboard → PostgreSQL → "Logs"

## Troubleshooting

### Error de conexión a BD
- Verifica que las variables de entorno DB_* sean correctas
- Comprueba que la IP de Render está en la whitelist (si aplica)

### Frontend no se conecta al Backend
- Verifica NEXT_PUBLIC_API_URL
- Comprueba CORS_ORIGIN en el backend

### Build falla
- Revisa los logs completos
- Asegúrate de que el comando de build está correcto

## Costos

- **PostgreSQL Free**: Incluido (reinicio automático después de 15 min de inactividad)
- **Backend Web Service Free**: $7/mes o gratis (limitaciones)
- **Frontend Web Service Free**: $7/mes o gratis (limitaciones)

Para uso en producción, considera los planes de pago.

## Consideraciones de Seguridad

1. Usa JWT_SECRET seguro (mínimo 32 caracteres aleatorios)
2. No expongas credenciales en el código
3. Usa HTTPS en todas las comunicaciones
4. Implementa rate limiting en producción
5. Habilita HTTPS en Render (automático)

## Actualizar Código

Para actualizar tu aplicación:

1. Haz push a tu rama main en GitHub
2. Render detectará los cambios automáticamente
3. Ejecutará el build y redesplegará

## Resetear la Base de Datos

Si necesitas resetear completamente:

1. En Render Dashboard, ve a PostgreSQL
2. En "Danger Zone" → "Delete Database" (cuidado: esto borra TODO)
3. Crea una nueva base de datos
4. Actualiza las credenciales en el backend
5. Redespliega el backend para ejecutar migraciones
