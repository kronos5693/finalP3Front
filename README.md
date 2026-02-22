# Frontend - Oficina de Turismo

Aplicación web para la gestión de excursiones turísticas. Desarrollado con React, Material UI y Vite. Este proyecto forma parte de un trabajo final de la materia Programacion 3. Y esta pensado para ser mostrado en un ambiente academico.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [Rutas de la Aplicación](#rutas-de-la-aplicación)
- [Componentes Principales](#componentes-principales)
- [Contextos](#contextos)
- [Servicios](#servicios)
- [Build para Producción](#build-para-producción)

---

## 📖 Descripción

Aplicación web interactiva para una oficina de turismo que permite a los usuarios:
- Explorar excursiones disponibles
- Buscar excursiones por provincia
- Crear reservas
- Gestionar carrito de compras
- Ver y gestionar reservas personales
- Panel administrativo (solo admins)

---

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18.2.0 | Biblioteca UI |
| Vite | 4.4.5 | Build tool y dev server |
| Material UI | 7.3.7 | Componentes UI |
| React Router DOM | 6.17.0 | Enrutamiento |
| Axios | 1.6.1 | Cliente HTTP |
| Day.js | 1.11.19 | Manejo de fechas |
| @mui/x-date-pickers | 8.25.0 | Selectores de fecha |
| FontAwesome | 6.4.2 | Iconos |

---

## ⚙️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** versión 18.x o superior
  ```bash
  node --version
  ```

- **npm** versión 9.x o superior
  ```bash
  npm --version
  ```

- **Backend** del proyecto corriendo en `http://localhost:3000`

---

## 📥 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/kronos5693/finalP3Front.git
cd finalP3Front
```

### 2. Instalar dependencias
```bash
npm install
```

Este comando instalará todas las dependencias listadas en `package.json`.

---

## 🔧 Configuración

#### Dado que se trata de un proyecto académico y el objetivo es facilitar la instalación y configuración de la aplicación, se ha incluido directamente en el repositorio el archivo .env con las variables de entorno necesarias para que la aplicación funcione correctamente.

#### De esta forma, cualquier persona que clone el repositorio podrá ejecutar la aplicación de inmediato, sin tener que crear o configurar manualmente dicho archivo.

#### No obstante, con fines educativos y para reflejar las buenas prácticas en entornos reales, también se proporcionan las instrucciones necesarias para el caso hipotético de que el archivo .env no estuviera presente en el repositorio (por ejemplo, si se parte de una plantilla .env.example).

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto frontend:

```bash
touch .env
```

Agregar el siguiente contenido:

```env
# URL del backend API
VITE_API_URL=http://localhost:3000

# Nombre de la aplicación
VITE_APP_NAME=Oficina de Turismo

# Versión
VITE_APP_VERSION=1.0.0
```

### Configuración del API

El archivo `src/services/api.js` usa la variable de entorno para conectarse al backend:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

**⚠️ IMPORTANTE:**
- Asegúrate de que el backend esté corriendo antes de iniciar el frontend
- En producción, cambiar `VITE_API_URL` a la URL del servidor de producción
- Las variables de entorno en Vite deben empezar con `VITE_`

---

## 🚀 Ejecución

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

**Características del modo desarrollo:**
- Hot Module Replacement (HMR) - Actualizaciones en tiempo real
- Recarga automática al guardar cambios
- Source maps para debugging

### Modo Vista Previa (Build local)

```bash
npm run build
npm run preview
```

---

## 📁 Estructura del Proyecto

```
front/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── Barrabusqueda/
│   │   │   ├── BarraBusqueda.jsx
│   │   │   └── barrabusqueda.css
│   │   ├── Card/
│   │   │   ├── card.jsx
│   │   │   ├── CardSearch.jsx
│   │   │   ├── CardCompra.jsx
│   │   │   ├── cardPeople.jsx
│   │   │   └── card.css
│   │   ├── Carrito/
│   │   │   └── Carrito.jsx
│   │   ├── GestionSalidas/
│   │   │   └── GestionSalidas.jsx
│   │   ├── LoginForm/
│   │   │   └── LoginForm.jsx
│   │   ├── NavBar/
│   │   │   ├── navBar.jsx
│   │   │   └── navBar.css
│   │   ├── SingUp/
│   │   │   └── SingUp.jsx
│   │   ├── data/        # Datos estáticos
│   │   └── ProtectedRoute.jsx
│   ├── context/         # Context API
│   │   ├── AuthContext.jsx
│   │   └── CarritoContext.jsx
│   ├── pages/           # Páginas/Vistas
│   │   ├── Home.jsx
│   │   ├── Excursiones.jsx
│   │   ├── Excursionbusqueda.jsx
│   │   ├── Contacto.jsx
│   │   ├── Experiencias.jsx
│   │   ├── Login.jsx
│   │   ├── Registro.jsx
│   │   ├── PageReserva.jsx
│   │   ├── MisReservas.jsx
│   │   ├── Carrito.jsx
│   │   ├── Checkout.jsx
│   │   ├── Perfil.jsx
│   │   ├── PanelAdmin.jsx
│   │   ├── AdminPanel.jsx
│   │   ├── LayOut.jsx
│   │   └── Default.jsx
│   ├── services/        # Servicios de API
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   ├── Carrito.service.js
│   │   ├── Reserva.service.js
│   │   └── Salida.service.js
│   ├── App.jsx          # Componente raíz
│   ├── App.css
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── .env                 # Variables de entorno (NO subir a git)
├── .eslintrc.cjs        # Configuración ESLint
├── .gitignore
├── index.html           # HTML principal
├── package.json
├── vite.config.js       # Configuración de Vite
└── README.md
```

---

## ✨ Funcionalidades

### Usuarios No Autenticados

- ✅ Ver lista de excursiones
- ✅ Buscar excursiones por provincia
- ✅ Ver detalles de excursiones
- ✅ Ver testimonios/experiencias
- ✅ Contacto
- ✅ Registrarse
- ✅ Iniciar sesión

### Usuarios Autenticados (Rol: usuario)

- ✅ Todo lo anterior, más:
- ✅ Crear reservas
- ✅ Agregar excursiones al carrito
- ✅ Gestionar carrito de compras
- ✅ Realizar checkout
- ✅ Ver mis reservas
- ✅ Cancelar reservas (con restricciones de tiempo)
- ✅ Actualizar perfil

### Administradores (Rol: admin)

- ✅ Todo lo anterior, más:
- ✅ Panel administrativo
- ✅ Gestionar excursiones (crear, editar, eliminar)
- ✅ Gestionar salidas
- ✅ Ver todas las reservas
- ✅ Completar reservas

---

## 🗺️ Rutas de la Aplicación

### Rutas Públicas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | Home | Página principal |
| `/excursiones` | Excursiones | Lista de excursiones |
| `/excursionbusqueda/:provincia` | Excursionbusqueda | Búsqueda por provincia |
| `/contacto` | Contacto | Formulario de contacto |
| `/experiencias` | Experiencias | Testimonios de clientes |
| `/login` | Login | Inicio de sesión |
| `/registro` | Registro | Registro de usuarios |

### Rutas Protegidas (Requieren Autenticación)

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/reserva/:nombreExcursion` | PageReserva | Crear reserva |
| `/mis-reservas` | MisReservas | Ver mis reservas |
| `/carrito` | Carrito | Ver carrito de compras |
| `/checkout` | Checkout | Finalizar compra |
| `/perfil` | Perfil | Perfil de usuario |

### Rutas Protegidas (Solo Administradores)

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/admin` | PanelAdmin | Panel administrativo |

---

## 🧩 Componentes Principales

### NavBar
**Ubicación:** `src/components/NavBar/navBar.jsx`

Barra de navegación principal con:
- Logo y nombre de la aplicación
- Links a páginas principales
- Menú de usuario (login/perfil/logout)
- Indicador de carrito de compras
- Responsive (menú hamburguesa en móvil)

### ProtectedRoute
**Ubicación:** `src/components/ProtectedRoute.jsx`

Componente de orden superior (HOC) que protege rutas:
```jsx
<ProtectedRoute>
  <MisReservas />
</ProtectedRoute>

<ProtectedRoute requireAdmin={true}>
  <PanelAdmin />
</ProtectedRoute>
```

### Cards
**Ubicación:** `src/components/Card/`

Componentes de tarjetas para:
- `card.jsx` - Tarjeta de excursión estándar
- `CardSearch.jsx` - Tarjeta de búsqueda
- `CardCompra.jsx` - Tarjeta de compra
- `cardPeople.jsx` - Tarjeta de testimonios

### Carrito
**Ubicación:** `src/components/Carrito/Carrito.jsx`

Drawer lateral que muestra:
- Items en el carrito
- Cantidad y precios
- Total a pagar
- Botones para checkout o vaciar carrito

### GestionSalidas
**Ubicación:** `src/components/GestionSalidas/GestionSalidas.jsx`

Panel administrativo para gestionar salidas de excursiones.

---

## 🔄 Contextos

### AuthContext
**Ubicación:** `src/context/AuthContext.jsx`

Maneja el estado de autenticación global:

```jsx
const { 
  user,              // Usuario actual
  isAuthenticated,   // Boolean de autenticación
  login,            // Función de login
  logout,           // Función de logout
  isAdmin,          // Verificar si es admin
  loading           // Estado de carga
} = useAuth();
```

**Uso:**
```jsx
import { useAuth } from './context/AuthContext';

function MiComponente() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <div>Hola {user.nombre}</div>;
}
```

### CarritoContext
**Ubicación:** `src/context/CarritoContext.jsx`

Maneja el estado del carrito de compras:

```jsx
const {
  carrito,              // Items del carrito
  agregarAlCarrito,     // Agregar item
  eliminarDelCarrito,   // Eliminar item
  actualizarCantidad,   // Actualizar cantidad
  vaciarCarrito,        // Vaciar carrito
  total,                // Total a pagar
  cantidadItems,        // Cantidad de items
  loading               // Estado de carga
} = useCarrito();
```

---

## 🔌 Servicios

### api.js
**Ubicación:** `src/services/api.js`

Cliente Axios configurado con:
- Base URL del backend
- Interceptors para agregar JWT automáticamente
- Manejo de errores 401 (redirección a login)

```javascript
import api from './services/api';

// Automáticamente incluye el token JWT
const response = await api.get('/excursiones');
```

### auth.service.js
**Ubicación:** `src/services/auth.service.js`

Servicio de autenticación:
```javascript
import authService from './services/auth.service';

// Login
await authService.login(email, password);

// Logout
authService.logout();

// Obtener usuario actual
const user = authService.getCurrentUser();

// Verificar si está autenticado
const isAuth = authService.isAuthenticated();
```

### Carrito.service.js
**Ubicación:** `src/services/Carrito.service.js`

Operaciones del carrito:
```javascript
import carritoService from './services/Carrito.service';

// Obtener carrito
const carrito = await carritoService.obtenerCarrito();

// Agregar item
await carritoService.agregarItem(salidaId, cantidad);

// Eliminar item
await carritoService.eliminarItem(itemId);
```

### Reserva.service.js
**Ubicación:** `src/services/Reserva.service.js`

Operaciones de reservas:
```javascript
import reservaService from './services/Reserva.service';

// Crear reserva
await reservaService.crearReserva(datos);

// Obtener mis reservas
const reservas = await reservaService.obtenerMisReservas();

// Cancelar reserva
await reservaService.cancelarReserva(reservaId);
```

---

## 📦 Build para Producción

### Generar Build

```bash
npm run build
```

Esto genera una carpeta `dist/` con los archivos optimizados para producción:
- HTML, CSS y JS minificados
- Assets optimizados
- Source maps (opcional)

### Vista Previa del Build

```bash
npm run preview
```



---

## 🎨 Personalización

### Tema de Material UI

El tema se puede personalizar editando la configuración de Material UI:

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

### Estilos Globales

Editar `src/index.css` para estilos globales de la aplicación.

---

## 🐛 Solución de Problemas

### Problema: Error al conectar con el backend
```bash
# Verificar que el backend esté corriendo
curl http://localhost:3000

# Verificar VITE_API_URL en .env
cat .env
```

### Problema: CORS Error
```bash
# Verificar configuración de CORS en el backend
# El backend debe permitir el origen del frontend
```

### Problema: Token expirado
```bash
# Limpiar localStorage
localStorage.clear()

# O desde el navegador: DevTools > Application > Local Storage > Clear
```

### Problema: Cambios no se reflejan
```bash
# Limpiar caché de Vite
rm -rf node_modules/.vite
npm run dev
```

### Problema: Error de compilación
```bash
# Limpiar y reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

---

## 🧪 Linting

Ejecutar ESLint:
```bash
npm run lint
```

---

## 📱 Responsive Design

La aplicación está diseñada para funcionar en:
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px - 1919px)
- ✅ Tablet (768px - 1365px)
- ✅ Mobile (320px - 767px)

Material UI proporciona breakpoints automáticos:
```jsx
import { useMediaQuery } from '@mui/material';

const isMobile = useMediaQuery('(max-width:600px)');
```

---

## 🔐 Seguridad

### Almacenamiento de Tokens

Los tokens JWT se almacenan en `localStorage`:
- ✅ Fácil de implementar
- ⚠️ Vulnerable a XSS (Cross-Site Scripting)

**Buenas prácticas:**
- No almacenar información sensible en localStorage
- El token expira en 24 horas
- Validar token en cada request (backend)
- Usar HTTPS en producción

### Variables de Entorno

- ✅ Usar `.env` para configuración
- ✅ Nunca commitear `.env` a Git
- ✅ Usar `.env.example` como template
- ✅ Variables de Vite deben empezar con `VITE_`

---

## 📚 Recursos Adicionales

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Material UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)

---

## 🎓 Scripts Disponibles

```json
{
  "dev": "vite",              // Modo desarrollo
  "build": "vite build",      // Build para producción
  "lint": "eslint .",         // Linting
  "preview": "vite preview"   // Vista previa del build
}
```

---

## 👥 Contacto

- Email: werner.krull@alu.inspt.utn.edu.ar


---

## 📄 Licencia

Este proyecto es parte de un trabajo académico para Programación III.

---



---

**Última actualización:** Febrero 2026
