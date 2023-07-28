import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SeguridadService } from 'src/app/services/seguridad.service';
import Swal from 'sweetalert2';
import { userModel } from 'src/app/models/user.model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  formularioEditarUser: FormGroup = new FormGroup({});
  id: string = this.route.snapshot.params["id"];

  usuario !: string;
  correo !: string;
  sucursal !: string;
  fecha !: string;
  perfil !: string;
  autorizado !: boolean;
  rol !: string;

  // idRol !: string;

  constructor(
    private fb: FormBuilder,
    private servicioSeguridad: SeguridadService,
    private route: ActivatedRoute,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.Construccionformulario();
    this.iniciarFormulario();
  }

  //Metodo
  Construccionformulario() {
    this.formularioEditarUser = this.fb.group({
      //id: ["",[Validators.required]],
      nombreCompleto: ["", [Validators.required]],
      correo: ["", [Validators.required]],
      sucursal: ["", [Validators.required]],
      fechaNacimiento: ["", [Validators.required]],
      rol: ["", [Validators.required]],
      autorizado: ["", [Validators.required]],
    });
  }

  //Funcion

  //Método para que los parámetros del formulario se inicialicen
  iniciarFormulario() {
    //captura los datos ingresados en el formulario

    //Llama Servicio para extraer de la BD el usuario a reset password
    //  console.log("this.route.snapshot.params[id]: " + this.route.snapshot.params["id"]);

    this.servicioSeguridad.SolicitarUser_id(this.id).subscribe({
      next: (data: any) => {
        console.log('Data:',data);
        this.usuario = data.usuario;
        this.formularioEditarUser.controls['nombreCompleto'].setValue(data.nombreCompleto);
        this.formularioEditarUser.controls['correo'].setValue(data.correo);
      
        // Eliminar la información de la zona horaria y formatear la fecha en "yyyy-MM-dd"
        const dateSinZonaHoraria = new Date(data.fechaNacimiento).toISOString().split('T')[0];
        this.formularioEditarUser.controls['fechaNacimiento'].setValue(dateSinZonaHoraria);

        this.sucursal = data.sucursal;
        this.formularioEditarUser.controls['sucursal'].setValue(this.sucursal);
        this.rol = data.rol.nombreRol;

        // console.log('Rol:',this.rol);
        this.formularioEditarUser.controls['rol'].setValue(this.rol);
        this.autorizado = data.autorizado;
        this.formularioEditarUser.controls['autorizado'].setValue(this.autorizado);
  
      },
      error: (e) => console.log(e)
    });
  }

  GuardarCambios() {
    //Resetea la contraseña

    if (this.formularioEditarUser.invalid) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: `Todos los campos son obligatorios !!`,
        showConfirmButton: true,
        confirmButtonText: 'Entendido'
      });
    } else {
      //captura los datos ingresados en el formulario
      let user = new userModel();
      user.id = this.id;  //Capturado mediante el this.route.snapshot.params["id"];
      user.usuario = this.usuario;
      user.nombreCompleto = this.formularioEditarUser.controls['nombreCompleto'].value;
      user.correo = this.formularioEditarUser.controls['correo'].value;
      user.fechaNacimiento = new Date(this.formularioEditarUser.controls['fechaNacimiento'].value);
      user.sucursal = this.capturarSelectSucursal();
      user.rol = this.capturarSelectRol();
      let autorizado = this.capturarSelectAutorizado();

      if (autorizado == "true") {
        user.autorizado = true;
      } else {
        user.autorizado = false;
      }

      console.log("Autorizado ?:",autorizado);
      this.rol = user.rol;

      //Llama Servicio para guardar en la base de datos los datos del usuario
      this.servicioSeguridad.actualizarUserServicio(user).subscribe({
        next: (data) => {
          console.log(data);
          //if(data){
          //  this.id=data.id;
          //Graba el Role en la base de datos
          console.log('Rol User:',this.rol);
          console.log('IdUser:',this.id);
          this.RegistrarRoleUsuario(this.rol, this.id);
          this.router.navigate(['./listarUsers']);
          // }else{
          //  GenerarVentanaModal("algo falló en la edición del usuario");
          //  this.router.navigate(['../seguridad/listarUser']);
          //  }
        },
        error: (e) => console.log(e)
      });
    }
  }


  RegistrarRoleUsuario(role: string, idUser: string) {
    //Graba el Role del usuario
    this.servicioSeguridad.ActualizarRoleUsuarioService(role, idUser).subscribe({
      next: (data:any) => {
        //console.log(data);
        if (data) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: `Actualización de usuario exitosa !!`,
            showConfirmButton: true,
            confirmButtonText: 'Entendido'
          });
          //this.router.navigate(['home']);
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: `Falló la actualización del usuario !!`,
            showConfirmButton: true,
            confirmButtonText: 'Entendido'
          });
          //this.router.navigate(['home']);
        }
      },
      error: (e) => console.log(e)
    });

  }

  capturarSelectSucursal(): string {
    const e = document.getElementById("idSucursal") as HTMLSelectElement;
    const text = e.options[e.selectedIndex].text;
    return text;
  }

  capturarSelectRol(): string {
    const e = document.getElementById("idRol") as HTMLSelectElement;
    const text = e.options[e.selectedIndex].text;
    return text;
  }

  capturarSelectAutorizado(): string {
    const e = document.getElementById("idAutorizado") as HTMLSelectElement;
    const text = e.options[e.selectedIndex].text;
    return text;
  }

  capturarSelectFecha(): string {
    const e = document.getElementById("idFecha") as HTMLSelectElement;
    const text = e.options[e.selectedIndex].text;
    return text;
  }
}
