
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SeguridadService } from 'src/app/services/seguridad.service';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private seguridadService: SeguridadService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Verificar si la sesión está activa
    if (this.seguridadService.ObtenerInfoSesion()) {
      return true; // Permite el acceso a la ruta
    } else {
      // Si la sesión no está activa, redirige al componente de login (app-login)
      this.router.navigate(['/login']);
      return false; // No permite el acceso a la ruta
    }
  }
}
