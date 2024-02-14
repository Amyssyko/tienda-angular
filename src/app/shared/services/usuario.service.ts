import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, throwError } from 'rxjs';
import { Usuario, UsuarioForm } from 'src/app/interfaces/usuario';
import { Toast } from 'src/app/services/toaster.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  url = environment.endpoint;
  handleError: any;
  endpoint = 'usuario';
  enpointId = 'usuario/';
  toast!: Toast;

  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.toast = new Toast(this.toastr);
  }

  obtenerUsuarios(): Observable<UsuarioForm[]> {
    return this.http.get<UsuarioForm[]>(`${this.url}${this.endpoint}`).pipe(
      catchError((error: HttpErrorResponse) => {
        // Aquí puedes manejar el error como desees, por ejemplo, mostrando un mensaje al usuario
        this.toast.showError(error.error.error);
        return throwError(error.error.error);
      })
    );
  }

  obtenerUsuario(id: string): Observable<UsuarioForm> {
    return this.http.get<UsuarioForm>(`${this.url}${this.endpoint}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        // Aquí puedes manejar el error como desees, por ejemplo, mostrando un mensaje al usuario
        if (error.error.error) {
          this.toast.showError(error.error.error);
        }
        return throwError(error.error.error);
      })
    );
  }

  crearUsuario(stateUser: Usuario): Observable<UsuarioForm> {
    return this.http
      .post<UsuarioForm>(`${this.url}${this.endpoint}`, stateUser)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Aquí puedes manejar el error como desees, por ejemplo, mostrando un mensaje al usuario
          if (error.error.error) {
            this.toast.showError(error.error.error);
          }
          return throwError(error.error.error);
        })
      );
  }

  actualizarUsuario(id: string, user: Usuario): Observable<UsuarioForm> {
    return this.http
      .put<UsuarioForm>(`${this.url}${this.enpointId}${id}`, user)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error.error) {
            this.toast.showError(error.error.error);
          }
          // Aquí puedes manejar el error como desees, por ejemplo, mostrando un mensaje al usuario
          return throwError(error.error.error);
        })
      );
  }

  eliminarUsuario(id: string): Observable<UsuarioForm> {
    return this.http
      .delete<UsuarioForm>(`${this.url}${this.enpointId}${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Aquí puedes manejar el error como desees, por ejemplo, mostrando un mensaje al usuario
          if (error.error.error) {
            this.toast.showError(error.error.error);
          }
          return throwError(error.error.error);
        })
      );
  }
}
