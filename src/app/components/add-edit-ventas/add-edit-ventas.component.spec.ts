import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditVentasComponent } from './add-edit-ventas.component';

describe('AddEditVentasComponent', () => {
  let component: AddEditVentasComponent;
  let fixture: ComponentFixture<AddEditVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditVentasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
