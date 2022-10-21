import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Analitica, Paquete, PaqueteRespuesta } from '../models/package.model';
import { map, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Servicios de la aplicación.
 */
@Injectable({
  providedIn: 'root',
})
export class HomebrewService {
  //Lista de paquetes.
  private listaPaquetes: Paquete[] = [];
  //Observable que sincroniza la lista de paquetes en todos los componentes que la usan.
  private paquetes = new Subject<Paquete[]>();

  //Inyección de dependencias.
  constructor(private http: HttpClient) {}

  /**
   * Método que envía el observable con el cual se informa la actualización de la lista.
   * @returns Observable.
   */
  watch() {
    return this.paquetes.asObservable();
  }

  /**
   * Obtiene todos los paquetes de Formulae.
   * Si la petición ya se hizo una vez, se capturan los datos del sessionStorage.
   */
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

  /**
   * Filtra los paquetes por una coincidencia en el nombre o descripción.
   * @param busqueda Texto de la búsqueda.
   * @returns Lista de paquetes que cumplen la coincidencia.
   */
  filtrarPorBusqueda(busqueda: string): Paquete[] {
    const busquedaAux = busqueda.toLowerCase();
    const paquetesFiltrados = this.listaPaquetes.filter(
      (paquete) =>
        paquete.name.toLowerCase().includes(busquedaAux) ||
        paquete.desc.toLowerCase().includes(busquedaAux)
    );

    return paquetesFiltrados;
  }

  /**
   * Obtiene los paquete que tienen la licencia especificada.
   * @param licencia Licencia a cumplir.
   * @param paquetes Lista de paquetes que se quiere filtrar.
   * @param listaActual Lista de paquetes a la que se va a añadir el nuevo filtro.
   * @returns Lista de paquetes que cumplen el filtro.
   */
  filtrarPorLicencia(
    licencia: string,
    paquetes: Paquete[],
    listaActual: Paquete[]
  ) {
    let listaFiltrada: Paquete[] = [];

    //Obtiene los paquetes que cumplen.
    listaFiltrada = paquetes.filter(
      (p) => p.license && p.license.includes(licencia)
    );

    //Une los paquetes nuevos con los anteriores, omite repetidos.
    listaFiltrada = [...new Set([...listaActual, ...listaFiltrada])];

    return listaFiltrada;
  }

  /**
   * Obtiene los paquetes que están en el SO especificado.
   * @param sistema Sistema operativo a cumplir.
   * @param paquetes Lista de paquetes a filtrar.
   * @param listaActual Lista de paquetes a la que se va a añadir el nuevo filtro.
   * @returns Lista de paquetes que cumplen el filtro.
   */
  filtrarPorSistemaOperativo(
    sistema: string,
    paquetes: Paquete[],
    listaActual: Paquete[]
  ) {
    let listaFiltrada: Paquete[] = [];

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

  /**
   * Obtiene los paquetes que en su descripción contienen la categoría especificada.
   * @param categoria Categoría a cumplir.
   * @param paquetes Lista de paquetes a filtrar.
   * @param listaActual Lista de paquetes a la que se va a añadir el nuevo filtro.
   * @returns Lista de paquetes que cumplen el filtro.
   */
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

  /**
   * Obtiene las analíticas de Mac OS de los últimos n días.
   * @param dias Número de días de la analítica.
   * @returns Observable de la petición.
   */
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

  /**
   * Obtiene la analíticas de Linux de los últimos n días.
   * @param dias Número de días de la analítica.
   * @returns Observable de la petición.
   */
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

  /**
   * Ordena la lista de paquetes de acuerdo a la cantidad de instalaciones.
   * @param paquetes Lista de paquetes a ordenar.
   * @returns Lista de paquetes ordenada.
   */
  ordenarListado(paquetes: Paquete[]) {
    const paquetesOrdenado = [...paquetes].sort(
      (p1: Paquete, p2: Paquete) =>
        parseInt(p2['analytics-365']!.replace(/,/g, '')) -
        parseInt(p1['analytics-365']!.replace(/,/g, ''))
    );

    return paquetesOrdenado;
  }

  /**
   * Obtiene un paquete específico por su nombre.
   * @param nombrePaquete Nombre del paquete.
   * @returns Paquete con su información.
   */
  getPaquete(nombrePaquete: string) {
    return this.http
      .get<PaqueteRespuesta>(`${environment.api}/get/${nombrePaquete}`)
      .pipe(
        map((paquete: PaqueteRespuesta) => {
          return {
            name: paquete.name,
            fullName: paquete['full-name'],
            tap: paquete.tap,
            homepage: paquete.homepage,
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
            'analytics-30': paquete['analytics-30'],
            'analytics-90': paquete['analytics-90'],
            'analytics-365': paquete['analytics-365'],
            'analytics-linux-30': paquete['analytics-linux-30'],
            'analytics-linux-90': paquete['analytics-linux-90'],
            'analytics-linux-365': paquete['analytics-linux-365'],
          } as Paquete;
        })
      );
  }
}
