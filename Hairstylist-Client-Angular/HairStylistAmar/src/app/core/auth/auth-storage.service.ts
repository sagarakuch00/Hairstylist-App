import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type UserRole = 'User' | 'Instructor' | null;

@Injectable({ providedIn: 'root' })
export class AuthStorageService {

 
  private roleSubject = new BehaviorSubject<UserRole>(
    (localStorage.getItem('role') as UserRole) 
  );

  role$ = this.roleSubject.asObservable();

  
  saveLogin(res: any): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('userId', res.userId);

    if (res.role) {
      localStorage.setItem('role', res.role);
      this.roleSubject.next(res.role); 
    }
  }

  
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

 
  setUserId(userId: string): void {
    localStorage.setItem('userId', userId);
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }


  setRole(role: UserRole): void {
    if (role) {
      localStorage.setItem('role', role);
    }
    this.roleSubject.next(role); 
  }

  getRole(): UserRole {
    return localStorage.getItem('role') as UserRole;
  }

  
  get returnUrl(): string | null {
    return localStorage.getItem('returnUrl');
  }

  setReturnUrl(url: string): void {
    localStorage.setItem('returnUrl', url);
  }

  clearReturnUrl(): void {
    localStorage.removeItem('returnUrl');
  }


  clearAll(): void {
    localStorage.clear();
    this.roleSubject.next(null); 
  }
}
