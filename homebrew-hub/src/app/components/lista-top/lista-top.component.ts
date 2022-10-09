import { Component, Input, OnInit } from '@angular/core';
import { Analitica } from 'src/app/models/package.model';

@Component({
  selector: 'app-lista-top',
  templateUrl: './lista-top.component.html',
  styleUrls: ['./lista-top.component.css']
})
export class ListaTopComponent implements OnInit {
  @Input() title: string = "";
  @Input() data: Analitica = {} as Analitica;

  constructor() { }

  ngOnInit(): void {
  }

}
