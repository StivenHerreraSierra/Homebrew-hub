import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';

/**
 * Buscador de paquetes.
 */
@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {
  

  //Propiedad para el binding con el HTML.
  busqueda = "";

  //Evento que se emite al padre.
  @Output() eventoBuscar = new EventEmitter();
  @Input() texto = "";

  ngOnInit(): void {
    this.busqueda = this.texto;
  }

  /**
   * Lanza el evento al padre cuando se presiona ENTER.
   * Pasa el valor de la variable 'busqueda'.
   */
  buscar() {
    this.busqueda = this.busqueda.trim();
    this.busqueda = this.busqueda.replace(/\s\s+/g, " ");
    this.eventoBuscar.emit(this.busqueda);
  }
}
