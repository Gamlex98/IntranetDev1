import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { SessionStorageService } from 'src/app/services/sessionStorage.service';
import { DatosSesionModel } from 'src/app/models/datos-sesion.model';

@Component({
  selector: 'app-profileUser',
  templateUrl: './profileUser.component.html',
  styleUrls: ['./profileUser.component.css']
})
export class ProfileUserComponent implements OnInit {
  idUser !: string;
  nombreUser !: string;
  correoUser !: string;
  sucursal !: string;
  cargo !: string;
  ciudad !: string;
  fecha !: string;

  dataSesion : DatosSesionModel | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private servicioSeguridad: SeguridadService,
    private router: Router,
    private sessionStorage : SessionStorageService

  ) { }

  ngOnInit() {

    this.obtenerDatosSesion();
  }

  obtenerDatosSesion(): void {
    this.dataSesion = this.sessionStorage.ObtenerSesionInfo();
    if (this.dataSesion) {
      this.idUser = this.dataSesion.datos.id;
      // console.log(this.idUser); 
    }
    this.dataUser();
  }

  dataUser () {
    this.servicioSeguridad.SolicitarUser_id(this.idUser).subscribe({
      next: (data: any) => {
        this.nombreUser= data.nombreCompleto;
        // console.log('Nombre:',this.nombreUser);
        this.correoUser = data.correo;
        // console.log('Correo:',this.correoUser);
        this.sucursal = data.sucursal;
        this.cargo = data.cargo;
        this.ciudad = data.lugarNacimiento;
        this.fecha = data.fechaNacimiento;
      },
      error: (e) => console.log(e)
    });
  }

  cerrarSesion() {
    this.sessionStorage.EliminarDatosSesion();
    window.location.reload();
  }
  
}
