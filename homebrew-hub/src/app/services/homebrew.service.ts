import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paquete } from '../models/package.model';
import { Subject } from 'rxjs';

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
      .get<Paquete[]>("https://formulae.brew.sh/api/formula.json")
      .subscribe({
        next: (res: Paquete[]) => {
          //this.paquetesAux = [];
          this.paquetesAux = res;
          //this.paquetes.next(this.paquetesAux);
          //this.paquetesAux = [];
        },
        error: (err) => err,
      });
  }
}
