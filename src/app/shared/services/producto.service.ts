import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, throwError } from 'rxjs';
import {
  Producto,
  ProductoAll,
  ProductoForm,
} from 'src/app/interfaces/producto.d';
import { Proveedor } from 'src/app/interfaces/proveedor.d';
import { Toast } from 'src/app/services/toaster.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  url = environment.endpoint;
  proveedor = 'proveedor-producto/e85eca43-2af5-47bd-ad10-c31af2e39dd5';
  endpoint = 'producto';
  endpoint_proveedor = 'proveedor';
  enpointId = 'producto/';

  handleError: any;
  toast!: Toast;

  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.toast = new Toast(this.toastr);
  }

  obtenerProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.url}${this.endpoint_proveedor}`);
  }

  obtenerProductos(): Observable<ProductoAll[]> {
    return this.http.get<ProductoAll[]>(`${this.url}${this.endpoint}`).pipe(
      catchError((error: HttpErrorResponse) => {
        // Aquí puedes manejar el error como desees, por ejemplo, mostrando un mensaje al usuario
        this.toast.showError(error.error.error);
        return throwError(error.error.error);
      })
    );
  }

  obtenerProducto(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}${this.enpointId}${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        // Aquí puedes manejar el error como desees, por ejemplo, mostrando un mensaje al usuario
        this.toast.showError(error.error.error);
        return throwError(error.error.error);
      })
    );
  }

  crearProducto(stateProducto: Producto): Observable<Producto> {
    return this.http
      .post<Producto>(`${this.url}${this.endpoint}`, stateProducto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Aquí puedes manejar el error como desees, por ejemplo, mostrando un mensaje al usuario
          this.toast.showError(error.error.error);
          return throwError(error.error.error);
        })
      );
  }

  actualizarProducto(
    id: string,
    producto: ProductoForm
  ): Observable<ProductoForm> {
    return this.http
      .put<ProductoForm>(`${this.url}${this.enpointId}${id}`, producto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Aquí puedes manejar el error como desees, por ejemplo, mostrando un mensaje al usuario
          this.toast.showError(error.error.error);
          return throwError(error.error.error);
        })
      );
  }
  eliminarProducto(id: string): Observable<Producto> {
    return this.http.delete<Producto>(`${this.url}${this.enpointId}${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        // Aquí puedes manejar el error como desees, por ejemplo, mostrando un mensaje al usuario
        this.toast.showError(error.error.error);
        return throwError(error.error.error);
      })
    );
  }
}
