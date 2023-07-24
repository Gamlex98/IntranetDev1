import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RolModel } from 'src/app/models/rol.model';
import { SeguridadService } from 'src/app/services/seguridad.service';

@Component({
  selector: 'app-listarRoles',
  templateUrl: './listarRoles.component.html',
  styleUrls: ['./listarRoles.component.css']
})
export class ListarRolesComponent implements OnInit {
  @ViewChild('selectBuscarListRoles') selectBuscarListRoles: any;


  listaRoles: RolModel []=[];
  listaRolesFiltrados : RolModel []=[];

  formularioListaRoles : FormGroup = new FormGroup({});
  constructor(
      private formBuild:FormBuilder,
      private servicioSeguridad: SeguridadService,

  ) { }

  ngOnInit(): void {
    this.ConstruccionFormulario();
  
    // Llama a función para listar los roles de la Intranet sin filtros
    this.listarRolesBusqueda();
  }
  

  ConstruccionFormulario() {
    this.formularioListaRoles = this.formBuild.group({
      buscaRol: ["", []],
    });
  }
  
  //Busca en la base de datos a los usuarios que cumplan con los criterios de búsqueda
  listarRolesBusqueda(buscar?: string) {
    this.servicioSeguridad.buscarRoleservice().subscribe({
      next: (datos: RolModel[]) => {
        if (buscar) {
          this.listaRolesFiltrados = datos.filter((rol: RolModel) => {
            if (rol.nombreRol && typeof rol.nombreRol === 'string') {
              return rol.nombreRol.toLowerCase().includes(buscar.toLowerCase());
            }
            return false;
          });
        } else {
          this.listaRolesFiltrados = datos;
        }
        console.log('DataRoles:', this.listaRolesFiltrados);
      },
      error: (e) => console.log(e)
    });
  }
  

//Busca lo que el usuario desea
aplicarBusqueda() {
  let buscar = this.formularioListaRoles.controls['buscaRol'].value;
  this.listarRolesBusqueda(buscar);
}



}
