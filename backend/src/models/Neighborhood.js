/**
 * Modelo Neighborhood (Barrio)
 * Representa los barrios donde se encuentran las casas
 */

import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Neighborhood = sequelize.define('Neighborhood', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nombre del barrio'
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
    comment: 'Latitud del barrio'
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
    comment: 'Longitud del barrio'
  },
  totalConsumption: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: 'Consumo total del barrio en m³'
  },
  totalDebt: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: 'Deuda total del barrio'
  }
}, {
  tableName: 'neighborhoods',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['name']
    }
  ]
});

export default Neighborhood;
