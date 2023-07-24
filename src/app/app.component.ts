import { Component, OnInit } from '@angular/core';
import { SeguridadService } from './services/seguridad.service';
import { DatosSesionModel } from './models/datos-sesion.model';
import { Router, NavigationEnd, Event } from '@angular/router'; // Cambiar aquí
import { filter, take } from 'rxjs/operators';
import { SharedService } from './services/shared.service';

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

  constructor(
    private seguridadService: SeguridadService,
    private router: Router,
    private sharedService: SharedService
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

  ngOnInit(): void {
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
