import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { listVenta } from '../interfaces/listaVentas';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ListVentasService {

  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/listaVentas/'

  }

  getListVentas2(): Observable<listVenta[]> {
    return this.http.get<listVenta[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  

  }
    

