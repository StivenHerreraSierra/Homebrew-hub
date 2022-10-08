import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-filtro-checkbox',
  templateUrl: './filtro-checkbox.component.html',
  styleUrls: ['./filtro-checkbox.component.css'],
})
export class FiltroCheckboxComponent implements OnInit {
  @Input() titulo: string = '';
  @Input() items: string[] = [];
  @Input() itemsSeleccionados: string[] = [];

  @Output() eventoFiltrar = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  filtrar() {
    this.eventoFiltrar.emit(this.itemsSeleccionados);
  }
}
