import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Paquete } from 'src/app/models/package.model';

/**
 * Componente que contiene la lista de paquetes disponibles.
 */
@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
})
export class ListaComponent {
  //Propiedades que llegan desde el padre.
  @Input() paquetes!: Paquete[]; //Lista de paquetes a desplegar.
  @Input() totalPaquetes = 0; //Total de paquetes.

  //Evento que se lanza al padre.
  @Output() eventoPaginador = new EventEmitter();

  //Evento que se activa cuando hay un cambio de página.
  cambiarPagina(evento: PageEvent) {
    this.eventoPaginador.emit(evento.pageIndex);
  }
}
