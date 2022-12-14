import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, ChartItem } from 'chart.js';
import { Paquete } from 'src/app/models/package.model';
import { HomebrewService } from 'src/app/services/homebrew.service';
import {
  BACKGROUND_COLOR,
  BORDER_COLOR,
  BORDER_WIDTH,
} from '../../../assets/constantes-chart';
import * as Highcharts from 'highcharts';
import network from 'highcharts/modules/networkgraph';
/**
 * Es el factory del módulo.
 * Agrega el módulo de grafos al Highchart importado.
 */
network(Highcharts);

/**
 * Componente que representa la vista de detalles de un paquete.
 */
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  //Enlace con elementos en el HTML.
  @ViewChild('chartMac') chartMacElement!: ElementRef;
  @ViewChild('chartLinux') chartLinuxElement!: ElementRef;

  //Paquete del que se va a mostrar los detalles.
  paquete: Paquete = {} as Paquete;

  //Instancias de los diagramas de barras.
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

  //Instancia de las redes de grafos.
  grafoDependencias = Highcharts;
  grafoDependenciasConf: any = {};

  grafoBuildDependencias = Highcharts;
  grafoBuildDependenciasConf: any = {};

  //Inyección de dependencias.
  constructor(
    private routerNavigate: Router,
    private route: ActivatedRoute,
    private homebrewService: HomebrewService
  ) {}

  /**
   * Método que se ejecuta cuando se carga el componente.
   * Obtiene el nombre del paquete y pide la información.
   */
  ngOnInit(): void {
    const nombrePaquete = this.route.snapshot.paramMap.get('pac');

    if (nombrePaquete) {
      this.homebrewService
        .getPaquete(nombrePaquete)
        .subscribe((data: Paquete) => {
          this.paquete = data;
          this.cargarChartMac();
          this.cargarChartLinux();
          this.grafoBuildDependenciasConf = this.cargarGrafo(
            'Dependencias de construcción',
            this.paquete.buildDependencies
          );
          this.grafoDependenciasConf = this.cargarGrafo(
            'Dependencias',
            this.paquete.dependencies
          );
        });
    }
  }

  /**
   * Carga los datos de la cantidad de instalaciones en Mac OS.
   */
  cargarChartMac() {
    const valoresMac = [
      Number(this.paquete['analytics-30']),
      Number(this.paquete['analytics-90']),
      Number(this.paquete['analytics-365']),
    ];

    const c = this.chartMacElement.nativeElement.getContext('2d');
    this.chartMac = this.iniciarChart(c, valoresMac);
  }

  /**
   * Carga los datos de la cantidad de instalaciones en Linux.
   */
  cargarChartLinux() {
    const valoresLinux = [
      Number(this.paquete['analytics-linux-30']),
      Number(this.paquete['analytics-linux-90']),
      Number(this.paquete['analytics-linux-365']),
    ];

    const c = this.chartLinuxElement.nativeElement.getContext('2d');
    this.chartLinux = this.iniciarChart(c, valoresLinux);
  }

  /**
   * Crea una instancia de Chart con los datos y configuración correspondiente.
   * @param ctx Contexto del elemento en el HTML.
   * @param data Valores de las barras del diagrama.
   * @returns Instancia Chart.
   */
  iniciarChart(ctx: ChartItem, data: number[]) {
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

  /**
   * Crea la configuración del grafo de las dependencias.
   * @param titulo Título del grafo.
   * @param lista Elementos del grafo.
   * @returns Configuración.
   */
  cargarGrafo(titulo: string, lista: string[]) {
    return {
      chart: {
        type: 'networkgraph',
        height: '70%',
      },
      title: {
        text: titulo,
      },
      plotOptions: {
        networkgraph: {
          keys: ['from', 'to'],
          layoutAlgorithm: {
            linkLength: 100,
          },
        },
        series: {
          cursor: 'pointer',
          events: {
            click: (evento: any) => this.irADetalles(evento.point.id),
          },
        },
      },
      series: [
        {
          marker: {
            radius: 50,
          },
          draggable: true,
          dataLabels: {
            enabled: true,
            linkFormat: '{point.fromNode.name} \u2192 {point.toNode.name}',
          },
          data: lista.map((d) => [d, this.paquete.fullName]),
          nodes: [
            {
              id: this.paquete.name,
              color: '#0000CC',
            },
          ],
        },
      ],
    };
  }

  /**
   * Navega hacia los detalles de una dependencia.
   *
   * Como los detalles se presentan en el mismo componente, la redirección se
   * ignora si no se navega primero a un componente diferente. Para solucionar
   * esto, se le debe dar a Router.routeReuseStrategy.shouldReuseRoute una
   * función que retorne false, además se debe definir en
   * Router.onSameUrlNavigation que el comportamiento sea recargar en la propiedad.
   *
   * Info obtenida de: https://angular.io/api/router/Router#onSameUrlNavigation
   * @param paquete Nombre de la dependencia.
   */
  irADetalles(paquete: string) {
    if (paquete != this.paquete.fullName) {
      this.routerNavigate.routeReuseStrategy.shouldReuseRoute = () => false;

      this.routerNavigate.onSameUrlNavigation = 'reload';
      this.routerNavigate.navigate(['detalles', paquete]);
    }
  }
}
