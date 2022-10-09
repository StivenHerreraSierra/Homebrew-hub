import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTopComponent } from './lista-top.component';

describe('ListaTopComponent', () => {
  let component: ListaTopComponent;
  let fixture: ComponentFixture<ListaTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaTopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
