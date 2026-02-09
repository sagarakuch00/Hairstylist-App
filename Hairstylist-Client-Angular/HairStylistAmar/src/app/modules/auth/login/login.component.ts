import { Component, AfterViewInit, NgZone } from '@angular/core';
import { AuthGoogleService } from '../../../core/auth/auth-google.service';
import { AuthStorageService } from '../../../core/auth/auth-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  constructor(
    private googleAuth: AuthGoogleService,
    private authStorage: AuthStorageService,
    private router: Router,
    private zone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.googleAuth.initGoogleLogin((idToken: string) => {
      this.handleGoogleLogin(idToken);
    });
  }

  private handleGoogleLogin(idToken: string): void {
    console.log('GOOGLE TOKEN RECEIVED');

   
    localStorage.setItem('google_id_token', idToken);

    
    this.zone.run(() => {
      this.router.navigate(['/auth/select-role']);
    });
  }
}
