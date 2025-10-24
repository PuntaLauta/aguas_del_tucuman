/**
 * Importador de datos CSV
 * Procesa archivos CSV y los importa a la base de datos
 * Columnas esperadas: id, barrio, lat, lng, period, consumo_m3, moroso, amount_due
 */

import { parse } from 'csv-parse';
import { Neighborhood, Household, Reading } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Procesa un archivo CSV y importa los datos a la base de datos
 * @param {Buffer} csvBuffer - Buffer del archivo CSV
 * @returns {Object} Resultado del procesamiento
 */
export async function importCsvData(csvBuffer) {
  const results = {
    recordsProcessed: 0,
    neighborhoodsCreated: 0,
    householdsCreated: 0,
    readingsCreated: 0,
    errors: []
  };

  try {
    console.log('🔄 Iniciando procesamiento de CSV...');

    // Parsear el CSV
    const records = await parseCsvBuffer(csvBuffer);
    console.log(`📊 Registros encontrados: ${records.length}`);

    // Procesar cada registro
    for (let i = 0; i < records.length; i++) {
      try {
        const record = records[i];
        await processRecord(record, results);
        results.recordsProcessed++;
      } catch (error) {
        console.error(`❌ Error en registro ${i + 1}:`, error.message);
        results.errors.push({
          row: i + 1,
          error: error.message,
          data: records[i]
        });
      }
    }

    console.log('✅ Procesamiento completado');
    console.log(`📈 Resumen: ${results.recordsProcessed} registros procesados`);
    console.log(`🏘️ Barrios creados: ${results.neighborhoodsCreated}`);
    console.log(`🏠 Casas creadas: ${results.householdsCreated}`);
    console.log(`📊 Lecturas creadas: ${results.readingsCreated}`);
    console.log(`❌ Errores: ${results.errors.length}`);

    return results;

  } catch (error) {
    console.error('❌ Error general en importación:', error);
    results.errors.push({
      row: 'general',
      error: error.message,
      data: null
    });
    throw error;
  }
}

/**
 * Parsea un buffer CSV y retorna los registros
 * @param {Buffer} csvBuffer - Buffer del archivo CSV
 * @returns {Array} Array de registros
 */
async function parseCsvBuffer(csvBuffer) {
  return new Promise((resolve, reject) => {
    const records = [];
    
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: ','
    });

    parser.on('readable', function() {
      let record;
      while (record = parser.read()) {
        records.push(record);
      }
    });

    parser.on('error', function(err) {
      reject(err);
    });

    parser.on('end', function() {
      resolve(records);
    });

    parser.write(csvBuffer);
    parser.end();
  });
}

/**
 * Procesa un registro individual del CSV
 * @param {Object} record - Registro del CSV
 * @param {Object} results - Objeto de resultados
 */
async function processRecord(record, results) {
  // Validar campos requeridos
  if (!record.barrio || !record.period || !record.consumo_m3) {
    throw new Error('Faltan campos requeridos: barrio, period, consumo_m3');
  }

  // Buscar o crear barrio
  const neighborhood = await findOrCreateNeighborhood(record);
  if (neighborhood.wasCreated) {
    results.neighborhoodsCreated++;
  }

  // Buscar o crear casa
  const household = await findOrCreateHousehold(record, neighborhood.neighborhood);
  if (household.wasCreated) {
    results.householdsCreated++;
  }

  // Crear o actualizar lectura
  await createOrUpdateReading(record, household.household);
  results.readingsCreated++;
}

/**
 * Busca o crea un barrio
 * @param {Object} record - Registro del CSV
 * @returns {Object} Barrio y flag de creación
 */
async function findOrCreateNeighborhood(record) {
  const [neighborhood, wasCreated] = await Neighborhood.findOrCreate({
    where: { name: record.barrio },
    defaults: {
      name: record.barrio,
      latitude: record.lat ? parseFloat(record.lat) : null,
      longitude: record.lng ? parseFloat(record.lng) : null,
      totalConsumption: 0,
      totalDebt: 0
    }
  });

  return { neighborhood, wasCreated };
}

/**
 * Busca o crea una casa
 * @param {Object} record - Registro del CSV
 * @param {Object} neighborhood - Barrio
 * @returns {Object} Casa y flag de creación
 */
async function findOrCreateHousehold(record, neighborhood) {
  // Generar ID único para la casa basado en el barrio y coordenadas
  const householdId = record.id || `${neighborhood.id}_${record.lat}_${record.lng}`;
  
  const [household, wasCreated] = await Household.findOrCreate({
    where: { 
      id: householdId,
      neighborhoodId: neighborhood.id 
    },
    defaults: {
      id: householdId,
      neighborhoodId: neighborhood.id,
      address: `${neighborhood.name} - Lat: ${record.lat}, Lng: ${record.lng}`,
      latitude: record.lat ? parseFloat(record.lat) : null,
      longitude: record.lng ? parseFloat(record.lng) : null,
      isDebtor: record.moroso === 'true' || record.moroso === '1' || record.moroso === true,
      totalDebt: record.amount_due ? parseFloat(record.amount_due) : 0,
      lastReadingDate: new Date()
    }
  });

  // Si el hogar ya existía, actualizar los campos importantes
  if (!wasCreated) {
    const isDebtor = record.moroso === 'true' || record.moroso === '1' || record.moroso === true;
    const totalDebt = record.amount_due ? parseFloat(record.amount_due) : 0;
    
    await household.update({
      isDebtor: isDebtor,
      totalDebt: totalDebt,
      lastReadingDate: new Date()
    });
  }

  return { household, wasCreated };
}

/**
 * Crea o actualiza una lectura
 * @param {Object} record - Registro del CSV
 * @param {Object} household - Casa
 */
async function createOrUpdateReading(record, household) {
  const consumptionM3 = parseFloat(record.consumo_m3) || 0;
  const amountDue = parseFloat(record.amount_due) || 0;
  const isDebtor = record.moroso === 'true' || record.moroso === '1' || record.moroso === true;

  // Buscar lectura existente para el período
  const existingReading = await Reading.findOne({
    where: {
      householdId: household.id,
      period: record.period
    }
  });

  if (existingReading) {
    // Actualizar lectura existente
    await existingReading.update({
      consumptionM3,
      amountDue,
      isPaid: !isDebtor,
      readingDate: new Date()
    });
  } else {
    // Crear nueva lectura
    await Reading.create({
      householdId: household.id,
      period: record.period,
      consumptionM3,
      amountDue,
      isPaid: !isDebtor,
      readingDate: new Date()
    });
  }

  // Actualizar estadísticas del barrio
  await updateNeighborhoodStats(household.neighborhoodId);
}

/**
 * Actualiza las estadísticas del barrio
 * @param {number} neighborhoodId - ID del barrio
 */
async function updateNeighborhoodStats(neighborhoodId) {
  const neighborhood = await Neighborhood.findByPk(neighborhoodId, {
    include: [
      {
        model: Household,
        as: 'households',
        include: [
          {
            model: Reading,
            as: 'readings'
          }
        ]
      }
    ]
  });

  if (neighborhood) {
    // Calcular totales
    const totalConsumption = neighborhood.households.reduce((sum, household) => {
      return sum + household.readings.reduce((householdSum, reading) => {
        return householdSum + parseFloat(reading.consumptionM3 || 0);
      }, 0);
    }, 0);

    const totalDebt = neighborhood.households.reduce((sum, household) => {
      return sum + parseFloat(household.totalDebt || 0);
    }, 0);

    // Actualizar barrio
    await neighborhood.update({
      totalConsumption,
      totalDebt
    });
  }
}
