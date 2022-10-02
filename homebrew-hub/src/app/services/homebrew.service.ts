import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paquete, PaqueteRespuesta } from '../models/package.model';
import { map, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

const _ = require('lodash');

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
    return this.http
      .get<PaqueteRespuesta[]>(environment.api + 'formula.json')
      .subscribe({
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
            } as Paquete;

            this.listaPaquetes.push(nuevoPaquete);
          });

          this.paquetes.next(this.listaPaquetes);
        },
        error: (err) => err,
      });
  }

  getAnalytics(nombrePaquete: string) {
    this.http
      .get<PaqueteRespuesta>(`${environment.api}/formula/${nombrePaquete}.json`)
      .pipe(map((data: PaqueteRespuesta) => data.analytics));
  }

  getLinuxAnalytics(nombrePaquete: string) {
    this.http
      .get<PaqueteRespuesta>(
        `${environment.api}/formula/${nombrePaquete}.json`,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://formulae.brew.sh/api/',
          }),
        }
      )
      .pipe(map((data: PaqueteRespuesta) => data['analytics-linux']));
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

  filtrarPorLicencia(licencia: string, paquetes: Paquete[], listaActual: Paquete[]) {
    var listaFiltrada: Paquete[] = [];

    //Obtiene los paquetes que cumplen.
    listaFiltrada = paquetes.filter(
      (p) => p.license && p.license.includes(licencia)
    );

    //Une los paquetes nuevos con los anteriores, omite repetidos.
    listaFiltrada = _.unionWith(listaActual, listaFiltrada, _.isEqual);

    return listaFiltrada;
  }

  removerFiltroPorLicencia(licencia: string, listaActual: Paquete[]) {
    //Obtiene los paquetes que cumplen.
    var listaFiltrada: Paquete[] = listaActual.filter(
      (p) => p.license && !p.license.includes(licencia)
    );

    return listaFiltrada;
  }
}
