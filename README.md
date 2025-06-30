# 💰 Control de Gastos - Frontend

Una aplicación web moderna para el control de gastos personales construida con Next.js 15, TypeScript y Tailwind CSS.

## 🚀 Características

- ✅ **Autenticación de usuarios** con JWT
- 📊 **Dashboard interactivo** con gráficos y estadísticas
- 💳 **Gestión de transacciones** (ingresos y gastos)
- 📂 **Categorización** de gastos
- 💰 **Presupuestos** y control de límites
- 📱 **Responsive design** para móviles y escritorio
- 🎨 **UI moderna** con Shadcn/UI
- 🔐 **Seguridad** con manejo de tokens

## 🛠️ Tecnologías

- **Framework**: Next.js 15 (React 18)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes**: Shadcn/UI + Radix UI
- **HTTP Client**: Axios
- **Gráficos**: Recharts
- **Iconos**: Lucide React
- **Validación**: Zod + React Hook Form

## 📦 Instalación

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn
- Backend deployado en Render (ver documentación del backend)

### Configuración local

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd Frontend-gastos
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Editar `.env.local`:
```bash
# Configuración de la API
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_API_URL_PRODUCTION=https://tu-backend.onrender.com/api
NEXT_PUBLIC_NODE_ENV=development

# Gemini API Key (opcional)
GEMINI_API_KEY=tu_gemini_api_key
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:9002`

## 🚀 Deployment en Vercel

### 1. Preparación

1. **Eliminar carpeta del backend** (si existe)
2. **Configurar variables de entorno** en Vercel
3. **Conectar repositorio** a Vercel

### 2. Variables de entorno en Vercel

```bash
NEXT_PUBLIC_API_URL_PRODUCTION=https://tu-backend.onrender.com/api
NEXT_PUBLIC_NODE_ENV=production
GEMINI_API_KEY=tu_gemini_api_key
```

### 3. Deploy automático

Vercel desplegará automáticamente cuando hagas push a la rama principal.

## 🏗️ Estructura del proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── (auth)/            # Rutas de autenticación
│   ├── (app)/             # Rutas de la aplicación
│   ├── globals.css        # Estilos globales
│   └── layout.tsx         # Layout principal
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de UI (Shadcn)
│   ├── analytics/        # Componentes de análisis
│   └── transactions/     # Componentes de transacciones
├── contexts/             # Contextos de React
│   └── AuthContext.tsx   # Contexto de autenticación
├── hooks/                # Hooks personalizados
│   ├── useTransactions.ts
│   ├── useCategories.ts
│   └── useBudgets.ts
├── lib/                  # Librerías y utilidades
│   ├── api-client.ts     # Cliente HTTP
│   ├── auth-service.ts   # Servicio de autenticación
│   ├── transaction-service.ts
│   ├── category-service.ts
│   ├── budget-service.ts
│   └── utils.ts          # Utilidades
└── types/                # Tipos de TypeScript
    └── index.ts
```

## 🔧 Scripts disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo

# Producción
npm run build        # Construir para producción
npm run start        # Servidor de producción

# Linting y tipos
npm run lint         # Linter
npm run typecheck    # Verificar tipos
```

## 🌐 API Endpoints

El frontend se conecta a estos endpoints del backend:

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/profile` - Obtener perfil
- `PUT /api/auth/profile` - Actualizar perfil

### Transacciones
- `GET /api/transactions` - Listar transacciones
- `POST /api/transactions` - Crear transacción
- `GET /api/transactions/:id` - Obtener transacción
- `PUT /api/transactions/:id` - Actualizar transacción
- `DELETE /api/transactions/:id` - Eliminar transacción
- `GET /api/transactions/stats` - Estadísticas

### Categorías
- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría
- `PUT /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría

### Presupuestos
- `GET /api/budgets` - Listar presupuestos
- `POST /api/budgets` - Crear presupuesto
- `PUT /api/budgets/:id` - Actualizar presupuesto
- `DELETE /api/budgets/:id` - Eliminar presupuesto

## 🎨 Personalización

### Colores y tema
Los colores se configuran en `tailwind.config.ts` y `src/app/globals.css`

### Componentes
Los componentes de UI están en `src/components/ui/` y pueden personalizarse

### Iconos
Se usan iconos de Lucide React. Puedes cambiarlos en `src/config/nav.ts`

## 🔐 Autenticación

La aplicación usa JWT para autenticación:

1. **Login/Register**: Obtiene tokens del backend
2. **Storage**: Guarda tokens en localStorage
3. **Interceptors**: Añade tokens a requests automáticamente
4. **Redirect**: Redirige a login si el token expira

## 📱 Responsive Design

La aplicación es totalmente responsive con:
- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: Responsive en todas las pantallas
- **Touch Friendly**: Botones y elementos táctiles
- **Navigation**: Menú lateral en móvil, sidebar en escritorio

## 🔍 Debugging

### Logs del cliente
```bash
# Verificar requests de API
console.log('API Request:', data)

# Verificar estado de autenticación
console.log('Auth state:', user)
```

### Variables de entorno
```bash
# Verificar configuración
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
```

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

MIT

## 📞 Soporte

Para problemas o preguntas:
1. Revisa la documentación en `DEPLOYMENT_GUIDE.md`
2. Verifica las variables de entorno
3. Revisa los logs en Vercel
4. Contacta al equipo de desarrollo

---

**Desarrollado con ❤️ para hacer el control de gastos más fácil y accesible.**
