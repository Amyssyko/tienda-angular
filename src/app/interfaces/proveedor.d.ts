export class Proveedor {
  id: string;
  ruc: string;
  nombre: string;
  direccion: string;
  telefono: string;
  fecha_creado: Date;
  fecha_modificacion: Date | null;
}

export default Proveedor;
