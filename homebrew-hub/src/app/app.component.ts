import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Paquete } from './models/package.model';
import { HomebrewService } from './services/homebrew.service';
import { LICENCIAS, SISTEMAS_OPERATIVOS } from '../assets/itemsFiltro';
import { CuerpoEventoFiltrar } from './components/filtro-checkbox/filtro-checkbox.component';
import { TitleStrategy } from '@angular/router';

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
  copiaPaquetes: Paquete[] = [];
  paquetesPagina: Paquete[] = [];

  indicePrimerItem = 0;
  indiceUltimoItem = 0;
  totalPaquetes = 0;

  licenciasSeleccionadas: string[] = [];
  licencias = LICENCIAS;

  sistemasOperativosSeleccionados: string[] = [];
  sistemasOperativos = SISTEMAS_OPERATIVOS;

  constructor(private homebrewService: HomebrewService) {}

  ngOnInit(): void {
    this.paquetesObservable = this.homebrewService.watch();

    this.paquetesObservable.subscribe({
      next: (data: Paquete[]) => {
        this.paquetes = data;
        this.verificarFiltros();
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
    this.licenciasSeleccionadas = [];
    this.sistemasOperativosSeleccionados = [];

    if (busqueda) {
      this.paquetes = this.homebrewService.filtrarPorBusqueda(busqueda);
    } else {
      this.homebrewService.getAll();
    }
    this.actualizarPagina(0);
  }

  filtrarPorLicenciaHandler(cuerpo: CuerpoEventoFiltrar) {
    const { opcion, seleccionados } = cuerpo;

    this.licenciasSeleccionadas = seleccionados;

    if (this.licenciasSeleccionadas.length === 0) {
      this.paquetes = this.copiaPaquetes;
      this.copiaPaquetes = [];
    } else if (opcion.selecciono) {
      this.agregarFiltroPorLicencia(opcion.valor);
    } else {
      this.removerFiltroPorLicencia(opcion.valor);
    }

    this.actualizarPagina(0);
  }

  agregarFiltroPorLicencia(valor: string) {
    if (this.licenciasSeleccionadas.length === 1) {
      this.copiaPaquetes = this.paquetes;
      this.paquetes = this.filtrarPorLicencia(valor, []);
    } else {
      this.paquetes = this.filtrarPorLicencia(valor, this.paquetes);
    }
  }

  removerFiltroPorLicencia(valor: string) {
    this.paquetes = this.homebrewService.removerFiltroPorLicencia(
      valor,
      this.paquetes
    );
  }

  filtrarPorLicencia(licencia: string, paquetesActual: Paquete[]): Paquete[] {
    return this.homebrewService.filtrarPorLicencia(
      licencia,
      this.copiaPaquetes,
      paquetesActual
    );
  }

  filtrarPorSistemaOperativoHandler(cuerpo: CuerpoEventoFiltrar) {
    const { opcion, seleccionados } = cuerpo;

    this.sistemasOperativosSeleccionados = seleccionados;

    if (this.sistemasOperativosSeleccionados.length === 0) {
      this.paquetes = this.copiaPaquetes;
      this.copiaPaquetes = [];
    } else if (opcion.selecciono) {
      this.agregarFiltroPorSistemaOperativo(opcion.valor);
    } else {
      this.removerFiltroPorSistemaOperativo(opcion.valor);
    }

    this.actualizarPagina(0);
  }

  agregarFiltroPorSistemaOperativo(valor: string) {
    if (this.sistemasOperativosSeleccionados.length === 1) {
      this.copiaPaquetes = this.paquetes;
      this.paquetes = this.filtrarPorSistemaOperativo(valor, []);
    } else {
      this.paquetes = this.filtrarPorSistemaOperativo(valor, this.paquetes);
    }
  }

  removerFiltroPorSistemaOperativo(valor: string) {
    this.paquetes = this.homebrewService.removerFiltroPorSistemaOperativo(
      valor,
      this.paquetes
    );
  }

  filtrarPorSistemaOperativo(so: string, paquetesActual: Paquete[]): Paquete[] {
    return this.homebrewService.filtrarPorSistemaOperativo(
      so,
      this.copiaPaquetes,
      paquetesActual
    );
  }

  verificarFiltros() {
    if (this.sistemasOperativosSeleccionados.length > 0) {
      this.sistemasOperativosSeleccionados.forEach((so) =>
        this.agregarFiltroPorSistemaOperativo(so)
      );
    }
    if (this.licenciasSeleccionadas.length > 0) {
      this.licenciasSeleccionadas.forEach((l) =>
        this.agregarFiltroPorLicencia(l)
      );
    }
  }
}
