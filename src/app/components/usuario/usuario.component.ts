import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { ToastrService } from 'ngx-toastr';
import { Usuario, UsuarioForm } from 'src/app/interfaces/usuario';
import { Filtro } from 'src/app/services/filter.service';
import { Toast } from 'src/app/services/toaster.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
})
export class UsuarioComponent implements OnInit {
  usuarioForm!: FormGroup;
  // usuarioForm: FormGroup = new FormGroup({
  //   rol: new FormControl('', [Validators.required, Validators.minLength(4)]),
  //   cedula: new FormControl('', [
  //     Validators.required,
  //     Validators.minLength(10),
  //     Validators.maxLength(10),
  //   ]),
  //   nombre: new FormControl('', [
  //     Validators.required,
  //     Validators.minLength(3),
  //     Validators.maxLength(50),
  //   ]),
  //   apellido: new FormControl('', [
  //     Validators.required,
  //     Validators.minLength(3),
  //     Validators.maxLength(50),
  //   ]),
  //   password: new FormControl('', [
  //     Validators.required,
  //     Validators.minLength(8),
  //   ]),
  //   telefono: new FormControl('', [
  //     Validators.required,
  //     Validators.minLength(10),
  //     Validators.maxLength(10),
  //   ]),
  //   direccion: new FormControl('', [
  //     Validators.required,
  //     Validators.minLength(10),
  //   ]),
  //   email: new FormControl('', [Validators.required, Validators.email]),
  // });
  usuarioId: string = '';
  usuarios: UsuarioForm[] = [];
  toast!: Toast; // Declara una variable para la instancia de Toast
  filtra!: Filtro<UsuarioForm>;

  constructor(
    private _usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    {
      this.toast = new Toast(this.toastr); // Inicializa la instancia de Toast
      this.filtra = new Filtro<UsuarioForm>(); // Inicializa la instancia de Filtro
    }
  }

  ngOnInit(): void {
    this.usuarioForm = this.formBuilder.group({
      rol: ['', Validators.required],
      cedula: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      password: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
    this.obtenerUsuarios();
    initFlowbite();
  }

  resetForm() {
    this.usuarioForm.reset();
    this.usuarioId = '';
  }

  obtenerUsuarios() {
    this._usuarioService.obtenerUsuarios().subscribe((data) => {
      this.usuarios = data;
    }),
      (error: any) => {
        console.error(error);
      };
  }

  crearUsuario(usuario: Usuario) {
    this._usuarioService.crearUsuario(usuario).subscribe((data) => {
      this.resetForm();
      this.obtenerUsuarios();
      this.toast.showSuccess('Usuario'); // Llama al método showSuccess de la instancia de Toast
    }),
      (error: any) => {
        console.log('error');
        console.error(error);
      };
  }

  actualizarUsuario(id: string, usuario: Usuario) {
    this._usuarioService.actualizarUsuario(id, usuario).subscribe((data) => {
      this.resetForm();
      this.obtenerUsuarios();
      this.toast.showUpdate('Usuario actualizado con éxito '); // Llama al método showUpdate de la instancia de Toast
    }),
      (error: any) => {
        console.error(error);
      };
  }

  eliminarUsuario(id: string) {
    this._usuarioService.eliminarUsuario(id).subscribe((data) => {
      this.resetForm();
      this.obtenerUsuarios();
      this.toast.showDelete('Usuario eliminado con éxito'); // Llama al método showDelete de la instancia de Toast
    }),
      (error: any) => {
        console.error(error);
      };
  }

  onEdit(id: string) {
    this.usuarioId = id;
    this._usuarioService.obtenerUsuario(id).subscribe((data) => {
      this.usuarioForm.setValue({
        rol: data.rol,
        cedula: data.cedula,
        nombre: data.nombre,
        apellido: data.apellido,
        password: data.password,
        telefono: data.telefono,
        direccion: data.direccion,
        email: data.email,
      });
    });
  }

  //create sortProducts Name
  sortUserName() {
    this.filtra.filtrarPorPropiedad(this.usuarios, 'nombre');
  }

  onSubmit() {
    if (this.usuarioForm.valid) {
      const usuario: Usuario = {
        rol: this.usuarioForm.value.rol,
        cedula: this.usuarioForm.value.cedula,
        nombre: this.usuarioForm.value.nombre,
        apellido: this.usuarioForm.value.apellido,
        password: this.usuarioForm.value.password,
        telefono: this.usuarioForm.value.telefono,
        direccion: this.usuarioForm.value.direccion,
        email: this.usuarioForm.value.email,
      };

      if (this.usuarioId !== '') {
        this.actualizarUsuario(this.usuarioId, this.usuarioForm.value);
      } else {
        this.crearUsuario(usuario);
      }
    } else {
      this.toast.showError(
        'Formulario inválido, complete los campos requeridos'
      ); // Llama al método showError de la instancia de Toast
    }
  }
}
