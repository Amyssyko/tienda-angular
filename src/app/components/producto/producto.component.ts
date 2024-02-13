import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/interfaces/producto.d';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  active: boolean = false;

  constructor(private _productService: ProductService) {}
  ngOnInit(): void {
    this.getProducts();
  }

  setActive() {
    this.active = !this.active;
  }

  putProductoId(id: string, producto: Producto) {
    this._productService.putProductoId(id, producto).subscribe((data) => {
      console.log(data);
      this.getProducts();
    });
  }

  deleteProductoId(id: string) {
    this._productService.deleteProductoId(id).subscribe((data) => {
      console.log(data);
      this.getProducts();
    });
  }

  getProducts() {
    this._productService.getProducts().subscribe((data) => {
      this.productos = data;
    }),
      (error: any) => {
        console.error(error);
      };
  }
}
