/**
 * Modelo Household (Casa/Hogar)
 * Representa las casas/hogares que pertenecen a un barrio
 */

import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Household = sequelize.define('Household', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  neighborhoodId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'neighborhoods',
      key: 'id'
    },
    comment: 'ID del barrio al que pertenece la casa'
  },
  address: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Dirección de la casa'
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
    comment: 'Latitud de la casa'
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
    comment: 'Longitud de la casa'
  },
  isDebtor: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Indica si la casa tiene deuda pendiente'
  },
  totalDebt: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: 'Deuda total de la casa'
  },
  lastReadingDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha de la última lectura'
  }
}, {
  tableName: 'households',
  timestamps: true,
  indexes: [
    {
      fields: ['neighborhood_id']
    },
    {
      fields: ['is_debtor']
    }
  ]
});

export default Household;
