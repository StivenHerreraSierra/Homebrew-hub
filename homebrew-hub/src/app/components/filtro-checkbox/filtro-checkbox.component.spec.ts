import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroCheckboxComponent } from './filtro-checkbox.component';

describe('FiltroCheckboxComponent', () => {
  let component: FiltroCheckboxComponent;
  let fixture: ComponentFixture<FiltroCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltroCheckboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltroCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
