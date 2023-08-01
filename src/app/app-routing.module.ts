import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/seguridad/login/login.component';
import { RegisterComponent } from './components/seguridad/register/register.component';
import { ResetPassComponent } from './components/seguridad/resetPass/resetPass.component';
import { SolicitudesComponent } from './components/solicitudes/solicitudes.component';
import { UploadComponent } from './components/upload/upload.component';
import { AdmonUserComponent } from './components/seguridad/admonUser/admonUser.component';
import { ListarUsuariosComponent } from './components/seguridad/listarUsuarios/listarUsuarios.component';
import { ListarRolesComponent } from './components/seguridad/listarRoles/listarRoles.component';
import { LogoutComponent } from './components/seguridad/logout/logout.component';
import { PerfilUserComponent } from './components/perfilUser/perfilUser.component';
import { EditarComponent } from './components/seguridad/editar/editar.component';
import { ChangePassComponent } from './components/perfilUser/changePass/changePass.component';
import { ProfileUserComponent } from './components/perfilUser/profileUser/profileUser.component';
import { RegisterUserComponent } from './components/seguridad/register-user/register-user.component';

const routes: Routes = [
  {path: '', redirectTo: 'home',pathMatch:'full'},
  {path: 'home', component: HomeComponent},
  {
    path:'documentos',
    loadChildren: () => import('./components/documents/documents.module').then(m => m.DocumentModule)
  },
  {path: 'upload', component: UploadComponent},
  {path: 'calendario', component: CalendarioComponent},
  {path: 'solicitudes', component: SolicitudesComponent},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'register', component: RegisterComponent,},
  {path: 'registerUser',component: RegisterUserComponent},
  {path: 'resetPass', component: ResetPassComponent,},
  {path: 'admonUser', component: AdmonUserComponent},
  {path: 'listarUsers', component: ListarUsuariosComponent},
  {path: 'listaRoles', component: ListarRolesComponent},
  {path: 'perfil', component: PerfilUserComponent},
  {path: 'editar/:id', component: EditarComponent},
  {path: 'resetPass/:id',component: ChangePassComponent},
  {path: 'profileUser/:id',component: ProfileUserComponent},

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
