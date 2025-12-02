import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Modal, initFlowbite } from 'flowbite';
import { ToastrService } from 'ngx-toastr';
import { Proveedor, ProveedorForm } from 'src/app/interfaces/proveedor';
import { Filtro } from 'src/app/services/filter.service';
import { Toast } from 'src/app/services/toaster.service';
import { ProveedorService } from 'src/app/shared/services/proveedor.service';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProveedorComponent implements OnInit {
  proveedorForm!: FormGroup;
  proveedorId: string = '';
  proveedores: Proveedor[] = [];

  toast: Toast; // Declara una variable para la instancia de Toast
  filtra!: Filtro<ProveedorForm>;

  constructor(
    private _proveedorService: ProveedorService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    {
      this.toast = new Toast(this.toastr); // Inicializa la instancia de Toast
      this.filtra = new Filtro<ProveedorForm>(); // Inicializa la instancia de Filtro
    }
  }
  ngOnInit(): void {
    this.proveedorForm = this.formBuilder.group({
      ruc: ['', Validators.required],
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
    });

    this.obtenerProveedores();
    initFlowbite();
  }

  onSubmit() {
    if (this.proveedorForm.valid) {
      const producto: ProveedorForm = {
        ruc: this.proveedorForm.value.ruc,
        nombre: this.proveedorForm.value.nombre,
        direccion: this.proveedorForm.value.direccion,
        telefono: this.proveedorForm.value.telefono,
      };

      if (this.proveedorId !== '') {
        this.actualizarProveedor(this.proveedorId, this.proveedorForm.value);
      } else {
        this.crearProveedor(producto);
      }
      this.onCloseModal();
    } else {
      this.toast.showWarning(
        'Formulario inválido, algunos campos son inválidos o están vacíos'
      ); // Llama al método showError de la instancia de Toast
    }
  }

  resetForm() {
    this.proveedorForm.reset();
    this.proveedorId = '';
  }

  onEdit(id: string) {
    this.resetForm();
    this.onOpenModal();
    this.proveedorId = id;
    this._proveedorService.obtenerProveedor(id).subscribe((data) => {
      this.proveedorForm.setValue({
        ruc: data.ruc,
        nombre: data.nombre,
        direccion: data.direccion,
        telefono: data.telefono,
      });
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
  sortProveedorFor() {
    this.filtra.filtrarPorPropiedad(this.proveedores, 'nombre');
  }

  obtenerProveedores() {
    this._proveedorService.obtenerProveedores().subscribe(
      (data) => {
        this.proveedores = data.map((item) => {
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
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  actualizarProveedor(id: string, producto: ProveedorForm) {
    this._proveedorService
      .actualizarProveedor(id, producto)
      .subscribe(
        (data) => {
          if (data) {
            this.resetForm();
            this.obtenerProveedores();
            this.toast.showUpdate('Proveedor actualizado con éxito'); // Llama al método showSuccess de la instancia de Toast
          }
        },
        (error: any) => {
          console.log('error');
          console.error(error);
        }
      );
  }

  crearProveedor(producto: ProveedorForm) {
    this._proveedorService.crearProveedor(producto).subscribe(
      (data) => {
        if (data) {
          this.resetForm();
          this.obtenerProveedores();
          this.toast.showSuccess('Proveedor creado con éxito'); // Llama al método showUpdate de la instancia de Toast
        }
      },
      (error: any) => {
        console.log('error');
        console.error(error);
      }
    );
  }

  eliminarProveedor(id: string) {
    this._proveedorService.eliminarProveedor(id).subscribe(
      (data) => {
        if (data === null) {
          this.resetForm();
          this.obtenerProveedores();
          this.toast.showDelete('Proveedor eliminado con éxito'); // Llama al método showDelete de la instancia de Toast
        }
      },
      (error: any) => {
        console.log('error');
        console.error(error);
      }
    );
  }
}
