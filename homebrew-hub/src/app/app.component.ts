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

    if (this.licenciasSeleccionadas.length === 0 || !opcion.selecciono) {
      this.homebrewService.getAll();
      this.reiniciarFiltrosLista();
    } else {
      this.agregarFiltroPorLicencia(opcion.valor);
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
      this.homebrewService.getAll();
      this.reiniciarFiltrosLista();
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

  get categoriasFiltro(): string[] {
    return [...this.categorias.keys()];
  }

  filtrarPorCategoriasHandler(cuerpo: CuerpoEventoFiltrar) {
    const { opcion, seleccionados } = cuerpo;

    this.categoriasSeleccionadas = seleccionados;

    if (this.categoriasSeleccionadas.length === 0 || !opcion.selecciono) {
      this.homebrewService.getAll();
      this.reiniciarFiltrosLista();
    } else {
      this.agregarFiltroPorCategoria(this.categorias.get(opcion.valor)!);
    }

    this.actualizarPagina(0);
  }

  agregarFiltroPorCategoria(valor: string) {
    if (this.categoriasSeleccionadas.length === 1) {
      this.copiaPaquetes = this.paquetes;
      this.paquetes = this.filtrarPorCategoria(valor, []);
    } else {
      this.paquetes = this.filtrarPorCategoria(valor, this.paquetes);
    }
  }

  filtrarPorCategoria(categoria: string, paquetesActual: Paquete[]): Paquete[] {
    return this.homebrewService.filtrarPorCategoria(
      categoria,
      this.copiaPaquetes,
      paquetesActual
    );
  }

  reiniciarFiltrosLista() {
    if (this.busqueda) {
      this.buscarPaquete(this.busqueda);
    }

    if (this.licenciasSeleccionadas.length > 0) {
      this.licenciasSeleccionadas.forEach((l) =>
        this.agregarFiltroPorLicencia(l)
      );
    }

    if (this.sistemasOperativosSeleccionados.length > 0) {
      this.sistemasOperativosSeleccionados.forEach((os) =>
        this.agregarFiltroPorSistemaOperativo(os)
      );
    }

    if (this.categoriasSeleccionadas.length > 0) {
      this.categoriasSeleccionadas.forEach((c) =>
        this.agregarFiltroPorCategoria(this.categorias.get(c)!)
      );
    }
  }
}
