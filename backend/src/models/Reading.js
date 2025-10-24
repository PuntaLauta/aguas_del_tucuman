/**
 * Modelo Reading (Lectura/Consumo)
 * Representa las lecturas de consumo de agua de cada casa
 */

import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Reading = sequelize.define('Reading', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  householdId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'households',
      key: 'id'
    },
    comment: 'ID de la casa a la que pertenece la lectura'
  },
  period: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'Período de la lectura (ej: 2024-01)'
  },
  consumptionM3: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Consumo en metros cúbicos'
  },
  amountDue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Monto adeudado por este período'
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Indica si el período está pagado'
  },
  readingDate: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Fecha de la lectura'
  }
}, {
  tableName: 'readings',
  timestamps: true,
  indexes: [
    {
      fields: ['household_id']
    },
    {
      fields: ['period']
    },
    {
      fields: ['reading_date']
    },
    {
      fields: ['is_paid']
    }
  ]
});

export default Reading;
