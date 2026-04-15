import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Factura } from '@interfaces/factura';
import { Usuario } from '@interfaces/usuario';
import { of, throwError } from 'rxjs';

import { FacturaService } from '@shared/services/factura.service';
import { UsuarioService } from '@shared/services/usuario.service';

import { FormularioFacturaComponent } from './formulario-factura.component';

describe('FormularioFacturaComponent', () => {
  let component: FormularioFacturaComponent;
  let fixture: ComponentFixture<FormularioFacturaComponent>;
  let facturaService: { crearFactura: ReturnType<typeof vi.fn> };
  let usuarioService: { obtenerUsuarios: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    facturaService = {
      crearFactura: vi.fn(),
    };
    usuarioService = {
      obtenerUsuarios: vi.fn(),
    };

    facturaService.crearFactura.mockReturnValue(of(new Factura()));
    usuarioService.obtenerUsuarios.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [FormularioFacturaComponent],
      providers: [
        { provide: FacturaService, useValue: facturaService },
        { provide: UsuarioService, useValue: usuarioService },
      ],
    })
      .overrideComponent(FormularioFacturaComponent, {
        set: { template: '<div></div>' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(FormularioFacturaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debe obtener usuarios en ngOnInit', () => {
    const usuario = new Usuario();
    usuario.id = 'u1';
    usuario.nombre = 'Ana';
    usuario.apellido = 'Luz';
    const usuariosMock: Usuario[] = [usuario];
    usuarioService.obtenerUsuarios.mockReturnValue(of(usuariosMock));

    fixture.detectChanges();

    expect(usuarioService.obtenerUsuarios).toHaveBeenCalled();
    expect(component.usuarios).toEqual(usuariosMock);
  });

  it('debe agregar un detalle de factura con valores por defecto', () => {
    expect(component.nuevaFactura.DetalleFactura.length).toBe(0);

    component.agregarDetalleFactura();

    expect(component.nuevaFactura.DetalleFactura.length).toBe(1);
    expect(component.nuevaFactura.DetalleFactura[0]).toEqual({
      cantidad_venta: 0,
      precio_venta: 0,
      descuento_venta: 0,
      productoId: '',
    });
  });

  it('debe guardar factura y reiniciar formulario en éxito', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    component.nuevaFactura.usuarioId = 'u1';

    component.guardarFactura();

    expect(facturaService.crearFactura).toHaveBeenCalledWith(
      expect.objectContaining({ usuarioId: 'u1' }),
    );
    expect(alertSpy).toHaveBeenCalledWith('Factura guardada correctamente');
    expect(component.nuevaFactura.usuarioId).toBe('');
    alertSpy.mockRestore();
  });

  it('debe mostrar alerta de error cuando falla guardarFactura', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    facturaService.crearFactura.mockReturnValue(
      throwError(() => ({ message: 'falló' })),
    );

    component.guardarFactura();

    expect(alertSpy).toHaveBeenCalledWith('Error al guardar la factura: falló');
    alertSpy.mockRestore();
  });
});
