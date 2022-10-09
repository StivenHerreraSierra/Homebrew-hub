import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnaliticasComponent } from './views/analiticas/analiticas.component';
import { HomeComponent } from './views/home/home.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "analiticas", component: AnaliticasComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
