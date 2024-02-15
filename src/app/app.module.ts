import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FacturaComponent } from './components/factura/factura.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProductoComponent } from './components/producto/producto.component';
import { ProveedorComponent } from './components/proveedor/proveedor.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { VentaComponent } from './components/venta/venta.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProductoComponent,
    UsuarioComponent,
    ProveedorComponent,
    FacturaComponent,
    VentaComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      closeButton: true,
      preventDuplicates: true,
      positionClass: 'toast-top-right',
      newestOnTop: true,
      progressBar: true,
      progressAnimation: 'decreasing',
      resetTimeoutOnDuplicate: true,
      easeTime: 100,
    }), // ToastrModule added
  ],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
