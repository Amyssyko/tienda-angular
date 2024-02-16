export class DetalleFacturaForm {
  cantidad_venta: number;
  precio_venta: number;
  descuento_venta: number;
  productoId: string;

  constructor() {
    this.cantidad_venta = 0;
    this.precio_venta = 0;
    this.descuento_venta = 0;
    this.productoId = '';
  }
}

export class DetalleFactura extends DetalleFacturaForm {
  facturacionId: string;
  id: string;

  constructor() {
    super();
    this.facturacionId = '';
    this.id = '';
  }
}
