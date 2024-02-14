export class Usuario {
  rol: string;
  cedula: string;
  nombre: string;
  apellido: string;
  password: string;
  telefono: string;
  direccion: string;
  email: string;
}

export class UsuarioForm extends Usuario {
  id: string;
}
