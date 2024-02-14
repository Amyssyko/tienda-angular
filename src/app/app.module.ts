import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Modulos
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

//componentes
import { AddEditListaVentasComponent } from './components/add-edit-lista-ventas/add-edit-lista-ventas.component';
import { AddEditProductComponent } from './components/add-edit-product/add-edit-product.component';
import { AddEditProveedorComponent } from './components/add-edit-proveedor/add-edit-proveedor.component';
import { AddEditVentasComponent } from './components/add-edit-ventas/add-edit-ventas.component';
import { ListProductsComponent } from './components/list-products/list-products.component';
import { ListProveedorComponent } from './components/list-proveedor/list-proveedor.component';
import { ListVentaComponent } from './components/list-venta/list-venta.component';
import { ListVentas1Component } from './components/list-ventas1/list-ventas1.component';
import { NavbarComponent } from './components/navbar/navbar.component';

//componente
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductoComponent } from './components/producto/producto.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ListProductsComponent,
    AddEditProductComponent,
    AddEditProveedorComponent,
    ListProveedorComponent,
    AddEditVentasComponent,
    AddEditListaVentasComponent,
    ListVentaComponent,
    ListVentas1Component,
    ProductoComponent,
    UsuarioComponent,
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
