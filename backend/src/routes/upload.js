/**
 * Ruta para subir y procesar archivos CSV
 * Endpoint: POST /api/upload
 */

import express from 'express';
import multer from 'multer';
import { importCsvData } from '../jobs/importCsv.js';

const router = express.Router();

// Configurar multer para almacenar archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Solo permitir archivos CSV
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos CSV'), false);
    }
  }
});

/**
 * POST /api/upload
 * Sube un archivo CSV y procesa los datos
 */
router.post('/', upload.single('csvFile'), async (req, res) => {
  try {
    // Verificar que se subió un archivo
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo CSV'
      });
    }

    console.log(`📁 Procesando archivo: ${req.file.originalname} (${req.file.size} bytes)`);

    // Procesar el archivo CSV
    const result = await importCsvData(req.file.buffer);

    res.json({
      success: true,
      message: 'Archivo CSV procesado correctamente',
      data: {
        filename: req.file.originalname,
        size: req.file.size,
        recordsProcessed: result.recordsProcessed,
        neighborhoodsCreated: result.neighborhoodsCreated,
        householdsCreated: result.householdsCreated,
        readingsCreated: result.readingsCreated,
        errors: result.errors
      }
    });

  } catch (error) {
    console.error('❌ Error al procesar archivo CSV:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error al procesar el archivo CSV',
      error: error.message
    });
  }
});

export default router;
