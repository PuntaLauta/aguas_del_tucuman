# Frontend - Aguas del Tucumán

Frontend desarrollado con React + Vite para la aplicación de gestión de agua potable.

## 🚀 Características

- **Dashboard completo** con visualización de datos
- **Subida de archivos CSV** para importar datos
- **Filtros avanzados** por barrio y estado de morosidad
- **Mapa interactivo** con marcadores de hogares
- **Estadísticas** de consumo por barrio
- **Tabla paginada** de hogares
- **Diseño responsive** y moderno

## 🛠️ Tecnologías

- **React 19** - Framework principal
- **Vite** - Build tool y dev server
- **React Router** - Navegación
- **React-Leaflet** - Mapas interactivos
- **Axios** - Cliente HTTP
- **CSS moderno** - Estilos personalizados

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env
# Editar .env con la URL del backend
```

## ⚙️ Configuración

### Variables de entorno

Crear archivo `.env` con:

```env
VITE_API_URL=http://localhost:4001/api
```

### Dependencias principales

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router-dom": "^7.9.4",
  "react-leaflet": "^5.0.0",
  "leaflet": "^1.9.4",
  "axios": "^1.12.2"
}
```

## 🚀 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## 📁 Estructura del proyecto

```
src/
├── api/                 # Cliente API y servicios
│   ├── client.js       # Configuración de Axios
│   └── households.js   # Endpoints de hogares
├── components/         # Componentes reutilizables
│   ├── Filters.jsx    # Filtros de búsqueda
│   ├── HouseholdsTable.jsx # Tabla de hogares
│   ├── Layout.jsx     # Layout principal
│   ├── MapView.jsx    # Mapa con marcadores
│   ├── Navbar.jsx     # Navegación
│   ├── StatsCards.jsx # Tarjetas de estadísticas
│   └── UploadCsv.jsx  # Subida de archivos
├── pages/              # Páginas principales
│   └── Dashboard.jsx  # Dashboard principal
├── App.jsx            # Componente raíz
├── main.jsx          # Punto de entrada
└── index.css         # Estilos globales
```

## 🎯 Funcionalidades

### 1. Subida de CSV
- Interfaz intuitiva para subir archivos
- Validación de formato
- Feedback visual del proceso
- Mensajes de éxito/error

### 2. Filtros
- Filtro por barrio (dropdown)
- Filtro por estado de morosidad
- Botón para limpiar filtros
- Actualización automática de datos

### 3. Mapa Interactivo
- Marcadores de colores según estado:
  - 🟢 Verde: Hogares al día
  - 🔴 Rojo: Hogares morosos
  - 🔵 Azul: Alto consumo
- Popups informativos
- Estadísticas en tiempo real

### 4. Estadísticas
- Top 5 barrios por consumo
- Tarjetas visuales con ranking
- Datos en tiempo real

### 5. Tabla de Hogares
- Paginación automática
- Información detallada
- Estados visuales (moroso/al día)
- Coordenadas geográficas

## 🎨 Diseño

- **Paleta de colores moderna** con azules y grises
- **Iconos emoji** para mejor UX
- **Responsive design** para móviles
- **Estados visuales** claros (loading, error, success)
- **Animaciones suaves** en hover y transiciones

## 🔧 API Endpoints

El frontend consume los siguientes endpoints:

- `GET /api/health` - Estado del servidor
- `POST /api/upload` - Subir archivo CSV
- `GET /api/households` - Listar hogares (con filtros)
- `GET /api/neighborhoods` - Listar barrios
- `GET /api/stats/top-consumption` - Estadísticas de consumo

## 📱 Responsive

- **Desktop**: Layout completo con sidebar
- **Tablet**: Grid adaptativo
- **Mobile**: Stack vertical optimizado

## 🚀 Deploy

```bash
# Build para producción
npm run build

# Los archivos se generan en dist/
# Subir a servidor web estático
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.