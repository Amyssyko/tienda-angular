import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Producto, ProductoForm } from 'src/app/interfaces/producto';
import { Proveedor } from 'src/app/interfaces/proveedor';
import { Filtro } from 'src/app/services/filter.service';
import { Toast } from 'src/app/services/toaster.service';
import { ProductService } from 'src/app/shared/services/producto.service';
import { ProveedorService } from 'src/app/shared/services/proveedor.service';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
})
export class ProductoFormComponent {
  proveedor: string = 'bc253462-c2b3-4266-8541-d627de7e232c';
  productoForm!: FormGroup;
  proveedorId: string = '';
  producto: Producto = {} as Producto;
  productoId: string = '';
  proveedores: Proveedor[] = [];
  toast: Toast; // Declara una variable para la instancia de Toast
  filtra!: Filtro<Producto>;

  
  constructor(
    private route: ActivatedRoute,
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
    const id = this.route.snapshot.paramMap.get('id');

   
    if (id && id !== 'add') {
      this.productoId = id;
      this.obtenerProductoId(id);
    }

    this.productoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0),Validators.pattern("^[0-9]*$")]],
      precio: ['', [Validators.required, Validators.min(0)]],
      proveedorId: ['', Validators.required],
    });
    this.obtenerProveedores();
  }

  obtenerProductoId(id: string) { 
    this._productService.obtenerProducto(id).subscribe((data) => {
      this.productoForm.setValue({
        nombre: data.nombre,
        stock: data.stock,
        precio: data.precio,
        proveedorId: data.proveedorId,
      });
    });
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

      if (this.productoId !== '') {
        this.actualizarProducto(this.productoId, this.productoForm.value);
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
        //redirectTo('/productos');
        window.location.href = '/productos';
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
        window.location.href = '/productos';

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

     
      
    }),
      (error: any) => {
        console.error(error);
      };
  }
}
