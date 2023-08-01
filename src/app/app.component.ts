import { Component, HostListener, OnInit } from '@angular/core';
import { SeguridadService } from './services/seguridad.service';
import { DatosSesionModel } from './models/datos-sesion.model';
import { Router, NavigationEnd, Event } from '@angular/router'; // Cambiar aquí
import { filter, take } from 'rxjs/operators';
import { SharedService } from './services/shared.service';
import { SessionStorageService } from './services/sessionStorage.service';
import Swal from 'sweetalert2';

// El resto del código se mantiene igual

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Intranet';

  isSideNavCollapsed = false;
  screenWidth = 0;

  sesionActiva !: boolean;
  showRegister = false;
  showResetPass = false;

  tiempoRestante !: number;   // Tiempo de vida asignado al token una vez se vencio !!
  isLoggedIn = false; // Valor inicial por defecto

  constructor(
    private seguridadService: SeguridadService,
    private router: Router,
    private sharedService: SharedService,
    private servicioSessionStorage: SessionStorageService,
    private serviceSeguridad : SeguridadService
  ) {
    this.showRegister = false;
    this.showResetPass = false;

     // Suscribirse a los cambios en las rutas y filtrar los eventos de tipo NavigationEnd
     this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd),
      take(1) // Tomar solo el primer evento NavigationEnd para evitar suscripciones múltiples
    ).subscribe((event: NavigationEnd) => {
      // Verificar la ruta actual y establecer la visibilidad de los componentes
      const currentRoute = event.url;
      this.showRegister = currentRoute.includes('register');
      this.showResetPass = currentRoute.includes('resetPass');
    });
    
  }

   // Los hostListner se ponen en funcionamiento una vez se verifica la variable del sessionStorage que valida el inicio de sesion
   @HostListener('window:click') onClick() {
    if (this.isLoggedIn) {
      this.servicioSessionStorage.refreshTokenExpiration();
    } else {
      console.log('Hostlistener Off');
      this.desactivarHostListeners();
    }
  }

  @HostListener('window:mousemove') onMouseMove() {
    if (this.isLoggedIn) {
      this.servicioSessionStorage.refreshTokenExpiration();
    } else {
      console.log('Hostlistener Off');
      this.desactivarHostListeners();
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.verificarInicioSesion();
    }, 1 * 1000);

    setInterval(() => {
      this.verificarExpiracionToken();
    }, 30 * 1000); // --> en Milisegundos = 30 segundos

    // Suscribirse al observable isLoggedIn$ para actualizar la variable sesionActiva
    this.sharedService.isLoggedIn$.subscribe(isLoggedIn => {
      this.sesionActiva = isLoggedIn;
    });
    // Suscribirse al observable showRegister$ para actualizar la variable showRegister
    this.sharedService.showRegister$.subscribe(showRegister => {
      this.showRegister = showRegister;
    });
    // Suscribirse al observable showResetPass$ para actualizar la variable showResetPass
    this.sharedService.showResetPass$.subscribe(showResetPass => {
      this.showResetPass = showResetPass;
    });
    // Llamamos a EstadoSesion al cargar el componente inicialmente
    this.EstadoSesion();
  }

  // Se realiza la validacion despues de cargar el Oninit para que no afecte el funcionamiento de los Hoslistner

  desactivarHostListeners(): void {
    window.removeEventListener('click', this.onClick);
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  // Verificamos tiempo de vida del token , si el tiempo de vida expiro se le asigna 20 segundos para avisar al usuario del cierre de Sesion
  verificarExpiracionToken(): void {
    if (!this.servicioSessionStorage.VerificarTokenExpirado()) {
      console.log('Check Token');
    } else {
      this.tiempoRestante = 20;
    
      Swal.fire({
        title: 'Tu sesión está a punto de expirar',
        text: `La sesión se cerrará en ${this.tiempoRestante} segundos`,
        timer: 20 * 1000, // Tiempo en milisegundos (20 segundos)
        timerProgressBar: true,
        showCancelButton: true, // Mostrar el botón de cancelar
        showConfirmButton: true,
        cancelButtonText: 'Cerrar Sesión',
        confirmButtonText: 'Quiero continuar',
        icon: 'warning',
        allowOutsideClick: false,
        showClass: {
          popup: 'swal2-noanimation',
          backdrop: 'swal2-noanimation'
        },
        hideClass: {
          popup: '',
          backdrop: ''
        }
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('Vida de Token aumentada');
          // El usuario ha seleccionado "Quiero continuar"
          clearInterval(interval);
          this.servicioSessionStorage.refreshTokenExpiration();
          this.verificarInicioSesion();
          this.verificarExpiracionToken(); 
          
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // El usuario ha seleccionado "Cerrar Sesion"
          clearInterval(interval);
          this.cerrarSesion();
        }
      });
  
      // Actualizar el contador cada segundo
      const interval = setInterval(() => {
        this.tiempoRestante--;
        Swal.fire({
          text: `La sesión se cerrará en ${this.tiempoRestante} segundos`,
        });
        if (this.tiempoRestante === 0) {
          clearInterval(interval);
          this.cerrarSesion();
        }
      }, 1000);
    }
  }
    
  // Borramos datos del sessionStorage

  cerrarSesion(): void {
    this.servicioSessionStorage.EliminarDatosSesion();
    this.serviceSeguridad.RefrescarDatosSesion(new DatosSesionModel());
    this.router.navigate([""]);
  }

  // Verificar estado de inicio de sesion

  verificarInicioSesion(): void {
    const datosSesion = this.servicioSessionStorage.ObtenerSesionInfo();
    // console.log('datos:', datosSesion);
    if (datosSesion?.isLoggedIn) {
      this.isLoggedIn = true;
    }
  }

  onRegisterClick(): void {
    this.showRegister = true;
  }

  onResetPassClick(): void {
    this.showResetPass = true;
  }

  EstadoSesion() {
    this.seguridadService.ObtenerInfoSesion().subscribe({
      next: (datos: DatosSesionModel) => {
        const sesionAnterior = this.sesionActiva;
        this.sesionActiva = datos.isLoggedIn;
        if (this.sesionActiva !== sesionAnterior) {
          console.log('Estado sesion:', this.sesionActiva);
        }
      }
    })
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
