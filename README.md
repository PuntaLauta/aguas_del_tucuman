# 💧 Aguas del Tucumán - Sistema de Gestión de Agua Potable

Sistema completo de gestión de agua potable desarrollado para la provincia de Tucumán, Argentina. Permite la administración de hogares, barrios, lecturas de medidores y análisis de consumo de agua.

## 🎯 Objetivo del Proyecto

Este proyecto fue desarrollado con el objetivo de aprender e implementar:

- **Arquitectura Full-Stack**: Separación clara entre frontend y backend
- **APIs REST**: Diseño e implementación de endpoints bien estructurados
- **Bases de Datos Relacionales**: Modelado de datos con PostgreSQL y Sequelize ORM
- **Visualización de Datos**: Mapas interactivos y dashboards con React
- **Procesamiento de Archivos**: Importación y procesamiento de datos CSV
- **Deployment en la Nube**: Configuración para Vercel y servicios cloud
- **Geolocalización**: Integración de mapas con Leaflet para visualización geográfica
- **Gestión de Estado**: Manejo de estado en aplicaciones React modernas

## 🏗️ Arquitectura del Proyecto

```mermaid
graph TB
    subgraph "Frontend (React + Vite)"
        A[App.jsx] --> B[Layout.jsx]
        B --> C[Dashboard.jsx]
        C --> D[MapView.jsx]
        C --> E[HouseholdsTable.jsx]
        C --> F[StatsCards.jsx]
        C --> G[UploadCsv.jsx]
        C --> H[Filters.jsx]
    end
    
    subgraph "Backend (Node.js + Express)"
        I[server.js] --> J[Routes]
        J --> K[upload.js]
        J --> L[households.js]
        J --> M[neighborhoods.js]
        J --> N[stats.js]
        K --> O[importCsv.js]
    end
    
    subgraph "Base de Datos (PostgreSQL)"
        P[Neighborhoods] --> Q[Households]
        Q --> R[Readings]
    end
    
    subgraph "Servicios Externos"
        S[Vercel Deployment]
        T[Leaflet Maps]
    end
    
    A -->|HTTP/API| I
    I -->|Sequelize ORM| P
    D -->|React-Leaflet| T
    I -->|Deploy| S
    
    style A fill:#61dafb
    style I fill:#68d391
    style P fill:#f6ad55
    style S fill:#9f7aea
```

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** (v18+) - Runtime de JavaScript
- **Express.js** - Framework web minimalista
- **PostgreSQL** - Base de datos relacional
- **Sequelize** - ORM para Node.js
- **Multer** - Middleware para subida de archivos
- **CSV-Parse** - Procesamiento de archivos CSV
- **CORS** - Configuración de políticas de origen cruzado

### Frontend
- **React 19** - Biblioteca de interfaz de usuario
- **Vite** - Build tool y dev server moderno
- **React Router DOM** - Enrutamiento del lado del cliente
- **React-Leaflet** - Integración de mapas interactivos
- **Axios** - Cliente HTTP para APIs
- **Bootstrap 5** - Framework CSS para diseño responsive

### Herramientas de Desarrollo
- **ESLint** - Linter para JavaScript/React
- **Nodemon** - Auto-reload para desarrollo
- **Vercel** - Plataforma de deployment

## 📁 Estructura del Proyecto

```
aguas_del_tucuman/
├── 📁 backend/                    # API REST con Node.js
│   ├── 📁 src/
│   │   ├── 📄 server.js          # Servidor principal Express
│   │   ├── 📄 db.js              # Configuración de base de datos
│   │   ├── 📁 models/            # Modelos Sequelize
│   │   │   ├── 📄 Neighborhood.js # Modelo de barrios
│   │   │   ├── 📄 Household.js   # Modelo de hogares
│   │   │   ├── 📄 Reading.js     # Modelo de lecturas
│   │   │   └── 📄 index.js       # Relaciones entre modelos
│   │   ├── 📁 routes/            # Rutas de la API
│   │   │   ├── 📄 upload.js      # Subida de archivos CSV
│   │   │   ├── 📄 households.js  # Gestión de hogares
│   │   │   ├── 📄 neighborhoods.js # Gestión de barrios
│   │   │   └── 📄 stats.js       # Estadísticas y reportes
│   │   └── 📁 jobs/              # Procesadores de datos
│   │       └── 📄 importCsv.js   # Importador de CSV
│   ├── 📄 package.json           # Dependencias del backend
│   ├── 📄 vercel.json           # Configuración de Vercel
│   └── 📄 README.md             # Documentación del backend
│
├── 📁 frontend/                   # Aplicación React
│   ├── 📁 src/
│   │   ├── 📁 api/               # Cliente API
│   │   │   ├── 📄 client.js      # Configuración de Axios
│   │   │   └── 📄 households.js  # Endpoints de hogares
│   │   ├── 📁 components/        # Componentes React
│   │   │   ├── 📄 Layout.jsx     # Layout principal
│   │   │   ├── 📄 Dashboard.jsx  # Dashboard principal
│   │   │   ├── 📄 MapView.jsx    # Mapa interactivo
│   │   │   ├── 📄 HouseholdsTable.jsx # Tabla de hogares
│   │   │   ├── 📄 StatsCards.jsx # Tarjetas de estadísticas
│   │   │   ├── 📄 UploadCsv.jsx  # Subida de archivos
│   │   │   ├── 📄 Filters.jsx    # Filtros de búsqueda
│   │   │   ├── 📄 Navbar.jsx     # Navegación
│   │   │   ├── 📄 Loading.jsx    # Componente de carga
│   │   │   └── 📄 ErrorBoundary.jsx # Manejo de errores
│   │   ├── 📁 pages/             # Páginas principales
│   │   │   └── 📄 Dashboard.jsx  # Página principal
│   │   ├── 📄 App.jsx            # Componente raíz
│   │   ├── 📄 main.jsx           # Punto de entrada
│   │   └── 📄 index.css          # Estilos globales
│   ├── 📄 package.json           # Dependencias del frontend
│   ├── 📄 vite.config.js         # Configuración de Vite
│   └── 📄 README.md              # Documentación del frontend
│
└── 📄 README.md                   # Este archivo
```

