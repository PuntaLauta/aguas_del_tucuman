# Aguas del Tucumán - Backend

Backend para el sistema de gestión de aguas del Tucumán desarrollado con Node.js, Express y Sequelize.

## 🚀 Características

- **Base de datos**: PostgreSQL con Sequelize ORM
- **API REST**: Endpoints para gestión de barrios, casas y lecturas
- **Importación CSV**: Procesamiento automático de archivos CSV
- **Estadísticas**: Reportes y análisis de consumo
- **Deployment**: Configurado para Vercel

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── server.js              # Servidor principal
│   ├── db.js                  # Configuración de base de datos
│   ├── models/                # Modelos Sequelize
│   │   ├── Neighborhood.js    # Modelo de barrios
│   │   ├── Household.js       # Modelo de casas
│   │   ├── Reading.js          # Modelo de lecturas
│   │   └── index.js           # Relaciones entre modelos
│   ├── routes/                # Rutas de la API
│   │   ├── upload.js          # Subida de archivos CSV
│   │   ├── households.js      # Gestión de casas
│   │   ├── neighborhoods.js    # Gestión de barrios
│   │   └── stats.js           # Estadísticas y reportes
│   └── jobs/                  # Procesadores
│       └── importCsv.js       # Importador de CSV
├── package.json               # Dependencias y scripts
├── vercel.json               # Configuración de Vercel
└── README.md                 # Este archivo
```

## 🛠️ Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <repository-url>
   cd aguas_del_tucuman/backend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Crear archivo `.env` con:
   ```env
   DATABASE_URL=postgresql://usuario:password@localhost:5432/aguas_del_tucuman
   PORT=3000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Configurar base de datos PostgreSQL**

5. **Ejecutar el servidor**:
   ```bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm start
   ```

## 📊 API Endpoints

### Salud del Servidor
- `GET /api/health` - Estado del servidor

### Subida de Archivos
- `POST /api/upload` - Subir archivo CSV

### Casas/Hogares
- `GET /api/households` - Listar casas con filtros
- `GET /api/households/debtors` - Listar casas morosas

### Barrios
- `GET /api/neighborhoods` - Listar barrios
- `GET /api/neighborhoods/:id` - Obtener barrio específico

### Estadísticas
- `GET /api/stats/overview` - Resumen general
- `GET /api/stats/top-consumption` - Top barrios por consumo
- `GET /api/stats/debt-summary` - Resumen de deudas
- `GET /api/stats/consumption-trends` - Tendencias de consumo

## 📁 Formato del CSV

El archivo CSV debe contener las siguientes columnas:

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| `id` | ID único de la casa | `12345` |
| `barrio` | Nombre del barrio | `Centro` |
| `lat` | Latitud | `-26.8083` |
| `lng` | Longitud | `-65.2176` |
| `period` | Período de lectura | `2024-01` |
| `consumo_m3` | Consumo en m³ | `25.5` |
| `moroso` | Es moroso (true/false) | `true` |
| `amount_due` | Monto adeudado | `150.00` |

## 🗄️ Modelos de Base de Datos

### Neighborhood (Barrios)
- `id`: ID único
- `name`: Nombre del barrio
- `latitude`: Latitud
- `longitude`: Longitud
- `totalConsumption`: Consumo total
- `totalDebt`: Deuda total

### Household (Casas)
- `id`: ID único
- `neighborhoodId`: ID del barrio
- `address`: Dirección
- `latitude`: Latitud
- `longitude`: Longitud
- `isDebtor`: Es moroso
- `totalDebt`: Deuda total
- `lastReadingDate`: Fecha última lectura

### Reading (Lecturas)
- `id`: ID único
- `householdId`: ID de la casa
- `period`: Período de lectura
- `consumptionM3`: Consumo en m³
- `amountDue`: Monto adeudado
- `isPaid`: Está pagado
- `readingDate`: Fecha de lectura

## 🚀 Deployment en Vercel

1. **Conectar repositorio a Vercel**
2. **Configurar variables de entorno**:
   - `DATABASE_URL`: URL de conexión a PostgreSQL
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: Dominio del frontend

3. **Deploy automático**:
   Vercel detectará automáticamente la configuración del `vercel.json`

## 🔧 Scripts Disponibles

```bash
npm start          # Ejecutar en producción
npm run dev        # Ejecutar en desarrollo con nodemon
```

## 📝 Notas de Desarrollo

- El servidor usa ES6 modules (`import/export`)
- Sequelize sincroniza automáticamente las tablas
- CORS configurado para desarrollo y producción
- Manejo de errores centralizado
- Logging de requests automático

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
