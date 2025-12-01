import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Producto, ProductoForm } from 'src/app/interfaces/producto';
import { Proveedor } from 'src/app/interfaces/proveedor';
import { Filtro } from 'src/app/services/filter.service';
import { Toast } from 'src/app/services/toaster.service';
import { ProductService } from 'src/app/shared/services/producto.service';
import { ProveedorService } from 'src/app/shared/services/proveedor.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProductoComponent implements OnInit {
  proveedor: string = 'bc253462-c2b3-4266-8541-d627de7e232c';
  productoForm!: FormGroup;
  proveedorId: string = '';
  productos: Producto[] = [];
  proveedores: Proveedor[] = [];
  toast: Toast; // Declara una variable para la instancia de Toast
  filtra!: Filtro<Producto>;

  constructor(
    private _productService: ProductService,
    private _proveedorService: ProveedorService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    {
      this.toast = new Toast(this.toastr); // Inicializa la instancia de Toast
      this.filtra = new Filtro<Producto>(); // Inicializa la instancia de Filtro
    }
  }
  ngOnInit(): void {
    this.productoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
      precio: ['', [Validators.required, Validators.min(0)]],
      proveedorId: ['', Validators.required],
    });
    this.obtenerProductos();
    this.obtenerProveedores();
  }

  //create sortProducts Name
  sortProductsName() {
    this.filtra.filtrarPorPropiedad(this.productos, 'nombre');
  }

  routeCreate() {
    window.location.href = '/producto/add';
  }

  routeUpdate(id: string) {
    window.location.href = `/producto/${id}`;
  }

  obtenerProveedores() {
    this._proveedorService.obtenerProveedores().subscribe((data) => {
      this.proveedores = data;
    });
  }
  onSubmit() {
    if (this.productoForm.valid) {
      const producto: ProductoForm = {
        nombre: this.productoForm.value.nombre,
        stock: this.productoForm.value.stock,
        precio: this.productoForm.value.precio,
        proveedorId: this.productoForm.value.proveedorId,
      };

      if (this.proveedorId !== '') {
        this.actualizarProducto(this.proveedorId, this.productoForm.value);
      } else {
        this.crearProducto(producto);
      }
    } else {
      this.toast.showWarning(
        'Formulario inválido, algunos campos son inválidos o están vacíos'
      ); // Llama al método showError de la instancia de Toast
    }
  }

  resetForm() {
    this.productoForm.reset();
    this.proveedorId = '';
  }

  onEdit(id: string) {
    this.resetForm();
    this.proveedorId = id;
    this._productService.obtenerProducto(id).subscribe((data) => {
      this.productoForm.setValue({
        nombre: data.nombre,
        stock: data.stock,
        precio: data.precio,
        proveedorId: data.proveedorId,
      });
    });
  }

  actualizarProducto(id: string, producto: ProductoForm) {
    this._productService.actualizarProducto(id, producto).subscribe((data) => {
      if (data) {
        this.resetForm();
        this.obtenerProductos();
        this.toast.showUpdate('Producto actualizado con éxito'); // Llama al método showSuccess de la instancia de Toast
      }
    }),
      (error: any) => {
        console.log('error');
        console.error(error);
      };
  }

  crearProducto(producto: ProductoForm) {
    this._productService.crearProducto(producto).subscribe((data) => {
      if (data) {
        this.resetForm();
        this.obtenerProductos();
        this.toast.showSuccess('Producto creado con éxito'); // Llama al método showUpdate de la instancia de Toast
      }
    }),
      (error: any) => {
        console.log('error');
        console.error(error);
      };
  }

  eliminarProducto(id: string) {
    this._productService.eliminarProducto(id).subscribe((data) => {
      if (data === null) {
        this.resetForm();
        this.obtenerProductos();
        this.toast.showDelete('Producto eliminado con éxito'); // Llama al método showDelete de la instancia de Toast
      }
    }),
      (error: any) => {
        console.log('error');
        console.error(error);
      };
  }

  obtenerProductos() {
    this._productService.obtenerProductos().subscribe((data) => {
      const newData = data.filter(
        (item) => item.proveedorId === this.proveedor
      );

      this.productos = newData.map((item) => {
        return {
          ...item,
          fecha_creado: new Date(item.fecha_creado).toLocaleDateString(
            'es-ES',
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }
          ),
          fecha_modificacion: item.fecha_modificacion
            ? new Date(item.fecha_modificacion).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })
            : null,
        };
      });
    }),
      (error: any) => {
        console.error(error);
      };
  }
}
