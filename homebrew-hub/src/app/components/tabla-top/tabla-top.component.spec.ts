import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaTopComponent } from './tabla-top.component';

describe('ListaTopComponent', () => {
  let component: TablaTopComponent;
  let fixture: ComponentFixture<TablaTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaTopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
