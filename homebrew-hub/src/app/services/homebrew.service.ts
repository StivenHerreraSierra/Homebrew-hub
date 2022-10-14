import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Analitica, Paquete, PaqueteRespuesta } from '../models/package.model';
import { map, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HomebrewService {
  private listaPaquetes: Paquete[] = [];
  private paquetes = new Subject<Paquete[]>();

  constructor(private http: HttpClient) {}

  watch() {
    return this.paquetes.asObservable();
  }

  getAll() {
    if (sessionStorage.getItem('all')) {
      this.listaPaquetes = JSON.parse(sessionStorage.getItem('all')!);
      this.paquetes.next(this.listaPaquetes);
    } else {
      this.http.get<PaqueteRespuesta[]>(`${environment.api}/all`).subscribe({
        next: (res: PaqueteRespuesta[]) => {
          this.listaPaquetes = [];

          res.forEach((paquete: PaqueteRespuesta) => {
            const nuevoPaquete: Paquete = {
              name: paquete.name,
              fullName: paquete['full-name'],
              tap: paquete.tap,
              oldname: paquete.oldname,
              desc: paquete.desc,
              license: paquete.license,
              stableVersion: paquete.versions.stable,
              stableUrl: paquete.urls.stable.url,
              linuxCompatible: paquete.bottle?.stable?.files.x86_64_linux
                ? true
                : false,
              buildDependencies: paquete.build_dependencies,
              dependencies: paquete.dependencies,
              deprecated: paquete.deprecated,
              deprecation_date: paquete.deprecation_date,
              'analytics-365': paquete['analytics-365'],
            } as Paquete;

            this.listaPaquetes.push(nuevoPaquete);
          });

          sessionStorage.setItem('all', JSON.stringify(this.listaPaquetes));
          this.paquetes.next(this.listaPaquetes);
        },
        error: (err) => err,
      });
    }
  }

  filtrarPorBusqueda(busqueda: string): Paquete[] {
    const busquedaAux = busqueda.toLowerCase();
    const paquetesFiltrados = this.listaPaquetes.filter(
      (paquete) =>
        paquete.name.toLowerCase().includes(busquedaAux) ||
        paquete.desc.toLowerCase().includes(busquedaAux)
    );

    return paquetesFiltrados;
  }

  filtrarPorLicencia(
    licencia: string,
    paquetes: Paquete[],
    listaActual: Paquete[]
  ) {
    var listaFiltrada: Paquete[] = [];

    //Obtiene los paquetes que cumplen.
    listaFiltrada = paquetes.filter(
      (p) => p.license && p.license.includes(licencia)
    );

    //Une los paquetes nuevos con los anteriores, omite repetidos.
    listaFiltrada = [...new Set([...listaActual, ...listaFiltrada])];

    return listaFiltrada;
  }

  removerFiltroPorLicencia(licencia: string, listaActual: Paquete[]) {
    //Obtiene los paquetes que cumplen.
    var listaFiltrada: Paquete[] = listaActual.filter(
      (p) => p.license && !p.license.includes(licencia)
    );

    return listaFiltrada;
  }

  filtrarPorSistemaOperativo(
    sistema: string,
    paquetes: Paquete[],
    listaActual: Paquete[]
  ) {
    var listaFiltrada: Paquete[] = [];

    //Obtiene los paquetes que cumplen.
    if (sistema.toLowerCase() === 'linux') {
      listaFiltrada = paquetes.filter((p) => p.linuxCompatible);
    } else {
      listaFiltrada = paquetes.filter((p) => !p.linuxCompatible);
    }

    //Une los paquetes nuevos con los anteriores, omite repetidos.
    listaFiltrada = [...new Set([...listaActual, ...listaFiltrada])];

    return listaFiltrada;
  }

  removerFiltroPorSistemaOperativo(sistema: string, listaActual: Paquete[]) {
    var listaFiltrada: Paquete[] = [];

    //Obtiene los paquetes que cumplen.
    if (sistema.toLowerCase() === 'linux') {
      listaFiltrada = listaActual.filter((p) => !p.linuxCompatible);
    } else {
      listaFiltrada = listaActual.filter((p) => p.linuxCompatible);
    }

    return listaFiltrada;
  }

  filtrarPorCategoria(
    categoria: string,
    paquetes: Paquete[],
    listaActual: Paquete[]
  ) {
    const categoriaAux = categoria.toLowerCase();

    let paquetesFiltrados = paquetes.filter(
      (paquete) =>
        paquete.desc && paquete.desc.toLowerCase().includes(categoriaAux)
    );

    paquetesFiltrados = [...new Set([...listaActual, ...paquetesFiltrados])];

    return paquetesFiltrados;
  }

  removerFiltroPorCategoria(categoria: string, listaActual: Paquete[]) {
    const categoriaAux = categoria.toLowerCase();

    //Obtiene los paquetes que cumplen.
    var listaFiltrada: Paquete[] = listaActual.filter(
      (p) => p.desc && !p.desc.toLocaleLowerCase().includes(categoriaAux)
    );

    return listaFiltrada;
  }

  getMacOsAnaliticas(dias: number) {
    return this.http
      .get<Analitica>(`${environment.api}/analytics/${dias}d`)
      .pipe<Analitica>(
        map((data: Analitica) => {
          return {
            total_items: data.total_items,
            start_date: data.start_date,
            end_date: data.end_date,
            total_count: data.total_count,
            items: data.items.slice(0, 10),
          } as Analitica;
        })
      );
  }

  getLinuxAnaliticas(dias: number) {
    return this.http
      .get<Analitica>(`${environment.api}/analytics-linux/${dias}d`)
      .pipe<Analitica>(
        map((data: Analitica) => {
          return {
            total_items: data.total_items,
            start_date: data.start_date,
            end_date: data.end_date,
            total_count: data.total_count,
            items: data.items.slice(0, 10),
          } as Analitica;
        })
      );
  }

  ordenarListado(paquetes: Paquete[]) {
    const paquetesOrdenado = [...paquetes].sort(
      (p1: Paquete, p2: Paquete) =>
        parseInt(p2['analytics-365'].replace(/,/g, '')) -
        parseInt(p1['analytics-365'].replace(/,/g, ''))
    );

    return paquetesOrdenado;
  }
}
