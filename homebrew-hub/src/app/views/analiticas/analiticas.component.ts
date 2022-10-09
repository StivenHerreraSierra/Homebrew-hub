import { Component, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-analiticas',
  templateUrl: './analiticas.component.html',
  styleUrls: ['./analiticas.component.css']
})
export class AnaliticasComponent implements OnInit {
  data: ChartData = {
    labels: ['30 días', '90 días', '365 días'],
    datasets: [{
      label: 'Total instalaciones',
      data: [11000000, 40000000, 100000000],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)'
      ],
      borderWidth: 1
    }]
  }

  constructor() { }

  ngOnInit(): void {
  }

}
