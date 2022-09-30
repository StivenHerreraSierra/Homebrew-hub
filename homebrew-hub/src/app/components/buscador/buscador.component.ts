import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {
  busqueda: string = "";

  constructor() { }

  ngOnInit(): void {
  }

  buscar() {
    console.log("Búsqueda: " + this.busqueda);
  }
}
