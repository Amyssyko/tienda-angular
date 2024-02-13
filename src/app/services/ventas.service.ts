import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { ventas } from '../interfaces/ventas';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class VentasService {

  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/ventas/'
  }

  getListventas(): Observable<ventas[]> {
    return this.http.get<ventas[]>(`${this.myAppUrl}${this.myApiUrl}`);

  }

  //delete(ventas_id){
   // return this.HttpClient.delete(this.myApiUrl+'/ventas/'+ventas.ventas_id,ventas)
  //}

  deleteListventas(): Observable<ventas[]> {
    return this.http.get<ventas[]>(`${this.myAppUrl}${this.myApiUrl}`);

  }

}
