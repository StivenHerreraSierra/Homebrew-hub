import { Component, Input, OnInit } from '@angular/core';
import { Analitica } from 'src/app/models/package.model';

const COLUMNAS = ["number", "formula", "count", "percent"];

@Component({
  selector: 'app-tabla-top',
  templateUrl: './tabla-top.component.html',
  styleUrls: ['./tabla-top.component.css']
})
export class TablaTopComponent implements OnInit {
  @Input() title: string = "";
  @Input() data: Analitica = {} as Analitica;

  columnas = COLUMNAS;

  constructor() { }

  ngOnInit(): void {
  }

}
