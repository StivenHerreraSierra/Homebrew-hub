import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

//Charts
import { NgChartsModule } from 'ng2-charts';

//Componentes
import { ListaComponent } from './components/lista/lista.component';
import { ListaItemComponent } from './components/lista-item/lista-item.component';
import { BuscadorComponent } from './components/buscador/buscador.component';

//Material
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FiltroCheckboxComponent } from './components/filtro-checkbox/filtro-checkbox.component';
import { HomeComponent } from './views/home/home.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { AnaliticasComponent } from './views/analiticas/analiticas.component';
import { ListaTopComponent } from './components/lista-top/lista-top.component';
import { ItemTopComponent } from './components/item-top/item-top.component';

@NgModule({
  declarations: [
    AppComponent,
    ListaComponent,
    ListaItemComponent,
    BuscadorComponent,
    FiltroCheckboxComponent,
    HomeComponent,
    ToolbarComponent,
    AnaliticasComponent,
    ListaTopComponent,
    ItemTopComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,

    //Charts
    NgChartsModule,

    //Material
    MatGridListModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatChipsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
