import dotenv from "dotenv";
import axios from "axios";

//Recuperar las variables de .env
dotenv.config();

const END_POINT = process.env.API;

//Configuración de Axios.
const httpClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Obtiene todos los paquetes disponibles en la API.
 * @param {*} req Petición.
 * @param {*} res Paquetes.
 */
const obtenerPaquetes = async (req, res) => {
  const resAll = await httpClient.get(`${END_POINT}/formula.json`);
  
  let paquetes = [...resAll.data];
  const resAnaliticas = await httpClient.get(
    `${END_POINT}/analytics/install/365d.json`
  );

  const analiticas = [...resAnaliticas.data.items]

  const analiticasMap = new Map(analiticas.map(a => [a.formula, a.count]));

  paquetes = paquetes.map(p => {
    p = {
      "name": p.name,
      "full-name": p.full_name,
      "tap": p.tap,
      "oldname": p.oldname,
      "desc": p.desc,
      "license": p.license,
      "versions": p.versions,
      "urls": p.urls,
      "bottle": p.bottle,
      "build_dependencies": p.build_dependencies,
      "dependencies": p.dependencies,
      "deprecated": p.deprecated,
      "deprecation_date": p.deprecation_date,
    };

    p.analytics = analiticasMap.get(p.full_name) ?? 0;
    return p;
  });
  
  res.status(200).json(paquetes);
};

/**
 * Obtiene las analíticas y los paquetes más instalados en MacOS.
 * @param {*} req Petición.
 * @param {*} res Analíticas de MacOS.
 */
const obtenerAnaliticasMac = async (req, res) => {
  const { dias } = req.params;
  const analiticas = await httpClient.get(
    `${END_POINT}/analytics/install/${dias}.json`
  );

  res.status(200).json(analiticas.data);
};

/**
 * Obtiene las analíticas y los paquetes más instalados en Linux.
 * @param {*} req Petición.
 * @param {*} res Analíticas de Linux.
 */
const obtenerAnaliticasLinux = async (req, res) => {
  const { dias } = req.params;
  const analiticas = await httpClient.get(
    `${END_POINT}/analytics-linux/install/${dias}.json`
  );
  res.status(200).json(analiticas.data);
};

/**
 * Exportando las funciones.
 */
export { obtenerPaquetes, obtenerAnaliticasMac, obtenerAnaliticasLinux };
