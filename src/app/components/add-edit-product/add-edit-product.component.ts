import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { Producto } from 'src/app/interfaces/producto';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css']
})
export class AddEditProductComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      modelo: ['', [Validators.required, Validators.maxLength(60)]],
      precio: [null, Validators.required],
      stock: [null, Validators.required],
    })

  }

  ngOnInit(): void {

  }

  addProduct() {
    //console.log(this.form.value.name);

    const producto: Producto = {
      producto_id: this.form.value,
      proveedor_id: this.form.value,
      nombre: this.form.value.nombre,
      modelo: this.form.value.modelo,
      precio: this.form.value.precio,
      stock: this.form.value.stock
    }


  }

}
