import { Component, OnInit } from '@angular/core';
import { proveedor } from 'src/app/interfaces/proveedor';
import { ProveedoresService } from 'src/app/services/proveedores.service';


@Component({
  selector: 'app-list-proveedor',
  templateUrl: './list-proveedor.component.html',
  styleUrls: ['./list-proveedor.component.css']
})
export class ListProveedorComponent implements OnInit{

  listProveedor: proveedor[] = [ ]

  constructor(private _proveedorService: ProveedoresService){}

  ngOnInit(): void {

    this.getListProveedores();
    
  }

    getListProveedores(){
    this._proveedorService.getListProveedores().subscribe((data) => {
    this.listProveedor = data;
   })
  }

}