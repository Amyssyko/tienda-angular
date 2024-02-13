interface DetalleFactura {
  id: string;
  cantidad_venta: number;
  precio_venta: number;
  descuento_venta: number;
  FacturacionId: string;
  productoId: string;
}

export default DetalleFactura;
