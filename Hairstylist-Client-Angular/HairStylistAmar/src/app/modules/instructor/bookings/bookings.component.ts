import { Component, OnInit } from '@angular/core';
import { BookingInstructorService } from '../../../services/bookings/booking-instructor.service';

@Component({
  selector: 'app-instructor-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class InstructorBookingsComponent implements OnInit {
  
  batches: any[] = [];
  bookings: any[] = [];
  loading = true;

  constructor(
    private bookingApi: BookingInstructorService
  ) {}

  ngOnInit(): void {
    this.loadInstructorBookings();
  }

  loadInstructorBookings(): void {
  this.bookingApi.getMyBookings().subscribe({
    next: res => {
      this.batches = res;   
      this.loading = false;
    },
    error: err => {
      console.error('Instructor bookings error', err);
      this.loading = false;
    }
  });
}

}
