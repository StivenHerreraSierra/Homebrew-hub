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

  const analiticas = [...resAnaliticas.data.items];

  const analiticasMap = new Map(analiticas.map((a) => [a.formula, a.count]));

  paquetes = paquetes.map((p) => {
    p = {
      name: p.name,
      "full-name": p.full_name,
      tap: p.tap,
      oldname: p.oldname,
      desc: p.desc,
      license: p.license,
      versions: p.versions,
      urls: p.urls,
      bottle: p.bottle,
      build_dependencies: p.build_dependencies,
      dependencies: p.dependencies,
      deprecated: p.deprecated,
      deprecation_date: p.deprecation_date,
    };

    p["analytics-365"] = analiticasMap.get(p["full-name"]) ?? "0";
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

const obtenerPaquete = async (req, res) => {
  const { pac } = req.params;
  const respuesta = await httpClient.get(`${END_POINT}/formula/${pac}.json`);

  let paquete = {
    name: respuesta.data.name,
    "full-name": respuesta.data.full_name,
    tap: respuesta.data.tap,
    oldname: respuesta.data.oldname,
    homepage: respuesta.data.homepage,
    desc: respuesta.data.desc,
    license: respuesta.data.license,
    versions: respuesta.data.versions,
    urls: respuesta.data.urls,
    bottle: respuesta.data.bottle,
    build_dependencies: respuesta.data.build_dependencies,
    dependencies: respuesta.data.dependencies,
    deprecated: respuesta.data.deprecated,
    deprecation_date: respuesta.data.deprecation_date,
    //Obtiene los valores en el objeto, en forma de array, y captura el primer elemento.
    "analytics-30":
      Object.values(respuesta.data.analytics.install["30d"])[0] ?? 0,
    "analytics-90":
      Object.values(respuesta.data.analytics.install["90d"])[0] ?? 0,
    "analytics-365":
      Object.values(respuesta.data.analytics.install["365d"])[0] ?? 0,
    "analytics-linux-30":
      Object.values(respuesta.data["analytics-linux"].install["30d"])[0] ?? 0,
    "analytics-linux-90":
      Object.values(respuesta.data["analytics-linux"].install["90d"])[0] ?? 0,
    "analytics-linux-365":
      Object.values(respuesta.data["analytics-linux"].install["365d"])[0] ?? 0,
  };

  res.status(200).json(paquete);
};

/**
 * Exportando las funciones.
 */
export {
  obtenerPaquetes,
  obtenerAnaliticasMac,
  obtenerAnaliticasLinux,
  obtenerPaquete,
};
