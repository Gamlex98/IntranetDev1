import {animate,keyframes,style,transition,trigger} from '@angular/animations';
import {Component,EventEmitter,HostListener,OnInit,Output, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { navbarData } from './nav-data';
import { INavbarData, fadeInOut } from './helper';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { DatosSesionModel } from 'src/app/models/datos-sesion.model';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './nav-var.component.html',
  styleUrls: ['./nav-var.component.scss'],
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate(
          '1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' }),
          ])
        ),
      ]),
    ]),
  ],
})

export class NavVarComponent implements OnInit , AfterViewInit {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();

  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  multiple: boolean = false;

  sesionActiva!: boolean;
  rolUsuario!: string;

  constructor(
    public router: Router,
    private seguridadService: SeguridadService
  ) {}

  @HostListener('window:resize', ['$event'])
  ngOnInit(): void {
    this.leerDatos();
    this.navData = this.getFilteredNavbarData();

    // Asegurar que la barra de navegación esté correctamente expandida o contraída al cargar la página

    this.ajustarPantalla(); 

  }
  
  ngAfterViewInit(): void {

  }

  leerDatos() {
    let datosActuales = sessionStorage.getItem("sesionIntranet");
    if (datosActuales) {
      let datoSesionJson = JSON.parse(datosActuales);
      let datos = datoSesionJson.datos;
      //this.sucursal = datosLS.sede;
      const rolUsuarioAnterior = this.rolUsuario;
      this.rolUsuario = datos.role;
      if (this.rolUsuario !== rolUsuarioAnterior) {
        console.log('Rol Usuario :', this.rolUsuario);
      }
    }
  }

  getFilteredNavbarData(): INavbarData[] {
    if (this.rolUsuario) {
      return this.navData.filter((data) => {
        // Si no se ha definido rolesToShow en el elemento o el rol del usuario está en rolesToShow, se muestra el elemento
        return !data.rolesToShow || data.rolesToShow.includes(this.rolUsuario);
      });
    } else {
      return [];
    }
  }

  ajustarPantalla() {
    this.screenWidth = window.innerWidth; // Obtener el ancho de la ventana después de que se haya renderizado la vista

    if (this.screenWidth <= 1100) {
      this.collapsed = false;
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    } else {
      this.collapsed = true;
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    }
  }

  togglecollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  handleClick(data: INavbarData): void {
    if (data.items && data.items.length > 0) {
      data.expanded = !data.expanded;
    } else {
      // Aquí puedes agregar el código para redirigir a la página correspondiente
      this.router.navigate([data.routeLink]);
    }
  }

  getActiveClass(data: INavbarData): string {
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
      for (let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }
}
