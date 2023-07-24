import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  private showRegister = new BehaviorSubject<boolean>(false);
  private showResetPass = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this.isLoggedIn.asObservable();
  showRegister$ = this.showRegister.asObservable();
  showResetPass$ = this.showResetPass.asObservable();

  constructor() {}

  setLoggedIn(value: boolean): void {
    this.isLoggedIn.next(value);
  }

  setShowRegister(value: boolean): void {
    this.showRegister.next(value);
  }

  setShowResetPass(value: boolean): void {
    this.showResetPass.next(value);
  }
}