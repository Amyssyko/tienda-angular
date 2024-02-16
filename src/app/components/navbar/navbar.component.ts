import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/shared/services/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  usuario: Usuario = new Usuario();

  link: { name: string; url: string; pathname: boolean }[] = [
    // { name: 'inicio', url: '/', pathname: '/' === window.location.pathname },
    {
      name: 'productos',
      url: '/productos',
      pathname: '/productos' === window.location.pathname,
    },
    {
      name: 'proveedores',
      url: '/proveedores',
      pathname: '/proveedores' === window.location.pathname,
    },
    {
      name: 'clientes',
      url: '/clientes',
      pathname: '/clientes' === window.location.pathname,
    },
    {
      name: 'facturas',
      url: '/facturas',
      pathname: '/facturas' === window.location.pathname,
    },
  ];

  constructor(private _usuarioService: UsuarioService) {}
  ngOnInit(): void {
    this.obtenerUsuario('4d9a2691-d10a-4bf8-849d-df494750fcad');
  }

  obtenerUsuario(id: string) {
    this._usuarioService.obtenerUsuario(id).subscribe((usuario) => {
      this.usuario = usuario;
    });
  }
}
