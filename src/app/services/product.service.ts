import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Producto } from '../interfaces/producto.d';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url: string;
  private endpoint: string;

  constructor(private http: HttpClient) {
    this.url = environment.endpoint;
    this.endpoint = 'producto';
  }
  getProducts(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.url}${this.endpoint}`);
  }
}
