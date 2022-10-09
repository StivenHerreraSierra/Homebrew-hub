import { Component, Input, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  @Input() title: string = "";
  @Input() data: ChartData = {} as ChartData;

  constructor() { }

  ngOnInit(): void {
  }

}
