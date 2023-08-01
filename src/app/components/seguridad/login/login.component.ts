import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CredencialesUserModel } from 'src/app/models/credenciales.user';
import { DatosSesionModel } from 'src/app/models/datos-sesion.model';
import { userModel } from 'src/app/models/user.model';
import { SessionStorageService } from 'src/app/services/sessionStorage.service';
import Swal from 'sweetalert2';
import { MD5 } from 'crypto-js';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, AfterViewInit {
  @Output() registerClick = new EventEmitter<void>();
  @Output() resetPassClick = new EventEmitter<void>();

  formularioLogin: FormGroup = new FormGroup({});
  mostrar: Boolean = true;
  siteKey: string = '';

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private formBuild: FormBuilder,
    private serviceSeguridad: SeguridadService,
    private servicioSessionStorage: SessionStorageService,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.siteKey = "6Ld6BCwjAAAAAMBTkRCSXqSyZQQp7Cz8AjLhmPMn";  //Se copia la clave dada por google";
  }

  ngOnInit(): void {
    this.ConstruccionFormulario();
  }

  ngAfterViewInit(): void {

  }
  onRegisterClick(): void {
    this.registerClick.emit();
  }

  onResetPassClick(): void {
    this.resetPassClick.emit();
  }

  ConstruccionFormulario() {
    this.formularioLogin = this.formBuild.group({
      usuario: ["", [Validators.required, Validators.minLength(3)]],
      password: ["", [Validators.required, Validators.minLength(4)]]
    });
  }

  Login() {
    if (this.formularioLogin.invalid) {
      this.mostrar = false;
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: `Datos incorrectos !!`,
        text: `Debe contener mínimo 3 caracteres y la contraseña de 4 ...`,
        showConfirmButton: true,
        confirmButtonText: 'Entendido'
      });
    } else {
      let datos = new CredencialesUserModel();
      datos.usuario = this.formularioLogin.controls['usuario'].value;
      // datos.password = this.formularioLogin.controls['password'].value;
      datos.password=MD5(this.formularioLogin.controls['password'].value).toString();
      datos.autorizado = true;

      console.log('Usuario :',datos.usuario);
      console.log('Password :',datos.password);
      console.log('Autorizado ? :',datos.autorizado);

      this.serviceSeguridad.Login(datos).subscribe({
        next: (data: DatosSesionModel) => {
          //console.log("data: " + data.info?.usuario);
          let info = new userModel();
          info.id = data.info?.id;
          //console.log("data id en login: " + info.id);
          if (data.tk) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `Bienvenido a la Intranet !!`,
              text: `Has iniciado sesión correctamente ...`,
              showConfirmButton: true,
              confirmButtonText: 'Entendido'
            });
            data.fecha = "1970-01-01T00:00:00.000+00:00";

            //Para controlar el tiempo de inactividad del usuario
            const horaActual = new Date();
            const expiracionToken = new Date(horaActual.getTime() + this.servicioSessionStorage.INACTIVITY_TIMEOUT); // tiempo de vida al Token -Viene del localStorageService
            // console.log('Actual :', horaActual);
            // console.log('Token : ', expiracionToken);
            data.expiracionToken = expiracionToken;
            data.isLoggedIn = true;

            this.servicioSessionStorage.GuardarDatosSesion(data);
            this.serviceSeguridad.RefrescarDatosSesion(data);
            this.serviceSeguridad.VerificarSesionActiva();

            window.location.reload(); // Refrescamos la pagina para que el rol se tome correctamente
          } else {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: `No tiene Token !!`,
              text: `No se genero el token para la sesión ...`,
              showConfirmButton: true,
              confirmButtonText: 'Entendido'
            });
            console.log("No  tiene tk");
            this.router.navigate(['/login']);

          }

        },
        error: (e) => {
          console.log("Se presentó error en el login");
          let message = e["error"]["error"]["name"];
          console.log("message: " + message);
          if (message == "UnauthorizedError") {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: `Usuario/Contraseña incorrectos !!`,
              text: `Los datos son incorrectos o eres un usuario no autorizado ...`,
              showConfirmButton: true,
              confirmButtonText: 'Entendido'
            });
          } else {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: `Se ha presentado un error ?`,
              text: `Por favor revisar que tengas la vpn activa...`,
              showConfirmButton: true,
              confirmButtonText: 'Entendido'
            });
          }
          console.log(e);
        }
      });
      this.router.navigate(['home']);
    }
  }   //Fin Login

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const passwordInput = document.getElementById("clave") as HTMLInputElement;
    passwordInput.type = this.showPassword ? "text" : "password";
  }

}
