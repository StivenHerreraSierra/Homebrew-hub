import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Paquete } from 'src/app/models/package.model';

/**
 * Componente que muestra la información de un paquete de la lista.
 */
@Component({
  selector: 'app-lista-item',
  templateUrl: './lista-item.component.html',
  styleUrls: ['./lista-item.component.css'],
})
export class ListaItemComponent {
  //Propiedad que llega desde el padre.
  @Input() paquete!: Paquete; //Paquete que se va a mostrar.

  //Inyección de dependencias.
  constructor(private router: Router) {}

  /**
   * Evento que se activa al seleccionar el componente.
   * Navega hacia /detalles/{nombre del paquete}
   */
  irADetalles() {
    this.router.navigate(['detalles', this.paquete.name]);
  }
}
