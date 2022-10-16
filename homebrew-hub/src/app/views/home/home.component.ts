import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Paquete } from 'src/app/models/package.model';
import { CATEGORIAS, LICENCIAS, SISTEMAS_OPERATIVOS } from '../../../assets/itemsFiltro';
import { HomebrewService } from '../../services/homebrew.service';

const ITEMS_PAGINA = 20;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  paquetesObservable = new Observable<Paquete[]>();
  paquetes: Paquete[] = [];

  paquetesPagina: Paquete[] = [];

  indicePrimerItem = 0;
  indiceUltimoItem = 0;
  totalPaquetes = 0;

  licenciasSeleccionadas: string[] = [];
  licencias = LICENCIAS;

  sistemasOperativosSeleccionados: string[] = [];
  sistemasOperativos = SISTEMAS_OPERATIVOS;

  categoriasSeleccionadas: string[] = [];
  categorias = CATEGORIAS;
  get categoriasFiltro(): string[] {
    return [...this.categorias.keys()];
  }

  busqueda = "";

  isOrdenarListado = false;

  constructor(private homebrewService: HomebrewService) { }

  ngOnInit(): void {
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
      this.isOrdenarListado = false;
      this.categoriasSeleccionadas = [];
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

  filtrarPorLicenciaHandler(seleccionados: string[]) {
    this.licenciasSeleccionadas = seleccionados;

    this.homebrewService.getAll();
    this.reiniciarFiltrosLista();

    this.actualizarPagina(0);
  }

  filtrarPorLicencia() {
    let listaFiltrada: Paquete[] = [];

    this.licenciasSeleccionadas.forEach(l => 
      listaFiltrada = this.homebrewService.filtrarPorLicencia(
        l,
        this.paquetes,
        listaFiltrada
      )
    );

    this.paquetes = listaFiltrada;
  }

  filtrarPorSistemaOperativoHandler(seleccionados: string[]) {
    this.sistemasOperativosSeleccionados = seleccionados;

    this.homebrewService.getAll();
    this.reiniciarFiltrosLista();

    this.actualizarPagina(0);
  }

  filtrarPorSistemaOperativo() {
    let listaFiltrada: Paquete[] = [];

    this.sistemasOperativosSeleccionados.forEach(so =>
      listaFiltrada = this.homebrewService.filtrarPorSistemaOperativo(
        so,
        this.paquetes,
        listaFiltrada
      )
    );

    this.paquetes = listaFiltrada;
  }

  filtrarPorCategoriasHandler(seleccionados: string[]) {
    this.categoriasSeleccionadas = seleccionados;

    this.homebrewService.getAll();
    this.reiniciarFiltrosLista();

    this.actualizarPagina(0);
  }

  filtrarPorCategoria() {
    let listaFiltrada: Paquete[] = [];

    this.categoriasSeleccionadas.forEach(c => 
      listaFiltrada = this.homebrewService.filtrarPorCategoria(
        this.categorias.get(c)!,
        this.paquetes,
        listaFiltrada
      )
    );

    this.paquetes = listaFiltrada;
  }

  ordenarListado() {
    if(this.isOrdenarListado) {
      this.paquetes = this.homebrewService.ordenarListado(this.paquetes);
    } else {
      this.homebrewService.getAll();
      this.reiniciarFiltrosLista();
    }
    this.actualizarPagina(0);
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

    if (this.isOrdenarListado)  {
      this.ordenarListado();
    }
  }
}
