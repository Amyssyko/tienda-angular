import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { proveedor } from '../interfaces/proveedor';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/proveedores/'
  }


  getListProveedores(): Observable<proveedor[]> {
    return this.http.get<proveedor[]>(`${this.myAppUrl}${this.myApiUrl}`);

  }

  
}
