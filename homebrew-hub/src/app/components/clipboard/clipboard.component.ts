import { Component, Input } from '@angular/core';

/**
 * Campo para copiar texto al portapapeles.
 */
@Component({
  selector: 'app-clipboard',
  templateUrl: './clipboard.component.html',
  styleUrls: ['./clipboard.component.css'],
})
export class ClipboardComponent {
  //Propiedad para el binding con el HTML.
  @Input() texto = '';
}
