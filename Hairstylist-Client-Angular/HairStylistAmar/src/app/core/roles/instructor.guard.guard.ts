import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class InstructorGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const role = localStorage.getItem('role');

    if (role !== 'Instructor') {
      this.router.navigate(['/user/dashboard']);
      return false;
    }

    return true;
  }
}
