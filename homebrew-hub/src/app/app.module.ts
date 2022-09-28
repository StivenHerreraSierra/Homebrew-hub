import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Componentes
import { ListaComponent } from './components/lista/lista.component';

//Material
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ListaItemComponent } from './components/lista-item/lista-item.component';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [AppComponent, ListaComponent, ListaItemComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,

    //Material
    MatGridListModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatChipsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
