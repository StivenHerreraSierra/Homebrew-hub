import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Paquete } from './models/package.model';
import { HomebrewService } from './services/homebrew.service';
import { CATEGORIAS, LICENCIAS, SISTEMAS_OPERATIVOS } from '../assets/itemsFiltro';
import { CuerpoEventoFiltrar } from './components/filtro-checkbox/filtro-checkbox.component';

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

  busqueda: string = "";

  licenciasSeleccionadas: string[] = [];
  licencias = LICENCIAS;

  sistemasOperativosSeleccionados: string[] = [];
  sistemasOperativos = SISTEMAS_OPERATIVOS;

  categoriasSeleccionadas: string[] = [];
  categorias = CATEGORIAS;

  constructor(private homebrewService: HomebrewService) {}

  ngOnInit(): void {
    console.log("Ejecutando Init:", Date.now().toLocaleString());
    this.paquetesObservable = this.homebrewService.watch();

    this.paquetesObservable.subscribe({
      next: (data: Paquete[]) => {
        this.paquetes = data;
        this.reiniciarFiltrosLista();
        this.actualizarPagina(0);
      },
      error(err) {
        console.error(err);
      },
    });

    this.homebrewService.getAll();

    this.busqueda = "";
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
    if (this.busqueda !== busqueda) {
      this.licenciasSeleccionadas = [];
      this.sistemasOperativosSeleccionados = [];
      this.busqueda = busqueda;
    }

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

    this.homebrewService.getAll();
    this.reiniciarFiltrosLista();

    this.actualizarPagina(0);
  }

  filtrarPorLicencia() {
    var listaFiltrada: Paquete[] = [];

    this.licenciasSeleccionadas.forEach(l => 
      listaFiltrada = this.homebrewService.filtrarPorLicencia(
        l,
        this.paquetes,
        listaFiltrada
      )
    );

    this.paquetes = listaFiltrada;
  }

  filtrarPorSistemaOperativoHandler(cuerpo: CuerpoEventoFiltrar) {
    const { opcion, seleccionados } = cuerpo;

    this.sistemasOperativosSeleccionados = seleccionados;

    this.homebrewService.getAll();
    this.reiniciarFiltrosLista();

    this.actualizarPagina(0);
  }

  filtrarPorSistemaOperativo() {
    var listaFiltrada: Paquete[] = [];

    this.sistemasOperativosSeleccionados.forEach(so =>
      listaFiltrada = this.homebrewService.filtrarPorSistemaOperativo(
        so,
        this.paquetes,
        listaFiltrada
      )
    );

    this.paquetes = listaFiltrada;
  }

  get categoriasFiltro(): string[] {
    return [...this.categorias.keys()];
  }

  filtrarPorCategoriasHandler(cuerpo: CuerpoEventoFiltrar) {
    const { opcion, seleccionados } = cuerpo;

    this.categoriasSeleccionadas = seleccionados;

    this.homebrewService.getAll();
    this.reiniciarFiltrosLista();

    this.actualizarPagina(0);
  }

  filtrarPorCategoria() {
    var listaFiltrada: Paquete[] = [];

    this.categoriasSeleccionadas.forEach(c => 
      listaFiltrada = this.homebrewService.filtrarPorCategoria(
        c,
        this.paquetes,
        listaFiltrada
      )
    );

    this.paquetes = listaFiltrada;
  }

  reiniciarFiltrosLista() {
    if (this.busqueda) {
      this.buscarPaquete(this.busqueda);
    }

    if (this.licenciasSeleccionadas.length > 0) {
      this.filtrarPorLicencia();
    }

    if (this.sistemasOperativosSeleccionados.length > 0) {
      this.filtrarPorSistemaOperativo();
    }

    if (this.categoriasSeleccionadas.length > 0) {
      this.filtrarPorCategoria();
    }
  }
}
