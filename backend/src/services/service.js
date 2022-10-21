import dotenv from 'dotenv';
import axios from 'axios';

// Recuperar las variables de .env
dotenv.config();

const END_POINT = process.env.API;

// Configuración de Axios.
const httpClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Obtiene todos los paquetes de la API.
 * @returns Paquetes.
 */
const obtenerPaquetes = async () => {
  const paquetesRes = await httpClient.get(`${END_POINT}/formula.json`);

  let paquetes = [...paquetesRes.data];
  const resAnaliticas = await httpClient.get(
    `${END_POINT}/analytics/install/365d.json`,
  );

  const analiticas = [...resAnaliticas.data.items];

  const analiticasMap = new Map(analiticas.map((a) => [a.formula, a.count]));

  paquetes = paquetes.map((p) => {
    const paqueteMod = {
      name: p.name,
      'full-name': p.full_name,
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

    paqueteMod['analytics-365'] = analiticasMap.get(paqueteMod['full-name']) ?? '0';
    return paqueteMod;
  });

  return paquetes;
};

/**
 * Obtiene las analíticas y los paquetes más instalados en MacOS.
 * @param {string} dias Cantidad de días que se tienen en cuenta para las analíticas.
 * @returns Analiticas
 */
const obtenerAnaliticasMac = async (dias) => {
  try {
    const analiticas = await httpClient.get(
      `${END_POINT}/analytics/install/${dias}.json`,
    );

    return analiticas.data;
  } catch {
    return null;
  }
};

/**
 * Obtiene las analíticas y los paquetes más instalados en Linux.
 * @param {number} dias Cantidad de días que se tienen en cuenta para las analíticas.
 * @returns Analiticas
 */
const obtenerAnaliticasLinux = async (dias) => {
  try {
    const analiticas = await httpClient.get(
      `${END_POINT}/analytics-linux/install/${dias}.json`,
    );

    return analiticas.data;
  } catch {
    return null;
  }
};

/**
 * Obtiene la información de un paquete específico.
 * @param {string} nombre Nombre del paquete.
 * @returns Paquete ó null si no existe.
 */
const obtenerPaquete = async (nombre) => {
  try {
    const respuesta = await httpClient.get(
      `${END_POINT}/formula/${nombre}.json`,
    );
    let paquete = respuesta.data;

    paquete = {
      name: paquete.name,
      'full-name': paquete.full_name,
      tap: paquete.tap,
      oldname: paquete.oldname,
      homepage: paquete.homepage,
      desc: paquete.desc,
      license: paquete.license,
      versions: paquete.versions,
      urls: paquete.urls,
      bottle: paquete.bottle,
      build_dependencies: paquete.build_dependencies,
      dependencies: paquete.dependencies,
      deprecated: paquete.deprecated,
      deprecation_date: paquete.deprecation_date,
      // Obtiene los valores en el objeto, en forma de array, y captura el primer elemento.
      'analytics-30': Object.values(paquete.analytics.install['30d'])[0] ?? 0,
      'analytics-90': Object.values(paquete.analytics.install['90d'])[0] ?? 0,
      'analytics-365': Object.values(paquete.analytics.install['365d'])[0] ?? 0,
      'analytics-linux-30':
        Object.values(paquete['analytics-linux'].install['30d'])[0] ?? 0,
      'analytics-linux-90':
        Object.values(paquete['analytics-linux'].install['90d'])[0] ?? 0,
      'analytics-linux-365':
        Object.values(paquete['analytics-linux'].install['365d'])[0] ?? 0,
    };

    return paquete;
  } catch {
    return null;
  }
};

export {
  obtenerPaquetes,
  obtenerAnaliticasMac,
  obtenerAnaliticasLinux,
  obtenerPaquete,
};
