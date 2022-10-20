import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Componente que muestra las opciones de filtrado.
 */
@Component({
  selector: 'app-filtro-checkbox',
  templateUrl: './filtro-checkbox.component.html',
  styleUrls: ['./filtro-checkbox.component.css'],
})
export class FiltroCheckboxComponent {
  //Propiedades que llegan desde el padre.
  @Input() titulo = ''; //Título del filtro.
  @Input() items: string[] = []; //Valores del filtro.
  @Input() itemsSeleccionados: string[] = []; //Valores seleccionados.

  //Evento que se lanza al padre.
  @Output() eventoFiltrar = new EventEmitter();

  //Evento que se activa cada vez que se selecciona una opción.
  filtrar() {
    this.eventoFiltrar.emit(this.itemsSeleccionados);
  }
}
