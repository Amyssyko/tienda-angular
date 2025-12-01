import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { initTWE, Input } from 'tw-elements';
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
    // Inicializa Flowbite (UI)
    initFlowbite();

    // Inicializa los módulos de tw-elements detectados en las plantillas.
    // Nota: Datepicker no forma parte de la versión instalada (tw-elements v2)
    // y requiere una librería alternativa si la plantilla lo usa.
    try {
      initTWE({ Input });
    } catch (e) {
      console.warn('tw-elements init (AppComponent) failed:', e);
    }

    // Detectar uso de datepicker en plantillas y avisar (datepicker no incluido en tw-elements v2)
    if (
      typeof document !== 'undefined' &&
      document.querySelector('[data-te-datepicker-init]')
    ) {
      console.warn(
        'Detected data-te-datepicker-init in templates but Datepicker is not included in tw-elements v2. Consider using a dedicated datepicker library (flatpickr, Pikaday) or adjust templates.'
      );
    }
  }
}
