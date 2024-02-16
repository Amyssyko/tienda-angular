export class ProveedorForm {
  ruc: string;
  nombre: string;
  direccion: string;
  telefono: string;

  constructor() {
    this.ruc = '';
    this.nombre = '';
    this.direccion = '';
    this.telefono = '';
  }
}

export class Proveedor extends ProveedorForm {
  id: string;
  fecha_creado: Date | string;
  fecha_modificacion: Date | string | null;

  constructor() {
    super();
    this.id = '';
    this.fecha_creado = new Date();
    this.fecha_modificacion = null;
  }
}
