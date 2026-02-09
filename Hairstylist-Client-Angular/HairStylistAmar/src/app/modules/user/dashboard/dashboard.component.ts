import { Component, OnInit } from '@angular/core';
import { BookingUserService } from 'src/app/services/bookings/booking-user.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  totalBookings = 0;
  upcomingCount = 0;
  completedCount = 0;
  upcomingBooking: any = null;
  loading = true;
 

  constructor(private bookingApi: BookingUserService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('UserId not found');
      this.loading = false;
      return;
    }

    this.bookingApi.getBookingsByUser(userId).subscribe({
      next: (res) => {
        this.totalBookings = res.length;
        this.upcomingBooking = res.find((b) => b.status === 'Confirmed');
        this.upcomingCount = res.filter((b) => b.status === 'Confirmed').length;
        this.completedCount = res.filter(
          (b) => b.status === 'Completed'
        ).length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Dashboard load error', err);
        this.loading = false;
      },
    });
  }
}
