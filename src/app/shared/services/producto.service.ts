import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, throwError } from 'rxjs';
import { Producto, ProductoForm } from 'src/app/interfaces/producto.d';
import { Proveedor } from 'src/app/interfaces/proveedor.d';
import { Toast } from 'src/app/services/toaster.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  url = environment.endpoint;
  proveedor = 'proveedor-producto/cc379332-8f67-4261-8801-81e6fa949c71';
  endpoint = 'producto';
  endpoint_proveedor = 'proveedor';
  enpointId = 'producto/';

  handleError: any;
  toast!: Toast;

  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.toast = new Toast(this.toastr);
  }

  obtenerProveedores(): Observable<Proveedor[]> {
    return this.http
      .get<Proveedor[]>(`${this.url}${this.endpoint_proveedor}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Aquí puedes manejar el error como desees, por ejemplo, mostrando un mensaje al usuario
          this.toast.showError(error.error.error);
          return throwError('Algo salio mal');
        })
      );
  }

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.url}${this.endpoint}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.toast.showError(error.error);
        }
        return throwError('Algo salio mal');
      })
    );
  }

  obtenerProducto(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}${this.enpointId}${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.toast.showError(error.error);
        }
        return throwError('Algo salio mal');
      })
    );
  }

  crearProducto(stateProducto: ProductoForm): Observable<Producto> {
    return this.http
      .post<Producto>(`${this.url}${this.endpoint}`, stateProducto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Aquí puedes manejar el error como desees, por ejemplo, mostrando un mensaje al usuario
          this.toast.showError(error.error.error);
          return throwError('Algo salio mal');
        })
      );
  }

  actualizarProducto(id: string, producto: ProductoForm): Observable<Producto> {
    return this.http
      .put<Producto>(`${this.url}${this.enpointId}${id}`, producto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Aquí puedes manejar el error como desees, por ejemplo, mostrando un mensaje al usuario
          this.toast.showError(error.error.error);
          return throwError('Algo salio mal');
        })
      );
  }
  eliminarProducto(id: string): Observable<Producto> {
    return this.http.delete<Producto>(`${this.url}${this.enpointId}${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.toast.showError(error.error);
        }
        return throwError('Algo salio mal');
      })
    );
  }
}
