import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVentas1Component } from './list-ventas1.component';

describe('ListVentas1Component', () => {
  let component: ListVentas1Component;
  let fixture: ComponentFixture<ListVentas1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListVentas1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListVentas1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
