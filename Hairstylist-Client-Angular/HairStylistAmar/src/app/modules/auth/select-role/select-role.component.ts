import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from '../../../core/auth/auth-api.service';
import { AuthStorageService } from '../../../core/auth/auth-storage.service';
import { AuthNavigationService } from '../../../core/auth/auth-navigation.service';

@Component({
  selector: 'app-select-role',
  templateUrl: './select-role.component.html',
  styleUrls: ['./select-role.component.css']
})
export class SelectRoleComponent {

  selectedRole: 'User' | 'Instructor' | null = null;
  mobileNumber = '';
  isSubmitting = false;

  constructor(
    private authApi: AuthApiService,
    private authStorage: AuthStorageService,
    private authNavigation: AuthNavigationService,
    private router: Router
  ) {}

  // ===============================
  // ROLE CLICK HANDLER
  // ===============================
  selectRole(role: 'User' | 'Instructor'): void {

    // Instructor first click → show input only
    if (role === 'Instructor' && this.selectedRole !== 'Instructor') {
      this.selectedRole = 'Instructor';
      return;
    }

    // Student → submit directly
    if (role === 'User') {
      this.submitRole('User');
      return;
    }

    // Instructor → submit after mobile entered
    if (role === 'Instructor') {
      if (this.mobileNumber.length !== 10) {
        alert('Please enter a valid 10-digit mobile number.');
        return;
      }

      this.submitRole('Instructor');
    }
  }

  // ===============================
  // ACTUAL API CALL
  // ===============================
  private submitRole(role: 'User' | 'Instructor'): void {

  const idToken = localStorage.getItem('google_id_token');

  if (!idToken) {
    alert('Google session expired. Please login again.');
    this.router.navigate(['/auth/login']);
    return;
  }

  this.isSubmitting = true;

  this.authApi.googleLogin({
    idToken: idToken,   // ✅ now defined
    role: role,
    mobileNumber: role === 'Instructor'
      ? this.mobileNumber
      : undefined
  }).subscribe({
    next: (res) => {
      localStorage.removeItem('google_id_token');
      this.authStorage.saveLogin(res);
      this.router.navigate(['/']);

    },
    error: (err) => {
      console.error('ROLE SET ERROR:', err);
      alert(err?.error || 'Failed to set role. Please try again.');
      this.isSubmitting = false;
    }
  });
}
}