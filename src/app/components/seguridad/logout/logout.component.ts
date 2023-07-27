import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatosSesionModel } from 'src/app/models/datos-sesion.model';
import { SessionStorageService } from 'src/app/services/sessionStorage.service';
import { SeguridadService } from 'src/app/services/seguridad.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})

export class LogoutComponent implements OnInit{

  constructor(
    private serviceSeguridad: SeguridadService,
    private servicioSessionStorage: SessionStorageService,
    private router:Router
  ) {
  }

  ngOnInit(): void {
    this.servicioSessionStorage.EliminarDatosSesion();
    this.serviceSeguridad.RefrescarDatosSesion(new DatosSesionModel());
    this.router.navigate(["/Home"]);
  }

}
