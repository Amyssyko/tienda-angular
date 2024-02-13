import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditListaVentasComponent } from './add-edit-lista-ventas.component';

describe('AddEditListaVentasComponent', () => {
  let component: AddEditListaVentasComponent;
  let fixture: ComponentFixture<AddEditListaVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditListaVentasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditListaVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
