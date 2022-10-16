import { Component, Input } from '@angular/core';
import { Analitica } from 'src/app/models/package.model';

const COLUMNAS = ["number", "formula", "count", "percent"];

@Component({
  selector: 'app-tabla-top',
  templateUrl: './tabla-top.component.html',
  styleUrls: ['./tabla-top.component.css']
})
export class TablaTopComponent {
  @Input() title = "";
  @Input() data: Analitica = {} as Analitica;

  columnas = COLUMNAS;
}
