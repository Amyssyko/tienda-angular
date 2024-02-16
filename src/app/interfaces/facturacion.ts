export class FacturacionForm {
  precio_final: number;
  usuarioId: string;
  fecha_venta: Date;

  constructor() {
    this.precio_final = 0;
    this.usuarioId = '';
    this.fecha_venta = new Date();
  }
}

export class Facturacion extends FacturacionForm {
  id: string;

  constructor() {
    super();
    this.id = '';
  }
}
