import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthStorageService,
  UserRole
} from '../../core/auth/auth-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  role: UserRole = null;
  menuOpen = false;
  searchText = '';
  hideSearch = false;

  showLogoutPopup = false;
  showWelcomePopup = false;

  private lastScrollTop = 0;

  constructor(
  private router: Router,
  private authStorage: AuthStorageService
) {
  this.authStorage.role$.subscribe(role => {
    this.role = role;

    // ✅ Show welcome popup ONLY on HOME page
    if (role && this.router.url === '/') {
      const shown = sessionStorage.getItem('welcomePopupShown');

      if (!shown) {
        setTimeout(() => {
          this.showWelcomePopup = true;
        }, 300);

        sessionStorage.setItem('welcomePopupShown', 'true');
      }
    }
  });
}



  // 🔽 Hide / show search on scroll
  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollTop =
      window.pageYOffset || document.documentElement.scrollTop;

    this.hideSearch = scrollTop > this.lastScrollTop && scrollTop > 80;
    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  // 🔐 LOGIN
  onLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  onWelcomeContinue(): void {
  this.showWelcomePopup = false;

  if (this.role === 'User') {
    this.router.navigate(['/user/dashboard']);
  } else if (this.role === 'Instructor') {
    this.router.navigate(['/instructor/dashboard']);
  }
}


  // 📊 DASHBOARD
  goToDashboard(): void {
    if (this.role === 'User') {
      this.router.navigate(['/user/dashboard']);
    } else if (this.role === 'Instructor') {
      this.router.navigate(['/instructor/dashboard']);
    }
  }

  // 🗂️ MANAGE BATCHES
  goToManageBatches(): void {
    if (this.role === 'Instructor') {
      this.router.navigate(['/instructor/batches']);
    }
  }

  // 📖 VIEW BOOKINGS
  goToViewBookings(): void {
    if (this.role === 'User') {
      this.router.navigate(['/user/bookings']);
    } else if (this.role === 'Instructor') {
      this.router.navigate(['/instructor/bookings']);
    }
  }

  // 📚 BOOK BATCH
  goToBookBatch(): void {
    if (this.role === 'User') {
      this.router.navigate(['/user/book-batch']);
    }
  }

  // 🔍 SEARCH
  onSearch(): void {
    if (!this.searchText?.trim()) return;

    this.router.navigate(['/search-results'], {
      queryParams: { q: this.searchText.trim() }
    });

    this.searchText = '';
  }

  // 👤 PROFILE
  goToProfile(): void {
    if (this.role === 'User') {
      this.router.navigate(['/user/profile']);
    } else if (this.role === 'Instructor') {
      this.router.navigate(['/instructor/profile']);
    }
  }

  // ❓ LOGOUT CONFIRMATION
  confirmLogout(): void {
    this.showLogoutPopup = true;
  }

  // 🚪 LOGOUT  
 logout(): void {
  this.showLogoutPopup = false;
  this.showWelcomePopup = false;

  sessionStorage.removeItem('welcomePopupShown');

  this.authStorage.clearAll();
  this.router.navigate(['/']);
}

}
