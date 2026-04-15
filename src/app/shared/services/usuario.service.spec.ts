import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '@environments/environment';
import { Usuario } from '@interfaces/usuario';
import { ToastrModule } from 'ngx-toastr';

import { UsuarioService } from './usuario.service';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        ToastrModule.forRoot(),
      ],
    });
    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe obtener usuarios con GET', () => {
    const usuario = new Usuario();
    usuario.id = 'u1';
    const response: Usuario[] = [usuario];

    service.obtenerUsuarios().subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.endpoint}usuario`);
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('debe obtener usuario por id con GET', () => {
    const response = new Usuario();
    response.id = 'u1';

    service.obtenerUsuario('u1').subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.endpoint}usuario/u1`);
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });
});
