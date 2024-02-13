export class Producto {
  id: string;
  nombre: string;
  stock: number;
  precio: number;
  proveedorId: string;
  fecha_creado: Date;
  fecha_modificacion: Date | null;

  // constructor() {
  //   this.id = '';
  //   this.nombre = '';
  //   this.stock = 0;
  //   this.precio = 0;
  //   this.proveedorId = '';
  //   this.fecha_creado = new Date();
  //   this.fecha_modificacion = null;
  // }
}
