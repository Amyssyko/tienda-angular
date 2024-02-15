import { DetalleFactura, DetalleFacturaForm } from './detalle-factura.d';

export class FacturaForm {
  precio_final: number;
  usuarioId: string;
  fecha_venta: Date | string;
  DetalleFactura: DetalleFactura[] | DetalleFacturaForm[];
}

export class Factura extends FacturaForm {
  id: string;
}
