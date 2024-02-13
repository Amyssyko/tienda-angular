import { Component, OnInit } from '@angular/core';
import { listVenta } from 'src/app/interfaces/listaVentas';

@Component({
  selector: 'app-list-ventas1',
  templateUrl: './list-ventas1.component.html',
  styleUrls: ['./list-ventas1.component.css']
})
export class ListVentas1Component implements OnInit {

  listVentas1: listVenta[] = [
    { id: 1,  cantidad: 1 },
    { id: 2,  cantidad: 2, },
    { id: 3,  cantidad: 4 }
  ]

  ngOnInit(): void {
    
  }

}
