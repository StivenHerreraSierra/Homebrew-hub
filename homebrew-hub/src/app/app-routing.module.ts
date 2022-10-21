import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnaliticasComponent } from './views/analiticas/analiticas.component';
import { DetailsComponent } from './views/details/details.component';
import { HomeComponent } from './views/home/home.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "analiticas", component: AnaliticasComponent },
  { path: "detalles/:pac", component: DetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
