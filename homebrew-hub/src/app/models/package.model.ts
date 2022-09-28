interface AnaliticsInstall {
  days30: number;
  days60: number;
  days90: number;
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
  installations: AnaliticsInstall;
  linuxInstallations: AnaliticsInstall;
}
