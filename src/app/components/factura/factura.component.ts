import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'flowbite';
import { ToastrService } from 'ngx-toastr';
import { DetalleFacturaForm } from 'src/app/interfaces/detalle-factura';
import { Factura, FacturaForm } from 'src/app/interfaces/factura.d';
import { Producto } from 'src/app/interfaces/producto.d';
import { Usuario } from 'src/app/interfaces/usuario.d';
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
  facturaForm!: FormGroup;
  detalleFacturaForm!: FormGroup;
  facturaId: string = '';
  facturas: Factura[] = [];
  productos: Producto[] = [];
  usuarios: Usuario[] = [];
  toast: Toast; // Declara una variable para la instancia de Toast
  filtra!: Filtro<FacturaForm>;

  constructor(
    private _facturaService: FacturaService,
    private _productoService: ProductService,
    private _usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    {
      this.detalleFacturaForm = this.formBuilder.group({
        cantidad_venta: ['', Validators.required],
        precio_venta: ['', Validators.required],
        descuento_venta: ['', Validators.required],
        productoId: ['', Validators.required],
      });
      this.toast = new Toast(this.toastr); // Inicializa la instancia de Toast
      this.filtra = new Filtro<Factura>(); // Inicializa la instancia de Filtro
    }
  }
  // [
  // {
  // "id": "3d36c7b7-997b-4b43-9e1e-7ff8c68e3180",
  // "precio_final": 36.23,
  // "usuarioId": "4d9a2691-d10a-4bf8-849d-df494750fcad",
  // "fecha_venta": "2023-12-01T05:00:00.000Z",
  // "DetalleFactura": [
  // {
  // "id": "1423b969-688f-4124-89a2-4ebd192b4b5a",
  // "cantidad_venta": 24,
  // "precio_venta": 36.12,
  // "descuento_venta": 0,
  // "facturacionId": "3d36c7b7-997b-4b43-9e1e-7ff8c68e3180",
  // "productoId": "b6b0865c-5e42-46d3-944b-5973b17317a2"
  // }
  // ]
  // },
  // {
  // "id": "35a86239-390d-40fa-9417-a93d91839916",
  // "precio_final": 68,
  // "usuarioId": "4d9a2691-d10a-4bf8-849d-df494750fcad",
  // "fecha_venta": "2023-11-12T00:00:00.000Z",
  // "DetalleFactura": [
  // {
  // "id": "9b0c4cbb-cfbd-4198-b8f1-e2bca098e59c",
  // "cantidad_venta": 3,
  // "precio_venta": 16,
  // "descuento_venta": 0,
  // "facturacionId": "35a86239-390d-40fa-9417-a93d91839916",
  // "productoId": "df40a101-f601-4c92-9ebc-c24dba8f3d9e"
  // },
  // {
  // "id": "50c52f0a-6222-46bf-8bc8-85404fd05e76",
  // "cantidad_venta": 2,
  // "precio_venta": 10,
  // "descuento_venta": 0,
  // "facturacionId": "35a86239-390d-40fa-9417-a93d91839916",
  // "productoId": "b6b0865c-5e42-46d3-944b-5973b17317a2"
  // }
  // ]
  // }]

  obtenerDetalleFactura() {
    return this.detalleFacturaForm.value as DetalleFacturaForm[] | null;
  }

  agregarDetalleFactura() {
    const detalleFactura = this.formBuilder.group({
      cantidad_venta: ['', Validators.required],
      precio_venta: ['', Validators.required],
      descuento_venta: ['', Validators.required],
      productoId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    initTE({ Datepicker, Input });

    this.facturaForm = this.formBuilder.group({
      precio_final: ['', Validators.required],
      usuarioId: ['', [Validators.required]],
      fecha_venta: ['', [Validators.required]],
      DetalleFactura: [
        this.formBuilder.group({
          cantidad_venta: ['', [Validators.required]],
          precio_venta: ['', [Validators.required]],
          descuento_venta: ['', [Validators.required]],
          productoId: ['', [Validators.required]],
        }),
      ],
    });

    this.obtenerFacturas();
    this.obtenerProductos();
    this.obtenerUsuarios();
  }

  eliminarDetalleFactura(index: number) {
    this.obtenerDetalleFactura()?.splice(index, 1);
  }

  obtenerProductos() {
    this._productoService.obtenerProductos().subscribe((data) => {
      this.productos = data;
    }),
      (error: any) => {
        console.error(error);
      };
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
    if (this.facturaForm.valid) {
      const factura: FacturaForm = {
        precio_final: this.facturaForm.value.precio_final,
        usuarioId: this.facturaForm.value.usuarioId,
        fecha_venta: this.facturaForm.value.fecha_venta,
        DetalleFactura: this.facturaForm.value.DetalleFactura.map(
          (detalle: any) => {
            return {
              cantidad_venta: detalle.cantidad_venta,
              precio_venta: detalle.precio_venta,
              descuento_venta: detalle.descuento_venta,
              productoId: detalle.productoId,
            };
          }
        ),
      };
      console.log(factura);
      if (this.facturaId !== '') {
        this.actualizarFactura(this.facturaId, this.facturaForm.value);
      } else {
        this.crearFactura(factura);
      }
      this.onCloseModal();
    } else {
      this.toast.showWarning(
        'Formulario inválido, algunos campos son inválidos o están vacíos'
      ); // Llama al método showError de la instancia de Toast
    }
  }

  resetForm() {
    this.facturaForm.reset();
    this.facturaId = '';
  }

  onEdit(id: string) {
    this.resetForm();
    this.onOpenModal();
    this.facturaId = id;
    this._facturaService.obtenerFactura(id).subscribe((data) => {
      console.log(data);
      this.facturaForm.setValue({
        precio_final: data.precio_final,
        usuarioId: data.usuarioId,
        fecha_venta: data.fecha_venta,
        DetalleFactura: data.DetalleFactura.map((detalle) => {
          return {
            cantidad_venta: detalle.cantidad_venta,
            precio_venta: detalle.precio_venta,
            descuento_venta: detalle.descuento_venta,
            productoId: detalle.productoId,
          };
        }),
      });

      console.log(this.facturaForm.value);
    });
  }

  onCloseModal() {
    const $modal = document.getElementById('crud-modal');
    // options with default values

    const modal = new Modal($modal);

    // show the modal
    modal.hide();

    // hide the modal
    // modal.hide();
  }

  onOpenModal() {
    const $modal = document.getElementById('crud-modal');
    // options with default values

    const modal = new Modal($modal);

    // show the modal
    modal.show();

    // hide the modal
    // modal.hide();
  }

  //create sortProducts Name
  sortFacturaFor() {
    this.filtra.filtrarPorPropiedad(this.facturas, 'fecha_venta');
  }

  obtenerFacturas() {
    this._facturaService.obtenerFacturas().subscribe((data) => {
      this.facturas = data.map((item) => {
        return {
          ...item,
          fecha_creado: new Date(item.fecha_venta).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
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
