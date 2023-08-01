import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import Swal from 'sweetalert2';


declare const StickyNavigation: any;

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})

export class SolicitudesComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    new StickyNavigation();
  }

  ngAfterViewInit(): void {
    
    // this.avisoAlert();

  }

  ngOnDestroy() {
    // Limpiar eventos y objetos relacionados con StickyNavigation para eliminar errores al cambiar de Componente en la NavBar Principal
    $(window).off('scroll');
    $(window).off('resize');
    $('.et-hero-tab').off('click');

    // Si es necesario, llamar a métodos adicionales de limpieza en StickyNavigation
    // this.stickyNavigation.cleanupMethod();
  }

  /* avisoAlert() {
    Swal.fire({
      position: 'center',
      icon: 'info',
      title: `Este componente se encuentra en Construcción !`,
      text: 'Pronto estará disponible , se encuentra en proceso de desarrollo...',
      showConfirmButton: true,
      confirmButtonText: 'Entendido'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/home']);
      }
    });
  } */

}
