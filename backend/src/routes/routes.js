import { Router } from 'express';
import {
  obtenerPaquetesHandler,
  obtenerAnaliticasMacHandler,
  obtenerAnaliticasLinuxHandler,
  obtenerPaqueteHandler,
} from '../controllers/controller.js';

const router = Router();

/**
 * Definición de los end points y sus handlers.
 */
router.get('/all', obtenerPaquetesHandler);
router.get('/analytics/:dias', obtenerAnaliticasMacHandler);
router.get('/analytics-linux/:dias', obtenerAnaliticasLinuxHandler);
router.get('/get/:pac', obtenerPaqueteHandler);

/**
 * Exportando el router.
 */
export default router;
