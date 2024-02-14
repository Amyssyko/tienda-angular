import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/interfaces/producto';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
})
export class ListProductsComponent implements OnInit {
  listProducts: Producto[] = [
    {
      producto_id: 1,
      proveedor_id: 2,
      nombre: 'Frenchy Camisa De Tamaño Grande De Color Sólido Con Cuello Alto',
      modelo: 'Top',
      precio: 11,
      stock: 20,
    },
    {
      producto_id: 2,
      proveedor_id: 1,
      nombre: 'MOD Vestido escote corazón de manga farol pecho con fruncido',
      modelo: 'A linea',
      precio: 17.1,
      stock: 15,
    },
    {
      producto_id: 3,
      proveedor_id: 4,
      nombre: 'EZwear Short Con Falda-pantalón Y Bolsillos',
      modelo: 'Falda pantalon',
      precio: 11,
      stock: 30,
    },
  ];

  constructor(private _productService: ProductService) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  // ngOnInit(): void {
  //   this.getLisProducts();

  // }

  // getLisProducts() {
  //   this._productService.obtenerProductos().subscribe((data) => {
  //     this.listProducts = data;

  //   })
  // }

  deleteProduct(producto_id: number): void {
    this.listProducts = this.listProducts.filter(
      (item) => item.producto_id !== producto_id
    );
  }
}
