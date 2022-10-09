import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnaliticasComponent } from './analiticas.component';

describe('AnaliticasComponent', () => {
  let component: AnaliticasComponent;
  let fixture: ComponentFixture<AnaliticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnaliticasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnaliticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
