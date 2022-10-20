/**
 * Interface que representa un paquete.
 */
export interface Paquete {
  name: string;
  fullName: string;
  tap: string;
  oldname: string;
  desc: string;
  license: string;
  homepage: string;
  stableVersion: string;
  stableUrl: string;
  linuxCompatible: boolean;
  buildDependencies: string[];
  dependencies: string[];
  deprecated: boolean;
  deprecation_date: string;
  'analytics-30': string;
  'analytics-90': string;
  'analytics-365': string;
  'analytics-linux-30': string;
  'analytics-linux-90': string;
  'analytics-linux-365': string;
}

/**
 * Interface que representa un paquete con el formato que se envía en la respuesta de la petición.
 */
export interface PaqueteRespuesta {
  name: string;
  'full-name': string;
  tap: string;
  oldname: string;
  desc: string;
  license: string;
  homepage: string;
  versions: {
    stable: string;
  };
  urls: {
    stable: {
      url: string;
    };
  };
  bottle: {
    stable: {
      files: {
        x86_64_linux: {
          url: string;
        };
      };
    };
  };
  build_dependencies: string[];
  dependencies: string[];
  deprecated: boolean;
  deprecation_date: string;
  'analytics-30': string;
  'analytics-90': string;
  'analytics-365': string;
  'analytics-linux-30': string;
  'analytics-linux-90': string;
  'analytics-linux-365': string;
}

/**
 * Interface que representa las analíticas de Homebrew.
 */
export interface Analitica {
  total_items: number;
  start_date: string;
  end_date: string;
  total_count: number;
  items: PaquetesAnalitica[];
}

/**
 * Interface que representa los items de la analítica.
 */
export interface PaquetesAnalitica {
  number: number;
  formula: string;
  count: string;
  percent: string;
}

/**
 * Interface que representa los datos del diagrama de barras.
 */
export interface ChartBarData {
  labels: string[];
  datasets: [
    {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }
  ];
}
