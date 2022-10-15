import {
  obtenerAnaliticasLinux,
  obtenerAnaliticasMac,
  obtenerPaquete,
  obtenerPaquetes,
} from "../services/service.js";

/**
 * Handler que obtiene todos los paquetes disponibles en la API.
 * @param {*} req Petición.
 * @param {*} res Paquetes.
 */
const obtenerPaquetesHandler = async (req, res) => {
  const paquetes = await obtenerPaquetes();

  res.status(200).json(paquetes);
};

/**
 * Handler que obtiene las analíticas y los paquetes más instalados en MacOS.
 * Se debe especificar si la analítica es de los últimos 30, 90 o 365 días.
 * @param {*} req Petición.
 * @param {*} res Analíticas de MacOS.
 */
const obtenerAnaliticasMacHandler = async (req, res) => {
  const { dias } = req.params;

  const analiticas = await obtenerAnaliticasMac(dias);

  if (!analiticas) res.status(404).json(analiticas);
  else res.status(200).json(analiticas);
};

/**
 * Handler que obtiene las analíticas y los paquetes más instalados en Linux.
 * Se debe especificar si la analítica es de los últimos 30, 90 o 365 días.
 * @param {*} req Petición.
 * @param {*} res Analíticas de Linux.
 */
const obtenerAnaliticasLinuxHandler = async (req, res) => {
  const { dias } = req.params;

  const analiticas = await obtenerAnaliticasLinux(dias);

  if (!analiticas) res.status(404).json(analiticas);
  else res.status(200).json(analiticas);
};

/**
 * Obtiene la información de un paquete específico.
 * @param {*} req Petición.
 * @param {*} res Respuesta.
 */
const obtenerPaqueteHandler = async (req, res) => {
  const { pac } = req.params;

  const paquete = await obtenerPaquete(pac);

  if (!paquete) res.status(404).json(paquete);
  else res.status(200).json(paquete);
};

/**
 * Exportando las funciones.
 */
export {
  obtenerPaquetesHandler,
  obtenerAnaliticasMacHandler,
  obtenerAnaliticasLinuxHandler,
  obtenerPaqueteHandler,
};
