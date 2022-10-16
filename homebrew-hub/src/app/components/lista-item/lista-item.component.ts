import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Paquete } from 'src/app/models/package.model';

@Component({
  selector: 'app-lista-item',
  templateUrl: './lista-item.component.html',
  styleUrls: ['./lista-item.component.css'],
})
export class ListaItemComponent {
  @Input() paquete!: Paquete;

  constructor(private router: Router) {}

  irADetalles() {
    this.router.navigate(['detalles', this.paquete.name]);
  }
}
