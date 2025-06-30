# CONFIGURACIÓN DE DEPLOYMENT - FRONTEND Y BACKEND

Este documento describe cómo configurar el deployment del frontend en Vercel y preparar la aplicación para trabajar con el backend deployado en Render.

## 🚀 DEPLOYMENT DEL FRONTEND EN VERCEL

### 1. Preparación previa

Antes de hacer el deployment, asegúrate de:

1. **Eliminar la carpeta Backend-gastos** del directorio del frontend
2. **Actualizar las variables de entorno** con la URL de producción del backend

### 2. Variables de entorno en Vercel

En tu proyecto de Vercel, configura las siguientes variables de entorno:

```bash
# Configuración de la API
NEXT_PUBLIC_API_URL_PRODUCTION=https://tu-backend-en-render.onrender.com/api
NEXT_PUBLIC_NODE_ENV=production

# API Key de Gemini (si es necesaria)
GEMINI_API_KEY=tu_gemini_api_key
```

### 3. Scripts de build

Los scripts en `package.json` ya están configurados:

```json
{
  "scripts": {
    "dev": "next dev --turbopack -p 9002",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  }
}
```

### 4. Configuración de Next.js

El archivo `next.config.ts` ya está configurado para ignorar errores de TypeScript y ESLint durante el build:

```typescript
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ... resto de configuración
};
```

## 🔧 CONFIGURACIÓN DEL BACKEND

### 1. URL del backend en Render

Una vez que tu backend esté deployado en Render, tendrás una URL como:
`https://tu-app-backend.onrender.com`

### 2. Endpoints de la API

El frontend está configurado para usar estos endpoints:

```
POST /api/auth/register      - Registrar usuario
POST /api/auth/login         - Iniciar sesión
POST /api/auth/logout        - Cerrar sesión
GET  /api/auth/profile       - Obtener perfil
PUT  /api/auth/profile       - Actualizar perfil
GET  /api/auth/verify        - Verificar token

GET  /api/transactions       - Obtener transacciones
POST /api/transactions       - Crear transacción
GET  /api/transactions/:id   - Obtener transacción específica
PUT  /api/transactions/:id   - Actualizar transacción
DELETE /api/transactions/:id - Eliminar transacción
GET  /api/transactions/stats - Estadísticas
GET  /api/transactions/trends - Tendencias mensuales

GET  /api/categories         - Obtener categorías
POST /api/categories         - Crear categoría
GET  /api/categories/:id     - Obtener categoría específica
PUT  /api/categories/:id     - Actualizar categoría
DELETE /api/categories/:id   - Eliminar categoría

GET  /api/budgets           - Obtener presupuestos
POST /api/budgets           - Crear presupuesto
GET  /api/budgets/:id       - Obtener presupuesto específico
PUT  /api/budgets/:id       - Actualizar presupuesto
DELETE /api/budgets/:id     - Eliminar presupuesto
GET  /api/budgets/active    - Presupuestos activos
```

## 🔐 CONFIGURACIÓN DE CORS

Asegúrate de que tu backend en Render tenga configurado CORS para permitir requests desde tu dominio de Vercel:

```javascript
// En tu backend
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:9002',
    'https://tu-frontend-en-vercel.vercel.app',
    // Agrega tu dominio personalizado si tienes uno
  ],
  credentials: true,
};
```

## 📝 PASOS PARA EL DEPLOYMENT

### Frontend en Vercel:

1. **Conectar repositorio** a Vercel
2. **Configurar variables de entorno** en la dashboard de Vercel
3. **Actualizar URL del backend** en las variables de entorno
4. **Deploy automático** cuando hagas push a la rama principal

### Backend en Render:

1. **Crear nuevo Web Service** en Render
2. **Conectar repositorio** del backend
3. **Configurar variables de entorno** (DATABASE_URL, JWT_SECRET, etc.)
4. **Configurar CORS** para permitir tu dominio de Vercel
5. **Deploy automático** cuando hagas push

## 🔄 FLUJO DE DESARROLLO

### Desarrollo local:
```bash
# Frontend (puerto 9002)
npm run dev

# Backend (puerto 3000)
# En el repositorio separado del backend
npm run dev
```

### Variables de entorno locales:
```bash
# .env.local (frontend)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_NODE_ENV=development
```

## ✅ VERIFICACIÓN

Para verificar que todo funciona correctamente:

1. **Frontend**: Verifica que se pueda acceder en tu URL de Vercel
2. **API Connection**: Verifica que el login/registro funcione
3. **Data Flow**: Crea una transacción de prueba
4. **Error Handling**: Verifica que los errores se muestren correctamente

## 📚 ESTRUCTURA DE ARCHIVOS ACTUALIZADA

```
Frontend-gastos/
├── src/
│   ├── lib/
│   │   ├── api-client.ts      # Cliente HTTP configurado
│   │   ├── auth-service.ts    # Servicio de autenticación
│   │   ├── transaction-service.ts # Servicio de transacciones
│   │   ├── category-service.ts    # Servicio de categorías
│   │   ├── budget-service.ts      # Servicio de presupuestos
│   │   └── api.ts             # Exportaciones y utilidades
│   ├── contexts/
│   │   └── AuthContext.tsx    # Contexto de autenticación actualizado
│   ├── hooks/
│   │   ├── useTransactions.ts # Hook para transacciones
│   │   ├── useCategories.ts   # Hook para categorías
│   │   └── useBudgets.ts      # Hook para presupuestos
│   └── types/
│       └── index.ts           # Tipos actualizados para la API
├── .env                       # Variables de entorno
├── .env.local                 # Variables locales
└── package.json               # Dependencias (axios agregado)
```

## 🚨 NOTAS IMPORTANTES

1. **Axios instalado**: Se agregó axios como dependencia para las llamadas HTTP
2. **Tipos actualizados**: Los tipos ahora coinciden con la estructura del backend
3. **Error handling**: Se implementó manejo de errores consistente
4. **Token management**: Los tokens se manejan automáticamente
5. **CORS**: Asegúrate de configurar CORS en el backend para tu dominio de Vercel

## 🔍 DEBUG

Si tienes problemas:

1. **Revisa las variables de entorno** en Vercel
2. **Verifica la URL del backend** en las variables
3. **Revisa los logs** en Vercel y Render
4. **Prueba las APIs** directamente con Postman/Thunder Client
5. **Verifica CORS** en el backend
