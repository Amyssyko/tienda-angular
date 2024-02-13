import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { ventas } from 'src/app/interfaces/ventas';
import {MatDatepickerModule} from '@angular/material/datepicker';
@Component({
  selector: 'app-add-edit-ventas',
  templateUrl: './add-edit-ventas.component.html',
  styleUrls: ['./add-edit-ventas.component.css']
})
export class AddEditVentasComponent implements OnInit{

  form: FormGroup; 

  constructor( private fb: FormBuilder) {
    this.form = this.fb.group({
      fecha: [null, Validators.required],
      total: [null, Validators.required],
    })

   }

  ngOnInit(): void {
    
  }

  addVentas() {
    //console.log(this.form.value.name);

    const ventas: ventas = {
      fecha: this.form.value.fecha,
      total: this.form.value.total,
    }
  

  }

}
