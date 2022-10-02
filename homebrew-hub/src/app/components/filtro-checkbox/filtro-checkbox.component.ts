import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatListOption, MatSelectionListChange } from '@angular/material/list';

export interface CuerpoEventoFiltrar {
  opcion: MatListOption,
  seleccionados: string[]
}

@Component({
  selector: 'app-filtro-checkbox',
  templateUrl: './filtro-checkbox.component.html',
  styleUrls: ['./filtro-checkbox.component.css']
})
export class FiltroCheckboxComponent implements OnInit {
  @Input() titulo: string = "";
  @Input() items: string[] = [];
  @Input() itemsSeleccionados: string[] = [];

  @Output() eventoFiltrar = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  filtrar(evento: MatSelectionListChange) {
    const opcion = evento.options[0];

    this.eventoFiltrar.emit({
      opcion: opcion,
      seleccionados: this.itemsSeleccionados
    });
  }
}
