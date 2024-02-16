export class UsuarioForm {
  rol: string;
  cedula: string;
  nombre: string;
  apellido: string;
  password: string;
  telefono: string;
  direccion: string;
  email: string;

  constructor() {
    this.rol = '';
    this.cedula = '';
    this.nombre = '';
    this.apellido = '';
    this.password = '';
    this.telefono = '';
    this.direccion = '';
    this.email = '';
  }
}

export class Usuario extends UsuarioForm {
  id: string;

  constructor() {
    super();
    this.id = '';
  }
}
