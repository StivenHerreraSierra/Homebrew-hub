import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Paquete } from 'src/app/models/package.model';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {
  @Input() paquetes!: Paquete[];
  @Input() totalPaquetes: number = 0;

  @Output() eventoPaginador = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    console.log(this.paquetes.length)
  }

  cambiarPagina(evento: PageEvent) {
    this.eventoPaginador.emit(evento.pageIndex);
  }
}
