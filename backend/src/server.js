/**
 * Servidor principal de Aguas del Tucumán
 * Configura Express, middleware, rutas y conexión a la base de datos
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection, syncDatabase, clearDatabase } from './db.js';
import './models/index.js'; // Importar modelos para establecer relaciones

// Importar rutas
import uploadRoutes from './routes/upload.js';
import householdRoutes from './routes/households.js';
import neighborhoodRoutes from './routes/neighborhoods.js';
import statsRoutes from './routes/stats.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware global
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    message: 'Servidor de Aguas del Tucumán funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Rutas de la API
app.use('/api/upload', uploadRoutes);
app.use('/api/households', householdRoutes);
app.use('/api/neighborhoods', neighborhoodRoutes);
app.use('/api/stats', statsRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API de Aguas del Tucumán',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      upload: '/api/upload',
      households: '/api/households',
      neighborhoods: '/api/neighborhoods',
      stats: '/api/stats'
    },
    documentation: {
      upload: 'POST /api/upload - Subir archivo CSV',
      households: 'GET /api/households - Listar casas con filtros',
      neighborhoods: 'GET /api/neighborhoods - Listar barrios',
      stats: 'GET /api/stats/overview - Estadísticas generales'
    }
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error no manejado:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Función para inicializar el servidor
async function startServer() {
  try {
    console.log('🚀 Iniciando servidor de Aguas del Tucumán...');
    
    // Probar conexión a la base de datos
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      process.exit(1);
    }

    // Limpiar base de datos al iniciar
    const dbCleared = await clearDatabase();
    if (!dbCleared) {
      console.error('❌ No se pudo limpiar la base de datos');
      process.exit(1);
    }

    // Sincronizar modelos con la base de datos
    const dbSynced = await syncDatabase();
    if (!dbSynced) {
      console.error('❌ No se pudo sincronizar la base de datos');
      process.exit(1);
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('✅ Servidor iniciado correctamente');
      console.log(`🌐 Servidor corriendo en: http://localhost:${PORT}`);
      console.log(`📊 API disponible en: http://localhost:${PORT}/api`);
      console.log(`❤️ Salud del servidor: http://localhost:${PORT}/api/health`);
      console.log('📁 Estructura del proyecto:');
      console.log('   ├── src/');
      console.log('   │   ├── server.js (servidor principal)');
      console.log('   │   ├── db.js (configuración de BD)');
      console.log('   │   ├── models/ (modelos Sequelize)');
      console.log('   │   ├── routes/ (rutas de API)');
      console.log('   │   └── jobs/ (procesadores)');
      console.log('   ├── package.json');
      console.log('   └── .env (variables de entorno)');
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de señales para cierre graceful
process.on('SIGTERM', () => {
  console.log('🛑 Señal SIGTERM recibida, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Señal SIGINT recibida, cerrando servidor...');
  process.exit(0);
});

// Iniciar servidor
startServer();
