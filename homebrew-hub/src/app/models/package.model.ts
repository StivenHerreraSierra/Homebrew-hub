export interface Analytics {
  install: {
    '30d': {
      total: number;
    };
    '90d': {
      total: number;
    };
    '365d': {
      total: number;
    };
  };
}

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

export interface Analitica {
  total_items: number;
  start_date: string;
  end_date: string;
  total_count: number;
  items: PaquetesAnalitica[];
}

export interface PaquetesAnalitica {
  number: number;
  formula: string;
  count: string;
  percent: string;
}

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
