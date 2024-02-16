import { DetalleFacturaForm } from './detalle-factura';

export class FacturaForm {
  precio_final: number;
  usuarioId: string;
  fecha_venta: Date | string;
  DetalleFactura: DetalleFacturaForm[];

  constructor() {
    this.precio_final = 0;
    this.fecha_venta = '';
    this.usuarioId = '';
    this.DetalleFactura = [];
  }
}

export class Factura extends FacturaForm {
  id: string;

  constructor() {
    super();
    this.id = '';
  }
}
