export class DetalleFacturaForm {
  cantidad_venta: number;
  precio_venta: number;
  descuento_venta: number;
  productoId: string;
}

export class DetalleFactura extends DetalleFacturaForm {
  facturacionId: string;
  id: string;
}
