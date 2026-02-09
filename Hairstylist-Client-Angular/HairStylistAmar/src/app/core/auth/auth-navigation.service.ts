import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthNavigationService {

  constructor(
    private router: Router,
    private zone: NgZone
  ) {}

  
  navigateAfterLogin(returnUrl: string | null): void {
    this.zone.run(() => {
      if (returnUrl) {
        this.router.navigateByUrl(returnUrl);
      } else {
        
        this.router.navigate(['/auth/select-role']);
      }
    });
  }

  
  navigateByRole(role: string): void {
    this.zone.run(() => {
      if (role === 'Instructor') {
        this.router.navigate(['/instructor/dashboard']);
      } else {
        this.router.navigate(['/user/dashboard']);
      }
    });
  }

  logout(): void {
    
    this.router.navigate(['/auth/login']);
  }
}
