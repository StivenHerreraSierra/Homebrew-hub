import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Componente toolbar o barra superior.
 */

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  constructor(private routerNavigate: Router) {}
  /**
   * Navega hacia el home (recarga).
   *
   * Como la recarga se hace hacia el mismo componente, la redirección se
   * ignora si no se navega primero a un componente diferente. Para solucionar
   * esto, se le debe dar a Router.routeReuseStrategy.shouldReuseRoute una
   * función que retorne false, además se debe definir en
   * Router.onSameUrlNavigation que el comportamiento sea recargar en la propiedad.
   *
   * Info obtenida de: https://angular.io/api/router/Router#onSameUrlNavigation
   */
   recargar() {
    this.routerNavigate.routeReuseStrategy.shouldReuseRoute = () => false;

    this.routerNavigate.onSameUrlNavigation = 'reload';
    this.routerNavigate.navigate(['']);
  }
}
