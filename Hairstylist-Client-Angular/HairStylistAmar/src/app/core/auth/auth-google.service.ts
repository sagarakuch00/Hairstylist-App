import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthGoogleService {

  private googleClientId =
    '847362915204-qk9xw7p3r8t5m2d6c1j4s0v9y8z.apps.googleusercontent.com'; // Mocked Client ID for demonstration

  initGoogleLogin(onTokenReceived: (idToken: string) => void): void {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: this.googleClientId,
      callback: (response: any) => {
        onTokenReceived(response.credential);
      }
    });

    // @ts-ignore
    google.accounts.id.renderButton(
      document.getElementById('googleBtn'),
      { theme: 'outline', size: 'large', width: 260 }
    );
  }
}
