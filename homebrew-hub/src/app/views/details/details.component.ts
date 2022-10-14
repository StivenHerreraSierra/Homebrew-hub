import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import { Paquete } from 'src/app/models/package.model';
import { HomebrewService } from 'src/app/services/homebrew.service';
import {
  BACKGROUND_COLOR,
  BORDER_COLOR,
  BORDER_WIDTH,
} from '../../../assets/constantes-chart';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  @ViewChild('chartMac') chartMacElement!: ElementRef;
  @ViewChild('chartLinux') chartLinuxElement!: ElementRef;

  paquete: Paquete = {} as Paquete;

  chartMac: Chart<'bar', number[], string> = {} as Chart<
    'bar',
    number[],
    string
  >;
  chartLinux: Chart<'bar', number[], string> = {} as Chart<
    'bar',
    number[],
    string
  >;

  constructor(
    private route: ActivatedRoute,
    private homebrewService: HomebrewService
  ) {}

  ngOnInit(): void {
    const nombrePaquete = this.route.snapshot.paramMap.get('pac');

    if (nombrePaquete) {
      this.homebrewService
        .getPaquete(nombrePaquete)
        .subscribe((data: Paquete) => {
          this.paquete = data;
          this.cargarChartMac();
          this.cargarChartLinux();
        });
    }
  }

  cargarChartMac() {
    const valoresMac = [
      Number(this.paquete['analytics-30']),
      Number(this.paquete['analytics-90']),
      Number(this.paquete['analytics-365']),
    ];

    var c = this.chartMacElement.nativeElement.getContext('2d');
    this.chartMac = this.iniciarChart(c, valoresMac);
  }

  cargarChartLinux() {
    const valoresLinux = [
      Number(this.paquete['analytics-linux-30']),
      Number(this.paquete['analytics-linux-90']),
      Number(this.paquete['analytics-linux-365']),
    ];

    var c = this.chartLinuxElement.nativeElement.getContext('2d');
    this.chartLinux = this.iniciarChart(c, valoresLinux);
  }

  iniciarChart(ctx: any, data: number[]) {
    return new Chart(ctx, {
      type: 'bar',
      options: {
        plugins: {
          legend: {
            display: true,
          },
        },
      },
      data: {
        labels: ['30 días', '90 días', '365 días'],
        datasets: [
          {
            label: 'Total instalaciones',
            data: data,
            backgroundColor: BACKGROUND_COLOR,
            borderColor: BORDER_COLOR,
            borderWidth: BORDER_WIDTH,
          },
        ],
      },
    });
  }
}
