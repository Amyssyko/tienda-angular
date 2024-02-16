export class ProductoForm {
  nombre: string;
  stock: number;
  precio: number;
  proveedorId: string;

  constructor() {
    this.nombre = '';
    this.stock = 0;
    this.precio = 0;
    this.proveedorId = '';
  }
}

export class Producto extends ProductoForm {
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
