import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Paquete } from 'src/app/models/package.model';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
})
export class ListaComponent {
  @Input() paquetes!: Paquete[];
  @Input() totalPaquetes = 0;

  @Output() eventoPaginador = new EventEmitter();

  cambiarPagina(evento: PageEvent) {
    this.eventoPaginador.emit(evento.pageIndex);
  }
}
