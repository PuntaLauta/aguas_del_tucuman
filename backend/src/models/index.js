/**
 * Archivo índice de modelos
 * Define las relaciones entre los modelos y exporta todos los modelos
 */

import Neighborhood from './Neighborhood.js';
import Household from './Household.js';
import Reading from './Reading.js';

// Definir relaciones entre modelos

// Un barrio tiene muchas casas (1:N)
Neighborhood.hasMany(Household, {
  foreignKey: 'neighborhoodId',
  as: 'households'
});

// Una casa pertenece a un barrio (N:1)
Household.belongsTo(Neighborhood, {
  foreignKey: 'neighborhoodId',
  as: 'neighborhood'
});

// Una casa tiene muchas lecturas (1:N)
Household.hasMany(Reading, {
  foreignKey: 'householdId',
  as: 'readings'
});

// Una lectura pertenece a una casa (N:1)
Reading.belongsTo(Household, {
  foreignKey: 'householdId',
  as: 'household'
});

// Las relaciones indirectas se manejan a través de las relaciones directas
// Neighborhood -> Household -> Reading

// Exportar todos los modelos
export {
  Neighborhood,
  Household,
  Reading
};

export default {
  Neighborhood,
  Household,
  Reading
};
