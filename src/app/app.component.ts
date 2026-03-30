import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
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
    void this.initializeUiLibraries();
  }

  private async initializeUiLibraries(): Promise<void> {
    // Carga diferida para evitar inflar el chunk inicial.
    try {
      const flowbite = await import('flowbite');
      flowbite.initFlowbite();
    } catch (e) {
      console.warn('flowbite init (AppComponent) failed:', e);
    }

    const hasTwElementsMarkup =
      typeof document !== 'undefined' &&
      document.querySelector(
        '[data-te-input-wrapper-init], [data-te-datepicker-init]',
      );

    if (!hasTwElementsMarkup) {
      return;
    }

    // Inicializa módulos de tw-elements bajo demanda.
    try {
      const twElements = await import('tw-elements');
      twElements.initTWE({ Input: twElements.Input });
    } catch (e) {
      console.warn('tw-elements init (AppComponent) failed:', e);
    }

    // Datepicker no forma parte de tw-elements v2.
    if (
      typeof document !== 'undefined' &&
      document.querySelector('[data-te-datepicker-init]')
    ) {
      console.warn(
        'Detected data-te-datepicker-init in templates but Datepicker is not included in tw-elements v2. Consider using a dedicated datepicker library (flatpickr, Pikaday) or adjust templates.',
      );
    }
  }
}
