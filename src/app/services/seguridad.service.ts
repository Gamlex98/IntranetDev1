import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CredencialesUserModel } from '../models/credenciales.user';
import { DatosSesionModel } from '../models/datos-sesion.model';
import { userModel } from '../models/user.model';
import { RolModel } from '../models/rol.model';
import { SessionStorageService } from './sessionStorage.service';

@Injectable({
  providedIn: 'root',
})
export class SeguridadService {
  urlLoopback: string = 'http://172.16.1.249:3030';

  infoSesion: BehaviorSubject<DatosSesionModel> =
    new BehaviorSubject<DatosSesionModel>(new DatosSesionModel());

  constructor(
    private http: HttpClient,
    //Se crea variable privada servicioLocalStorage para poder llamar un método creado en el local-storage.service.ts
    private servicioSessionStorage: SessionStorageService
  ) {
    //En el constructor de seguridad.service.ts se incluye verificarSesionActiva para efectos de que apenas abra el navegador el sistema le verifique si dejó una sesión activa o no y si la dejo activa le muestre el menú de cuando ya está logueado.
    this.VerificarSesionActiva();
  }

  passwordRecoveryService(identUsuario: string): Observable<any> {
    return this.http.post<any>(
      `${this.urlLoopback}/RecuperarContrasenaId/${identUsuario}`,
      {
        identUsuario: identUsuario,
      }
    );
  }

  Login(Credentials: CredencialesUserModel): Observable<any> {
    console.log('usuario:', Credentials.usuario, typeof Credentials.usuario);
    console.log('password:', Credentials.password, typeof Credentials.password);
    console.log('autorizado:',Credentials.autorizado,typeof Credentials.autorizado);

    return this.http.post(`${this.urlLoopback}/LoginT`, {
      usuario: Credentials.usuario,
      password: Credentials.password,
      autorizado: Credentials.autorizado,
    });
  }

  VerificarSesionActiva() {
    let info = this.servicioSessionStorage.ObtenerSesionInfo();
    if (info) {
      info.isLoggedIn = true;
      this.RefrescarDatosSesion(info);
      //console.log("isLoggedIn: en VerificarSesionActiva: "+ info.isLoggedIn);
      //console.log("fecha en VerificarSesionActiva: "+ info.fecha);
      return true;
    } else {
      return false;
    }
  }

  RefrescarDatosSesion(datos: DatosSesionModel) {
    this.infoSesion.next(datos);
  }

  //7. Adiciono otro método en el servicio de seguridad (seguridad.services.ts). ObtenerInfoSesion.
  ObtenerInfoSesion() {
    return this.infoSesion.asObservable();
  }

  buscarRoleservice(): Observable<any> {
    //console.log(" buscarRoleservice en ejecución: ");
    return this.http.get<RolModel[]>(`${this.urlLoopback}/rols`);
  }

  //Consulta cuantas veces existe un usuario creado
  ConsultarCuentaUsuarioService(user: userModel): Observable<any> {
    console.log(
      'Usuario a consultar en ConsultarCuentaUsuarioService: ' + user.usuario
    );
    return this.http.get(
      `${this.urlLoopback}/usuarios/count?where={"usuario":"${user.usuario}"}`,
      {
        //Para count() se debe hacer con solo la propiedad -> {"usuario":"CCL"}
      }
    );
  }

  //Servicio para consultar los usuarios que existen en la base de  datos
  listarUsuariosServicio(
    campo: string,
    orden: string
  ): Observable<userModel[]> {
    let campoOrden = campo + ' ' + orden;
    console.log('listarUsuariosServicio -> campoOrden: ' + campoOrden);
    return this.http.get<userModel[]>(
      `${this.urlLoopback}/usuarios?filter={"order": "${campoOrden}"}`
    );
    // return this.http.get<userModel[]>(`${this.urlLoopback}/usuarios?filter={"order": "${campoOrden}", "include":["role"]}`);
  }

  //Servicio para buscar en la base de datos usuarios que cumple con los parámetros de búsqueda
  BusquedaUsuariosServicio(
    buscar: string,
    campoBuscar: string
  ): Observable<userModel[]> {
    console.log('buscar ->BusquedaUsuariosServicio: ' + buscar);
    console.log('campoBuscar -> BusquedaUsuariosServicio: ' + campoBuscar); //"where":{"sede":"${sede}"}
    return this.http.get<userModel[]>(
      `${this.urlLoopback}/usuarios?filter={"order": "id DESC", "where":{"${campoBuscar}":"${buscar}"}}`
    );
    // return this.http.get<userModel[]>(`${this.urlLoopback}/usuarios?filter={"order": "id DESC", "where":{"${campoBuscar}":"${buscar}"}, "include":["role"]}`);
  }

  //Solicitar un usuario en particular a partir del id
  SolicitarUser_id(id: string): Observable<any> {
    //console.log("id a enviar en servicioSeguridad.SolicitarUser_id: " + id);
    return this.http.get(
      `${this.urlLoopback}/usuarios/${id}?filter={"include":["rol"]}`,
      // return this.http.get(`${this.urlLoopback}/usuarios/${id}?filter={"include":["role"]}`,
      {}
    );
  }

  CrearUsuarioService(datos: userModel): Observable<any> {
    //console.log("user.usuario: " + user.usuario);
    //console.log("user.nombreCompleto: " + user.nombreCompleto);
    //console.log("user.password: " + user.password);
    //console.log("user.sede: " + user.sede);
    //console.log("user.roles: " + user.roles);
    return this.http.post(`${this.urlLoopback}/usuarios`, {
      usuario: datos.usuario,
      correo : datos.correo,
      nombreCompleto: datos.nombreCompleto,
      sucursal: datos.sucursal,
      cargo: datos.cargo,
      lugarNacimiento : datos.lugarNacimiento,
      fechaNacimiento: datos.fechaNacimiento,
      autorizado: datos.autorizado,
      password: datos.password,
    });
  }

  CrearRoleUsuarioService(role: string, idUsuario: string): Observable<any> {
    //console.log("role: " + role);
    //console.log("idUsuario: " + idUsuario);
    return this.http.post(`${this.urlLoopback}/usuarios/${idUsuario}/rol`, {
      nombreRol: role,
    });
  }

  //Actualiza/Edita/Upgrade un registro de un Usuario
  actualizarUserServicio(user: userModel): Observable<any> {
    //console.log("id a enviar en actualizarUserServicio: " +user.id);
    return this.http.patch(`${this.urlLoopback}/usuarios/${user.id}`, {
      nombreCompleto: user.nombreCompleto,
      correo : user.correo,
      fechaNacimiento: user.fechaNacimiento,
      sucursal: user.sucursal,
      autorizado: user.autorizado,
    });
  }

  //Actualiza el rol del usuario
  ActualizarRoleUsuarioService(role: string, idUser: string): Observable<any> {
    //console.log("role: " + role);
    //console.log("idUser: " + idUser);
    return this.http.patch(`${this.urlLoopback}/usuarios/${idUser}/rol`, {
      nombreRol: role,
    });
  }

  ChangePasswordService(Credentials: CredencialesUserModel): Observable<any> {
    return this.http.post(`${this.urlLoopback}/ModificarPassUser`, {
      user: Credentials.usuario,
      currentPass: Credentials.password,
      newPass: Credentials.newPassword,
      confirmPass: Credentials.confPassword,
    });
  }
}
