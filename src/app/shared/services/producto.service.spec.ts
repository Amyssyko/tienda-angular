import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '@environments/environment';
import { Producto, ProductoForm } from '@interfaces/producto';
import { ToastrModule } from 'ngx-toastr';

import { ProductService } from './producto.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        ToastrModule.forRoot(),
      ],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe obtener productos con GET', () => {
    const producto = new Producto();
    producto.id = 'p1';
    const response: Producto[] = [producto];

    service.obtenerProductos().subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.endpoint}producto`);
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('debe actualizar producto con PUT', () => {
    const payload = new ProductoForm();
    payload.nombre = 'Mouse';
    const response = new Producto();
    response.id = 'p2';
    response.nombre = payload.nombre;
    response.stock = payload.stock;
    response.precio = payload.precio;
    response.proveedorId = payload.proveedorId;

    service.actualizarProducto('p2', payload).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.endpoint}producto/p2`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(response);
  });
});
