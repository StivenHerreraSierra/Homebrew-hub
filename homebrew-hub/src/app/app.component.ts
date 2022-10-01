import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Paquete } from './models/package.model';
import { HomebrewService } from './services/homebrew.service';
import { LICENCIAS } from '../assets/licencias';
import { MatSelectionListChange } from '@angular/material/list';

const ITEMS_PAGINA = 20;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'homebrew-hub';

  paquetesObservable = new Observable<Paquete[]>();
  paquetes: Paquete[] = [];
  paquetesPagina: Paquete[] = [];

  indicePrimerItem = 0;
  indiceUltimoItem = 0;
  totalPaquetes = 0;

  licenciasSeleccionadas: string[] = [];
  licencias = LICENCIAS;

  constructor(private homebrewService: HomebrewService) {}

  ngOnInit(): void {
    this.paquetesObservable = this.homebrewService.watch();

    this.paquetesObservable.subscribe({
      next: (data: Paquete[]) => {
        this.paquetes = data;
        this.actualizarPagina(0);
      },
      error(err) {
        console.error(err);
      },
    });

    this.homebrewService.getAll();
  }

  actualizarPagina(indicePagina: number) {
    this.totalPaquetes = this.paquetes.length;

    if (this.totalPaquetes == 0) {
      this.indicePrimerItem = -1;
      this.indiceUltimoItem = 0;
      this.paquetesPagina = [];
      return;
    }

    this.indicePrimerItem = indicePagina * ITEMS_PAGINA;
    this.indiceUltimoItem = this.indicePrimerItem + ITEMS_PAGINA;

    this.paquetesPagina = this.paquetes.slice(
      this.indicePrimerItem,
      this.indiceUltimoItem
    );

    if (this.paquetesPagina.length < 20) {
      this.indiceUltimoItem =
        this.indicePrimerItem + this.paquetesPagina.length;
    }
  }

  buscarPaquete(busqueda: string) {
    if (busqueda) {
      this.paquetes = this.homebrewService.filtrarPorBusqueda(busqueda);
    } else {
      this.homebrewService.getAll();
    }
    this.actualizarPagina(0);
  }

  filtrarPorLicencia(evento: MatSelectionListChange) {
    const opcion = evento.options[0];

    if (this.licenciasSeleccionadas.length === 0) {
      this.homebrewService.getAll();
    } else if (opcion.selected && this.licenciasSeleccionadas.length === 1) {
      this.paquetes = this.homebrewService.filtrarPorLicencia(opcion.value, []);
    } else if (opcion.selected) {
      this.paquetes = this.homebrewService.filtrarPorLicencia(
        opcion.value,
        this.paquetes
      );
    } else {
      this.paquetes = this.homebrewService.removerFiltroPorLicencia(
        opcion.value,
        this.paquetes
      );
    }

    this.actualizarPagina(0);
  }
}
