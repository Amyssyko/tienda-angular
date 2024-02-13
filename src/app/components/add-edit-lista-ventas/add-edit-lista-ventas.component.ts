import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { listVenta } from 'src/app/interfaces/listaVentas';


@Component({
  selector: 'app-add-edit-lista-ventas',
  templateUrl: './add-edit-lista-ventas.component.html',
  styleUrls: ['./add-edit-lista-ventas.component.css']
})
export class AddEditListaVentasComponent implements OnInit {
  form: FormGroup; 

  constructor( private fb: FormBuilder) {
    this.form = this.fb.group({
      cantidad: [null, Validators.required],
    })

   }

  ngOnInit(): void {
    
  }

  addListaVentas() {
    //console.log(this.form.value.name);

    const listaVentas: listVenta = {
      cantidad: this.form.value.cantidad
    }
  

  }


}
