import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Modulos
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//componentes
import { NavbarComponent } from './components/navbar/navbar.component';
import { ListProductsComponent } from './components/list-products/list-products.component';
import { AddEditProductComponent } from './components/add-edit-product/add-edit-product.component';
import { AddEditProveedorComponent } from './components/add-edit-proveedor/add-edit-proveedor.component';
import { ListProveedorComponent } from './components/list-proveedor/list-proveedor.component';
import { AddEditVentasComponent } from './components/add-edit-ventas/add-edit-ventas.component';
import { AddEditListaVentasComponent } from './components/add-edit-lista-ventas/add-edit-lista-ventas.component';
import { ListVentaComponent } from './components/list-venta/list-venta.component';
import { ListVentas1Component } from './components/list-ventas1/list-ventas1.component';


//componente
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductoComponent } from './components/producto/producto.component';


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
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule

  ],

  

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
