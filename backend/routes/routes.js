import { Router } from "express";
import {
  obtenerPaquetes,
  obtenerAnaliticasMac,
  obtenerAnaliticasLinux,
} from "../controllers/controller.js";

const router = Router();

/**
 * Definición de los end points y sus handlers.
 */
router.get("/all", obtenerPaquetes);
router.get("/analytics/:dias", obtenerAnaliticasMac);
router.get("/analytics-linux/:dias", obtenerAnaliticasLinux);

/**
 * Exportando el router.
 */
export default router;
