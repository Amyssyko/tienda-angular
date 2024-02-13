import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { AddEditListaVentasComponent } from './components/add-edit-lista-ventas/add-edit-lista-ventas.component';
import { AddEditProductComponent } from './components/add-edit-product/add-edit-product.component';
import { AddEditProveedorComponent } from './components/add-edit-proveedor/add-edit-proveedor.component';
import { AddEditVentasComponent } from './components/add-edit-ventas/add-edit-ventas.component';
import { ListProductsComponent } from './components/list-products/list-products.component';
import { ListProveedorComponent } from './components/list-proveedor/list-proveedor.component';
import { ListVentaComponent } from './components/list-venta/list-venta.component';
import { ListVentas1Component } from './components/list-ventas1/list-ventas1.component';
import { ProductoComponent } from './components/producto/producto.component';

const routes: Routes = [
  { path: '', component: ListProductsComponent },
  { path: 'productos', component: ProductoComponent },
  { path: 'proveedor', component: ListProveedorComponent },
  { path: 'ventas', component: ListVentaComponent },
  { path: 'lista de ventas', component: ListVentas1Component },
  { path: 'addProduct', component: AddEditProductComponent },
  { path: 'listaProductos', component: ListProductsComponent },
  { path: 'addProveedor', component: AddEditProveedorComponent },
  { path: 'addVentas', component: AddEditVentasComponent },
  { path: 'addListaVentas', component: AddEditListaVentasComponent },
  { path: 'edit/:id', component: AddEditProductComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
