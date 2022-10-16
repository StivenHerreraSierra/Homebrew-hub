import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filtro-checkbox',
  templateUrl: './filtro-checkbox.component.html',
  styleUrls: ['./filtro-checkbox.component.css'],
})
export class FiltroCheckboxComponent {
  @Input() titulo = '';
  @Input() items: string[] = [];
  @Input() itemsSeleccionados: string[] = [];

  @Output() eventoFiltrar = new EventEmitter();

  filtrar() {
    this.eventoFiltrar.emit(this.itemsSeleccionados);
  }
}
