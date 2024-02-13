import { Component, OnInit } from '@angular/core';
import { ventas } from 'src/app/interfaces/ventas';


@Component({
  selector: 'app-list-venta',
  templateUrl: './list-venta.component.html',
  styleUrls: ['./list-venta.component.css']
})
export class ListVentaComponent implements OnInit{

  listVenta: ventas[] = [
    { ventas_id: 1, fecha: new Date(), total: 11 },
    { ventas_id: 2, fecha: new Date(), total: 34.2, },
    { ventas_id: 3, fecha: new Date(), total: 44 }
  ]

  ngOnInit(): void {
    
  }

}
