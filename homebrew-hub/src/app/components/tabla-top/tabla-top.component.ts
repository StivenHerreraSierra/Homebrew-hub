import { Component, Input } from '@angular/core';
import { Analitica } from 'src/app/models/package.model';

/**
 * Componente tabla que contiene la información de las analíticas.
 * Las columnas las extrae de data.items.
 */

//Nombre de los campos de 'data' que se muestran en la tabla.
const COLUMNAS = ["number", "formula", "count", "percent"];

@Component({
  selector: 'app-tabla-top',
  templateUrl: './tabla-top.component.html',
  styleUrls: ['./tabla-top.component.css']
})
export class TablaTopComponent {
  //Propiedades que llegan desde el padre.
  @Input() title = ""; //Título de la tabla.
  @Input() data: Analitica = {} as Analitica; //Datos de la analítica.

  //Propiedad para el binding con el HTML
  columnas = COLUMNAS;
}
