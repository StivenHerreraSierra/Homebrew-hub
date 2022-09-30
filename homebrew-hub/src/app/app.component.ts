import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Paquete } from './models/package.model';
import { HomebrewService } from './services/homebrew.service';

const ITEMS_PAGINA = 20;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'homebrew-hub';

  paquetesObservable = new Observable<Paquete[]>();
  paquetesCompletos: Paquete[] = [];
  paquetesPagina: Paquete[] = [];
  paquetesFiltrados: Paquete[] = [];

  indicePrimerItem = 0;
  indiceUltimoItem = 0;
  totalPaquetes = 0;
  private estaFiltrado = false;

  licenciasSeleccionadas: string[] = [];
  licencias = [
    '0BSD',
    'AFL',
    'AGPL',
    'AMPAS',
    'ANTLR-PD',
    'APSL',
    'Apache',
    'Artistic',
    'BSD',
    'BSL',
    'Beerware',
    'BlueOak',
    'CC',
    'CC0',
    'CDDL',
    'CECILL',
    'CECILL-B',
    'CECILL-C',
    'Cannot Represent',
    'ClArtistic',
    'DOC',
    'ECL',
    'EPL',
    'EUPL',
    'FSFUL',
    'FSFULLR',
    'FTL',
    'Fair',
    'FreeImage',
    'GCC',
    'GFDL',
    'GL2PS',
    'GPL',
    'HPND',
    'HPND-sell-variant',
    'ICU',
    'IJG',
    'ISC',
    'ImageMagick',
    'Imlib2',
    'Info-ZIP',
    'Intel-ACPI',
    'JSON',
    'JasPer',
    'LGPL',
    'MIT',
    'MIT-CMU',
    'MIT-Modern-Variant',
    'MIT-enna',
    'MIT-feh',
    'MIT-open-group',
    'MPL',
    'MirOS',
    'NCSA',
    'NGPL',
    'NLPL',
    'Net-SNMP',
    'NetCDF',
    'Noweb',
    'OFL',
    'OLDAP',
    'OML',
    'OpenSSL',
    'PHP',
    'PSF',
    'PostgreSQL',
    'Public Domain',
    'Python',
    'QPL',
    'Qhull',
    'RSA-MD',
    'Ruby',
    'SGI',
    'SGI-B',
    'SSH-OpenSSH',
    'Sleepycat',
    'TCL',
    'TU-Berlin',
    'UPL',
    'Unicode',
    'Unicode-TOU',
    'Unlicense',
    'VOSTROM',
    'Vim',
    'W3C',
    'WTFPL',
    'X11',
    'Xerox',
    'ZPL',
    'Zlib',
    'Blessing',
    'Bzip2',
    'Curl',
    'GSOAP',
    'Gnuplot',
    'Libpng',
    'Libtiff',
    'Mpich2',
    'Psutils',
    'WxWindows',
    'Zlib-acknowledgement',
  ];

  constructor(private homebrewService: HomebrewService) {}

  ngOnInit(): void {
    this.paquetesObservable = this.homebrewService.watch();

    this.paquetesObservable.subscribe({
      next: (data: Paquete[]) => {
        this.paquetesCompletos = data;
        this.actualizarPagina(0);
      },
      error(err) {
        console.error(err);
      },
    });

    this.homebrewService.getAll();
  }

  actualizarPagina(indicePagina: number) {
    if (this.estaFiltrado) {
      this.segmentarPaquetes(indicePagina, this.paquetesFiltrados);
    } else {
      this.segmentarPaquetes(indicePagina, this.paquetesCompletos);
    }
  }

  segmentarPaquetes(indicePagina: number, paquetes: Paquete[]) {
    this.totalPaquetes = paquetes.length;

    if (this.totalPaquetes == 0) {
      this.indicePrimerItem = -1;
      this.indiceUltimoItem = 0;
      this.paquetesPagina = [];
      return;
    }

    this.indicePrimerItem = indicePagina * ITEMS_PAGINA;
    this.indiceUltimoItem = this.indicePrimerItem + ITEMS_PAGINA;

    this.paquetesPagina = paquetes.slice(
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
      this.paquetesFiltrados = this.homebrewService.filtrarPorBusqueda(
        busqueda,
        this.paquetesCompletos
      );
      this.estaFiltrado = true;
    } else {
      this.paquetesFiltrados = [];
      this.estaFiltrado = false;
    }
    this.actualizarPagina(0);
  }
}
