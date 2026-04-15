import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '@environments/environment';
import { Proveedor } from '@interfaces/proveedor';
import { ToastrModule } from 'ngx-toastr';

import { ProveedorService } from './proveedor.service';

describe('ProveedorService', () => {
  let service: ProveedorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        ToastrModule.forRoot(),
      ],
    });
    service = TestBed.inject(ProveedorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe obtener proveedores con GET', () => {
    const proveedor = new Proveedor();
    proveedor.id = 'pr1';
    const response: Proveedor[] = [proveedor];

    service.obtenerProveedores().subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.endpoint}proveedor`);
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('debe eliminar proveedor con DELETE', () => {
    service.eliminarProveedor('pr1').subscribe((data) => {
      expect(data).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.endpoint}proveedor/pr1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
