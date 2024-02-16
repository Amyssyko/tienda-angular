import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, throwError } from 'rxjs';
import { Factura, FacturaForm } from 'src/app/interfaces/factura';
import { Toast } from 'src/app/services/toaster.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  url = environment.endpoint;
  endpoint = 'factura';
  enpointId = 'factura/';

  handleError: any;
  toast!: Toast;

  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.toast = new Toast(this.toastr);
  }

  obtenerFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.url}${this.endpoint}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toast.showError(error.error);

        return throwError('Algo salio mal');
      })
    );
  }

  obtenerFactura(id: string): Observable<Factura> {
    return this.http.get<Factura>(`${this.url}${this.enpointId}${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toast.showError(error.error);

        return throwError('Algo salio mal');
      })
    );
  }

  crearFactura(form: FacturaForm): Observable<Factura> {
    return this.http.post<Factura>(`${this.url}${this.endpoint}`, form).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error) {
          this.toast.showError(error.error);
        }

        return throwError(error.error);
      })
    );
  }

  actualizarFactura(id: string, factura: FacturaForm): Observable<Factura> {
    return this.http
      .put<Factura>(`${this.url}${this.enpointId}${id}`, factura)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.toast.showError(error.error);
          return throwError('Algo salio mal');
        })
      );
  }
  eliminarFactura(id: string): Observable<Factura> {
    return this.http.delete<Factura>(`${this.url}${this.enpointId}${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toast.showError(error.error);

        return throwError('Algo salio mal');
      })
    );
  }
}
