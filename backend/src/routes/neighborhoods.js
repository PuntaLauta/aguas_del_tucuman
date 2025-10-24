/**
 * Rutas para gestión de barrios
 * Endpoints: GET /api/neighborhoods
 */

import express from 'express';
import { Neighborhood, Household } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

/**
 * GET /api/neighborhoods
 * Lista todos los barrios con estadísticas
 * Query params:
 * - search: buscar por nombre de barrio
 * - limit: límite de resultados (default: 50)
 * - offset: offset para paginación (default: 0)
 */
router.get('/', async (req, res) => {
  try {
    const {
      search,
      limit = 50,
      offset = 0
    } = req.query;

    // Construir filtros
    const whereClause = {};
    if (search) {
      whereClause.name = {
        [Op.iLike]: `%${search}%`
      };
    }

    // Consultar barrios con estadísticas
    const neighborhoods = await Neighborhood.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Household,
          as: 'households',
          attributes: ['id'],
          required: false
        }
      ],
      attributes: [
        'id',
        'name',
        'latitude',
        'longitude',
        'totalConsumption',
        'totalDebt',
        'createdAt',
        'updatedAt'
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    // Agregar estadísticas adicionales
    const neighborhoodsWithStats = neighborhoods.rows.map(neighborhood => {
      const householdCount = neighborhood.households ? neighborhood.households.length : 0;
      return {
        ...neighborhood.toJSON(),
        householdCount,
        averageConsumption: householdCount > 0 ? 
          (parseFloat(neighborhood.totalConsumption) / householdCount).toFixed(2) : 0
      };
    });

    res.json({
      success: true,
      data: {
        neighborhoods: neighborhoodsWithStats,
        total: neighborhoods.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < neighborhoods.count
      }
    });

  } catch (error) {
    console.error('❌ Error al obtener barrios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los barrios',
      error: error.message
    });
  }
});

/**
 * GET /api/neighborhoods/:id
 * Obtiene un barrio específico con sus casas
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const neighborhood = await Neighborhood.findByPk(id, {
      include: [
        {
          model: Household,
          as: 'households',
          attributes: [
            'id',
            'address',
            'latitude',
            'longitude',
            'isDebtor',
            'totalDebt',
            'lastReadingDate'
          ],
          order: [['address', 'ASC']]
        }
      ],
      attributes: [
        'id',
        'name',
        'latitude',
        'longitude',
        'totalConsumption',
        'totalDebt',
        'createdAt',
        'updatedAt'
      ]
    });

    if (!neighborhood) {
      return res.status(404).json({
        success: false,
        message: 'Barrio no encontrado'
      });
    }

    const householdCount = neighborhood.households ? neighborhood.households.length : 0;
    const debtorCount = neighborhood.households ? 
      neighborhood.households.filter(h => h.isDebtor).length : 0;

    res.json({
      success: true,
      data: {
        ...neighborhood.toJSON(),
        householdCount,
        debtorCount,
        averageConsumption: householdCount > 0 ? 
          (parseFloat(neighborhood.totalConsumption) / householdCount).toFixed(2) : 0
      }
    });

  } catch (error) {
    console.error('❌ Error al obtener barrio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el barrio',
      error: error.message
    });
  }
});

export default router;
