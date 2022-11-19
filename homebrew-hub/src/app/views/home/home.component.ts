import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Paquete } from 'src/app/models/package.model';
import { CATEGORIAS, LICENCIAS, SISTEMAS_OPERATIVOS } from '../../../assets/itemsFiltro';
import { HomebrewService } from '../../services/homebrew.service';

//Cantidad de paquetes por página.
const ITEMS_PAGINA = 20;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //Observable y lista de paquetes.
  paquetesObservable = new Observable<Paquete[]>();
  paquetes: Paquete[] = [];

  //Lista de paquetes de la página actual.
  paquetesPagina: Paquete[] = [];

  //Variables auxiliares para calcular los paquetes que se van a mostrar.
  indicePrimerItem = 0;
  indiceUltimoItem = 0;
  totalPaquetes = 0;

  //Lista de licencias para filtrar la lista.
  licenciasSeleccionadas: string[] = [];
  licencias = LICENCIAS;

  //Lista de SO para filtrar la lista.
  sistemasOperativosSeleccionados: string[] = [];
  sistemasOperativos = SISTEMAS_OPERATIVOS;

  //Lista de categorías para filtrar la lista.
  categoriasSeleccionadas: string[] = [];
  categorias = CATEGORIAS;
  //Obtiene el valor que representa la categoría.
  get categoriasFiltro(): string[] {
    return [...this.categorias.keys()];
  }

  //Valor del filtro por búsqueda.
  busqueda = "";

  //Variable del Toogle que ordena la lista.
  isOrdenarListado = false;

  //Inyección de dependencias.
  constructor(private homebrewService: HomebrewService) { }

  /**
   * Método que se ejecuta cuando se carga el componente.
   */
  ngOnInit(): void {
    this.recuperarFiltros();
    this.paquetesObservable = this.homebrewService.watch();

    this.paquetesObservable.subscribe({
      next: (data: Paquete[]) => {
        this.paquetes = data;
        this.reiniciarFiltrosLista(true);
        this.actualizarPagina(0);
      },
      error(err) {
        console.error(err);
      },
    });

    this.homebrewService.getAll();
  }

  /**
   * Método que actualiza los paquetes que se muestran en la página.
   * @param indicePagina Índice actual de la página.
   */
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

  /**
   * Filtra la lista por el valor buscado.
   * @param busqueda Valor de la busqueda.
   */
  buscarPaquete(busqueda: string) {
    if (this.busqueda !== busqueda) {
      this.busqueda = busqueda;
      this.persistirFiltros();
    }

    if (busqueda) {
      this.paquetes = this.homebrewService.filtrarPorBusqueda(busqueda);
    } else {
      this.homebrewService.getAll();
    }

    this.reiniciarFiltrosLista(false);
    this.actualizarPagina(0);
  }

  /**
   * Método que recibe el evento de filtrar por licencia.
   * @param seleccionados Lista de licencias seleccionadas en el filtro.
   */
  filtrarPorLicenciaHandler(seleccionados: string[]) {
    this.licenciasSeleccionadas = seleccionados;

    this.homebrewService.getAll();
    this.reiniciarFiltrosLista(true);

    this.actualizarPagina(0);
  }

  /**
   * Filtra la lista por las licencias seleccionadas.
   */
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

  /**
   * Método que recibe el evento de filtrar por SO.
   * @param seleccionados Lista de SO seleccionados en el filtro.
   */
  filtrarPorSistemaOperativoHandler(seleccionados: string[]) {
    this.sistemasOperativosSeleccionados = seleccionados;

    this.homebrewService.getAll();
    this.reiniciarFiltrosLista(true);

    this.actualizarPagina(0);
  }

  /**
   * Filtra la lista por los SO seleccionados.
   */
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

  /**
   * Método que recibe el evento de filtrar por categorías.
   * @param seleccionados Lista de categorías seleccionadas.
   */
  filtrarPorCategoriasHandler(seleccionados: string[]) {
    this.categoriasSeleccionadas = seleccionados;

    this.homebrewService.getAll();
    this.reiniciarFiltrosLista(true);

    this.actualizarPagina(0);
  }

  /**
   * Filtra la lista por las categorías seleccionadas.
   */
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

  /**
   * Ordena los paquetes por cantidad de instalaciones (mayor a menor).
   */
  ordenarListado() {
    if(this.isOrdenarListado) {
      this.paquetes = this.homebrewService.ordenarListado(this.paquetes);

      this.persistirFiltros();
    } else {
      this.homebrewService.getAll();
      this.reiniciarFiltrosLista(true);
    }
    this.actualizarPagina(0);
  }

  /**
   * Reincia la lista de paquetes y los filtros que se tienen.
   */
  reiniciarFiltrosLista(restaurarLista: boolean) {
    this.persistirFiltros();

    if (restaurarLista && this.busqueda) {
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

  /**
   * Persiste los filtros marcados por el usuario.
   */
  persistirFiltros() {
    localStorage.setItem('filtros', JSON.stringify({
        busqueda: this.busqueda || "",
        licencias: this.licenciasSeleccionadas || [],
        os: this.sistemasOperativosSeleccionados || [],
        categorias: this.categoriasSeleccionadas || [],
        orden: this.isOrdenarListado
      })
    );
  }

  /**
   * Recupera los filtros marcados por el usuario.
   */
  recuperarFiltros() {
    const recuperado = localStorage.getItem('filtros');

    if (recuperado) {
      const filtros = JSON.parse(recuperado);
      this.busqueda = filtros.busqueda;
      this.licenciasSeleccionadas = filtros.licencias;
      this.sistemasOperativosSeleccionados = filtros.os;
      this.categoriasSeleccionadas = filtros.categorias;
      this.isOrdenarListado = filtros.orden;
    }
  }
}
