import { Component, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Analitica, ChartBarData } from 'src/app/models/package.model';
import { HomebrewService } from 'src/app/services/homebrew.service';

const BACKGROUND_COLOR = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
];

const BORDER_COLOR = [
  'rgb(255, 99, 132)',
  'rgb(75, 192, 192)',
  'rgb(153, 102, 255)',
]

const BORDER_WIDTH = 1;

@Component({
  selector: 'app-analiticas',
  templateUrl: './analiticas.component.html',
  styleUrls: ['./analiticas.component.css'],
})
export class AnaliticasComponent implements OnInit {
  @ViewChild('canvas') canvas!: BaseChartDirective;

  data30d: Analitica = {} as Analitica;
  data90d: Analitica = {} as Analitica;
  data365d: Analitica = {} as Analitica;
  totales: number[] = [];
  chart: any = [];

  data = {
    labels: ["1", "2", "3"],
    datasets: [{
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
      ],
      borderWidth: 1,
      data: this.totales,
      label: "Total",
    }]
  } as ChartBarData;

  constructor(private homebrewService: HomebrewService) {}

  ngOnInit(): void {
    this.homebrewService
      .getAnaliticas(30)
      .subscribe({
        next: (data) => (this.data30d = data),
        complete: () => {
          this.homebrewService
            .getAnaliticas(90)
            .subscribe({
              next: (data) => (this.data90d = data),
              complete: () => {
                this.homebrewService
                .getAnaliticas(365)
                .subscribe({
                  next: (data) => (this.data365d = data),
                  complete: () => {
                    this.totales = [
                      this.data30d.total_count,
                      this.data90d.total_count,
                      this.data365d.total_count
                    ];

                    this.iniciarChart();
                  },
                  error: (err) => console.error(err),
                });
              },
              error: (err) => console.error(err),
            });
        },
        error: (err) => console.error(err),
      });
  }

  iniciarChart() {
    this.chart = new Chart(
      'chart',
      {
        'type': 'bar',
        options: {
          plugins: {
            legend: {
              display: true
            }
          }
        },
        data: {
          labels: ["30 días", "90 días", "365 días"],
          datasets: [
            {
              label: "Total instalaciones",
              data: this.totales,
              backgroundColor: BACKGROUND_COLOR,
              borderColor: BORDER_COLOR,
              borderWidth: BORDER_WIDTH,
            }
          ],
        },
      }
    );
  }
}
