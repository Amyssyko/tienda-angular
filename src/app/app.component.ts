import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // Agrega ReactiveFormsModule aquí
})
export class AppComponent implements OnInit {
  title = 'App ventas';

  ngOnInit(): void {
    initFlowbite();
  }
}
