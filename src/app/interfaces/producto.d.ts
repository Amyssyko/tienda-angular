export class Producto {
  nombre: string;
  stock: number;
  precio: number;
  proveedorId: string;

  //  constructor(id: string, nombre: string, stock: number, precio: number, proveedorId: string) {
  //     this.id = id;
  //     this.nombre = nombre;
  //     this.stock = stock;
  //     this.precio = precio;
  //     this.proveedorId = proveedorId;
  //   }
}

export class ProductoForm extends Producto {
  id: string;
}

export class ProductoAll extends ProductoForm {
  fecha_creado: Date | string;
  fecha_modificacion: Date | string | null;
}
