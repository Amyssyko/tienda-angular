export class ProductoForm {
  nombre: string;
  stock: number;
  precio: number;
  proveedorId: string;
}

export class Producto extends ProductoForm {
  id: string;
  fecha_creado: Date | string;
  fecha_modificacion: Date | string | null;
}
