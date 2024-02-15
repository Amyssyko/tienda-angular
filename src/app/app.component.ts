import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Tooltip, initTE } from 'tw-elements';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // Agrega ReactiveFormsModule aquí
})
export class AppComponent implements OnInit {
  title = 'App ventas';

  ngOnInit(): void {
    initFlowbite();
    initTE({ Tooltip });
  }
}
