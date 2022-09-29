import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Analytics, Paquete, PaqueteRespuesta } from '../models/package.model';
import { map, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HomebrewService {
  private paquetesAux: Paquete[] = [];
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

            this.paquetesAux.push(nuevoPaquete);
          });

          this.paquetes.next(this.paquetesAux);

          this.paquetesAux = [];
        },
        error: (err) => err,
      });
  }

  getAnalytics(nombrePaquete: string) {
    this.http
      .get<PaqueteRespuesta>(`${environment.api}/formula/${nombrePaquete}.json`)
      .pipe(
        map((data: PaqueteRespuesta) => data.analytics)
      );
  }

  getLinuxAnalytics(nombrePaquete: string) {
    this.http
      .get<PaqueteRespuesta>(`${environment.api}/formula/${nombrePaquete}.json`)
      .pipe(
        map((data: PaqueteRespuesta) => data['analytics-linux'])
      );
  }
}
