import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {
  busqueda: string = "";

  @Output() eventoBuscar = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  buscar() {
    this.eventoBuscar.emit(this.busqueda);
  }
}
