export class ProveedorForm {
  ruc: string;
  nombre: string;
  direccion: string;
  telefono: string;
}

export class Proveedor extends ProveedorForm {
  id: string;
  fecha_creado: Date | string;
  fecha_modificacion: Date | string | null;
}
