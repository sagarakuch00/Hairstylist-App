import { Component, OnInit } from '@angular/core';
import { BookingUserService } from 'src/app/services/bookings/booking-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-bookings',
  templateUrl: './user-bookings.component.html',
  styleUrls: ['./user-bookings.component.css']
})
export class UserBookingsComponent implements OnInit {

  bookings: any[] = [];
  loading = true;

  // 🔔 Cancel popup state
  showCancelPopup = false;
  selectedBookingId: string | null = null;

  constructor(
    private bookingApi: BookingUserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyBookings();
  }

  loadMyBookings(): void {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('UserId not found');
      this.loading = false;
      return;
    }

    this.bookingApi.getBookingsByUser(userId).subscribe({
      next: (res) => {
        this.bookings = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load bookings', err);
        this.loading = false;
      }
    });
  }

  // ❌ OLD confirm REMOVED
  // ✅ Open Hairvona popup instead
  openCancelPopup(bookingId: string): void {
    this.selectedBookingId = bookingId;
    this.showCancelPopup = true;
  }

  // ✅ Final cancel action
  confirmCancelBooking(): void {
    if (!this.selectedBookingId) return;

    this.bookingApi.cancelBooking(this.selectedBookingId).subscribe({
      next: () => {
        this.showCancelPopup = false;
        this.selectedBookingId = null;
        this.loadMyBookings();
      },
      error: (err) => {
        console.error('Cancel booking error', err);
        this.showCancelPopup = false;
      }
    });
  }

  maskMobile(mobile?: string): string {
    if (!mobile || mobile.length < 10) return '**********';
    return mobile.substring(0, 2) + '******' + mobile.substring(8);
  }

  goToPayment(bookingId: string): void {
    this.router.navigate(['/user/payment', bookingId]);
  }
}
