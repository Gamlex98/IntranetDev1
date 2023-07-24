import { Injectable} from '@angular/core';
import { DatosSesionModel } from '../models/datos-sesion.model';


@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  //Variables para controlar la inactividad del usuario
  TOKEN_KEY = 'sesionIntranet';
  EXPIRATION_KEY = 'tokenExpiration';
  INACTIVITY_TIMEOUT = 30* 60 * 1000; // 30 minutos en milisegundos
  isLoggedIn = false;

constructor() { }

//Verificar la inactividad del usuario
setLoggedIn (value:boolean) {
  this.isLoggedIn = value;
}
getLoggedIn(): boolean {
  return this.isLoggedIn;
}

refreshTokenExpiration() {
  let dateToken = sessionStorage.getItem("sesionIntranet");
  if (!dateToken) {
    console.log('no hay Token');
  } else {
    const expiration = new Date();
    expiration.setMilliseconds(expiration.getMilliseconds() + this.INACTIVITY_TIMEOUT);
    const expirationString = expiration.toUTCString();
    sessionStorage.setItem(this.EXPIRATION_KEY, expirationString);
  }
}

VerificarTokenExpirado(): boolean {
  let expiration = sessionStorage.getItem(this.EXPIRATION_KEY);
  if (!expiration) {
    return false;
  } else {
    let expirationDate = new Date(expiration);
    return expirationDate <= new Date();
  };
} 

//Manejo de la sessión - Registro

GuardarDatosSesion(datos:DatosSesionModel){
  let datosActuales=sessionStorage.getItem("sesionIntranet");
  if (datosActuales) {
    return false;
  } else {
    let datosSesionString=JSON.stringify(datos);
    sessionStorage.setItem("sesionIntranet", datosSesionString);
    sessionStorage.setItem(this.EXPIRATION_KEY, datos.expiracionToken!.toUTCString());
    return true;
  }
}

EliminarDatosSesion(){
  sessionStorage.clear();
}

ObtenerToken():string{
  let datosActuales=sessionStorage.getItem("sesionIntranet");
  if(datosActuales){
    let datoSesionJson= JSON.parse(datosActuales);
    return datoSesionJson.tk;
  }else{
    return "";
  }
}

ObtenerSesionInfo(): DatosSesionModel | null{
  let datosActuales=sessionStorage.getItem("sesionIntranet");
  if (datosActuales){
    let datoSesionJson=JSON.parse(datosActuales);
    return datoSesionJson;
  }else {
    return null;
  }
}

}
