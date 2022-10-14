import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Paquete } from 'src/app/models/package.model';

@Component({
  selector: 'app-lista-item',
  templateUrl: './lista-item.component.html',
  styleUrls: ['./lista-item.component.css'],
})
export class ListaItemComponent implements OnInit {
  @Input() paquete!: Paquete;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  irADetalles() {
    this.router.navigate(['detalles', this.paquete.name]);
  }
}
