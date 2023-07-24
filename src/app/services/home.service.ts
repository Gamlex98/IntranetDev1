import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { userModel } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})

export class HomeService {

  urlLoopback = 'http://172.16.1.249:3030';

  constructor(private http: HttpClient) {}

  getDataUserByBirthMonth(month: string): Observable<userModel[]> {
    const filter = {
      where: {
        $expr: {
          $eq: [{ $month: { $toDate: '$fechaNacimiento' } }, Number(month)]
        }
      },
      order: 'fechaNacimiento ASC' // Ordenar por fechaNacimiento en orden ascendente
    };

    return this.http.get<userModel[]>(`${this.urlLoopback}/usuarios`, { params: { filter: JSON.stringify(filter) } })
      .pipe(
        map(users => {
          // Ordenar los usuarios por el día de cumpleaños de forma ascendente
          return users.sort((a, b) => {
            const dayA = new Date(a.fechaNacimiento).getDate();
            const dayB = new Date(b.fechaNacimiento).getDate();
            return dayA - dayB;
          });
        })
      );
  }
}
