import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { proveedor } from 'src/app/interfaces/proveedor';

@Component({
  selector: 'app-add-edit-proveedor',
  templateUrl: './add-edit-proveedor.component.html',
  styleUrls: ['./add-edit-proveedor.component.css']
})
export class AddEditProveedorComponent  implements OnInit{
  form: FormGroup; 

  constructor( private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', [Validators.required, Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.maxLength(60)]],
      telefono:  [null, Validators.required],
    })

   }

  ngOnInit(): void {
    
  }

  addProveedor() {
    //console.log(this.form.value.name);

    const product: proveedor = {
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      direccion: this.form.value.direccion,
      email: this.form.value.email,
      telefono: this.form.value.telefono
    }
  

  }

}
