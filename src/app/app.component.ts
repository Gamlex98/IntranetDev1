import { Component , OnInit} from '@angular/core';
import { SeguridadService } from './services/seguridad.service';
import { DatosSesionModel } from './models/datos-sesion.model';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Intranet';

  isSideNavCollapsed = false;
  screenWidth = 0;

  sesionActiva !: boolean;

  constructor(
    private seguridadService : SeguridadService
  ) {

  }

  ngOnInit(): void {
    this.EstadoSesion();
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
