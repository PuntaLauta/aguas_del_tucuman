/**
 * Rutas para gestión de casas/hogares
 * Endpoints: GET /api/households
 */

import express from 'express';
import { Household, Neighborhood } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

/**
 * GET /api/households
 * Lista todas las casas con filtros opcionales
 * Query params:
 * - neighborhood: filtrar por nombre de barrio
 * - debtor: filtrar por casas morosas (true/false)
 * - limit: límite de resultados (default: 50)
 * - offset: offset para paginación (default: 0)
 */
router.get('/', async (req, res) => {
  try {
    const {
      neighborhood,
      debtor,
      limit = 50,
      offset = 0
    } = req.query;

    // Construir filtros
    const whereClause = {};
    
    if (debtor !== undefined) {
      whereClause.isDebtor = debtor === 'true';
    }

    // Construir filtros para el barrio
    const neighborhoodWhere = {};
    if (neighborhood) {
      neighborhoodWhere.name = {
        [Op.iLike]: `%${neighborhood}%`
      };
    }

    // Consultar casas con sus barrios
    const households = await Household.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Neighborhood,
          as: 'neighborhood',
          where: Object.keys(neighborhoodWhere).length > 0 ? neighborhoodWhere : undefined,
          attributes: ['id', 'name', 'latitude', 'longitude']
        }
      ],
      attributes: [
        'id',
        'address',
        'latitude',
        'longitude',
        'isDebtor',
        'totalDebt',
        'lastReadingDate',
        'createdAt',
        'updatedAt'
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        households: households.rows,
        total: households.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < households.count
      }
    });

  } catch (error) {
    console.error('❌ Error al obtener casas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las casas',
      error: error.message
    });
  }
});

/**
 * GET /api/households/debtors
 * Lista todas las casas morosas
 */
router.get('/debtors', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const debtors = await Household.findAndCountAll({
      where: { isDebtor: true },
      include: [
        {
          model: Neighborhood,
          as: 'neighborhood',
          attributes: ['id', 'name']
        }
      ],
      attributes: [
        'id',
        'address',
        'isDebtor',
        'totalDebt',
        'lastReadingDate'
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['totalDebt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        debtors: debtors.rows,
        total: debtors.count,
        totalDebt: debtors.rows.reduce((sum, debtor) => sum + parseFloat(debtor.totalDebt || 0), 0),
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (error) {
    console.error('❌ Error al obtener casas morosas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las casas morosas',
      error: error.message
    });
  }
});

export default router;
