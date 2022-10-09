import { Component, Input, OnInit } from '@angular/core';
import { PaquetesAnalitica } from 'src/app/models/package.model';

@Component({
  selector: 'app-item-top',
  templateUrl: './item-top.component.html',
  styleUrls: ['./item-top.component.css']
})
export class ItemTopComponent implements OnInit {
  @Input() item: PaquetesAnalitica = {} as PaquetesAnalitica;

  constructor() { }

  ngOnInit(): void {
  }

}
