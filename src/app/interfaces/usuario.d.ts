export class UsuarioForm {
  rol: string;
  cedula: string;
  nombre: string;
  apellido: string;
  password: string;
  telefono: string;
  direccion: string;
  email: string;
}

export class Usuario extends UsuarioForm {
  id: string;
}