## 🚀 Funcionalidades Principales

### 📊 Dashboard Interactivo
- **Visualización en tiempo real** de estadísticas de consumo
- **Mapa geográfico** con marcadores de hogares por barrio
- **Filtros avanzados** por barrio y estado de morosidad
- **Tabla paginada** con información detallada de hogares

### 📁 Gestión de Datos
- **Importación CSV** para cargar datos masivos
- **Procesamiento automático** de archivos con validación
- **Sincronización** entre barrios, hogares y lecturas
- **Limpieza automática** de datos al reiniciar

### 🗺️ Visualización Geográfica
- **Mapas interactivos** con Leaflet
- **Marcadores de colores** según estado:
  - 🟢 Verde: Hogares al día
  - 🔴 Rojo: Hogares morosos
  - 🔵 Azul: Alto consumo
- **Popups informativos** con datos de cada hogar

### 📈 Análisis y Reportes
- **Top 5 barrios** por consumo
- **Estadísticas de morosidad** por zona
- **Tendencias de consumo** por período
- **Resúmenes ejecutivos** de gestión

## 🗄️ Modelo de Datos

### Neighborhoods (Barrios)
- Información geográfica (latitud, longitud)
- Estadísticas agregadas (consumo total, deuda total)
- Relación 1:N con hogares

### Households (Hogares)
- Dirección y coordenadas geográficas
- Estado de morosidad y deuda acumulada
- Fecha de última lectura
- Relación N:1 con barrios, 1:N con lecturas

### Readings (Lecturas)
- Período de lectura (YYYY-MM)
- Consumo en metros cúbicos
- Monto adeudado y estado de pago
- Fecha de lectura
- Relación N:1 con hogares

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js v18 o superior
- PostgreSQL v12 o superior
- npm o yarn

### Backend
```bash
cd backend
npm install
cp env.example .env
# Configurar variables de entorno en .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp env.example .env
# Configurar VITE_API_URL en .env
npm run dev
```

### Variables de Entorno

**Backend (.env)**
```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/aguas_del_tucuman
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3000/api
```

## 📊 API Endpoints

### Salud del Sistema
- `GET /api/health` - Estado del servidor

### Gestión de Datos
- `POST /api/upload` - Subir archivo CSV
- `GET /api/households` - Listar hogares (con filtros)
- `GET /api/households/debtors` - Listar hogares morosos
- `GET /api/neighborhoods` - Listar barrios

### Estadísticas
- `GET /api/stats/overview` - Resumen general
- `GET /api/stats/top-consumption` - Top barrios por consumo
- `GET /api/stats/debt-summary` - Resumen de deudas
- `GET /api/stats/consumption-trends` - Tendencias de consumo

## 📁 Formato de Archivo CSV

El sistema acepta archivos CSV con las siguientes columnas:

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| `id` | ID único del hogar | `12345` |
| `barrio` | Nombre del barrio | `Centro` |
| `lat` | Latitud | `-26.8083` |
| `lng` | Longitud | `-65.2176` |
| `period` | Período de lectura | `2024-01` |
| `consumo_m3` | Consumo en m³ | `25.5` |
| `moroso` | Es moroso (true/false) | `true` |
| `amount_due` | Monto adeudado | `150.00` |

## 🌐 Deployment

El proyecto utiliza **Vercel** para el deployment automático. Al conectar el repositorio a Vercel, se realiza el deploy automático en cada push a la rama principal.

