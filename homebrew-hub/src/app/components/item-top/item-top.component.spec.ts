import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTopComponent } from './item-top.component';

describe('ItemTopComponent', () => {
  let component: ItemTopComponent;
  let fixture: ComponentFixture<ItemTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemTopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
