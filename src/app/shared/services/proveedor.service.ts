import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, throwError } from 'rxjs';
import { Proveedor, ProveedorForm } from 'src/app/interfaces/proveedor';
import { Toast } from 'src/app/services/toaster.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  url = environment.endpoint;
  endpoint = 'proveedor';
  enpointId = 'proveedor/';

  handleError: any;
  toast!: Toast;

  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.toast = new Toast(this.toastr);
  }

  obtenerProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.url}${this.endpoint}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toast.showError(error.error);

        return throwError('Algo salio mal');
      })
    );
  }

  obtenerProveedor(id: string): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.url}${this.enpointId}${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toast.showError(error.error);

        return throwError('Algo salio mal');
      })
    );
  }

  crearProveedor(stateproveedor: ProveedorForm): Observable<Proveedor> {
    return this.http
      .post<Proveedor>(`${this.url}${this.endpoint}`, stateproveedor)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error) {
            this.toast.showError(error.error);
          }

          return throwError(error.error);
        })
      );
  }

  actualizarProveedor(
    id: string,
    proveedor: ProveedorForm
  ): Observable<Proveedor> {
    return this.http
      .put<Proveedor>(`${this.url}${this.enpointId}${id}`, proveedor)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.toast.showError(error.error);
          return throwError('Algo salio mal');
        })
      );
  }
  eliminarProveedor(id: string): Observable<Proveedor> {
    return this.http
      .delete<Proveedor>(`${this.url}${this.enpointId}${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.toast.showError(error.error);
          return throwError('Algo salio mal');
        })
      );
  }
}
