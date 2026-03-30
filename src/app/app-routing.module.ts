import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { FacturaComponent } from './components/factura/factura.component';

import { FormularioFacturaComponent } from './components/formulario-factura/formulario-factura.component';
import { ProductoFormComponent } from './components/producto-form/producto-form.component';
import { ProductoComponent } from './components/producto/producto.component';
import { ProveedorComponent } from './components/proveedor/proveedor.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { VentaComponent } from './components/venta/venta.component';

const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  { path: 'productos', component: ProductoComponent },
  { path: 'proveedores', component: ProveedorComponent },
  { path: 'ventas', component: VentaComponent },
  { path: 'facturas', component: FacturaComponent },
  { path: 'clientes', component: UsuarioComponent },
  { path: 'facturacion', component: FormularioFacturaComponent },
  { path: 'producto/:id', component: ProductoFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
