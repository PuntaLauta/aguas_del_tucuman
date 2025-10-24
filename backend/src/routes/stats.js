/**
 * Rutas para estadísticas y reportes
 * Endpoints: GET /api/stats/*
 */

import express from 'express';
import { Neighborhood, Household, Reading } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';

const router = express.Router();

/**
 * GET /api/stats/top-consumption
 * Muestra los top 5 barrios por consumo total
 * Query params:
 * - limit: número de barrios a mostrar (default: 5)
 */
router.get('/top-consumption', async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    // Consulta simplificada sin JOIN problemático
    const topNeighborhoods = await Neighborhood.findAll({
      attributes: [
        'id',
        'name',
        'totalConsumption',
        'totalDebt'
      ],
      order: [['totalConsumption', 'DESC']],
      limit: parseInt(limit)
    });

    // Formatear datos para el frontend
    const formattedData = topNeighborhoods.map(neighborhood => ({
      id: neighborhood.id,
      name: neighborhood.name,
      barrio: neighborhood.name, // Para compatibilidad con frontend
      total_m3: neighborhood.totalConsumption,
      total: neighborhood.totalConsumption, // Para compatibilidad con frontend
      totalDebt: neighborhood.totalDebt
    }));

    res.json(formattedData);

  } catch (error) {
    console.error('❌ Error al obtener top barrios por consumo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de consumo',
      error: error.message
    });
  }
});

/**
 * GET /api/stats/debt-summary
 * Resumen de deudas por barrio
 */
router.get('/debt-summary', async (req, res) => {
  try {
    const debtSummary = await Neighborhood.findAll({
      attributes: [
        'id',
        'name',
        'totalDebt',
        [fn('COUNT', col('households.id')), 'householdCount'],
        [fn('COUNT', literal('CASE WHEN households.is_debtor = true THEN 1 END')), 'debtorCount']
      ],
      include: [
        {
          model: Household,
          as: 'households',
          attributes: [],
          required: false
        }
      ],
      group: ['Neighborhood.id', 'Neighborhood.name', 'Neighborhood.totalDebt'],
      order: [['totalDebt', 'DESC']]
    });

    const totalDebt = debtSummary.reduce((sum, neighborhood) => 
      sum + parseFloat(neighborhood.totalDebt || 0), 0
    );

    res.json({
      success: true,
      data: {
        debtSummary,
        totalDebt,
        neighborhoodCount: debtSummary.length
      }
    });

  } catch (error) {
    console.error('❌ Error al obtener resumen de deudas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener resumen de deudas',
      error: error.message
    });
  }
});

/**
 * GET /api/stats/consumption-trends
 * Tendencias de consumo por período
 * Query params:
 * - months: número de meses a analizar (default: 12)
 */
router.get('/consumption-trends', async (req, res) => {
  try {
    const { months = 12 } = req.query;
    
    // Calcular fecha de inicio
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));

    const trends = await Reading.findAll({
      attributes: [
        'period',
        [fn('SUM', col('consumptionM3')), 'totalConsumption'],
        [fn('COUNT', col('id')), 'readingCount'],
        [fn('AVG', col('consumptionM3')), 'averageConsumption']
      ],
      where: {
        readingDate: {
          [Op.gte]: startDate
        }
      },
      group: ['period'],
      order: [['period', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        trends,
        months: parseInt(months),
        period: `${startDate.toISOString().split('T')[0]} - ${new Date().toISOString().split('T')[0]}`
      }
    });

  } catch (error) {
    console.error('❌ Error al obtener tendencias de consumo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tendencias de consumo',
      error: error.message
    });
  }
});

/**
 * GET /api/stats/overview
 * Resumen general del sistema
 */
router.get('/overview', async (req, res) => {
  try {
    // Estadísticas generales
    const totalNeighborhoods = await Neighborhood.count();
    const totalHouseholds = await Household.count();
    const totalReadings = await Reading.count();
    const debtorHouseholds = await Household.count({ where: { isDebtor: true } });

    // Totales
    const totalConsumption = await Reading.sum('consumptionM3');
    const totalDebt = await Household.sum('totalDebt');

    // Promedios
    const averageConsumptionPerHousehold = totalHouseholds > 0 ? 
      (totalConsumption / totalHouseholds).toFixed(2) : 0;
    const averageDebtPerHousehold = totalHouseholds > 0 ? 
      (totalDebt / totalHouseholds).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalNeighborhoods,
          totalHouseholds,
          totalReadings,
          debtorHouseholds,
          totalConsumption: parseFloat(totalConsumption || 0).toFixed(2),
          totalDebt: parseFloat(totalDebt || 0).toFixed(2),
          averageConsumptionPerHousehold,
          averageDebtPerHousehold,
          debtorPercentage: totalHouseholds > 0 ? 
            ((debtorHouseholds / totalHouseholds) * 100).toFixed(2) : 0
        }
      }
    });

  } catch (error) {
    console.error('❌ Error al obtener resumen general:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener resumen general',
      error: error.message
    });
  }
});

export default router;
