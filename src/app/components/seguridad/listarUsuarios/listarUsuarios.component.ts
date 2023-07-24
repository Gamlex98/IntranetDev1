import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { userModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-listarUsuarios',
  templateUrl: './listarUsuarios.component.html',
  styleUrls: ['./listarUsuarios.component.css']
})

export class ListarUsuariosComponent implements OnInit {
  @ViewChild('selectFiltroListUser') selectFiltroListUser: any;
  @ViewChild('selectOrdenAscListUser') selectOrdenAscListUser: any;
  @ViewChild('selectBuscarListUser') selectBuscarListUser: any;

  listaUsuario: userModel []=[];
  formularioListarUser : FormGroup = new FormGroup({});

  constructor(
      private formBuild:FormBuilder,
      private servicioSeguridad: SeguridadService,

  ) { }

  ngOnInit(): void {
    this.ConstruccionFormulario();
    //llama a función para listar los usuarios de la Intranet
    this.listarUsers("id", "ASC");
  //  throw new Error('Method not implemented.');
  }

ConstruccionFormulario(){
  this.formularioListarUser=this.formBuild.group({
      buscarUser:["",[]],
  });
}

  //Consulta todos los usuarios que existen en la base de datos
listarUsers(campo:string, orden:string){
  //utiliza servicio para listar todos los cuadres de caja
  this.servicioSeguridad.listarUsuariosServicio(campo, orden).subscribe({
      next: (datos:userModel[])=>{
          this.listaUsuario=datos;
          //console.log(this.listaUsuario);
          let usuario = new userModel();
          for(let i = 0; i < this.listaUsuario.length; i++){

              usuario = this.listaUsuario[i];
              //Como el usuario.role es un objeto de java hay que tratarlo para poder leer el perfil

              // let roleJson= JSON.stringify(usuario.rol);
              // let roleString= JSON.parse(roleJson);

              //console.log("roleString.nombrerol: " + roleString.nombreRol)

              //copia en usuario.role el rol/perfil del usuario para mostrarlo

              // usuario.rol = roleString.nombreRol;

              this.listaUsuario[i]=usuario;

            }
      },
      error:(e)=> console.log(e)
    }
    );
  }

  //Busca en la base de datos a los usuarios que cumplan con los criterios de búsqueda
  listarUserBusqueda(buscar:string, campoBuscar:string){

    //utiliza servicio para listar todos los cuadres de caja
    this.servicioSeguridad.BusquedaUsuariosServicio(buscar, campoBuscar).subscribe({
        next: (datos:userModel[])=>{
            this.listaUsuario=datos;
            //console.log(this.listaUsuario);
            let usuario = new userModel();
            for(let i = 0; i < this.listaUsuario.length; i++){
                usuario = this.listaUsuario[i];
                //Como el usuario.role es un objeto de java hay que tratarlo para poder leer el perfil
                // let roleJson= JSON.stringify(usuario.rol);
                // let roleString= JSON.parse(roleJson);
                // console.log("roleString.nombrerol: " + roleString.nombreRol)

                //copia en usuario.role el rol/perfil del usuario para mostrarlo

                // usuario.rol = roleString.nombreRol;

                this.listaUsuario[i]=usuario;

              }
        },
        error:(e)=> console.log(e)
      }
      );
    }

  //
//Aplica el filtro seleccionado por el usuario
aplicarFiltroUser(){
  let ordenFiltro =  this.capturarSelectCampoFiltroUser();
  let campoFiltro= this.capturarSelectOrdenFiltroUser();
  //console.log("campoFiltro: ", campoFiltro);
  //console.log("ordenFiltro: ", ordenFiltro);
  if (ordenFiltro =="ascendente"){
        ordenFiltro ="ASC";
  }else {
        ordenFiltro ="DESC";
      }
  //console.log("campoFiltro: " + campoFiltro);
  //console.log("ordenFiltro: " + ordenFiltro);
  if(campoFiltro=="defecto"){
    this.listarUsers("id", ordenFiltro);
}else{
      this.listarUsers(campoFiltro, ordenFiltro);
    }
}

//
//Busca lo que el usuario desea
aplicarBusqueda(){
  let campoBuscar= this.capturarSelectCampoBuscarUser();
  let buscar =this.formularioListarUser.controls['buscarUser'].value;
  //console.log("campoBuscar: " + campoBuscar);
  //console.log("buscarUser: " + buscar);
  this.listarUserBusqueda(buscar, campoBuscar);
  }

// CAPTURAR INFORMACION DEL HTML 

capturarSelectCampoFiltroUser(): string {
  const selectedIndex = this.selectFiltroListUser.nativeElement.selectedIndex;
  const selectedOption = this.selectFiltroListUser.nativeElement.options[selectedIndex].text;
  console.log('CAMPO:', selectedOption);
  return selectedOption;
}

capturarSelectOrdenFiltroUser(): string {
  const selectedIndex = this.selectOrdenAscListUser.nativeElement.selectedIndex;
  const selectedOption = this.selectOrdenAscListUser.nativeElement.options[selectedIndex].text;
  console.log('ORDEN :', selectedOption);
  return selectedOption;
}

capturarSelectCampoBuscarUser(): string {
  const selectedIndex = this.selectBuscarListUser.nativeElement.selectedIndex;
  const selectedOption = this.selectBuscarListUser.nativeElement.options[selectedIndex].text;
  console.log('CAMPO BUSCAR:', selectedOption);
  return selectedOption;
}
  
}
