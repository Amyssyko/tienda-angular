import { Component, OnInit } from '@angular/core';
import { FacturaForm } from 'src/app/interfaces/factura';
import { Usuario } from 'src/app/interfaces/usuario';
import { FacturaService } from 'src/app/shared/services/factura.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Datepicker, Input, initTE } from 'tw-elements';

@Component({
  selector: 'app-formulario-factura',
  templateUrl: './formulario-factura.component.html',
})
export class FormularioFacturaComponent implements OnInit {
  nuevaFactura: FacturaForm = new FacturaForm(); // Utiliza el constructor del modelo para inicializar la factura
  usuarios: Usuario[] = [];
  constructor(
    private facturaService: FacturaService,
    private _usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    initTE({ Datepicker, Input });
    this.obtenerUsuarios();
  }
  guardarFactura(): void {
    console.log(this.nuevaFactura);
    this.facturaService.crearFactura(this.nuevaFactura).subscribe(
      (facturaGuardada) => {
        alert('Factura guardada correctamente');
        this.nuevaFactura = new FacturaForm(); // Reiniciar el formulario después de guardar la factura
      },
      (error) => {
        alert('Error al guardar la factura: ' + error.message);
      }
    );
  }

  obtenerUsuarios() {
    this._usuarioService.obtenerUsuarios().subscribe((data) => {
      this.usuarios = data;
    });
  }

  agregarDetalleFactura(): void {
    // Agregar un nuevo objeto DetalleFactura al array
    this.nuevaFactura.DetalleFactura.push({
      cantidad_venta: 0,
      precio_venta: 0,
      descuento_venta: 0,
      productoId: '',
    });
  }
}
