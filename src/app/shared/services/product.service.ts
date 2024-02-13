import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from 'src/app/interfaces/producto.d';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  url = environment.endpoint;
  endpoint = 'producto';
  enpointId = 'producto/';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.url}${this.endpoint}`);
  }

  getProductoId(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}${this.enpointId}${id}`);
  }

  postProduct(stateProducto: Producto): Observable<Producto> {
    return this.http.post<Producto>(
      `${this.url}${this.endpoint}`,
      stateProducto
    );
  }
  postProductoId(id: Producto): Observable<Producto> {
    return this.http.post<Producto>(`${this.url}${this.enpointId}`, id);
  }
  putProductoId(id: string, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(
      `${this.url}${this.enpointId}${id}`,
      producto
    );
  }
  deleteProductoId(id: string): Observable<Producto> {
    return this.http.delete<Producto>(`${this.url}${this.enpointId}${id}`);
  }
}
