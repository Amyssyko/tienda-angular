import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Factura, FacturaForm } from '@interfaces/factura';
import { Toast } from '@services/toaster.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  url = environment.endpoint;
  endpoint = 'factura';
  enpointId = 'factura/';

  handleError: any;
  toast!: Toast;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
  ) {
    this.toast = new Toast(this.toastr);
  }

  obtenerFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.url}${this.endpoint}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toast.showError(error.error);

        return throwError('Algo salio mal');
      }),
    );
  }

  obtenerFactura(id: string): Observable<Factura> {
    return this.http.get<Factura>(`${this.url}${this.enpointId}${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toast.showError(error.error);

        return throwError('Algo salio mal');
      }),
    );
  }

  crearFactura(form: FacturaForm): Observable<Factura> {
    return this.http.post<Factura>(`${this.url}${this.endpoint}`, form).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error) {
          this.toast.showError(error.error);
        }

        return throwError(error.error);
      }),
    );
  }

  actualizarFactura(id: string, factura: FacturaForm): Observable<Factura> {
    return this.http
      .put<Factura>(`${this.url}${this.enpointId}${id}`, factura)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.toast.showError(error.error);
          return throwError('Algo salio mal');
        }),
      );
  }
  eliminarFactura(id: string): Observable<Factura> {
    return this.http.delete<Factura>(`${this.url}${this.enpointId}${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toast.showError(error.error);

        return throwError('Algo salio mal');
      }),
    );
  }
}
