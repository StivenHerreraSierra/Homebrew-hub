import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Paquete } from './models/package.model';
import { HomebrewService } from './services/homebrew.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'homebrew-hub';

  paquetesObservable = new Observable<Paquete[]>();

  constructor(private homebrewService: HomebrewService) {}

  ngOnInit(): void {
    this.paquetesObservable = this.homebrewService.watch();

    this.paquetesObservable.subscribe();

    this.homebrewService.getAll();
  }
}
