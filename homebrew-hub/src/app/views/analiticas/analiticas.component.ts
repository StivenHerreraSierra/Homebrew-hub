import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartItem } from 'chart.js';
import { Analitica } from 'src/app/models/package.model';
import { HomebrewService } from 'src/app/services/homebrew.service';
import { BACKGROUND_COLOR, BORDER_COLOR, BORDER_WIDTH } from '../../../assets/constantes-chart';

/**
 * Componente que representa la vista de las analíticas.
 */
@Component({
  selector: 'app-analiticas',
  templateUrl: './analiticas.component.html',
  styleUrls: ['./analiticas.component.css'],
})
export class AnaliticasComponent implements OnInit {
  //Enlace con elementos en el HTML.
  @ViewChild('chartMac') chartMacElement!: ElementRef;
  @ViewChild('chartLinux') chartLinuxElement!: ElementRef;

  //Analíticas que se muestran.
  data30dMac: Analitica = {} as Analitica; //Captura las analíticas de 30 días de Mac OS.
  data90dMac: Analitica = {} as Analitica; //Captura las analíticas de 90 días de Mac OS.
  data365dMac: Analitica = {} as Analitica; //Captura las analíticas de 365 días de Mac OS.
  data30dLinux: Analitica = {} as Analitica; //Captura las analíticas de 30 días de Linux.
  data90dLinux: Analitica = {} as Analitica; //Captura las analíticas de 90 días de Linux.
  data365dLinux: Analitica = {} as Analitica; //Captura las analíticas de 365 días de Linux.
  macTotales: number[] = []; //Cantidad de instalaciones en Mac OS en 30, 90 y 365 días.
  linuxTotales: number[] = []; //Cantidad de instalaciones en Linux OS en 30, 90 y 365 días.

  //Instancias de los diagramas de barras.
  chartMac: Chart<"bar", number[], string> = {} as Chart<"bar", number[], string>;
  chartLinux: Chart<"bar", number[], string> = {} as Chart<"bar", number[], string>;

  //Inyección de dependencias.
  constructor(private homebrewService: HomebrewService) {}

  /**
   * Método que se ejecuta apenas se carga el componente.
   * Hace la petición para obtener las analíticas y cargarlas en las pestañas.
   */
  ngOnInit(): void {
    this.cargarAnaliticasMac();
    this.cargarAnaliticasLinux();
  }

  /**
   * Carga los datos necesarios para la pestaña de Mac OS.
   */
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

  /**
   * Carga los datos necesarios para la pestaña de Linux.
   */
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

  /**
   * Enlaza el diagrama de Mac OS en el HTML con la instancia Chart.
   */
  iniciarChartMac() {
    const c = this.chartMacElement.nativeElement.getContext('2d');
    this.chartMac = this.iniciarChart(c, this.macTotales);
  }

  /**
   * Enlaza el diagrama de Linux en el HTML con la instancia Chart.
   */
  iniciarChartLinux() {
    const c = this.chartLinuxElement.nativeElement.getContext('2d');
    this.chartLinux = this.iniciarChart(c, this.linuxTotales);
  }

  /**
   * Crea una instancia de Chart con los datos y la configuración correspondiente.
   * @param ctx Contexto del elemento en el HTML.
   * @param data Valores de las barras del diagrama.
   * @returns Instancia Chart.
   */
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
