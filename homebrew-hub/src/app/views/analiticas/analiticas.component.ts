import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartItem } from 'chart.js';
import { Analitica } from 'src/app/models/package.model';
import { HomebrewService } from 'src/app/services/homebrew.service';
import { BACKGROUND_COLOR, BORDER_COLOR, BORDER_WIDTH } from '../../../assets/constantes-chart';

@Component({
  selector: 'app-analiticas',
  templateUrl: './analiticas.component.html',
  styleUrls: ['./analiticas.component.css'],
})
export class AnaliticasComponent implements OnInit {
  @ViewChild('chartMac') chartMacElement!: ElementRef;
  @ViewChild('chartLinux') chartLinuxElement!: ElementRef;

  data30dMac: Analitica = {} as Analitica;
  data90dMac: Analitica = {} as Analitica;
  data365dMac: Analitica = {} as Analitica;
  data30dLinux: Analitica = {} as Analitica;
  data90dLinux: Analitica = {} as Analitica;
  data365dLinux: Analitica = {} as Analitica;
  macTotales: number[] = [];
  linuxTotales: number[] = [];
  chartMac: Chart<"bar", number[], string> = {} as Chart<"bar", number[], string>;
  chartLinux: Chart<"bar", number[], string> = {} as Chart<"bar", number[], string>;

  constructor(private homebrewService: HomebrewService) {}

  ngOnInit(): void {
    this.cargarAnaliticasMac();
    this.cargarAnaliticasLinux();
  }

  cargarAnaliticasMac() {
    this.homebrewService
      .getMacOsAnaliticas(30)
      .subscribe({
        next: (data) => (this.data30dMac = data),
        complete: () => {
          this.homebrewService
            .getMacOsAnaliticas(90)
            .subscribe({
              next: (data) => (this.data90dMac = data),
              complete: () => {
                this.homebrewService
                .getMacOsAnaliticas(365)
                .subscribe({
                  next: (data) => (this.data365dMac = data),
                  complete: () => {
                    this.macTotales = [
                      this.data30dMac.total_count,
                      this.data90dMac.total_count,
                      this.data365dMac.total_count
                    ];

                    this.iniciarChartMac();
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

  cargarAnaliticasLinux() {
    this.homebrewService
      .getLinuxAnaliticas(30)
      .subscribe({
        next: (data) => (this.data30dLinux = data),
        complete: () => {
          this.homebrewService
            .getLinuxAnaliticas(90)
            .subscribe({
              next: (data) => (this.data90dLinux = data),
              complete: () => {
                this.homebrewService
                .getLinuxAnaliticas(365)
                .subscribe({
                  next: (data) => (this.data365dLinux = data),
                  complete: () => {
                    this.linuxTotales = [
                      this.data30dLinux.total_count,
                      this.data90dLinux.total_count,
                      this.data365dLinux.total_count
                    ];

                    this.iniciarChartLinux();
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

  iniciarChartMac() {
    const c = this.chartMacElement.nativeElement.getContext('2d');
    this.chartMac = this.iniciarChart(c, this.macTotales);
  }

  iniciarChartLinux() {
    const c = this.chartLinuxElement.nativeElement.getContext('2d');
    this.chartLinux = this.iniciarChart(c, this.linuxTotales);
  }

  iniciarChart(ctx: ChartItem, data: number[]) {
    return new Chart(
      ctx,
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
              data: data,
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
