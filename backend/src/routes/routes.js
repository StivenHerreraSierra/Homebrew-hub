import { Router } from "express";
import {
  obtenerPaquetes,
  obtenerAnaliticasMac,
  obtenerAnaliticasLinux,
} from "../controllers/controller.js";

const router = Router();

router.get("/all", obtenerPaquetes);
router.get("/analytics/:dias", obtenerAnaliticasMac);
router.get("/analytics-linux/:dias", obtenerAnaliticasLinux);

export default router;
