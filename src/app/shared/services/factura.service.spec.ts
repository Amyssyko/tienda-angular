import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '@environments/environment';
import { Factura, FacturaForm } from '@interfaces/factura';
import { ToastrModule } from 'ngx-toastr';

import { FacturaService } from './factura.service';

describe('FacturaService', () => {
  let service: FacturaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        ToastrModule.forRoot(),
      ],
    });
    service = TestBed.inject(FacturaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe obtener facturas con GET', () => {
    const factura = new Factura();
    factura.id = 'f1';
    const response: Factura[] = [factura];

    service.obtenerFacturas().subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.endpoint}factura`);
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('debe crear factura con POST', () => {
    const payload = new FacturaForm();
    payload.usuarioId = 'u1';
    const response = new Factura();
    response.id = 'f2';
    response.usuarioId = payload.usuarioId;
    response.fecha_venta = payload.fecha_venta;
    response.precio_final = payload.precio_final;
    response.DetalleFactura = payload.DetalleFactura;

    service.crearFactura(payload).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.endpoint}factura`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(response);
  });
});
