import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { userModel } from 'src/app/models/user.model';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.component.html',
  styleUrls: ['./informacion.component.scss']
})
export class InformacionComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource!: MatTableDataSource<userModel>;
  usersWithBirthday: userModel[] = [];
  displayedColumns: string[] = ['sucursal', 'nombreCompleto', 'cargo', 'lugarNacimiento', 'fechaNacimiento'];
  currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');

  months: { value: string, name: string }[] = [
    { value: '01', name: 'Enero' },
    { value: '02', name: 'Febrero' },
    { value: '03', name: 'Marzo' },
    { value: '04', name: 'Abril' },
    { value: '05', name: 'Mayo' },
    { value: '06', name: 'Junio' },
    { value: '07', name: 'Julio' },
    { value: '08', name: 'Agosto' },
    { value: '09', name: 'Septiembre' },
    { value: '10', name: 'Octubre' },
    { value: '11', name: 'Noviembre' },
    { value: '12', name: 'Diciembre' }
  ];

  constructor(private homeService: HomeService) {
    this.dataSource = new MatTableDataSource<userModel>([]);
  }

  ngOnInit() {
    // console.log('Este es el mes Automatizado : ',this.currentMonth);
    this.getDataUsersWithBirthday(this.currentMonth);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getDataUsersWithBirthday(month: string) {
    switch (month) {
      case '01':
      case '02':
      case '03':
      case '04':
      case '05':
      case '06':
      case '07':
      case '08':
      case '09':
      case '10':
      case '11':
      case '12':
        this.homeService.getDataUserByBirthMonth(month).subscribe((users: userModel[]) => {
          // Reordenar los datos después de recibirlos del servicio
          this.usersWithBirthday = this.sortDataByBirthday(users);
          this.dataSource.data = this.usersWithBirthday;
        });
        break;
      default:
        this.usersWithBirthday = [];
        this.dataSource.data = this.usersWithBirthday;
        break;
    }
  }

  sortDataByBirthday(users: userModel[]): userModel[] {
    const today = new Date();
    const todayBirthdayUsers: userModel[] = [];
    const otherUsers: userModel[] = [];
  
    // Separar los usuarios en dos grupos: los que cumplen años hoy y los demás
    for (const user of users) {
      const birthday = new Date(user.fechaNacimiento);
      if (today.getUTCMonth() === birthday.getUTCMonth() && today.getUTCDate() === birthday.getUTCDate()) {
        todayBirthdayUsers.push(user);
      } else {
        otherUsers.push(user);
      }
    }
  
    // Ordenar los usuarios que cumplen años hoy por el día de cumpleaños
    todayBirthdayUsers.sort((a, b) => {
      const dayA = new Date(a.fechaNacimiento).getDate();
      const dayB = new Date(b.fechaNacimiento).getDate();
      return dayA - dayB;
    });
  
    // Combinar ambos grupos y devolver el resultado
    return [...todayBirthdayUsers, ...otherUsers];
  }
  

  getMonthName(monthValue: string): string {
    const month = this.months.find(m => m.value === monthValue);
    return month ? month.name : '';
  }

  isBirthdayToday(dateString: string): boolean {
    const today = new Date();
    const birthday = new Date(dateString);
  
    return today.getUTCMonth() === birthday.getUTCMonth() && today.getUTCDate() === birthday.getUTCDate();
  }
  
}
