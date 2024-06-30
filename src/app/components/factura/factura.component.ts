import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Factura, FacturaForm } from 'src/app/interfaces/factura';
import { Producto } from 'src/app/interfaces/producto';
import { Usuario } from 'src/app/interfaces/usuario';
import { Filtro } from 'src/app/services/filter.service';
import { Toast } from 'src/app/services/toaster.service';
import { FacturaService } from 'src/app/shared/services/factura.service';
import { ProductService } from 'src/app/shared/services/producto.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Datepicker, Input, initTE } from 'tw-elements';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
})
export class FacturaComponent implements OnInit {
  facturaForm: FacturaForm = new FacturaForm();
  facturaId: string = '';
  fecha= new Date();
  facturas: Factura[] = [];
  productos: Producto[] = [];
  usuarios: Usuario[] = [];
  toast: Toast; // Declara una variable para la instancia de Toast
  filtra!: Filtro<FacturaForm>;

  constructor(
    private _facturaService: FacturaService,
    private _productoService: ProductService,
    private _usuarioService: UsuarioService,
    private toastr: ToastrService
  ) {
    {
      this.toast = new Toast(this.toastr); // Inicializa la instancia de Toast
      this.filtra = new Filtro<Factura>(); // Inicializa la instancia de Filtro
    }
  }
  agregarDetalleFactura(): void {
    // Agregar un nuevo objeto DetalleFactura al array
    this.facturaForm.DetalleFactura.push({
      cantidad_venta: 0,
      precio_venta: 0,
      descuento_venta: 0,
      productoId: '',
    });
  }
  eliminarDetalleFactura(index: number): void {
    // Eliminar un objeto DetalleFactura del array
    this.facturaForm.DetalleFactura = this.facturaForm.DetalleFactura.filter(
      (_, i) => i !== index
    );
  }

  ngOnInit(): void {
    initTE({ Datepicker, Input });

    this.obtenerFacturas();
    this.obtenerProductos();
    this.obtenerUsuarios();
  }

  obtenerProductos() {
    this._productoService.obtenerProductos().subscribe((data) => {
      this.productos = data;
    }),
      (error: any) => {
        console.error(error);
      };
  }

  obtenerProducto(id: string) {
    const producto = this.productos.find((producto) => producto.id === id);
    return producto?.nombre;
  }

  obtenerUsuario(id: string) {
    const usuario = this.usuarios.find((usuario) => usuario.id === id);
    return usuario?.nombre + ' ' + usuario?.apellido;
  }

  obtenerUsuarios() {
    this._usuarioService.obtenerUsuarios().subscribe((data) => {
      this.usuarios = data;
    }),
      (error: any) => {
        console.error(error);
      };
  }

  onSubmit() {
    const fecha_venta = new Date(this.facturaForm.fecha_venta);

    const factura = { ...this.facturaForm, fecha_venta };

    console.log(factura);
    if (!factura.DetalleFactura.length) {
      return this.toast.showError('Asegúrese de agregar los detalles de la factura');
    }

    if (this.facturaId) {
      this.actualizarFactura(this.facturaId, factura);
    } else {
      this.crearFactura(factura);
    }
  }

  resetForm() {
    this.facturaForm = new FacturaForm();
    this.facturaId = '';
  }

  onEdit(id: string) {
    this.facturaId = id;
    this.resetForm();
    this.facturaId = id;
    this._facturaService.obtenerFactura(id).subscribe((data) => {
      const dataFormated = {
        ...data,
        fecha_venta: new Date(data.fecha_venta).toISOString().split('T')[0],
      };
      this.facturaForm = dataFormated;
    });
  }

  //create sortProducts Name
  sortFacturaFor() {
    this.filtra.filtrarPorPropiedad(this.facturas, 'fecha_venta');
  }

  obtenerFacturas() {
    this._facturaService.obtenerFacturas().subscribe((data) => {
      this.facturas = data.map((factura) => {
        return {
          ...factura,
          fecha_venta: new Date(factura.fecha_venta).toLocaleString('ec-ES', {
            hour12: false,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }),
        };
      });
    }),
      (error: any) => {
        console.error(error);
      };
  }

  actualizarFactura(id: string, factura: FacturaForm) {
    this._facturaService.actualizarFactura(id, factura).subscribe((data) => {
      if (data) {
        this.resetForm();
        this.obtenerFacturas();
        this.toast.showUpdate('Factura actualizado con éxito'); // Llama al método showSuccess de la instancia de Toast
      }
    }),
      (error: any) => {
        console.log('error');
        console.error(error);
      };
  }

  crearFactura(factura: FacturaForm) {
    this._facturaService.crearFactura(factura).subscribe((data) => {
      if (data) {
        this.resetForm();
        this.obtenerFacturas();
        this.toast.showSuccess('Factura creado con éxito'); // Llama al método showUpdate de la instancia de Toast
      }
    }),
      (error: any) => {
        console.log('error');
        console.error(error);
      };
  }

  eliminarFactura(id: string) {
    this._facturaService.eliminarFactura(id).subscribe((data) => {
      if (data === null) {
        this.resetForm();
        this.obtenerFacturas();
        this.toast.showDelete('Factura eliminado con éxito'); // Llama al método showDelete de la instancia de Toast
      }
    }),
      (error: any) => {
        console.log('error');
        console.error(error);
      };
  }
}
