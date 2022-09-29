import { Component, Input, OnInit } from '@angular/core';
import { Paquete } from 'src/app/models/package.model';

@Component({
  selector: 'app-lista-item',
  templateUrl: './lista-item.component.html',
  styleUrls: ['./lista-item.component.css']
})
export class ListaItemComponent implements OnInit {
  @Input() paquete!: Paquete;

  constructor() { }

  ngOnInit(): void {
  }

}
