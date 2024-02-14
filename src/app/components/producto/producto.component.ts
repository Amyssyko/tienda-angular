import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { ToastrService } from 'ngx-toastr';
import {
  Producto,
  ProductoAll,
  ProductoForm,
} from 'src/app/interfaces/producto.d';
import { Proveedor } from 'src/app/interfaces/proveedor.d';
import { Filtro } from 'src/app/services/filter.service';
import { Toast } from 'src/app/services/toaster.service';
import { ProductService } from 'src/app/shared/services/producto.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
})
export class ProductoComponent implements OnInit {
  productoForm!: FormGroup;
  proveedorId: string = '';
  productos: ProductoAll[] = [];
  proveedores: Proveedor[] = [];
  toast: Toast; // Declara una variable para la instancia de Toast
  filtra!: Filtro<ProductoAll>;

  constructor(
    private _productService: ProductService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    {
      this.toast = new Toast(this.toastr); // Inicializa la instancia de Toast
      this.filtra = new Filtro<ProductoAll>(); // Inicializa la instancia de Filtro
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
    initFlowbite();
  }

  //create sortProducts Name
  sortProductsName() {
    this.filtra.filtrarPorPropiedad(this.productos, 'nombre');
    // // Si productos está vacío o tiene solo un elemento, no es necesario ordenar
    // if (this.productos.length <= 1) return;

    // // Invertir el estado de orden al llamar a la función
    // this.ordernarPor = !this.ordernarPor;

    // // Ordenar los productos según el estado actual (ascendente o descendente)
    // if (this.ordernarPor) {
    //   this.productos = this.productos.sort((a, b) =>
    //     a.nombre.localeCompare(b.nombre)
    //   );
    // } else {
    //   this.productos = this.productos.sort((a, b) =>
    //     b.nombre.localeCompare(a.nombre)
    //   );
    // }
  }

  obtenerProveedores() {
    this._productService.obtenerProveedores().subscribe((data) => {
      this.proveedores = data;
    });
  }
  onSubmit() {
    if (this.productoForm.valid) {
      const producto: Producto = {
        nombre: this.productoForm.value.nombre,
        stock: this.productoForm.value.stock,
        precio: this.productoForm.value.precio,
        proveedorId: this.productoForm.value.proveedorId,
      };

      if (this.proveedorId !== '') {
        this.actualizarProducto(this.proveedorId, this.productoForm.value);
      } else {
        this.crearProductoo(producto);
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

  crearProductoo(producto: Producto) {
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
        (item) => item.proveedorId === 'e85eca43-2af5-47bd-ad10-c31af2e39dd5'
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
