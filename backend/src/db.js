/**
 * Configuración de la base de datos PostgreSQL con Sequelize
 * Este archivo establece la conexión a la base de datos y configura Sequelize
 */

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración de la base de datos
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
});

// Función para probar la conexión
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    return false;
  }
};

// Función para sincronizar modelos con la base de datos
export const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Base de datos sincronizada correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al sincronizar la base de datos:', error.message);
    return false;
  }
};

// Función para limpiar la base de datos
export const clearDatabase = async () => {
  try {
    console.log('🧹 Limpiando base de datos...');
    
    // Importar modelos para acceder a las tablas
    const { Household, Neighborhood, Reading } = await import('./models/index.js');
    
    // Limpiar en orden correcto (respetando foreign keys)
    await Reading.destroy({ where: {}, force: true });
    console.log('   ✅ Tabla readings limpiada');
    
    await Household.destroy({ where: {}, force: true });
    console.log('   ✅ Tabla households limpiada');
    
    await Neighborhood.destroy({ where: {}, force: true });
    console.log('   ✅ Tabla neighborhoods limpiada');
    
    console.log('✅ Base de datos limpiada correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al limpiar la base de datos:', error.message);
    return false;
  }
};

export default sequelize;
