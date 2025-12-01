import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { NavbarComponent } from './components/navbar/navbar.component';

// Se removieron las llamadas a 'tw-elements' (initTE) temporalmente porque su API cambió.
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
})
export class AppComponent implements OnInit {
  title = 'App ventas';

  ngOnInit(): void {
    // Inicializa Flowbite (UI) — tw-elements init se ha eliminado durante la migración.
    initFlowbite();
  }
}
