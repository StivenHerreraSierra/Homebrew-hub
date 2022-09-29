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

  indicePrimerItem = 0;
  indiceUltimoItem = 0;

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
    this.indicePrimerItem = indicePagina * ITEMS_PAGINA;
    this.indiceUltimoItem = this.indicePrimerItem + ITEMS_PAGINA;

    this.paquetesPagina = this.paquetesCompletos.slice(
      this.indicePrimerItem,
      this.indiceUltimoItem
    );
  }
}
