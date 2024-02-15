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

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}${this.endpoint}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.toast.showError(error.error);
        }
        return throwError('Algo salio mal');
      })
    );
  }

  obtenerUsuario(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}${this.endpoint}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        // Aquí puedes manejar el error como desees, por ejemplo, mostrando un mensaje al usuario
        if (error.error.error) {
          this.toast.showError(error.error.error);
        }
        return throwError('Algo salio mal');
      })
    );
  }

  crearUsuario(stateUser: UsuarioForm): Observable<Usuario> {
    return this.http
      .post<Usuario>(`${this.url}${this.endpoint}`, stateUser)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.toast.showError(error.error);
          }
          return throwError('Algo salio mal');
        })
      );
  }

  actualizarUsuario(id: string, user: UsuarioForm): Observable<Usuario> {
    return this.http
      .put<Usuario>(`${this.url}${this.enpointId}${id}`, user)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.toast.showError(error.error);
          }
          console.log(error.status);
          console.log(error.error);
          if (error.error.error) {
            this.toast.showError(error.error.error);
          }
          // Aquí puedes manejar el error como desees, por ejemplo, mostrando un mensaje al usuario
          return throwError('Algo salio mal');
        })
      );
  }

  eliminarUsuario(id: string): Observable<Usuario> {
    return this.http.delete<Usuario>(`${this.url}${this.enpointId}${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        // Aquí puedes manejar el error como desees, por ejemplo, mostrando un mensaje al usuario
        if (error.error.error) {
          this.toast.showError(error.error.error);
        }
        return throwError('Algo salio mal');
      })
    );
  }
}
