import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent {
  busqueda = "";

  @Output() eventoBuscar = new EventEmitter();

  buscar() {
    this.eventoBuscar.emit(this.busqueda);
  }
}
