import { userModel } from "./user.model"; 

export class DatosSesionModel{
    info?: userModel;
    tk?: string;
    isLoggedIn:boolean=false;
    fecha:string ="1970-01-01T00:00:00.000+00:00";
    expiracionToken ?: Date | null;
  datos: any;
}
